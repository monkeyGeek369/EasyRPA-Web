declare module "easyrpa" {
  export interface RequestHeader {
    user_id: number;
    trace_id: string;
    req_time: Date;
  }

  export interface RequestBaseModel {
    header: RequestHeader;
    model: any;
  }

  export interface SortBaseModel {
    prop: string;
    order: string;
  }

  export interface RequestPageBaseModel {
    page: number;
    page_size: number;
    sorts: list[SortBaseModel];
  }

  export interface ResponsePageBaseModel {
    total: number;
    data: any;
    sorts: list[SortBaseModel];
  }

  export interface ResponseDoBaseModel {
    created_id: number;
    created_time: Date;
    modify_id: number;
    modify_time: Date;
    trace_id: string;
    is_active: boolean;
  }
}
