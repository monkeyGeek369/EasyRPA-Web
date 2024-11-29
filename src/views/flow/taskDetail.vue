<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import type { TaskDetailModel } from "@/api/flowTask";
import { getFlowTaskById } from "@/api/flowTask";
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
        <el-tab-pane label="结果数据">
          <json-viewer
            :value="resultData || {}"
            :expand-depth="5"
            copyable
            :sort="true"
          />
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
