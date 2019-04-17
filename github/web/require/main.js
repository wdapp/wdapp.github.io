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

require(["index", "test", "math"], function (index, test, math) {
  index.index();
  test.test();
  alert(math.add(1, 1));
});

// require(['math'], function (math){
//   alert(math.add(1,1));
// });