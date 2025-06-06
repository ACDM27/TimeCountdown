import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "timer",
    component: () => import("../views/Timer.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 全局路由守卫（可选）
router.beforeEach((to, from, next) => {
  if (to.meta.requiresTimer) {
    // 可在此处添加计时器初始化逻辑
    console.log("进入计时器页面");
  }
  next();
});

export default router