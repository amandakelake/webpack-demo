import { SyncWaterfallHook } from 'tapable';

class FrontEnd {
    constructor() {
        this.hooks = {
            framework: new SyncWaterfallHook(['framework']),
        };
    }

    learnFramework(framework) {
        this.hooks.framework.call(framework);
    }
}

const Xiaobai = new FrontEnd();

// 只要其中一个插件有非undefined返回(null也算非undefined) 剩余插件全部停止执行
Xiaobai.hooks.framework.tap('learn framework', (framework) => {
    console.log(`${framework} is easy, let's play vue2`);
    return 'vue2';
});

Xiaobai.hooks.framework.tap('learn framework', (arg) => {
    console.log(`${arg} is also easy, let's play react`);
    return 'react'
});

Xiaobai.hooks.framework.tap('learn framework', (arg) => {
    console.log(`${arg} is amazing`);
});

Xiaobai.learnFramework('vue1');
