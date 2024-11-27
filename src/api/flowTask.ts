import { http } from "@/utils/http";
import { baseUrlApi, buildRequestModel } from "./utils";
import type {
  RequestPageBaseModel,
  ResponseDoBaseModel,
  ResponsePageBaseModel,
  ResponseBaseModel
} from "easyrpa";

export interface TaskSearchReqModel extends RequestPageBaseModel {
  id?: number;
  site_id: number;
  flow_id: number;
  biz_no: string;
  sub_source: number;
  status: number;
  result_code: number;
  result_message: string;
  result_data: string;
}

export interface TaskDetailModel extends ResponseDoBaseModel {
  id: number;
  site_id: number;
  site_name: string;
  flow_id: number;
  flow_code: string;
  flow_name: string;
  flow_config_id: number;
  flow_config_name: string;
  biz_no: string;
  sub_source: number;
  sub_source_name: string;
  status: number;
  status_name: string;
  result_code: number;
  result_message: string;
  result_data: string;
  retry_number: number;
  screenshot_base64: string;
  request_standard_message: string;
  flow_standard_message: string;
  task_result_message: string;
  flow_result_handle_message: string;
}

export interface TaskSearchResModel extends ResponsePageBaseModel {
  data: TaskDetailModel[];
}

/** 搜索flow task*/
export const searchFlowTasks = (data?: TaskSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("flow/task/search"),
    { data: retData }
  );
};
