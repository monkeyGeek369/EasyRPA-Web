import { http } from "@/utils/http";
import { baseUrlApi, buildRequestModel } from "./utils";
import type {
  RequestPageBaseModel,
  ResponseDoBaseModel,
  ResponsePageBaseModel,
  ResponseBaseModel
} from "easyrpa";

export interface RobotSearchReqModel extends RequestPageBaseModel {
  robot_code: string;
  robot_ip: string;
  status: number;
  current_task_id: number;
}

export interface RobotDetailModel extends ResponseDoBaseModel {
  id: number;
  robot_code: string;
  robot_ip: string;
  status: number;
  status_name: string;
  port: number;
  current_task_id: number;
}

export interface RobotSearchResModel extends ResponsePageBaseModel {
  data: RobotDetailModel[];
}

export interface RobotLogSearchReqModel extends RequestPageBaseModel {
  robot_id: number;
  task_id: number;
  log_type: number;
}

export interface RobotLogDetailModel extends ResponseDoBaseModel {
  id: number;
  robot_id: number;
  task_id: number;
  log_type: number;
  log_type_name: string;
  message: string;
}

export interface RobotLogSearchResModel extends ResponsePageBaseModel {
  data: RobotLogDetailModel[];
}

export interface MetaDataBaseModel {
  id: number;
  des: string;
}

/** 搜索robots*/
export const searchRobots = (data?: RobotSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("robot/search/robots"),
    { data: retData }
  );
};

/** 删除robot*/
export const deleteRobot = (code: string) => {
  const retData = buildRequestModel(code);
  return http.request<ResponseBaseModel>("post", baseUrlApi("robot/delete"), {
    data: retData
  });
};

/** release robot*/
export const releaseRobot = (code: string) => {
  const retData = buildRequestModel(code);
  return http.request<ResponseBaseModel>("post", baseUrlApi("release/robot"), {
    data: retData
  });
};

/** 搜索robot logs*/
export const searchRobotLogs = (data?: RobotLogSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("robot/search/logs"),
    { data: retData }
  );
};

/** 查询所有robot status*/
export const getAllRobotStatus = () => {
  const retData = buildRequestModel(null);
  return http.request<ResponseBaseModel>("post", baseUrlApi("robot/status"), {
    data: retData
  });
};

/** 查询所有robot log types*/
export const getAllRobotLogTypes = () => {
  const retData = buildRequestModel(null);
  return http.request<ResponseBaseModel>("post", baseUrlApi("sys/log/types"), {
    data: retData
  });
};
