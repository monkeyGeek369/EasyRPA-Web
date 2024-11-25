import { http } from "@/utils/http";
import { baseUrlApi, buildRequestModel } from "./utils";
import type {
  RequestPageBaseModel,
  ResponseDoBaseModel,
  ResponsePageBaseModel,
  ResponseBaseModel
} from "easyrpa";

export interface JobDataSearchReqModel extends RequestPageBaseModel {
  id?: number;
  job_id: number;
  data_business_no: string;
  data_json: string;
}

export interface JobDataDetailModel extends ResponseDoBaseModel {
  id: number;
  job_id: number;
  job_name: string;
  data_business_no: string;
  data_json: string;
}

export interface JobDataSearchResModel extends ResponsePageBaseModel {
  data: JobDataDetailModel[];
}

/** 搜索job data*/
export const searchJobDatas = (data?: JobDataSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("job/data/search"),
    { data: retData }
  );
};
