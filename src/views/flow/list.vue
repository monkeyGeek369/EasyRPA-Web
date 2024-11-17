<script lang="ts" setup>
import { useRouter } from "vue-router";
import { computed, ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import { message } from "@/utils/message";
import { Delete, Edit } from "@element-plus/icons-vue";
import { is } from "@pureadmin/utils";
import type {
  FlowSearchReqModel,
  FlowDetailModel,
  FlowAddReqModel
} from "@/api/flow";
import { searchFlows, addFlow } from "@/api/flow";
import { searchSitesByName } from "@/api/site";
import type { SiteDetailModel } from "@/api/site";

defineOptions({
  name: "flow_list"
});

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
  flow_code: undefined,
  flow_name: undefined,
  flow_rpa_type: undefined,
  flow_exe_env: undefined,
  flow_biz_type: undefined,
  retry_code: undefined,
  is_active: undefined
});
const selectValues = ref<FlowDetailModel[]>([]);
const deleteVisible = ref(false);
const addFormInline = reactive<FlowAddReqModel>({
  site_id: undefined,
  flow_code: undefined,
  flow_name: undefined,
  flow_rpa_type: undefined,
  flow_exe_env: undefined,
  flow_biz_type: undefined,
  max_retry_number: undefined,
  max_exe_time: undefined,
  retry_code: undefined,
  request_check_script: "// todo : request_check_script",
  request_adapt_script: "// todo : request_adapt_script",
  flow_exe_script: "// todo : flow_exe_script",
  flow_result_handle_script: "// todo : flow_result_handle_script"
});
const addVisible = ref(false);

