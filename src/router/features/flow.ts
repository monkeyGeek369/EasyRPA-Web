import { $t } from "@/plugins/i18n";

export default {
  path: "/flow",
  redirect: "/flow/list",
  meta: {
    icon: "ri:flow-chart",
    // showLink: false,
    title: $t("menus.flow"),
    rank: 9
  },
  children: [
    {
      path: "/flow/list",
      name: "flow_list",
      component: () => import("@/views/flow/list.vue"),
      meta: {
        icon: "ri:flow-chart",
        title: $t("menus.flowList")
      }
    },
    {
      path: "/flow/detail",
      name: "flow_detail",
      component: () => import("@/views/flow/detail.vue"),
      meta: {
        icon: "ri:flow-chart",
        showLink: false,
        title: $t("menus.flowDetail")
      }
    },
    {
      path: "/flow/config",
      name: "flow_config",
      component: () => import("@/views/flow/config.vue"),
      meta: {
        icon: "ri:information-line",
        showLink: true,
        title: $t("menus.flowConfig")
      }
    },
    {
      path: "/flow/task/list",
      name: "flow_task_list",
      component: () => import("@/views/flow/taskList.vue"),
      meta: {
        icon: "ri:list-indefinite",
        showLink: true,
        title: $t("menus.taskList")
      }
    },
    {
      path: "/flow/task/taskDetail",
      name: "flow_task_detail",
      component: () => import("@/views/flow/taskDetail.vue"),
      meta: {
        icon: "ri:information-line",
        showLink: false,
        title: $t("menus.taskDetail")
      }
    }
  ]
} satisfies RouteConfigsTable;
