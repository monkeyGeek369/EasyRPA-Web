import { $t } from "@/plugins/i18n";

export default {
  path: "/robot",
  redirect: "/robot/list",
  meta: {
    icon: "ri:robot-2-line",
    // showLink: false,
    title: $t("menus.robot"),
    rank: 9
  },
  children: [
    {
      path: "/robot/list",
      name: "robotList",
      component: () => import("@/views/robot/list.vue"),
      meta: {
        icon: "ri:robot-2-line",
        title: $t("menus.robotList")
      }
    },
    {
      path: "/robot/log/list",
      name: "robotLogList",
      component: () => import("@/views/robot/logList.vue"),
      meta: {
        icon: "ri:robot-2-line",
        showLink: false,
        title: $t("menus.robotLogList")
      }
    }
  ]
} satisfies RouteConfigsTable;
