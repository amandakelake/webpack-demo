// class SyncHook {
//     constructor(limit = []) {
//         this.limit = limit;
//         this.tasks = [];
//     }

//     tap(name, task) {
//         this.tasks.push(task);
//     }

//     call(...args) {
//         const param = args.slice(0, this.limit.length);
//         this.tasks.forEach(task => task(...param));
//     }
// }

import { SyncHook, AsyncSeriesHook, AsyncParallelHook } from 'tapable';

class FrontEnd {
    constructor() {
        this.hooks = {
            // 数组声明参数
            framework: new SyncHook(['framework']),
            bundler: new AsyncSeriesHook(['bundler']),
            compiler: new AsyncParallelHook(['compiler']),
        };
    }
}

const Xiaobai = new FrontEnd();

Xiaobai.hooks.framework.tap('learn framework', framework => {
    console.log(`learn ${framework}`);
});

Xiaobai.hooks.bundler.tapAsync('learn bundler', (bundler, callback) => {
    console.log(`first: learn ${bundler}`);
    setTimeout(() => {
        callback();
    }, 1000);
});
Xiaobai.hooks.bundler.tapAsync('learn bundler again', (bundler, callback) => {
    console.log(`second: learn ${bundler}`);
    setTimeout(() => {
        callback();
    }, 2000);
});

Xiaobai.hooks.compiler.tapPromise('learn compiler', compiler => {
    console.log('start tapPromise');
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`we use ${compiler} to convert ES6+ code into ES5- JavaScript`);
            resolve();
        }, 2000);
    });
});
Xiaobai.hooks.compiler.tapPromise('learn compiler again', compiler => {
    console.log('start tapPromise');
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`we use ${compiler} to convert ES6+ code into ES5- JavaScript`);
            resolve();
        }, 1000);
    });
});

export { Xiaobai };
