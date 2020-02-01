// import sayHello from './bundler-utils/say-hello.js';
// import message from './bundler-utils/message.js';
// sayHello(message);
//
// import { Xiaobai } from './tapable/synchook';
//
// Xiaobai.hooks.framework.call('vue');
// Xiaobai.hooks.framework.call('react');
//
// console.time('tapAsync/callAsync');
// Xiaobai.hooks.bundler.callAsync('webpack', () => {
//     console.log('tapAsync/callAsync -> callback');
//     console.timeEnd('tapAsync/callAsync');
// });
//
// console.time('tapPromise/promise');
// Xiaobai.hooks.compiler.promise('babel').then(() => {
//     console.log('tapPromise/promise -> then()');
//     console.timeEnd('tapPromise/promise');
// });

// require('./tapable/Tapable-Synchook');
// require('../src/tapable/Tapable-AsyncParralleHook');
// require('../src/tapable/Tapable-AsyncSeriesHook');
// require('../src/tapable/Tapable-SyncBailHook');
require('../src/tapable/Tapable-SyncWaterfallHook');
