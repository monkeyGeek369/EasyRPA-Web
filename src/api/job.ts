import { http } from "@/utils/http";
import { baseUrlApi, buildRequestModel } from "./utils";
import type {
  RequestPageBaseModel,
  ResponseDoBaseModel,
  ResponsePageBaseModel,
  ResponseBaseModel
} from "easyrpa";

export interface JobSearchReqModel extends RequestPageBaseModel {
  id?: number;
  job_name: string;
  flow_code: string;
  flow_config_id: number;
  job_type: number;
  parent_job: number;
  is_active?: boolean;
}

export interface JobDetailModel extends ResponseDoBaseModel {
  id: number;
  job_name: string;
  data_count: number;
  cron: string;
  flow_code: string;
  flow_name: string;
  flow_config_id: number;
  flow_config_name: string;
  job_type: number;
  job_type_name: string;
  parent_job: number;
  parent_job_name: string;
  current_data_id: number;
  last_record_id: number;
  last_record_status: string;
}

export interface JobSearchResModel extends ResponsePageBaseModel {
  data: JobDetailModel[];
}

export interface JobAddReqModel {
  job_name: string;
  cron: string;
  flow_code: string;
  flow_config_id: number;
  job_type: number;
  parent_job: number;
  current_data_id: number;
  last_record_id: number;
}
export interface JobUpdateReqModel {
  id: number;
  job_name: string;
  cron: string;
  flow_code: string;
  flow_config_id: number;
  job_type: number;
  parent_job: number;
  current_data_id: number;
  last_record_id: number;
  is_active: boolean;
}

export interface JobTypeModel {
  id: number;
  des: string;
}

/** 搜索job */
export const searchJobs = (data?: JobSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("job/search/jobs"),
    { data: retData }
  );
};

/** 删除job**/
export const deleteJob = (id: number) => {
  const retData = buildRequestModel(id);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`job/delete`), {
    data: retData
  });
};

/** 新增job */
export const addJob = (data: JobAddReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`job/add`), {
    data: retData
  });
};

/** 更新job */
export const updateJob = (data: JobUpdateReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`job/update`), {
    data: retData
  });
};

/** 获取job类型 */
export const getJobTypes = () => {
  const retData = buildRequestModel(null);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`job/type`), {
    data: retData
  });
};

/* 模糊查询job */
export const searchJobsDim = (name: string) => {
  const retData = buildRequestModel(name);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`job/search/dim`), {
    data: retData
  });
};

/* job exe */
export const jobExe = (job_id: number) => {
  const retData = buildRequestModel(job_id);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`job/exe`), {
    data: retData
  });
};
