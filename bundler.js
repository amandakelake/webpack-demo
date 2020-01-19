const fs = require('fs');
const path = require('path');
// 把JS代码转为AST（抽象语法树，可以简单google一下概念，先不用太深入）
const parser = require('@babel/parser');
// 帮助我们解析AST的内容，最直接的就是通过 ImportDeclaration 点位找到文件的依赖入口
const traverse = require('@babel/traverse').default;
// babel.transformFromAst(AST, code, options) 可以帮助我们把AST转换成ES5代码
const babel = require('@babel/core');

// 入口文件模块分析
const moduleAnalyse = filename => {
    const content = fs.readFileSync(filename, 'utf-8');
    // 得到抽象语法树
    const ast = parser.parse(content, {
        sourceType: 'module',
    });
    // 找到该文件的依赖
    const dependencies = {};
    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(filename);
            // node.source.value就是获取到的模块路径名，带有相对于当前文件的路径
            // 比如import sleep from './utils/sleep.js'里面的'./utils/sleep.js'
            dependencies[node.source.value] = `./${path.join(dirname, node.source.value)}`;
        },
    });
    // babel翻译AST为浏览器可以识别的代码
    const { code } = babel.transformFromAst(ast, null, {
        presets: ['@babel/preset-env'],
    });
    return {
        filename,
        dependencies,
        code,
    };
};

const makeDependenciesGraph = entry => {
    // 先拿到入口文件的模块分析对象
    const entryModule = moduleAnalyse(entry);
    // 将通过递归遍历，把所有的模块依赖收集到这里
    const graphArray = [entryModule];
    for (let i = 0; i < graphArray.length; i++) {
        const item = graphArray[i];
        const { dependencies } = item;
        // 判断dependencies对象是否为空，即item是否还有依赖
        if (Object.keys(dependencies).length > 0) {
            for (let j in dependencies) {
                // 把得到的子依赖添加进graphArray，长度发生变化，for循环继续，形成了递归
                graphArray.push(moduleAnalyse(dependencies[j]));
            }
        }
    }
    // 数组转换为对象  方便后续操作
    const graph = {};
    graphArray.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code,
        };
    });

    return graph;
};

const generateCode = entry => {
    const graph = makeDependenciesGraph(entry);
    console.log('graph', graph);
    // 1、通过闭包执行，避免污染全局环境
    // 2、定义require方法，并立即执行，传入entry字符串
    // 3、require里再执行一个闭包(不污染上一个闭包的作用域)，用来执行依赖模块的代码，
    //    参数就是该模块的code,然后直接用eval(code)来执行
    // 4、执行到子模块时，定义localRequire把相对当前模块的依赖路径转变成相对于bundler.js的路径
    // 5、定一个exports对象，传入执行函数，最后并导出该对象
    return `
        (function(graph) {
            function require(module){
                function localRequire(relativePath){
                    return require(graph[module].dependencies[relativePath])
                }
                var exports = {};
                (function(require, exports, code){
                    eval(code)
                })(localRequire, exports, graph[module].code);
                return exports;
            }
            require('${entry}')
        })(${JSON.stringify(graph)})
    `;
};

const code = generateCode('./src/index.js');
console.log('code', code);
