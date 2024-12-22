<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import {
  searchJobs,
  deleteJob,
  addJob,
  updateJob,
  getJobTypes,
  searchJobsDim,
  jobExe
} from "@/api/job";
import type {
  JobSearchReqModel,
  JobDetailModel,
  JobAddReqModel,
  JobUpdateReqModel,
  JobTypeModel
} from "@/api/job";
import { message } from "@/utils/message";
import { searchDimFlow } from "@/api/flow";
import type { FlowDetailModel } from "@/api/flow";
import { searchConfigDim } from "@/api/flowConfig";
import type { FlowConfigDetailModel } from "@/api/flowConfig";

defineOptions({
  name: "job_list"
});

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
  job_name: undefined,
  flow_code: undefined,
  flow_config_id: undefined,
  job_type: undefined,
  parent_job: undefined,
  is_active: undefined
});
const selectValues = ref<JobDetailModel[]>([]);
const deleteVisible = ref(false);
const execOneVisible = ref(false);
const addFormInline = reactive<JobAddReqModel>({
  job_name: undefined,
  cron: undefined,
  flow_code: undefined,
  flow_config_id: undefined,
  job_type: undefined,
  parent_job: undefined,
  current_data_id: undefined,
  last_record_id: undefined
});
const addVisible = ref(false);
const updateFormInline = reactive({
  id: undefined,
  job_name: undefined,
  cron: undefined,
  flow_code: undefined,
  flow_config_id: undefined,
  job_type: undefined,
  parent_job: undefined,
  current_data_id: undefined,
  last_record_id: undefined,
  is_active: undefined
});
const updateVisible = ref(false);
const copyVisible = ref(false);
const jobExeVisible = ref(false);

// job类型
const jobTypeSelectSearchOptions = ref<JobTypeModel[]>([]);

// 流程模糊搜索
const flowDetailSelectLoading = ref(false);
const flowDetailSelectOptions = ref<FlowDetailModel[]>([]);
const flowDetailSelectUpdateLoading = ref(false);
const flowDetailSelectUpdateOptions = ref<FlowDetailModel[]>([]);
const flowDetailSelectSearchLoading = ref(false);
const flowDetailSelectSearchOptions = ref<FlowDetailModel[]>([]);

// 流程配置模糊查询
const flowConfigDetailSelectLoading = ref(false);
const flowConfigDetailSelectOptions = ref<FlowConfigDetailModel[]>([]);
const flowConfigDetailSelectUpdateLoading = ref(false);
const flowConfigDetailSelectUpdateOptions = ref<FlowConfigDetailModel[]>([]);
const flowConfigDetailSelectSearchLoading = ref(false);
const flowConfigDetailSelectSearchOptions = ref<FlowConfigDetailModel[]>([]);

