// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    redirect: { name: "province" },
    children: [
      {
        path: "province",
        name: "province",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/province.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
