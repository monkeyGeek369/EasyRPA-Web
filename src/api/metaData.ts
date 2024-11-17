import { http } from "@/utils/http";
import { baseUrlApi, buildRequestModel } from "./utils";
import type {
  RequestPageBaseModel,
  ResponseDoBaseModel,
  //ResponsePageBaseModel,
  ResponseBaseModel
} from "easyrpa";

export interface MetaDataSearchReqModel extends RequestPageBaseModel {
  id: number;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
}

export interface MetaDataDetailModel extends ResponseDoBaseModel {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface MetaDataAddReqModel {
  name: string;
  code: string;
  description: string;
}

export interface MetaDataUpdateReqModel {
  id: number;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
}

export interface MetaDataItemAddReqModel {
  meta_id: number;
  business_code: string;
  name_en: string;
  name_cn: string;
}

export interface MetaDataItemUpdateReqModel {
  id: number;
  meta_id: number;
  business_code: string;
  name_en: string;
  name_cn: string;
  is_active: boolean;
}

export interface MetaDataItemDetailModel extends ResponseDoBaseModel {
  id: number;
  meta_id: number;
  business_code: string;
  name_en: string;
  name_cn: string;
}

/** 搜索元数据 */
export const searchMetaData = (data?: MetaDataSearchReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("meta/data/search"),
    { data: retData }
  );
};

/** 删除元数据**/
export const deleteMetaData = (id: number) => {
  const retData = buildRequestModel(id);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi(`meta/data/delete`),
    {
      data: retData
    }
  );
};

/** 新增元数据 */
export const addMetaData = (data: MetaDataAddReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>("post", baseUrlApi(`meta/data/add`), {
    data: retData
  });
};

/** 更新元数据 */
export const updateMetaData = (data: MetaDataUpdateReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi(`meta/data/update`),
    {
      data: retData
    }
  );
};

/** 搜索元数据项 */
export const searchMetaDataItems = (metaId: number) => {
  const retData = buildRequestModel(metaId);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi("meta/data/item/search"),
    { data: retData }
  );
};

/** 新增元数据项 */
export const addMetaDataItem = (data: MetaDataItemAddReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi(`meta/data/item/add`),
    {
      data: retData
    }
  );
};

/** 更新元数据项 */
export const updateMetaDataItem = (data: MetaDataItemUpdateReqModel) => {
  const retData = buildRequestModel(data);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi(`meta/data/item/update`),
    {
      data: retData
    }
  );
};

/** 删除元数据项 */
export const deleteMetaDataItem = (id: number) => {
  const retData = buildRequestModel(id);
  return http.request<ResponseBaseModel>(
    "post",
    baseUrlApi(`meta/data/item/delete`),
    {
      data: retData
    }
  );
};
