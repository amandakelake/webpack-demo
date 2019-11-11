import '@babel/polyfill';

const logoImage = require('./assets/images/logo-round.png');
console.log('logoImage', logoImage);

async function sleep() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}
console.log('time1', Date.now());
sleep().then(console.log('time2', Date.now()));
