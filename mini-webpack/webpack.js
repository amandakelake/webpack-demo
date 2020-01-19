const fs = require('fs');
const path = require('path');
// 把JS代码转为AST（抽象语法树，可以简单google一下概念，先不用太深入）
const parser = require('@babel/parser');
// 帮助我们解析AST的内容，最直接的就是通过 ImportDeclaration 点位找到文件的依赖入口
const traverse = require('@babel/traverse').default;
// babel.transformFromAst(AST, code, options) 可以帮助我们把AST转换成ES5代码
const babel = require('@babel/core');

const Options = require('./webpack.config');

const Parser = {
    getAst: path => {
        const content = fs.readFileSync(path, 'utf-8');
        return parser.parse(content, {
            sourceType: 'module',
        });
    },
    getDependecies: (ast, filename) => {
        const dependencies = {};
        traverse(ast, {
            ImportDeclaration({ node }) {
                const dirname = path.dirname(filename);
                // node.source.value就是获取到的模块路径名，带有相对于当前文件的路径
                // 比如import sleep from './utils/sleep.js'里面的'./utils/sleep.js'
                dependencies[node.source.value] = `./${path.join(dirname, node.source.value)}`;
            },
        });
        return dependencies;
    },
    getCode: ast => {
        // AST转换为code
        const { code } = babel.transformFromAst(ast, null, {
            presets: ['@babel/preset-env'],
        });
        return code;
    },
};

class Complier {
    constructor(options) {
        const { entry, output } = options;
        this.entry = entry;
        this.output = output;
        this.modules = []; // 存放所有模块的信息，每个模块是{filename, dependencies, code}
    }

    run() {
        const entryModule = this.build(this.entry);
        this.modules.push(entryModule);

        for (let i = 0; i < this.modules.length; i++) {
            const { dependencies } = this.modules[i];
            // 判断dependencies对象是否为空，即item是否还有依赖
            if (Object.keys(dependencies).length > 0) {
                for (let j in dependencies) {
                    // 把得到的子依赖添加进graphArray，长度发生变化，for循环继续，形成了递归
                    this.modules.push(this.build(dependencies[j]));
                }
            }
        }

        const dependencyGraph = this.modules.reduce(
            (graph, item) => ({
                ...graph,
                [item.filename]: {
                    dependencies: item.dependencies,
                    code: item.code,
                },
            }),
            {}
        );

        this.generate(dependencyGraph);
    }

    build(filename) {
        const { getAst, getDependecies, getCode } = Parser;
        const ast = getAst(filename);
        const dependencies = getDependecies(ast, filename);
        const code = getCode(ast);
        return {
            filename,
            dependencies,
            code,
        };
    }

    // 重写require函数 输出bundle
    generate(dependencyGraph) {
        const bundle = `
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
            require('${this.entry}')
        })(${JSON.stringify(dependencyGraph)})
    `;
        const filePath = path.join(this.output.path, this.output.filename);
        fs.writeFileSync(filePath, bundle, 'utf-8');
    }
}

new Complier(Options).run();
