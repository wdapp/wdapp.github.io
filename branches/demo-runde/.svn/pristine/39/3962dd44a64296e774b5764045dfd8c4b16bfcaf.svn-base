import Vue from "vue";
import VueRouter from "vue-router";
import Live from "views/Live.vue";
import Index from "views/Index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Index
  },
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
