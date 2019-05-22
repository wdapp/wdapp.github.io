import Component from 'common/component'
import template from './chat.html'
import './chat.scss'
// import UIChat from "./UIChat"
import LiveInfo from "common/liveinfo"
// import ChatMsg from "./ChatMsg"
// import PrivateChatMsg from "./PrivateChatMsg"

class Chat extends Component {

  constructor() {
    super()

    this.render('chat', template, () => {

    })
    // this.uiChat = new UIChat();
    // this.chatMap = {};
    // this.addHandler();
    // this.addEvents();
  }
  addEvents(){
    hdScience.addEvent(hdScience.OnPublishChatMsg,()=>{
      let msgInfo = LiveInfo.publicChatMsgInfo
      let chatMsg = new ChatMsg();
      chatMsg.info = msgInfo;
      this.chatMap[msgInfo.chatId] = chatMsg;
    })
    hdScience.addEvent(hdScience.OnPrivateChatMsg,()=>{
      let msgInfo = LiveInfo.privateChatMsgInfo
      let chatMsg = new PrivateChatMsg();
      chatMsg.info =msgInfo;
    })
  }
  addHandler(){
    let chatSmile = this.getNode("chat-smile");//选择表情
    let chatSwitch = this.getNode("chat-switch");//私聊
    let  chatSelect = this.getNode("chat-select");//选择聊天对象
    let  smilesList = this.getNode("chat-smile-list");//表情面板
    let sendMsg = this.getNode("send-chat")//发送聊天按钮
    this.bind(chatSmile,"click",(e)=>{
      this.uiChat.isShowChatSmileList = !this.uiChat.isShowChatSmileList;

    })
    this.bind(chatSwitch,"click",(e)=>{

    })
    this.bind(chatSelect,"click",()=>{
      // console.log("dia")
      this.uiChat.isShowChatSelect = !this.uiChat.isShowChatSelect;
    })
    this.bind(smilesList,"click",(e)=>{
      let select = e.target.parentNode;
      if(select.localName =="td"){
        let index =this.getAttr(select,"index");
        console.log()
        this.uiChat.smiles = index;
        this.uiChat.isShowChatSmileList = false;
      }

    })
    this.bind(sendMsg,"click",(e)=>{
      this.sdk = hdScience.getObjectForName(hdScience.LiveInterface)
      this.sdk.call(this.sdk.SENDPUBLICMSG,this.uiChat.msg);
      this.uiChat.msg = "";
    })
  }
}

export default Chat