webpackJsonp([15],{"7yij":function(n,t){},bGxg:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=e("pdtE"),i=e("JaHG"),s={name:"CommonAnnouncement",data:function(){return{info:"",isShow:!1,title:"系统公告",know:"知道了"}},watch:{info:function(n){Object(i.d)("公告",n),this.isShow=!!n}},created:function(){this.hd=new o.a,this.addEvents()},methods:{addEvents:function(){var n=this;this.hd.onAnnouncement(function(t){if(!t||"remove"===t.action)return n.info="",!1;n.info=t})},handleFooterButtonClick:function(){this.isShow=!1}}},a={render:function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{directives:[{name:"show",rawName:"v-show",value:n.isShow,expression:"isShow"}],staticClass:"announcement-wrap"},[e("div",{staticClass:"announcement-wrap__content-wrap"},[e("p",{staticClass:"content__title"},[n._v(n._s(n.title))]),n._v(" "),e("p",{staticClass:"content__text"},[n._v("\n      "+n._s(n.info)+"\n    ")]),n._v(" "),e("div",{staticClass:"content__footer-button",on:{click:n.handleFooterButtonClick}},[n._v("\n      "+n._s(n.know)+"\n    ")])])])},staticRenderFns:[]};var c=e("VU/8")(s,a,!1,function(n){e("7yij")},"data-v-86f0a5de",null);t.default=c.exports}});
//# sourceMappingURL=15.cbe315ddd46afe8ca019.js.map