// job模糊查询
const jobDetailSelectLoading = ref(false);
const jobDetailSelectUpdateLoading = ref(false);
const jobDetailSelectSearchLoading = ref(false);
const jobDetailSelectOptions = ref<JobDetailModel[]>([]);
const jobDetailSelectUpdateOptions = ref<JobDetailModel[]>([]);
const jobDetailSelectSearchOptions = ref<JobDetailModel[]>([]);

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: JobSearchReqModel = {
    id: formInline.id,
    job_name: formInline.job_name,
    flow_code: formInline.flow_code,
    flow_config_id: formInline.flow_config_id,
    job_type: formInline.job_type,
    parent_job: formInline.parent_job,
    is_active:
      formInline.is_active === undefined
        ? null
        : formInline.is_active === "true"
          ? true
          : false,
    page: page,
    page_size: pageSize,
    sorts: [{ prop: prop, order: order }]
  };

  searchJobs(datatest).then(res => {
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

// 布尔格式化
const formatBoolean = (row, column) => {
  return row[column.property] ? "启用" : "不启用";
};

// 搜索
const onSubmit = () => {
  getData(currentPage.value, pageSize.value, sortProp.value, sortOrder.value);
};

// 重置
const cleanForm = () => {
  formInline.id = undefined;
  formInline.job_name = undefined;
  formInline.flow_code = undefined;
  formInline.flow_config_id = undefined;
  formInline.job_type = undefined;
  formInline.parent_job = undefined;
  formInline.is_active = undefined;
};

// 删除
const handleDelete = (row: JobDetailModel) => {
  if (row == undefined) {
    message("未选择数据", { type: "error" });
    return;
  }

  selectValues.value = [row];
  deleteVisible.value = true;
};
const handleDeleteConfirm = () => {
  if (selectValues.value.length === 0) {
    message("未选择数据", { type: "error" });
    return;
  }

  Promise.all(selectValues.value.map(v => deleteJob(v.id))).then(responses => {
    responses.forEach(res => {
      if (res?.status) {
        message(res.message, { type: "success" });
      } else {
        message(res.message + "(" + res.data?.message + ")", { type: "error" });
      }
    });
    onSubmit();
  });
  deleteVisible.value = false;
};

// 新增
const addDialog = () => {
  if (addFormInline.job_name === undefined) {
    message("请输入job名称", { type: "error" });
    return;
  }
  if (addFormInline.cron === undefined) {
    message("请输入cron", { type: "error" });
    return;
  }
  if (addFormInline.flow_code === undefined) {
    message("请选择流程", { type: "error" });
    return;
  }
  if (addFormInline.flow_config_id === undefined) {
    message("请选择流程配置", { type: "error" });
    return;
  }
  if (addFormInline.job_type === undefined) {
    message("请输入job类型", { type: "error" });
    return;
  }

  addJob(addFormInline).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
      onSubmit();
      // clean
      addFormInline.job_name = undefined;
      addFormInline.cron = undefined;
      addFormInline.flow_code = undefined;
      addFormInline.flow_config_id = undefined;
      addFormInline.job_type = undefined;
      addFormInline.parent_job = undefined;
      addFormInline.current_data_id = undefined;
      addFormInline.last_record_id = undefined;
      addVisible.value = false;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};

// 修改
const showUpdateDialog = (selectRow: JobDetailModel) => {
  if (selectRow == undefined) {
    message("未选择数据", { type: "error" });
    return;
  }

  selectValues.value = [selectRow];

  if (selectValues.value.length === 0) {
    message("未选择数据", { type: "error" });
    return;
  }
  if (selectValues.value.length > 1) {
    message("只能选择一条数据", { type: "error" });
    return;
  }
  updateVisible.value = true;

  const row = selectValues.value[0];
  updateFormInline.job_name = row.job_name;
  updateFormInline.cron = row.cron;
  searchFlows(row.flow_name);
  updateFormInline.flow_code = row.flow_code;
  searchFlowConfigDim(row.flow_config_name);
  updateFormInline.flow_config_id = row.flow_config_id;
  updateFormInline.job_type = row.job_type;
  searchJobsByName(row.parent_job_name);
  updateFormInline.parent_job = row.parent_job;
  updateFormInline.current_data_id = row.current_data_id;
  updateFormInline.last_record_id = row.last_record_id;
  updateFormInline.is_active = row.is_active ? "1" : "0";
  updateFormInline.id = row.id;
};
const updateDialog = () => {
  if (updateFormInline.id === undefined) {
    message("未选择数据", { type: "error" });
    return;
  }
  if (updateFormInline.job_name === undefined) {
    message("请输入job名称", { type: "error" });
    return;
  }
  if (updateFormInline.cron === undefined) {
    message("请输入cron", { type: "error" });
    return;
  }
  if (updateFormInline.flow_code === undefined) {
    message("请选择流程", { type: "error" });
    return;
  }
  if (updateFormInline.flow_config_id === undefined) {
    message("请选择流程配置", { type: "error" });
    return;
  }
  if (updateFormInline.job_type === undefined) {
    message("请输入job类型", { type: "error" });
    return;
  }

  const updateData: JobUpdateReqModel = {
    id: updateFormInline.id,
    job_name: updateFormInline.job_name,
    cron: updateFormInline.cron,
    flow_code: updateFormInline.flow_code,
    flow_config_id: updateFormInline.flow_config_id,
    job_type: updateFormInline.job_type,
    parent_job: updateFormInline.parent_job,
    current_data_id: updateFormInline.current_data_id,
    last_record_id: updateFormInline.last_record_id,
    is_active: updateFormInline.is_active == "1" ? true : false
  };

  updateJob(updateData).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
      onSubmit();
      updateVisible.value = false;
    } else {
      message(res.message + "(" + res.data?.message + ")", { type: "error" });
    }
  });
};

