<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import type {
  TaskSearchReqModel,
  MetaDataBaseModel,
  TaskDetailModel
} from "@/api/flowTask";
import {
  searchFlowTasks,
  getTaskSubSource,
  getTaskStatus
} from "@/api/flowTask";
import { message } from "@/utils/message";
import { searchSitesByName } from "@/api/site";
import type { SiteDetailModel } from "@/api/site";
import { searchFlows } from "@/api/flow";
import type { FlowDetailModel, FlowSearchReqModel } from "@/api/flow";

const router = useRouter();

// 控制组件大小
const size = ref<ComponentSize>("default");
const disabled = ref(false);
const background = ref(false);

// 响应式参数
const tableData = ref([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const sortProp = ref("id");
const sortOrder = ref("desc");
const formInline = reactive({
  id: undefined,
  site_id: undefined,
  flow_id: undefined,
  biz_no: undefined,
  sub_source: undefined,
  status: undefined,
  result_code: undefined,
  result_message: undefined,
  result_data: undefined
});

// 站点搜索
const siteDetailSelectSearchLoading = ref(false);
const siteDetailSelectSearchOptions = ref<SiteDetailModel[]>([]);

// 流程模糊搜索(查询)
const flowDetailSelectSearchLoading = ref(false);
const flowDetailSelectSearchOptions = ref<FlowDetailModel[]>([]);

// 来源方
const taskSubSourceOptions = ref<MetaDataBaseModel[]>([]);
// 任务状态
const taskStatusOptions = ref<MetaDataBaseModel[]>([]);

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: TaskSearchReqModel = {
    id: formInline.id,
    site_id: formInline.site_id,
    flow_id: formInline.flow_id,
    biz_no: formInline.biz_no,
    sub_source: formInline.sub_source,
    status: formInline.status,
    result_code: formInline.result_code,
    result_message: formInline.result_message,
    result_data: formInline.result_data,
    page: page,
    page_size: pageSize,
    sorts: [{ prop: prop, order: order }]
  };

  searchFlowTasks(datatest).then(res => {
    if (res?.status) {
      total.value = res.data.total;
      tableData.value = res.data.data;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};

// 初始化
getData(currentPage.value, pageSize.value, sortProp.value, sortOrder.value);

// 分页
const handleCurrentChange = (val: number) => {
  // val 为当前页
  currentPage.value = val;
  // 更新 tableData
  getData(currentPage.value, pageSize.value, sortProp.value, sortOrder.value);
};

// 每页展示条数
const handleSizeChange = (val: number) => {
  // val 为当前页展示条数
  pageSize.value = val;
  // 更新 tableData
  getData(currentPage.value, pageSize.value, sortProp.value, sortOrder.value);
};

// 排序
const sortChange = column => {
  // 排序字段"prop": "id", 排序顺序"order": null/"ascending"/"descending"
  sortProp.value = column.prop;
  sortOrder.value = column.order == "ascending" ? "asc" : "desc";
  // 更新 tableData
  getData(currentPage.value, pageSize.value, sortProp.value, sortOrder.value);
};

// 日期格式化
const dateFormat = (row, column) => {
  let time = row[column.property];
  if (!time) {
    return "";
  }
  const date = new Date(row[column.property]);
  return date.toLocaleString("zh-CN", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
};

// 搜索
const onSubmit = () => {
  getData(currentPage.value, pageSize.value, sortProp.value, sortOrder.value);
};

// 重置
const cleanForm = () => {
  formInline.id = undefined;
  formInline.site_id = undefined;
  formInline.flow_id = undefined;
  formInline.biz_no = undefined;
  formInline.sub_source = undefined;
  formInline.status = undefined;
  formInline.result_code = undefined;
  formInline.result_message = undefined;
  formInline.result_data = undefined;
};

// 详情页跳转
const toTaskDetail = (row: TaskDetailModel) => {
  const route = router.resolve({
    path: "/flow/task/taskDetail",
    query: { id: row.id }
  });
  window.open(route.href, "_blank");
};

// 站点模糊搜索
const searchSites = (query: string) => {
  if (query) {
    siteDetailSelectSearchLoading.value = true;
    flowDetailSelectSearchOptions.value = [];
    formInline.flow_id = undefined;

    searchSitesByName(query).then(res => {
      if (res?.status) {
        siteDetailSelectSearchOptions.value = res.data.data;
      } else {
        message(res.message + "(" + res.data + ")", { type: "error" });
      }
      siteDetailSelectSearchLoading.value = false;
    });
  } else {
    siteDetailSelectSearchOptions.value = [];
  }
};

// 流程模糊搜索
const searchDimFlows = (query: string) => {
  if (query) {
    flowDetailSelectSearchLoading.value = true;

    const datatest: FlowSearchReqModel = {
      id: undefined,
      site_id: formInline.site_id,
      flow_code: undefined,
      flow_name: query,
      flow_rpa_type: undefined,
      flow_exe_env: undefined,
      flow_biz_type: undefined,
      retry_code: undefined,
      is_active: true,
      page: 1,
      page_size: 10000,
      sorts: [{ prop: sortProp.value, order: sortOrder.value }]
    };
    searchFlows(datatest).then(res => {
      if (res?.status) {
        flowDetailSelectSearchOptions.value = res.data.data;
      } else {
        message(res.message + "(" + res.data + ")", { type: "error" });
      }
      flowDetailSelectSearchLoading.value = false;
    });
  } else {
    flowDetailSelectSearchOptions.value = [];
  }
};

// 来源方查询
getTaskSubSource().then(res => {
  if (res?.status) {
    taskSubSourceOptions.value = res.data;
  } else {
    message(res.message + "(" + res.data + ")", { type: "error" });
  }
});

// 任务状态查询
getTaskStatus().then(res => {
  if (res?.status) {
    taskStatusOptions.value = res.data;
  } else {
    message(res.message + "(" + res.data + ")", { type: "error" });
  }
});
</script>

<template>
  <div>
    <!-- 搜索表单行 -->
    <el-row style="padding-top: 30px">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="ID">
            <el-input v-model="formInline.id" placeholder="请输入任务ID" />
          </el-form-item>
          <el-form-item label="站点">
            <el-select
              v-model="formInline.site_id"
              filterable
              remote
              reserve-keyword
              placeholder="请选择站点"
              remote-show-suffix
              :remote-method="searchSites"
              :loading="siteDetailSelectSearchLoading"
              style="width: 240px"
            >
              <el-option
                v-for="item in siteDetailSelectSearchOptions"
                :key="item.id"
                :label="item.site_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="流程">
            <el-select
              v-model="formInline.flow_id"
              filterable
              remote
              reserve-keyword
              placeholder="请选择流程"
              remote-show-suffix
              :remote-method="searchDimFlows"
              :loading="flowDetailSelectSearchLoading"
              style="width: 240px"
            >
              <el-option
                v-for="item in flowDetailSelectSearchOptions"
                :key="item.id"
                :label="item.flow_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="业务编号">
            <el-input
              v-model="formInline.biz_no"
              placeholder="请输入业务编号"
            />
          </el-form-item>
          <el-form-item label="来源方">
            <el-select
              v-model="formInline.sub_source"
              filterable
              reserve-keyword
              placeholder="请选择任务来源"
              style="width: 240px"
            >
              <el-option
                v-for="item in taskSubSourceOptions"
                :key="item.id"
                :label="item.des"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="任务状态">
            <el-select
              v-model="formInline.status"
              filterable
              reserve-keyword
              placeholder="请选择任务状态"
              style="width: 240px"
            >
              <el-option
                v-for="item in taskStatusOptions"
                :key="item.id"
                :label="item.des"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="结果CODE">
            <el-input
              v-model="formInline.result_code"
              placeholder="请输入结果CODE"
            />
          </el-form-item>
          <el-form-item label="结果数据">
            <el-input
              v-model="formInline.result_data"
              placeholder="请输入结果数据"
            />
          </el-form-item>
          <el-form-item label="结果消息">
            <el-input
              v-model="formInline.result_message"
              placeholder="请输入结果消息"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="cleanForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 分割线 -->
    <el-divider />

    <!-- 表格行 -->
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData"
          :stripe="true"
          :default-sort="{ prop: 'id', order: 'descending' }"
          :border="true"
          style="width: 100%; height: 100%"
          @sort-change="sortChange"
        >
          <el-table-column prop="id" label="ID" width="80" sortable="custom" />
          <el-table-column prop="site_name" label="站点" width="180" />
          <el-table-column
            prop="flow_code"
            label="流程code"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="flow_name"
            label="流程名称"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="flow_config_name"
            label="流程配置"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="biz_no"
            label="业务编号"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sub_source_name"
            label="来源方"
            show-overflow-tooltip
          />
          <el-table-column
            prop="status_name"
            label="任务状态"
            show-overflow-tooltip
          />
          <el-table-column
            prop="result_code"
            label="结果code"
            show-overflow-tooltip
          />
          <el-table-column fixed="right" label="操作" min-width="100">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                style="margin-left: 11px"
                @click="toTaskDetail(scope.row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 分页行 -->
    <el-row>
      <el-col :span="24" style="margin-top: 20px; margin-bottom: 20px">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          scrollbar-tabindex="1"
          :page-sizes="[10, 20, 50, 100, 200]"
          :size="size"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      /></el-col>
    </el-row>
  </div>
</template>
