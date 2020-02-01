import { AsyncParallelHook } from 'tapable';

class FrontEnd {
    constructor() {
        this.hooks = {
            bundler: new AsyncParallelHook(['bundler']),
        };
    }

    learnBundler(bundler) {
        this.hooks.bundler.callAsync(bundler, () => {
            console.timeEnd('costTime');
        });
    }
}

const Xiaobai = new FrontEnd();

Xiaobai.hooks.bundler.tapAsync('learn bundler1', (bundler, callback) => {
    console.log(`Xiaobai learn ${bundler} for the first time`);
    setTimeout(() => {
        callback();
    }, 2000);
});

Xiaobai.hooks.bundler.tapAsync('learn bundler2', (bundler, callback) => {
    console.log(`Xiaobai learn ${bundler} for the second time`);
    setTimeout(() => {
        callback();
    }, 1000);
});

console.time('costTime');
Xiaobai.learnBundler('webpack');
