// Composables
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "province",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/province.vue"),
      },
      {
        path: "country",
        name: "country",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/country.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