// 搜索job类型
const getJobTypeList = () => {
  getJobTypes().then(res => {
    if (res?.status) {
      jobTypeSelectSearchOptions.value = res.data;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};
getJobTypeList();

// 流程模糊搜索
const searchFlows = (query: string) => {
  if (query) {
    flowDetailSelectLoading.value = true;
    flowDetailSelectUpdateLoading.value = true;
    flowDetailSelectSearchLoading.value = true;

    searchDimFlow(query).then(res => {
      if (res?.status) {
        flowDetailSelectOptions.value = res.data.data;
        flowDetailSelectUpdateOptions.value = res.data.data;
        flowDetailSelectSearchOptions.value = res.data.data;
      } else {
        message(res.message + "(" + res.data + ")", { type: "error" });
      }
      flowDetailSelectLoading.value = false;
      flowDetailSelectUpdateLoading.value = false;
      flowDetailSelectSearchLoading.value = false;
    });
  } else {
    flowDetailSelectOptions.value = [];
    flowDetailSelectUpdateOptions.value = [];
    flowDetailSelectSearchOptions.value = [];
  }
};

// 流程配置模糊查询
const searchFlowConfigDim = (query: string) => {
  if (query) {
    flowConfigDetailSelectLoading.value = true;
    flowConfigDetailSelectUpdateLoading.value = true;
    flowConfigDetailSelectSearchLoading.value = true;

    searchConfigDim(query).then(res => {
      if (res?.status) {
        flowConfigDetailSelectOptions.value = res.data.data;
        flowConfigDetailSelectUpdateOptions.value = res.data.data;
        flowConfigDetailSelectSearchOptions.value = res.data.data;
      } else {
        message(res.message + "(" + res.data + ")", { type: "error" });
      }

      flowConfigDetailSelectLoading.value = false;
      flowConfigDetailSelectUpdateLoading.value = false;
      flowConfigDetailSelectSearchLoading.value = false;
    });
  } else {
    flowConfigDetailSelectOptions.value = [];
    flowConfigDetailSelectUpdateOptions.value = [];
    flowConfigDetailSelectSearchOptions.value = [];
  }
};

// job模糊查询
const searchJobsByName = (query: string) => {
  if (query) {
    jobDetailSelectLoading.value = true;
    jobDetailSelectUpdateLoading.value = true;
    jobDetailSelectSearchLoading.value = true;

    searchJobsDim(query).then(res => {
      if (res?.status) {
        jobDetailSelectOptions.value = res.data.data;
        jobDetailSelectUpdateOptions.value = res.data.data;
        jobDetailSelectSearchOptions.value = res.data.data;
      } else {
        message(res.message + "(" + res.data + ")", { type: "error" });
      }
      jobDetailSelectLoading.value = false;
      jobDetailSelectUpdateLoading.value = false;
      jobDetailSelectSearchLoading.value = false;
    });
  } else {
    jobDetailSelectOptions.value = [];
    jobDetailSelectUpdateOptions.value = [];
    jobDetailSelectSearchOptions.value = [];
  }
};

// 选中行
const handleSelectionChange = (rows: JobDetailModel[]) => {
  selectValues.value = rows;
};

// 复制功能
const handleCopyConfirm = () => {
  if (selectValues.value.length === 0) {
    message("未选择数据", { type: "error" });
    return;
  }
  if (selectValues.value.length > 1) {
    message("只能选择一条数据", { type: "error" });
    return;
  }

  let copyValue = selectValues.value[0];
  copyValue.id = undefined;
  copyValue.job_name = copyValue.job_name + "_copy";

  addJob(copyValue).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
      getData(
        currentPage.value,
        pageSize.value,
        sortProp.value,
        sortOrder.value
      );
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });

  copyVisible.value = false;
};

// 详情页跳转
const handleOperationClick = (row: JobDetailModel) => {
  const route = router.resolve({
    path: "/job/record",
    query: { id: row.id }
  });
  window.open(route.href, "_blank");
};

const handleOperationDataClick = (row: JobDetailModel) => {
  const route = router.resolve({
    path: "/job/data",
    query: { id: row.id }
  });
  window.open(route.href, "_blank");
};

// job 执行
const handleJobExecute = (row: JobDetailModel) => {
  if (row == undefined) {
    message("未选择数据", { type: "error" });
    return;
  }

  selectValues.value = [row];
  jobExeVisible.value = true;
};
const handleJobExecuteConfirm = () => {
  if (selectValues.value.length === 0) {
    message("未选择数据", { type: "error" });
    return;
  }
  if (selectValues.value.length > 1) {
    message("只能选择一条数据", { type: "error" });
    return;
  }

  const row = selectValues.value[0];
  jobExe(row.id).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });

  jobExeVisible.value = false;
};

