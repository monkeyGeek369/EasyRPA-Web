import { http } from "@/utils/http";
import { baseUrlApi, buildRequestModel } from "./utils";
import type {
  RequestPageBaseModel,
  ResponseDoBaseModel,
  ResponsePageBaseModel,
  ResponseBaseModel
} from "easyrpa";

export interface JobRecordSearchReqModel extends RequestPageBaseModel {
  id?: number;
  job_id: number;
  flow_task_id: number;
  status: number;
}

export interface JobRecordDetailModel extends ResponseDoBaseModel {
  id: number;
  job_id: number;
  job_name: string;
  flow_code: string;
  flow_name: string;
  flow_task_id: number;
  status: number;
  status_name: string;
  result_message: string;
}

export interface JobRecordSearchResModel extends ResponsePageBaseModel {
  data: JobRecordDetailModel[];
}

export interface JobRecordStatusModel {
  id: number;
  des: string;
}

/** 搜索job record*/
export const searchJobRecords = (data?: JobRecordSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("job/record/search"),
    { data: retData }
  );
};

/** 获取job record status */
export const getJobRecordStatus = () => {
  const retData = buildRequestModel(null);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("job/record/status"),
    { data: retData }
  );
};
