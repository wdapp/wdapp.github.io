// define(['require','main'],function (require) {
//   require(['index','test'],function (index,test) {
//     index.index();
//     test.test();
//   });
// });

// define(function(require, exports, module) {
//     var index = require('index');
//     var test = require('test');
//     index.index();
//     test.test();
//   }
// );

require(['math'], function (math){
  alert(math.add(1,1));
});