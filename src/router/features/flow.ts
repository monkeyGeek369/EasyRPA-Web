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
    }
  ]
} satisfies RouteConfigsTable;
