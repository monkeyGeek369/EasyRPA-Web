import { http } from "@/utils/http";
import { baseUrlApi, buildRequestModel } from "./utils";
import type {
  RequestPageBaseModel,
  ResponseDoBaseModel,
  ResponsePageBaseModel,
  ResponseBaseModel
} from "easyrpa";

export interface SiteSearchReqModel extends RequestPageBaseModel {
  id?: number;
  site_name?: string;
  site_description?: string;
  is_active?: boolean;
}

export interface SiteDetailModel extends ResponseDoBaseModel {
  id: number;
  site_name: string;
  site_description: string;
}

export interface SiteSearchResModel extends ResponsePageBaseModel {
  data: SiteDetailModel[];
}

/** 搜索站点 */
export const searchSites = (data?: SiteSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("site/search/sites"),
    { data: retData }
  );
};
