import { $t } from "@/plugins/i18n";

export default {
  path: "/job",
  redirect: "/job/list",
  meta: {
    icon: "ri:timer-2-fill",
    // showLink: false,
    title: $t("menus.job"),
    rank: 9
  },
  children: [
    {
      path: "/job/list",
      name: "job",
      component: () => import("@/views/job/list.vue"),
      meta: {
        icon: "ri:timer-2-fill",
        title: $t("menus.jobList")
      }
    },
    {
      path: "/job/record",
      name: "job_record",
      component: () => import("@/views/job/record.vue"),
      meta: {
        icon: "ri:timer-2-fill",
        showLink: false,
        title: $t("menus.jobRecord")
      }
    }
  ]
} satisfies RouteConfigsTable;
