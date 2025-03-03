import { http } from "@/utils/http";
import { baseUrlApi, buildRequestModel } from "./utils";
import type {
  RequestPageBaseModel,
  ResponseDoBaseModel,
  ResponsePageBaseModel,
  ResponseBaseModel
} from "easyrpa";

export interface JobHandlerDataSearchReqModel extends RequestPageBaseModel {
  id?: number;
  job_id: number;
  data_job_id: number;
  data_id: number;
  status: number;
}

export interface JobHandlerDataDetailModel extends ResponseDoBaseModel {
  id: number;
  job_id: number;
  job_name: string;
  data_job_id: number;
  data_job_name: string;
  data_id: number;
  status: number;
  status_name: string;
}

export interface JobHandlerDataSearchResModel extends ResponsePageBaseModel {
  data: JobHandlerDataDetailModel[];
}

export interface JobHandlerDataUpdateReqModel {
  id?: number;
  status: number;
}

export interface JobHandlerDataStatusModel {
  id: number;
  des: string;
}

/** 搜索job handler data*/
export const searchJobHandlerDatas = (data?: JobHandlerDataSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("job/handler/data/search"),
    { data: retData }
  );
};

/** 获取job handler data status */
export const getJobHandlerDataStatus = () => {
  const retData = buildRequestModel(null);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("job/handler/data/status"),
    { data: retData }
  );
};

export const deleteJobHandlerData = (id: number) => {
  const retData = buildRequestModel(id);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("job/handler/data/delete"),
    { data: retData }
  );
};

export const updateJobHandlerDataStatus = (
  data: JobHandlerDataUpdateReqModel
) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("job/handler/data/update/status"),
    { data: retData }
  );
};
