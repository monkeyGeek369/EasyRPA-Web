import { http } from "@/utils/http";
import { baseUrlApi, buildRequestModel } from "./utils";
import type {
  RequestPageBaseModel,
  ResponseDoBaseModel,
  //ResponsePageBaseModel,
  ResponseBaseModel
} from "easyrpa";

export interface FlowSearchReqModel extends RequestPageBaseModel {
  id: number;
  site_id: number;
  flow_code: string;
  flow_name: string;
  flow_rpa_type: number;
  flow_exe_env: number;
  flow_biz_type: number;
  retry_code: string;
  is_active: boolean;
}

export interface FlowAddReqModel {
  site_id: number;
  flow_code: string;
  flow_name: string;
  flow_rpa_type: number;
  flow_exe_env: number;
  flow_biz_type: number;
  max_retry_number: number;
  max_exe_time: number;
  retry_code: string;
  request_check_script: string;
  request_adapt_script: string;
  flow_exe_script: string;
  flow_result_handle_script: string;
}

export interface FlowUpdateReqModel {
  id: number;
  site_id: number;
  flow_code: string;
  flow_name: string;
  flow_rpa_type: number;
  flow_exe_env: number;
  flow_biz_type: number;
  max_retry_number: number;
  max_exe_time: number;
  retry_code: string;
  request_check_script: string;
  request_adapt_script: string;
  flow_exe_script: string;
  flow_result_handle_script: string;
  is_active: boolean;
}

export interface FlowDetailModel extends ResponseDoBaseModel {
  id: number;
  site_id: number;
  site_name: string;
  flow_code: string;
  flow_name: string;
  flow_rpa_type: number;
  flow_rpa_type_name: string;
  flow_exe_env: number;
  flow_exe_env_name: string;
  flow_biz_type: number;
  flow_biz_type_name: string;
  max_retry_number: number;
  max_exe_time: number;
  retry_code: string;
  request_check_script: string;
  request_adapt_script: string;
  flow_exe_script: string;
  flow_result_handle_script: string;
}

/** 搜索流程 */
export const searchFlows = (data?: FlowSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>("post", baseUrlApi("flow/search"), {
    data: retData
  });
};

/** 逻辑删除流程**/
export const logicDeleteFlow = (id: number) => {
  const retData = buildRequestModel(id);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`flow/delete`), {
    data: retData
  });
};

/** 新增流程 */
export const addFlow = (data: FlowAddReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`flow/add`), {
    data: retData
  });
};

/** 更新流程 */
export const updateFlow = (data: FlowUpdateReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`flow/update`), {
    data: retData
  });
};
