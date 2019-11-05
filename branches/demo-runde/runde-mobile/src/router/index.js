import Vue from "vue";
import VueRouter from "vue-router";
import Live from "views/Live.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "live",
    component: Live
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
