import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "reset.css/reset.css";
import "lib-flexible/flexible";
import { Icon, Switch } from "vant";

Vue.use(Icon);
Vue.use(Switch);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
