<script lang="ts" setup>
import * as monaco from "monaco-editor";
import { useRoute } from "vue-router";
import { defineProps, ref, onUnmounted } from "vue";
import { message } from "@/utils/message";
import { searchFlows, updateFlowScript } from "@/api/flow";
import type { FlowSearchReqModel, FlowUpdateReqModel } from "@/api/flow";

const route = useRoute();
const flowId = route.query.id;
const type = route.query.type;
const scriptValue = ref("");
const saveVisible = ref(false);

// 编辑器容器div
const editorContainer = ref(null);
// 编辑器实列
let editor = null;

defineProps({
  frameInfo: String,
  class: String
});

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

      if (type === "execute") {
        scriptValue.value = flowDetail.flow_exe_script;
      } else if (type === "check") {
        scriptValue.value = flowDetail.request_check_script;
      } else if (type === "adapt") {
        scriptValue.value = flowDetail.request_adapt_script;
      } else {
        scriptValue.value = flowDetail.flow_result_handle_script;
      }
      editorInit();
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
}

// 初始化编辑器
const editorInit = () => {
  //console.log(checkScript.value);
  if (editorContainer.value) {
    // 创建编辑器实列
    editor = monaco.editor.create(editorContainer.value, {
      value: scriptValue.value,
      language: "python", // 编辑器语言
      theme: "vs-dark", // 编辑器主题 默认vs-dark VSCode 黑色主题,可选：vs、vs-dark、hc-black、hc-light
      readOnly: false, // 是否只读内容不可编辑
      codeLens: true, // 代码透镜
      folding: true, // 代码折叠
      snippetSuggestions: "inline", // 代码提示
      tabCompletion: "on", // 代码提示按tab完成
      foldingStrategy: "auto", // 折叠策略
      smoothScrolling: true // 滚动动画
    });

    // 编辑器内容变更时回调
    editor.onDidChangeModelContent(() => {
      //const value = editor.value.getValue();
      //console.log(value);
    });
  }
};

//onMounted(editorInit);

// 当组件被卸载时调用该回调函数
onUnmounted(() => {
  // 检查 editor 是否已初始化
  if (editor) {
    // 清理 editor 资源，避免内存泄漏
    editor.dispose();
  }
});

// 保存脚本
const saveScript = () => {
  //console.log(editor.getValue());

  const updateData: FlowUpdateReqModel = {
    id: Number(flowId),
    site_id: undefined,
    flow_code: undefined,
    flow_name: undefined,
    flow_rpa_type: undefined,
    flow_exe_env: undefined,
    flow_biz_type: undefined,
    max_retry_number: undefined,
    max_exe_time: undefined,
    retry_code: undefined,
    request_check_script: type === "check" ? editor.getValue() : undefined,
    request_adapt_script: type === "adapt" ? editor.getValue() : undefined,
    flow_exe_script: type === "execute" ? editor.getValue() : undefined,
    flow_result_handle_script:
      type === "response" ? editor.getValue() : undefined,
    is_active: undefined
  };

  updateFlowScript(updateData).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
      saveVisible.value = false;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};
</script>

<template>
  <div>
    <div>
      <div ref="editorContainer" style="height: 80vh" />
    </div>

    <!-- 分割线 -->
    <el-divider />

    <div style=" margin-top: 20px;text-align: center">
      <el-button type="primary" @click="saveVisible = true">保存</el-button>
    </div>

    <!-- 分割线 -->
    <el-divider />

    <!-- 保存确认框 -->
    <el-dialog v-model="saveVisible" title="提示" width="500">
      <span>是否确认保存</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="saveVisible = false">取消</el-button>
          <el-button type="primary" @click="saveScript"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
