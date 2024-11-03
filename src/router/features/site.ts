import { $t } from "@/plugins/i18n";

export default {
  path: "/site",
  redirect: "/site/list",
  meta: {
    icon: "ri:webcam-line",
    // showLink: false,
    title: $t("menus.site"),
    rank: 9
  },
  children: [
    {
      path: "/site/list",
      name: "site_list",
      component: () => import("@/views/site/list.vue"),
      meta: {
        icon: "ri:list-indefinite",
        title: $t("menus.siteList")
      }
    }
  ]
} satisfies RouteConfigsTable;
