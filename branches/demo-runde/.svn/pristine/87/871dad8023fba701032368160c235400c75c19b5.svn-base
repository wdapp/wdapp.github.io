import Vue from "vue";
import VueRouter from "vue-router";
import Index from "views/Index.vue";
import Live from "views/Live.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index
  },
  {
    path: "/live",
    name: "Live",
    component: Live
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
