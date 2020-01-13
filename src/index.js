import sayHello from './bundler-utils/say-hello.js';
import message from './bundler-utils/message.js';
sayHello(message);

import {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook,
} from 'tapable';

// const hook = new SyncHook(['agr1', 'agr2', 'agr3']);
class Car {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newSpeed']),
            brake: new SyncHook(),
            calculateRoutes: new AsyncParallelHook(['source', 'target', 'routesList']),
        };
    }

    setSpeed(newSpeed) {
        this.hooks.accelerate.call(newSpeed);
    }

    useNavigationSystemPromise(source = 'source', target = 'target') {
        const routesList = ['route1', 'route2'];
        return this.hooks.calculateRoutes.promise(source, target, routesList).then(res => {
            console.log('res undefined?', res);
            return res;
        });
    }
}

const myCar = new Car();
// basic usage
myCar.hooks.brake.tap('WarningLampPlugin', () => {
    console.log('WarningLampPlugin');
});
// 接受参数
myCar.hooks.accelerate.tap('LoggerPlugin', newSpeed => console.log(`Accelerating to ${newSpeed}`));

// 异步钩子
// 异步tapPromise
myCar.hooks.calculateRoutes.tapPromise('GoogleMapsPlugin', (source, target, routesList) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ source, target, routesList });
        }, 1000);
    });
});
// tapAsync -> exec callback()
myCar.hooks.calculateRoutes.tapAsync('BingMapsPlugin', (source, target, routesList, callback) => {
    setTimeout(() => {
        // call the callback
        callback();
    }, 2000);
});

myCar.setSpeed('2');
