<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import type {
  JobRecordSearchReqModel,
  JobRecordSearchResModel,
  JobRecordDetailModel,
  JobRecordStatusModel
} from "@/api/jobRecord";
import { searchJobRecords, getJobRecordStatus } from "@/api/jobRecord";
import { message } from "@/utils/message";

const route = useRoute();
const jobId = route.query.id;
const statusOptions = ref<JobRecordStatusModel[]>([]);

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
  job_id: Number(jobId),
  flow_task_id: undefined,
  status: undefined
});

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: JobRecordSearchReqModel = {
    id: formInline.id,
    job_id: formInline.job_id,
    flow_task_id: formInline.flow_task_id,
    status: formInline.status,
    page: page,
    page_size: pageSize,
    sorts: [{ prop: prop, order: order }]
  };

  searchJobRecords(datatest).then(res => {
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
  formInline.flow_task_id = undefined;
  formInline.status = undefined;
};

// 查询record 状态
const getRecordStatus = () => {
  getJobRecordStatus().then(res => {
    if (res?.status) {
      statusOptions.value = res.data;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};
getRecordStatus();
</script>

<template>
  <div>
    <!-- 搜索表单行 -->
    <el-row style="padding-top: 30px">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="ID">
            <el-input v-model="formInline.id" placeholder="请输入ID" />
          </el-form-item>
          <el-form-item label="任务ID">
            <el-input
              v-model="formInline.flow_task_id"
              placeholder="请输入任务ID"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="formInline.status"
              placeholder="请选择状态"
              style="width: 240px"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.des"
                :value="Number(item.id)"
              />
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
          <el-table-column prop="job_id" label="job-ID" width="180" />
          <el-table-column prop="job_name" label="job名称" width="180" />
          <el-table-column prop="flow_code" label="流程code" width="180" />
          <el-table-column prop="flow_name" label="流程名称" width="180" />
          <el-table-column prop="flow_task_id" label="流程任务ID" width="180" />
          <el-table-column prop="status_name" label="状态" width="180" />
          <el-table-column prop="result_message" label="结果消息" width="180" />
          <el-table-column
            prop="created_time"
            label="创建日期"
            :formatter="dateFormat"
          />
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
