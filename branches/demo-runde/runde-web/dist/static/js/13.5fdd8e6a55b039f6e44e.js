webpackJsonp([13],{"/4D4":function(t,e,i){t.exports=i.p+"static/img/qrcode.049a8c3.png"},X2IL:function(t,e){},px9l:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("Dd8w"),a=i.n(s),n=i("JaHG"),r=i("pdtE"),l=i("NYxO"),o={name:"PlayerFooter",data:function(){var t=this;return{disabledLeft:!1,disabledRight:!0,swiperLength:0,swiperOption:{slidesPerView:6,slidesOffsetBefore:0,slidesOffsetAfter:0,on:{slideChange:function(){if(t.swiperLength<=0)return!1;Object(n.d)("activeIndex",t.swiper.activeIndex),t.swiper.activeIndex<=0?t.disabledRight=!0:t.disabledRight=!1,t.swiper.activeIndex>=t.swiperLength?t.disabledLeft=!0:t.disabledLeft=!1}}},giftUrl:"https://github.wdapp.top/branches/demo-runde/runde-web/src/assets/images/gifts/",giftNames:[{name:"gift1",customName:"礼物1"},{name:"gift2",customName:"礼物2"},{name:"gift3",customName:"礼物3"},{name:"gift1",customName:"礼物4"},{name:"gift2",customName:"礼物5"},{name:"gift3",customName:"礼物6"},{name:"gift1",customName:"礼物7"},{name:"gift2",customName:"礼物8"}],isShowGiftPanel:!1,giveOptions:[{number:1,active:!1},{number:5,active:!1},{number:10,active:!1}],selectGift:{giftMsg:"",giftUrl:"",giftCustomName:""},qrCodeSrc:i("/4D4"),isShowRewardQRCode:!1}},computed:a()({},Object(l.d)(["viewer"]),{giftOptions:function(){var t=[],e=this.giftUrl;return this.giftNames.forEach(function(i,s){var a={url:e+i.name+".png",name:i.name,customName:i.customName};t.push(a)}),t},Panel:function(){return this.$refs.Panel},Swiper:function(){return this.$refs.Swiper},fontSize:function(){var t=document.getElementsByTagName("html")[0].style.fontSize;return parseFloat(t)}}),methods:{init:function(){this.HD=new r.a,this.swiper=this.Swiper.swiper,this.swiperLength=this.giftOptions.length-this.swiperOption.slidesPerView,this.swiperLength<=0&&(this.disabledLeft=!0,this.disabledRight=!0)},mouseEnterReward:function(){this.isShowRewardQRCode=!0},mouseLeaveReward:function(){this.isShowRewardQRCode=!1},handleRewardClick:function(){var t="打赏给老师[cem_"+(this.giftUrl+"gift2.png")+"]￥100";this.HD.sendPublicChatMsg(t)},handleClickGift:function(t,e){var i="赠送给老师[cem_"+t+"]x";this.selectGift={giftMsg:i,giftUrl:t,giftCustomName:e},this.isShowGiftPanel=!this.isShowGiftPanel},handleSwiperClick:function(t){var e=this.offset(this.Swiper.$el).left,i=t.clientX-e,s=this.Swiper.$el.clientWidth/6,a=Math.floor(i/s)*s-(this.Panel.clientWidth-.5625*this.fontSize)+"px";this.Panel.style.left=a},offset:function(t){var e=null,i=null,s=t.offsetParent;for(e+=t.offsetLeft,i+=t.offsetTop;s;)-1===navigator.userAgent.indexOf("MSIE 8.0")&&(e+=s.clientLeft,i+=s.clientTop),e+=s.offsetLeft,i+=s.offsetTop,s=s.offsetParent;return{left:e,top:i}},mouseEnterGift:function(){this.isShowGiftPanel=!1},mouseLeaveGift:function(){this.isShowGiftPanel=!1},giveGift:function(t,e){for(var i=0;i<this.giveOptions.length;i++)this.giveOptions[i].active=!1;this.giveOptions[t].active=!0;var s=this.selectGift.giftMsg+e;this.HD.sendPublicChatMsg(s)},handleSlideNextClick:function(){if(this.swiperLength<=0)return!1;this.swiper.slideNext()},handleSlidePrevClick:function(){if(this.swiperLength<=0)return!1;this.swiper.slidePrev()}},mounted:function(){this.init()}},c={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"player-footer-wrapper"},[i("div",{staticClass:"left"},[i("div",{staticClass:"reward-wrap",on:{mouseenter:t.mouseEnterReward,mouseleave:t.mouseLeaveReward,click:t.handleRewardClick}},[i("span",{staticClass:"reward-image"}),t._v(" "),i("span",{staticClass:"reward-text"},[t._v("打赏")]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowRewardQRCode,expression:"isShowRewardQRCode"}],staticClass:"reward-qrCode-wrap"},[t._m(0),t._v(" "),i("div",{staticClass:"reward-qrCode-img-wrap"},[i("img",{staticClass:"reward-qrCode-img",attrs:{src:t.qrCodeSrc}})])])]),t._v(" "),t._m(1)]),t._v(" "),i("div",{staticClass:"right"},[i("div",{staticClass:"swiper-wrap"},[i("span",{staticClass:"arrow-left",class:{disabled:t.disabledLeft},on:{click:t.handleSlideNextClick}},[i("i",{staticClass:"el-icon-arrow-left"})]),t._v(" "),i("swiper",{ref:"Swiper",attrs:{options:t.swiperOption},nativeOn:{click:function(e){return t.handleSwiperClick(e)}}},t._l(t.giftOptions,function(e,s){return i("swiper-slide",{key:s,staticClass:"item",nativeOn:{click:function(i){return t.handleClickGift(e.url,e.customName)},mouseenter:function(e){return t.mouseEnterGift(e)}}},[i("img",{staticClass:"image",attrs:{src:e.url}})])}),1),t._v(" "),i("span",{staticClass:"arrow-right",class:{disabled:t.disabledRight},on:{click:t.handleSlidePrevClick}},[i("i",{staticClass:"el-icon-arrow-right"})]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowGiftPanel,expression:"isShowGiftPanel"}],ref:"Panel",staticClass:"gift-panel-wrap",on:{mouseleave:t.mouseLeaveGift}},[i("div",{staticClass:"gift-panel-left"},[i("div",{staticClass:"gift-panel-img-wrap"},[i("img",{staticClass:"gift-panel-img",attrs:{src:t.selectGift.giftUrl}})])]),t._v(" "),i("div",{staticClass:"gift-panel-right"},[i("div",{staticClass:"gift-panel-title-wrap"},[i("p",{staticClass:"gift-panel-title"},[t._v(t._s(t.selectGift.giftCustomName))]),t._v(" "),i("span",{staticClass:"gift-panel-subhead"},[t._v("赠送数量")])]),t._v(" "),i("div",{staticClass:"gift-panel-number-wrap"},t._l(t.giveOptions,function(e,s){return i("div",{key:s,staticClass:"item gift-panel-number",class:{"gift-active":e.active},on:{click:function(i){return t.giveGift(s,e.number)}}},[t._v("\n              "+t._s(e.number)+"\n            ")])}),0)]),t._v(" "),i("i",{staticClass:"el-icon-caret-bottom"})])],1)])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"reward-qrCode-title-wrap"},[e("p",{staticClass:"reward-qrCode-title"},[this._v("\n            扫描二维码支付打赏老师\n          ")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"evaluation-wrap"},[e("span",{staticClass:"evaluation-image"}),this._v(" "),e("span",{staticClass:"evaluation-text"},[this._v("评价")])])}]};var f=i("VU/8")(o,c,!1,function(t){i("X2IL")},"data-v-531239ba",null);e.default=f.exports}});
//# sourceMappingURL=13.5fdd8e6a55b039f6e44e.js.map