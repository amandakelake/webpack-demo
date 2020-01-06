const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
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
            // node.source.value就是模块名
            // 遍历获取模块的绝对路径（相对于打包目录的绝对路径）
            dependencies[node.source.value] = path.join(dirname, node.source.value);
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

const moduleInfo = moduleAnalyse('./src/index.js');
console.log('moduleInfo', moduleInfo);
