// import '@babel/polyfill';
import _ from 'lodash';

// const logoImage = require('./assets/images/logo-round.png');
// console.log('logoImage', logoImage);
import sleep from './utils/sleep';
// import lgcContent from './utils/lgc.lgc';
// const lgcContent = require('./utils/lgc.lgc');
// console.log('lgcContent', lgcContent);
import content from './utils/lgc.lgc';
console.log('lgcContent', content);
console.log('time1', Date.now());

sleep().then(() => {
    console.log('time2', Date.now());
});
