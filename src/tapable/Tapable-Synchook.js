import { SyncHook } from 'tapable';

class FrontEnd {
    constructor() {
        this.hooks = {
            framework: new SyncHook(['framework']),
        };
    }

    learnFramework(framework) {
        this.hooks.framework.call(framework);
    }
}

const Xiaobai = new FrontEnd();

// 注册钩子回调
Xiaobai.hooks.framework.tap('learn framework', framework => {
    console.log(`Xiaobai learn ${framework}`);
});

// 触发钩子
Xiaobai.learnFramework('vue');
Xiaobai.learnFramework('react');

// Xiaobai learn vue
// Xiaobai learn react
