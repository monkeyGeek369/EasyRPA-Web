// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { addIcon } from "@iconify/vue/dist/offline";

// 本地菜单图标，后端在路由的 icon 中返回对应的图标字符串并且前端在此处使用 addIcon 添加即可渲染菜单图标
// @iconify-icons/ep
import Lollipop from "@iconify-icons/ep/lollipop";
import HomeFilled from "@iconify-icons/ep/home-filled";
addIcon("ep:lollipop", Lollipop);
addIcon("ep:home-filled", HomeFilled);
// @iconify-icons/ri
import Search from "@iconify-icons/ri/search-line";
import InformationLine from "@iconify-icons/ri/information-line";
import WebcamLine from "@iconify-icons/ri/webcam-line";
import ListIndefinite from "@iconify-icons/ri/list-indefinite";
import FlowChart from "@iconify-icons/ri/flow-chart";
import StackOverFlow from "@iconify-icons/ri/stack-overflow-fill";
import TimerFull from "@iconify-icons/ri/timer-2-fill";
import JobData from "@iconify-icons/ri/database-2-fill";
import JobRecord from "@iconify-icons/ri/record-mail-fill";
import Robot from "@iconify-icons/ri/robot-2-line";

addIcon("ri:search-line", Search);
addIcon("ri:information-line", InformationLine);
addIcon("ri:webcam-line", WebcamLine);
addIcon("ri:list-indefinite", ListIndefinite);
addIcon("ri:flow-chart", FlowChart);
addIcon("ri:stack-overflow-fill", StackOverFlow);
addIcon("ri:timer-2-fill", TimerFull);
addIcon("ri:timeline-view", JobData);
addIcon("ri:record-mail-fill", JobRecord);
addIcon("ri:robot-2-line", Robot);
