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

export interface SiteAddReqModel {
  site_name: string;
  site_description: string;
}
export interface SiteUpdateReqModel {
  site_id: number;
  site_name: string;
  site_description: string;
  is_active: boolean;
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

/** 删除站点**/
export const deleteSite = (site_id: number) => {
  const retData = buildRequestModel(site_id);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`site/delete`), {
    data: retData
  });
};

/** 新增站点 */
export const addSite = (data: SiteAddReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`site/add`), {
    data: retData
  });
};

/** 更新站点 */
export const updateSite = (data: SiteUpdateReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`site/update`), {
    data: retData
  });
};
