<script lang="ts" setup>
import { useRoute } from "vue-router";
import { computed, ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import { message } from "@/utils/message";
import { Delete, Edit } from "@element-plus/icons-vue";
import { is } from "@pureadmin/utils";
import { searchFlows } from "@/api/flow";
import type { FlowSearchReqModel, FlowDetailModel } from "@/api/flow";
import { string } from "vue-types";

// 参数设置
const route = useRoute();
const flowId = route.query.id;
const checkScript = ref("");
const adaptScript = ref("");
const exeScript = ref("");
const resultHandleScript = ref("");

// 校验
if (!flowId) {
  message("参数有误", { type: "error" });
} else {
  // 根据流程id查询流程详情
  const datatest: FlowSearchReqModel = {
    id: Number(flowId),
    site_id: undefined,
    flow_code: undefined,
    flow_name: undefined,
    flow_rpa_type: undefined,
    flow_exe_env: undefined,
    flow_biz_type: undefined,
    retry_code: undefined,
    is_active: undefined,
    page: 1,
    page_size: 1,
    sorts: []
  };
  searchFlows(datatest).then(res => {
    //console.log(res);
    if (res?.status) {
      const flowDetail = res.data.data[0];

      checkScript.value = flowDetail.request_check_script;
      adaptScript.value = flowDetail.request_adapt_script;
      exeScript.value = flowDetail.flow_exe_script;
      resultHandleScript.value = flowDetail.flow_result_handle_script;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
}
</script>

<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="校验脚本">flowId</el-tab-pane>
      <el-tab-pane label="适配脚本">Config</el-tab-pane>
      <el-tab-pane label="执行脚本">Role</el-tab-pane>
      <el-tab-pane label="结果处理脚本">Task</el-tab-pane>
    </el-tabs>
  </div>
</template>
