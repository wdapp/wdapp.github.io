webpackJsonp([3],{eerB:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n("mvHQ"),s=n.n(r),i=n("Dd8w"),a=n.n(i),c=n("JaHG"),l=n("NYxO"),u={name:"Index",data:function(){return{url:""}},computed:a()({},Object(l.d)({currentUrl:"url"}),Object(l.b)(["getOptions"])),methods:a()({handleClick:function(t){Object(c.b)(this.url)?(this.changeUrl(this.url),this.$router.push({name:t,params:{options:encodeURIComponent(s()(this.getOptions))}})):this.$message({showClose:!0,message:"请输入正确的观看地址",type:"warning"})}},Object(l.c)(["changeUrl"])),mounted:function(){this.url=this.currentUrl||"https://view.csslcloud.net/api/view/index?roomid=D4A2E14A89D372399C33DC5901307461&userid=2876043E67CBDC9D"}},o={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wrapper"},[n("el-input",{staticClass:"input",attrs:{placeholder:"请输入观看地址"},model:{value:t.url,callback:function(e){t.url=e},expression:"url"}}),t._v(" "),n("el-button",{staticClass:"button",attrs:{type:"primary"},on:{click:function(e){return t.handleClick("Live")}}},[t._v("\n    PC端观看直播\n  ")]),t._v(" "),n("el-button",{staticClass:"button",attrs:{type:"primary"},on:{click:function(e){return t.handleClick("Replay")}}},[t._v("\n    PC端观看回放\n  ")])],1)},staticRenderFns:[]};var p=n("VU/8")(u,o,!1,function(t){n("gtvJ")},"data-v-1eb2c902",null);e.default=p.exports},gtvJ:function(t,e){}});
//# sourceMappingURL=3.abaacedf3f5ade01b2ef.js.map