// 执行一次
const execOne = () => {
  if (selectValues.value.length === 0) {
    message("未选择数据", { type: "error" });
    return;
  }

  Promise.all(selectValues.value.map(v => jobExe(v.id))).then(responses => {
    responses.forEach(res => {
      if (res?.status) {
        message(res.message, { type: "success" });
      } else {
        message(res.message + "(" + res.data?.message + ")", { type: "error" });
      }
    });
    onSubmit();
  });
  execOneVisible.value = false;
};
</script>

<template>
  <div>
    <!-- 搜索表单行 -->
    <el-row style="padding-top: 30px">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="ID">
            <el-input v-model="formInline.id" placeholder="请输入job-ID" />
          </el-form-item>
          <el-form-item label="job名称">
            <el-input
              v-model="formInline.job_name"
              placeholder="请输入job名称"
            />
          </el-form-item>
          <el-form-item label="流程">
            <el-select
              v-model="formInline.flow_code"
              filterable
              remote
              reserve-keyword
              placeholder="请选择流程"
              remote-show-suffix
              :remote-method="searchFlows"
              :loading="flowDetailSelectSearchLoading"
              style="width: 240px"
            >
              <el-option
                v-for="item in flowDetailSelectSearchOptions"
                :key="item.flow_code"
                :label="item.flow_code"
                :value="item.flow_code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="流程配置">
            <el-select
              v-model="formInline.flow_config_id"
              filterable
              remote
              reserve-keyword
              placeholder="请选择流程配置"
              remote-show-suffix
              :remote-method="searchFlowConfigDim"
              :loading="flowConfigDetailSelectSearchLoading"
              style="width: 240px"
            >
              <el-option
                v-for="item in flowConfigDetailSelectSearchOptions"
                :key="item.id"
                :label="item.config_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="job类型">
            <el-select
              v-model="formInline.job_type"
              filterable
              remote
              reserve-keyword
              placeholder="请选择job类型"
              remote-show-suffix
              style="width: 240px"
            >
              <el-option
                v-for="item in jobTypeSelectSearchOptions"
                :key="item.id"
                :label="item.des"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="父job">
            <el-select
              v-model="formInline.parent_job"
              filterable
              remote
              reserve-keyword
              placeholder="请选择父job"
              remote-show-suffix
              :remote-method="searchJobsByName"
              :loading="jobDetailSelectSearchLoading"
              style="width: 240px"
            >
              <el-option
                v-for="item in jobDetailSelectSearchOptions"
                :key="item.id"
                :label="item.job_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-select
              v-model="formInline.is_active"
              placeholder="请选择"
              style="width: 220px"
            >
              <el-option label="启用" value="true" />
              <el-option label="不启用" value="false" />
            </el-select>
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

    <!-- 按钮行 -->
    <el-row>
      <el-col :span="24">
        <el-button type="primary" round @click="addVisible = true"
          >新增</el-button
        >
        <el-button type="primary" round @click="copyVisible = true"
          >复制</el-button
        >
        <el-button type="primary" round @click="execOneVisible = true"
          >执行一次</el-button
        >
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" width="80" sortable="custom" />
          <el-table-column
            prop="job_name"
            label="job名称"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column prop="data_count" label="数据量" width="80" />
          <el-table-column
            prop="cron"
            label="cron"
            width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="flow_code"
            label="流程code"
            width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="flow_name"
            label="流程名称"
            width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="flow_config_name"
            label="流程配置名称"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="last_record_status"
            label="上次状态"
            width="100"
          />
          <el-table-column prop="last_record_id" label="最新记录" width="100" />
          <el-table-column prop="job_type_name" label="job类型" width="100" />
          <el-table-column
            prop="parent_job_name"
            label="父job名称"
            width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="current_data_id"
            label="当前数据"
            width="100"
          />
          <el-table-column prop="created_id" label="创建人" />
          <el-table-column
            prop="created_time"
            label="创建日期"
            width="180"
            :formatter="dateFormat"
            show-overflow-tooltip
          />
          <el-table-column
            prop="is_active"
            label="状态"
            :formatter="formatBoolean"
          />
          <el-table-column fixed="right" label="操作" min-width="110">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="showUpdateDialog(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="handleOperationClick(scope.row)"
              >
                记录
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="handleOperationDataClick(scope.row)"
              >
                数据
              </el-button>
              <el-button
                link
                type="primary"
                size="small"
                @click="handleJobExecute(scope.row)"
              >
                执行一次
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

    <!-- 删除确认框 -->
    <el-dialog v-model="deleteVisible" title="提示" width="500">
      <span>是否确认删除</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDeleteConfirm">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 执行确认框 -->
    <el-dialog v-model="execOneVisible" title="提示" width="500">
      <span>是否确认执行一次</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="execOneVisible = false">取消</el-button>
          <el-button type="primary" @click="execOne"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增对话框 -->
    <el-dialog v-model="addVisible" title="新增" width="500">
      <el-form :model="addFormInline">
        <el-form-item label="job名称">
          <el-input
            v-model="addFormInline.job_name"
            placeholder="请输入job名称"
          />
        </el-form-item>
        <el-form-item label="cron">
          <el-input v-model="addFormInline.cron" placeholder="请输入cron" />
        </el-form-item>
        <el-form-item label="流程">
          <el-select
            v-model="addFormInline.flow_code"
            filterable
            remote
            reserve-keyword
            placeholder="请选择流程"
            remote-show-suffix
            :remote-method="searchFlows"
            :loading="flowDetailSelectLoading"
            style="width: 240px"
          >
            <el-option
              v-for="item in flowDetailSelectOptions"
              :key="item.flow_code"
              :label="item.flow_code"
              :value="item.flow_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流程配置">
          <el-select
            v-model="addFormInline.flow_config_id"
            filterable
            remote
            reserve-keyword
            placeholder="请选择流程配置"
            remote-show-suffix
            :remote-method="searchFlowConfigDim"
            :loading="flowConfigDetailSelectLoading"
            style="width: 240px"
          >
            <el-option
              v-for="item in flowConfigDetailSelectOptions"
              :key="item.id"
              :label="item.config_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="job类型">
          <el-select
            v-model="addFormInline.job_type"
            filterable
            remote
            reserve-keyword
            placeholder="请选择job类型"
            remote-show-suffix
            style="width: 240px"
          >
            <el-option
              v-for="item in jobTypeSelectSearchOptions"
              :key="item.id"
              :label="item.des"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="父job">
          <el-select
            v-model="addFormInline.parent_job"
            filterable
            remote
            reserve-keyword
            placeholder="请选择父job"
            remote-show-suffix
            :remote-method="searchJobsByName"
            :loading="jobDetailSelectLoading"
            style="width: 240px"
          >
            <el-option
              v-for="item in jobDetailSelectOptions"
              :key="item.id"
              :label="item.job_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前数据ID">
          <el-input
            v-model="addFormInline.current_data_id"
            placeholder="请输入当前输入id"
          />
        </el-form-item>
        <el-form-item label="最新记录ID">
          <el-input
            v-model="addFormInline.last_record_id"
            placeholder="请输入最新记录ID"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addVisible = false">取消</el-button>
          <el-button type="primary" @click="addDialog"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog v-model="updateVisible" title="编辑" width="500">
      <el-form :model="updateFormInline">
        <el-form-item label="job-ID">
          <el-input v-model="updateFormInline.id" disabled />
        </el-form-item>
        <el-form-item label="job名称">
          <el-input
            v-model="updateFormInline.job_name"
            placeholder="请输入job名称"
          />
        </el-form-item>
        <el-form-item label="cron">
          <el-input v-model="updateFormInline.cron" placeholder="请输入cron" />
        </el-form-item>
        <el-form-item label="流程">
          <el-select
            v-model="updateFormInline.flow_code"
            filterable
            remote
            reserve-keyword
            placeholder="请选择流程"
            remote-show-suffix
            :remote-method="searchFlows"
            :loading="flowDetailSelectUpdateLoading"
            style="width: 240px"
          >
            <el-option
              v-for="item in flowDetailSelectUpdateOptions"
              :key="item.flow_code"
              :label="item.flow_code"
              :value="item.flow_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流程配置">
          <el-select
            v-model="updateFormInline.flow_config_id"
            filterable
            remote
            reserve-keyword
            placeholder="请选择流程配置"
            remote-show-suffix
            :remote-method="searchFlowConfigDim"
            :loading="flowConfigDetailSelectUpdateLoading"
            style="width: 240px"
          >
            <el-option
              v-for="item in flowConfigDetailSelectUpdateOptions"
              :key="item.id"
              :label="item.config_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="job类型">
          <el-select
            v-model="updateFormInline.job_type"
            filterable
            remote
            reserve-keyword
            placeholder="请选择job类型"
            remote-show-suffix
            style="width: 240px"
          >
            <el-option
              v-for="item in jobTypeSelectSearchOptions"
              :key="item.id"
              :label="item.des"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="父job">
          <el-select
            v-model="updateFormInline.parent_job"
            filterable
            remote
            reserve-keyword
            placeholder="请选择父job"
            remote-show-suffix
            :remote-method="searchJobsByName"
            :loading="jobDetailSelectUpdateLoading"
            style="width: 240px"
          >
            <el-option
              v-for="item in jobDetailSelectUpdateOptions"
              :key="item.id"
              :label="item.job_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前数据ID">
          <el-input
            v-model="updateFormInline.current_data_id"
            placeholder="请输入当前数据ID"
          />
        </el-form-item>
        <el-form-item label="最新记录ID">
          <el-input
            v-model="updateFormInline.last_record_id"
            placeholder="请输入最新记录ID"
          />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="updateFormInline.is_active">
            <el-radio value="1" size="large">启用</el-radio>
            <el-radio value="0" size="large">不启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="updateVisible = false">取消</el-button>
          <el-button type="primary" @click="updateDialog"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 复制确认框 -->
    <el-dialog v-model="copyVisible" title="提示" width="500">
      <span>是否确认复制</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="copyVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCopyConfirm">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 执行确认框 -->
    <el-dialog v-model="jobExeVisible" title="提示" width="500">
      <span>是否确认执行</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="jobExeVisible = false">取消</el-button>
          <el-button type="primary" @click="handleJobExecuteConfirm">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
