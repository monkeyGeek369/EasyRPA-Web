import { $t } from "@/plugins/i18n";

export default {
  path: "/metaData",
  redirect: "/metaData/list",
  meta: {
    icon: "ri:stack-overflow-fill",
    title: $t("menus.metaData"),
    showLink: true,
    rank: 9
  },
  children: [
    {
      path: "/metaData/list",
      name: "metaDataList",
      component: () => import("@/views/metaData/list.vue"),
      meta: {
        icon: "ri:stack-overflow-fill",
        title: $t("menus.metaDataList")
      }
    },
    {
      path: "/metaData/item/list",
      name: "metaDataItemList",
      component: () => import("@/views/metaData/itemList.vue"),
      meta: {
        icon: "ri:list-indefinite",
        showLink: false,
        title: $t("menus.metaDataItemList")
      }
    }
  ]
} satisfies RouteConfigsTable;
