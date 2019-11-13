import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "reset.css/reset.css";
import "animate.css/animate.css";
import "lib-flexible/flexible";

import {
  Icon,
  Switch,
  Tab,
  Tabs,
  Field,
  Popup,
  Card,
  Tag,
  Grid,
  GridItem,
  Image,
  Notify,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  Button
} from "vant";

Vue.use(Icon);
Vue.use(Switch);
Vue.use(Tab).use(Tabs);
Vue.use(Field);
Vue.use(Popup);
Vue.use(Card);
Vue.use(Tag);
Vue.use(Image);
Vue.use(Notify);
Vue.use(Grid).use(GridItem);
Vue.use(Checkbox).use(CheckboxGroup);
Vue.use(Cell).use(CellGroup);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Button);

Vue.prototype.bus = new Vue();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
