import { http } from "@/utils/http";
import { baseUrlApi, buildRequestModel } from "./utils";
import type {
  RequestPageBaseModel,
  ResponseDoBaseModel,
  ResponsePageBaseModel,
  ResponseBaseModel
} from "easyrpa";

export interface FlowConfigSearchReqModel extends RequestPageBaseModel {
  id: number;
  flow_id: string;
  config_name: string;
  config_description: string;
  is_active: boolean;
}

export interface FlowConfigDetailModel extends ResponseDoBaseModel {
  id: number;
  flow_id: number;
  flow_code: string;
  flow_name: string;
  config_name: string;
  config_description: string;
  config_json: string;
}

export interface FlowConfigSearchResModel extends ResponsePageBaseModel {
  data: FlowConfigDetailModel[];
}

export interface FlowConfigAddReqModel {
  flow_id: number;
  config_name: string;
  config_description: string;
  config_json: string;
}

export interface FlowConfigUpdateReqModel {
  id: number;
  flow_id: number;
  config_name: string;
  config_description: string;
  config_json: string;
  is_active: boolean;
}

/** 搜索流程配置 */
export const searchFlowConfigs = (data?: FlowConfigSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("flow/config/search"),
    { data: retData }
  );
};

/** 删除流程配置**/
export const deleteFlowConfig = (id: number) => {
  const retData = buildRequestModel(id);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi(`flow/config/delete`),
    {
      data: retData
    }
  );
};

/** 新增流程配置 */
export const addFlowConfig = (data: FlowConfigAddReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi(`flow/config/add`),
    {
      data: retData
    }
  );
};

/** 更新流程配置 */
export const updateFlowConfig = (data: FlowConfigUpdateReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi(`flow/config/update`),
    {
      data: retData
    }
  );
};

/** 模糊查询流程配置 */
export const searchConfigDim = (data?: string) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("flow/config/dim"),
    {
      data: retData
    }
  );
};
