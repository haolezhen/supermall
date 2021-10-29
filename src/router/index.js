import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "/home",
  },
  {
    path: "/home",
    component: () => import("../views/home/home.vue"),
  },
  {
    path: "/cart",
    component: () => import("../views/cart/cart.vue"),
  },
  {
    path: "/profile",
    component: () => import("../views/profile/profile.vue"),
  },
  {
    path: "/category",
    component: () => import("../views/category/category.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
