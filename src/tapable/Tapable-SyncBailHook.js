import { SyncBailHook } from 'tapable';

class FrontEnd {
    constructor() {
        this.hooks = {
            framework: new SyncBailHook(),
        };
    }

    learnFramework() {
        this.hooks.framework.call();
    }
}

const Xiaobai = new FrontEnd();

// 只要其中一个插件有非undefined返回(null也算非undefined) 剩余插件全部停止执行
Xiaobai.hooks.framework.tap('learn framework', () => {
    console.log('vue is easy');
    return undefined;
});

Xiaobai.hooks.framework.tap('learn framework', () => {
    console.log('react is easy');
    return null;
});

Xiaobai.hooks.framework.tap('learn framework', () => {
    console.log('Angular is easy');
    return true;
});

Xiaobai.learnFramework();