// 站点模糊搜索
const siteDetailSelectValue = ref<number>();
const siteDetailSelectLoading = ref(false);
const siteDetailSelectOptions = ref<SiteDetailModel[]>([]);

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: FlowSearchReqModel = {
    id: formInline.id,
    site_id: formInline.site_id,
    flow_code: formInline.flow_code,
    flow_name: formInline.flow_name,
    flow_rpa_type: formInline.flow_rpa_type,
    flow_exe_env: formInline.flow_exe_env,
    flow_biz_type: formInline.flow_biz_type,
    retry_code: formInline.retry_code,
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

  searchFlows(datatest).then(res => {
    //console.log(res);
    if (res?.status) {
      total.value = res.data.total;
      tableData.value = res.data.data;
      //console.log(tableData.value);
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
  const date = new Date(row[column.property]);
  return date.toLocaleString("zh-CN", {
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

// 新增
const addDialog = () => {
  addFormInline.site_id = siteDetailSelectValue.value;
  if (addFormInline.site_id === undefined) {
    message("请选择站点", { type: "error" });
    return;
  }
  if (addFormInline.flow_code === undefined) {
    message("请输入流程code", { type: "error" });
    return;
  }
  if (addFormInline.flow_name === undefined) {
    message("请输入流程名称", { type: "error" });
    return;
  }
  if (addFormInline.flow_rpa_type === undefined) {
    message("请选择选择流程类型", { type: "error" });
    return;
  }
  if (addFormInline.flow_exe_env === undefined) {
    message("请选择执行环境", { type: "error" });
    return;
  }
  if (addFormInline.flow_biz_type === undefined) {
    message("请选择业务类型", { type: "error" });
    return;
  }
  if (addFormInline.max_retry_number === undefined) {
    message("请输入最大重试次数", { type: "error" });
    return;
  }
  if (addFormInline.max_exe_time === undefined) {
    message("请输入最大执行时间", { type: "error" });
    return;
  }
  if (addFormInline.retry_code === undefined) {
    message("请输入重试code", { type: "error" });
    return;
  }

  addFlow(addFormInline).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
      getData(
        currentPage.value,
        pageSize.value,
        sortProp.value,
        sortOrder.value
      );
      // clean
      addFormInline.site_id = undefined;
      addFormInline.flow_code = undefined;
      addFormInline.flow_name = undefined;
      addFormInline.flow_rpa_type = undefined;
      addFormInline.flow_exe_env = undefined;
      addFormInline.flow_biz_type = undefined;
      addFormInline.max_retry_number = undefined;
      addFormInline.max_exe_time = undefined;
      addFormInline.retry_code = undefined;

      addVisible.value = false;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};

// 站点模糊搜索
const searchSites = (query: string) => {
  if (query) {
    siteDetailSelectLoading.value = true;

    searchSitesByName(query).then(res => {
      if (res?.status) {
        siteDetailSelectOptions.value = res.data.data;
      } else {
        message(res.message + "(" + res.data + ")", { type: "error" });
      }
      siteDetailSelectLoading.value = false;
    });
  } else {
    siteDetailSelectOptions.value = [];
  }
};
</script>
<template>
  <div>
    <!-- 搜索表单行 -->
    <el-row style="padding-top: 30px">
      <el-col :span="24">搜索表单行</el-col>
    </el-row>

    <!-- 分割线 -->
    <el-divider />

    <!-- 按钮行 -->
    <el-row>
      <el-col :span="24">
        <el-button type="primary" round @click="addVisible = true"
          >新增</el-button
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
        >
          <el-table-column prop="id" label="ID" width="80" sortable="custom" />
          <el-table-column prop="site_name" label="站点名称" width="180" />
          <el-table-column prop="flow_code" label="流程code" width="180" />
          <el-table-column prop="flow_name" label="流程名称" width="180" />
          <el-table-column
            prop="flow_rpa_type_name"
            label="流程类型"
            width="180"
          />
          <el-table-column
            prop="flow_exe_env_name"
            label="执行环境"
            width="180"
          />
          <el-table-column
            prop="flow_biz_type_name"
            label="业务类型"
            width="180"
          />
          <el-table-column
            prop="max_retry_number"
            label="最大重试次数"
            width="180"
          />
          <el-table-column
            prop="max_exe_time"
            label="最大执行时间"
            width="180"
          />
          <el-table-column prop="retry_code" label="重试code" width="180" />
          <el-table-column prop="created_id" label="创建人ID" />
          <el-table-column
            prop="created_time"
            label="创建日期"
            :formatter="dateFormat"
          />
          <el-table-column prop="modify_id" label="修改人ID" />
          <el-table-column
            prop="modify_time"
            label="修改日期"
            :formatter="dateFormat"
          />
          <el-table-column
            prop="is_active"
            label="是否启用"
            :formatter="formatBoolean"
          />
          <el-table-column fixed="right" label="操作" min-width="120" />
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
        />
      </el-col>
    </el-row>

    <!-- 新增对话框 -->
    <el-dialog v-model="addVisible" title="新增" width="500">
      <el-form :model="addFormInline">
        <el-form-item label="站点">
          <el-select
            v-model="siteDetailSelectValue"
            filterable
            remote
            reserve-keyword
            placeholder="请选择站点"
            remote-show-suffix
            :remote-method="searchSites"
            :loading="siteDetailSelectLoading"
            style="width: 240px"
          >
            <el-option
              v-for="item in siteDetailSelectOptions"
              :key="item.id"
              :label="item.site_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流程code">
          <el-input
            v-model="addFormInline.flow_code"
            placeholder="请输入流程code"
          />
        </el-form-item>
        <el-form-item label="流程名称">
          <el-input
            v-model="addFormInline.flow_name"
            placeholder="请输入流程名称"
          />
        </el-form-item>
        <el-form-item label="流程类型">
          <el-input
            v-model="addFormInline.flow_rpa_type"
            placeholder="请选择流程类型"
          />
        </el-form-item>
        <el-form-item label="执行环境">
          <el-input
            v-model="addFormInline.flow_exe_env"
            placeholder="请选择执行环境"
          />
        </el-form-item>
        <el-form-item label="业务类型">
          <el-input
            v-model="addFormInline.flow_biz_type"
            placeholder="请选择业务类型"
          />
        </el-form-item>
        <el-form-item label="最大重试次数">
          <el-input
            v-model="addFormInline.max_retry_number"
            placeholder="请输入最大重试次数"
          />
        </el-form-item>
        <el-form-item label="最大执行时间">
          <el-input
            v-model="addFormInline.max_exe_time"
            placeholder="请输入最大执行时间"
          />
        </el-form-item>
        <el-form-item label="重试code">
          <el-input
            v-model="addFormInline.retry_code"
            placeholder="请输入重试code"
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
  </div>
</template>
