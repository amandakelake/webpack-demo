// import '@babel/polyfill';
import _ from 'lodash';

// const logoImage = require('./assets/images/logo-round.png');
// console.log('logoImage', logoImage);
console.log('webpack demo');
console.log('_', _);

async function sleep() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}
console.log('time1', Date.now());
sleep().then(() => {
    console.log('time2', Date.now());
});
