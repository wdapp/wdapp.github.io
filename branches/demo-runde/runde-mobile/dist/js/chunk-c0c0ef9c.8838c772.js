(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c0c0ef9c"],{"16d5":function(e,s,t){"use strict";var i=t("a12c"),n=t.n(i);n.a},"5bdc":function(e,s,t){"use strict";t.r(s);var i=function(){var e=this,s=e.$createElement,t=e._self._c||s;return e.isShowQuestionnaireWrapper?t("div",{staticClass:"questionnaire-wrapper"},[t("animation-fade",[t("div",{directives:[{name:"show",rawName:"v-show",value:e.isShowQuestionnaire,expression:"isShowQuestionnaire"}],staticClass:"questionnaire-container"},[t("div",{staticClass:"questionnaire-wrap"},[t("div",{staticClass:"questionnaire-header-wrap"},[t("div",{staticClass:"questionnaire-header-title-wrap"},[t("p",{staticClass:"questionnaire-header-title-text"},[e._v(" "+e._s(e.isShowResult?e.resultTitle:e.title)+" ")])]),t("div",{directives:[{name:"show",rawName:"v-show",value:!!e.isShowResult||!e.questionnaire.forcibly,expression:"isShowResult ? true : !questionnaire.forcibly"}],staticClass:"questionnaire-header-close-wrap",on:{click:e.onClose}},[t("van-icon",{staticClass:"questionnaire-header-close-btn",attrs:{name:"cross"}})],1)]),t("div",{staticClass:"questionnaire-body-wrap"},[t("div",{staticClass:"questionnaire-body-title-wrap"},[t("p",{staticClass:"questionnaire-body-title-text"},[e._v(" "+e._s(e.questionnaire.title)+" ")])]),t("div",{staticClass:"questionnaire-body-questions-wrap",class:{"question-active":e.isShowResult}},[t("van-checkbox-group",{attrs:{disabled:e.disabled,max:e.questionnaire.max},model:{value:e.result,callback:function(s){e.result=s},expression:"result"}},[t("van-cell-group",e._l(e.questionnaire.options,(function(s,i){return t("van-cell",{key:i,staticClass:"question-item",class:{active:e.isActive(i),select:e.isSelect(i),correct:e.isCorrect(s)},attrs:{title:e.formatContent(s),clickable:""},on:{click:e.onReset}},[t("van-checkbox",{directives:[{name:"show",rawName:"v-show",value:!0,expression:"true"}],staticClass:"van-checkbox",attrs:{slot:"right-icon",name:i},slot:"right-icon"})],1)})),1)],1)],1),t("div",{staticClass:"questionnaire-footer-wrap"},[t("div",{directives:[{name:"show",rawName:"v-show",value:!e.isShowResult,expression:"!isShowResult"}],staticClass:"questionnaire-footer-btn-wrap",on:{click:e.onSubmit}},[t("div",{staticClass:"questionnaire-footer-btn"},[e._v("确定提交")])])])])])])]),t("van-popup",{on:{closed:e.onClosed},model:{value:e.show,callback:function(s){e.show=s},expression:"show"}},[t("span",{staticClass:"popup-icon",class:e.popup.type}),e._v(" "+e._s(e.popup.message)+" ")])],1):e._e()},n=[],o=(t("c975"),function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("transition",[e._t("default")],2)}),a=[],r={name:"Fade"},u=r,c=(t("16d5"),t("2877")),l=Object(c["a"])(u,o,a,!1,null,"4211a8f5",null),h=l.exports,p=t("af10"),m=t("90b9"),d={name:"Questionnaire",components:{AnimationFade:h},props:{questionnaire:{type:Object,default:function(){return{}}}},data:function(){return{title:"问卷",resultTitle:"答题结果",messageBoxTimer:0,messageBoxTimerInterval:2e3,isShowQuestionnaireWrapper:!1,isShowQuestionnaire:!1,isShowResult:!1,result:[],max:1,disabled:!1,show:!1,success:!0,popup:{type:"success",message:"提交成功"}}},computed:{formatResult:function(){for(var e=[],s=["A","B","C","D","E","F","G","H","I","J"],t=0;t<this.result.length;t++){var i=s[this.result[t]];e.push(i)}return e}},watch:{questionnaire:function(){this.isShowQuestionnaireWrapper=!0,this.isShowQuestionnaire=!0,this.disabled=!1,this.result=[]}},methods:{isActive:function(e){var s=!1;return s=this.compareResult(e),s},isSelect:function(e){var s=!1;return s=this.compareResult(e),this.isShowResult&&s},compareResult:function(e){for(var s=!1,t=0;t<this.result.length;t++)this.result[t]===e&&(s=!0);return s},isCorrect:function(e){var s=e.correct;return this.isShowResult&&s},formatContent:function(e){return e.key+"."+e.content},showMessageBox:function(e,s){var t=this;this.show=!0,this.popup={type:e,message:s},this.messageBoxTimer&&clearTimeout(this.messageBoxTimer),this.messageBoxTimer=setTimeout((function(){t.show=!1,t.messageBoxTimer=0}),this.messageBoxTimerInterval)},onClose:function(){this.isShowQuestionnaireWrapper=!1,this.isShowQuestionnaire=!1},onSubmit:function(){var e=this,s=this.formatResult;if(s.length){this.isShowQuestionnaire=!1,Object(m["b"])("select",s);for(var t=[],i=this.questionnaire.options,n=0;n<s.length;n++)for(var o=s[n],a=0;a<i.length;a++){var r=i[a];o===r.key&&(t+=r.id+",")}t=t.substring(0,t.length-1);var u={questionnaireId:this.questionnaire.questionnaireId,subjectsAnswer:[{subjectId:this.questionnaire.subjectId}]};this.questionnaire.max>1?u.subjectsAnswer[0].selectedOptionIds=t:u.subjectsAnswer[0].selectedOptionId=t,this.isShowQuestionnaire=!1,this.HD.submitQuestionnaire(u,(function(s){Object(m["b"])("submitQuestionnaire",s),s.success?(e.success=!0,e.showMessageBox("success","提交成功")):(e.success=!1,e.showMessageBox("fail","提交失败"))}))}},onClosed:function(){this.messageBoxTimer&&clearTimeout(this.messageBoxTimer),this.messageBoxTimer=0,this.success&&this.questionnaire.submitedAction?(this.isShowQuestionnaire=!0,this.isShowResult=!0,this.disabled=!0):this.stopQuestionnaire()},isError:function(e){return-1!==this.formatResult.indexOf(e)},isRight:function(e){return this.questionnaire.correct===e},stopQuestionnaire:function(){this.isShowQuestionnaireWrapper=!1,this.isShowQuestionnaire=!1,this.isShowResult=!1,this.disabled=!1,this.messageBoxTimer&&clearTimeout(this.messageBoxTimer),this.messageBoxTimer=0,this.show=!1},onReset:function(){this.disabled||1!==this.questionnaire.max||(this.result=[])}},mounted:function(){var e=this;this.HD=new p["a"],this.HD.onQuestionnairePublishStop((function(s){Object(m["b"])("onQuestionnairePublishStop",s),e.stopQuestionnaire()}))}},w=d,f=(t("b46c"),t("8fe6"),Object(c["a"])(w,i,n,!1,null,"a1117fde",null));s["default"]=f.exports},6997:function(e,s,t){},"8fe6":function(e,s,t){"use strict";var i=t("b816"),n=t.n(i);n.a},a12c:function(e,s,t){},b46c:function(e,s,t){"use strict";var i=t("6997"),n=t.n(i);n.a},b816:function(e,s,t){}}]);
//# sourceMappingURL=chunk-c0c0ef9c.8838c772.js.map