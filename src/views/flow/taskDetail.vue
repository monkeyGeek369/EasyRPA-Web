<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import type { TaskDetailModel, TaskLogSearchReqModel } from "@/api/flowTask";
import { getFlowTaskById, searchFlowTaskLogs } from "@/api/flowTask";
import { message } from "@/utils/message";
import "vue-json-viewer/style.css";

const route = useRoute();
const taskId = route.query.id;
const taskDetail = ref<TaskDetailModel>();
const resultData = ref();
const requestStandardMessage = ref();
const flowStandardMessage = ref();
const taskResultMessage = ref();
const flowResultHandleMessage = ref();

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
const sortOrder = ref("asc");

// search task
getFlowTaskById(Number(taskId)).then(res => {
  if (res?.status) {
    taskDetail.value = res.data;
    resultData.value = JSON.parse(taskDetail.value?.result_data);
    requestStandardMessage.value = JSON.parse(
      taskDetail.value?.request_standard_message
    );
    flowStandardMessage.value = JSON.parse(
      taskDetail.value?.flow_standard_message
    );
    taskResultMessage.value = JSON.parse(taskDetail.value?.task_result_message);
    flowResultHandleMessage.value = JSON.parse(
      taskDetail.value?.flow_result_handle_message
    );
    // console.log(taskDetail.value);
  } else {
    message(res.message + "(" + res.data + ")", { type: "error" });
  }
});

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: TaskLogSearchReqModel = {
    id: undefined,
    task_id: Number(taskId),
    page: page,
    page_size: pageSize,
    sorts: [{ prop: prop, order: order }]
  };

  searchFlowTaskLogs(datatest).then(res => {
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
</script>
<template>
  <div>
    <el-card style="max-width: 100%">
      <template #header>
        <div class="card-header">
          <span>任务基本信息</span>
        </div>
      </template>

      <!-- 基本信息 -->
      <el-row class="row_style">
        <el-col :span="6">
          <span class="title">任务ID:</span>
          <span class="title_value">{{ taskDetail?.id }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">站点ID:</span>
          <span class="title_value">{{ taskDetail?.site_id }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">站点名称:</span>
          <span class="title_value">{{ taskDetail?.site_name }}</span>
        </el-col>
        <el-col :span="6" />
      </el-row>
      <el-row class="row_style">
        <el-col :span="6">
          <span class="title">流程ID:</span>
          <span class="title_value">{{ taskDetail?.flow_id }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">流程CODE:</span>
          <span class="title_value">{{ taskDetail?.flow_code }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">流程名称:</span>
          <span class="title_value">{{ taskDetail?.flow_name }}</span>
        </el-col>
        <el-col :span="6" />
      </el-row>
      <el-row class="row_style">
        <el-col :span="6">
          <span class="title">配置ID:</span>
          <span class="title_value">{{ taskDetail?.flow_config_id }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">配置名称:</span>
          <span class="title_value">{{ taskDetail?.flow_config_name }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">来源ID:</span>
          <span class="title_value">{{ taskDetail?.sub_source }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">来源名称:</span>
          <span class="title_value">{{ taskDetail?.sub_source_name }}</span>
        </el-col>
      </el-row>
      <el-row class="row_style">
        <el-col :span="6">
          <span class="title">业务编号:</span>
          <span class="title_value">{{ taskDetail?.biz_no }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">状态ID:</span>
          <span class="title_value">{{ taskDetail?.status }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">状态名称:</span>
          <span class="title_value">{{ taskDetail?.status_name }}</span>
        </el-col>
        <el-col :span="6" />
      </el-row>
      <el-row class="row_style">
        <el-col :span="6">
          <span class="title">结果CODE:</span>
          <span class="title_value">{{ taskDetail?.result_code }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">结果消息:</span>
          <span class="title_value">{{ taskDetail?.result_message }}</span>
        </el-col>
        <el-col :span="6">
          <span class="title">重试次数:</span>
          <span class="title_value">{{ taskDetail?.retry_number }}</span>
        </el-col>
        <el-col :span="6" />
      </el-row>

      <!-- 分割线 -->
      <el-divider />

      <!-- 信息卡片 -->
      <el-tabs type="border-card">
        <el-tab-pane label="任务日志">
          <el-table
            :data="tableData"
            :stripe="true"
            :default-sort="{ prop: 'id', order: 'ascending' }"
            :border="true"
            style="width: 100%; height: 100%"
            @sort-change="sortChange"
          >
            <el-table-column
              prop="id"
              label="ID"
              width="80"
              sortable="custom"
              show-overflow-tooltip
            />
            <el-table-column
              prop="log_type_name"
              label="日志类型"
              width="100"
              show-overflow-tooltip
            />
            <el-table-column
              prop="message"
              label="日志信息"
              show-overflow-tooltip
            />
            <el-table-column
              prop="screenshot"
              label="截图"
              width="80"
              show-overflow-tooltip
            />
            <el-table-column
              prop="robot_ip"
              label="机器ip"
              width="100"
              show-overflow-tooltip
            />
            <el-table-column
              prop="created_time"
              label="创建日期"
              width="160"
              :formatter="dateFormat"
              show-overflow-tooltip
            />
          </el-table>

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
        </el-tab-pane>
        <el-tab-pane label="请求标准报文">
          <json-viewer
            :value="requestStandardMessage || {}"
            :expand-depth="5"
            copyable
            :sort="true"
          />
        </el-tab-pane>
        <el-tab-pane label="流程标准报文">
          <json-viewer
            :value="flowStandardMessage || {}"
            :expand-depth="5"
            copyable
            :sort="true"
          />
        </el-tab-pane>
        <el-tab-pane label="任务执行结果">
          <json-viewer
            :value="taskResultMessage || {}"
            :expand-depth="5"
            copyable
            :sort="true"
          />
        </el-tab-pane>
        <el-tab-pane label="任务执行处理结果">
          <json-viewer
            :value="flowResultHandleMessage || {}"
            :expand-depth="5"
            copyable
            :sort="true"
          />
        </el-tab-pane>
        <el-tab-pane label="结果数据">
          <json-viewer
            :value="resultData || {}"
            :expand-depth="5"
            copyable
            :sort="true"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style lang="css">
.row_style {
  margin-bottom: 20px;
}

.title {
  margin-bottom: 4px;
  font-size: 16px;
  font-weight: bold;
}

.title_value {
  margin-left: 10px;
  font-size: 14px;
  color: #666;
}
</style>
