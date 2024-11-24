<script setup lang="ts">
import { ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import type {
  FlowConfigSearchReqModel,
  FlowConfigDetailModel,
  FlowConfigAddReqModel,
  FlowConfigUpdateReqModel
} from "@/api/flowConfig";
import {
  searchFlowConfigs,
  deleteFlowConfig,
  addFlowConfig,
  updateFlowConfig
} from "@/api/flowConfig";
import { message } from "@/utils/message";
import { searchDimFlow } from "@/api/flow";

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
  flow_id: undefined,
  config_name: undefined,
  config_description: undefined,
  is_active: undefined
});
const selectValues = ref<FlowConfigDetailModel[]>([]);
const deleteVisible = ref(false);
const addFormInline = reactive<FlowConfigAddReqModel>({
  flow_id: undefined,
  config_name: undefined,
  config_description: undefined,
  config_json: undefined
});
const addVisible = ref(false);
const updateFormInline = reactive({
  id: undefined,
  flow_id: undefined,
  config_name: undefined,
  config_description: undefined,
  config_json: undefined,
  is_active: undefined
});
const updateVisible = ref(false);

// 站点模糊搜索(新增)
const flowDetailSelectValue = ref<number>();
const flowDetailSelectLoading = ref(false);
const flowDetailSelectOptions = ref<FlowConfigDetailModel[]>([]);

// 站点模糊搜索(修改)
const flowDetailSelectUpdateValue = ref<number>();
const flowDetailSelectUpdateLoading = ref(false);
const flowDetailSelectUpdateOptions = ref<FlowConfigDetailModel[]>([]);

// 站点模糊搜索(查询)
const flowDetailSelectSearchLoading = ref(false);
const flowDetailSelectSearchOptions = ref<FlowConfigDetailModel[]>([]);

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: FlowConfigSearchReqModel = {
    id: formInline.id,
    flow_id: formInline.flow_id,
    config_name: formInline.config_name,
    config_description: formInline.config_description,
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

  searchFlowConfigs(datatest).then(res => {
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
  formInline.flow_id = undefined;
  formInline.config_name = undefined;
  formInline.config_description = undefined;
  formInline.is_active = undefined;
};

// 删除
const handleDelete = (row: FlowConfigDetailModel) => {
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

  Promise.all(selectValues.value.map(v => deleteFlowConfig(v.id))).then(
    responses => {
      responses.forEach(res => {
        if (res?.status) {
          message(res.message, { type: "success" });
        } else {
          message(res.message + "(" + res.data?.message + ")", {
            type: "error"
          });
        }
      });
      onSubmit();
    }
  );
  deleteVisible.value = false;
};

// 新增
const addDialog = () => {
  addFormInline.flow_id = flowDetailSelectValue.value;
  if (addFormInline.flow_id === undefined) {
    message("请选择流程", { type: "error" });
    return;
  }
  if (addFormInline.config_name === undefined) {
    message("请输入配置名称", { type: "error" });
    return;
  }
  if (addFormInline.config_description === undefined) {
    message("请输入配置描述", { type: "error" });
    return;
  }
  if (addFormInline.config_json === undefined) {
    message("请输入配置信息", { type: "error" });
    return;
  }

  addFlowConfig(addFormInline).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
      onSubmit();
      // clean
      addFormInline.flow_id = undefined;
      addFormInline.config_name = undefined;
      addFormInline.config_description = undefined;
      addFormInline.config_json = undefined;
      addVisible.value = false;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};

// 修改
const showUpdateDialog = (selectRow: FlowConfigDetailModel) => {
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
  flowDetailSelectUpdateValue.value = row.flow_id;
  searchFlows(row.flow_name);
  updateFormInline.config_name = row.config_name;
  updateFormInline.config_description = row.config_description;
  updateFormInline.config_json = row.config_json;
  updateFormInline.is_active = row.is_active ? "1" : "0";
  updateFormInline.id = row.id;
};
const updateDialog = () => {
  if (updateFormInline.id === undefined) {
    message("未选择数据", { type: "error" });
    return;
  }
  updateFormInline.flow_id = flowDetailSelectUpdateValue.value;
  if (updateFormInline.flow_id === undefined) {
    message("请选择流程", { type: "error" });
    return;
  }
  if (updateFormInline.config_name === undefined) {
    message("请输入配置名称", { type: "error" });
    return;
  }
  if (updateFormInline.config_description === undefined) {
    message("请输入配置描述", { type: "error" });
    return;
  }
  if (updateFormInline.config_json === undefined) {
    message("请输入配置信息", { type: "error" });
    return;
  }

  const updateData: FlowConfigUpdateReqModel = {
    id: updateFormInline.id,
    flow_id: updateFormInline.flow_id,
    config_name: updateFormInline.config_name,
    config_description: updateFormInline.config_description,
    config_json: updateFormInline.config_json,
    is_active: updateFormInline.is_active == "1" ? true : false
  };

  updateFlowConfig(updateData).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
      onSubmit();
      updateVisible.value = false;
    } else {
      message(res.message + "(" + res.data?.message + ")", { type: "error" });
    }
  });
};

// 站点模糊搜索
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
</script>
<template>
  <div>
    <!-- 搜索表单行 -->
    <el-row style="padding-top: 30px">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="ID">
            <el-input v-model="formInline.id" placeholder="请输入配置id" />
          </el-form-item>
          <el-form-item label="流程名称">
            <el-select
              v-model="formInline.flow_id"
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
                :key="item.id"
                :label="item.flow_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="配置名称">
            <el-input
              v-model="formInline.config_name"
              placeholder="请输入配置名称"
            />
          </el-form-item>
          <el-form-item label="配置描述">
            <el-input
              v-model="formInline.config_description"
              placeholder="请输入配置描述"
            />
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
            prop="config_name"
            label="配置名称"
            width="180"
            show-overflow-tooltip
          /><el-table-column
            prop="config_description"
            label="配置描述"
            width="180"
            show-overflow-tooltip
          /><el-table-column
            prop="config_json"
            label="配置信息"
            width="180"
            show-overflow-tooltip
          />
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
          <el-table-column fixed="right" label="操作" min-width="120">
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
        />
      </el-col>
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

    <!-- 新增对话框 -->
    <el-dialog v-model="addVisible" title="新增" width="500">
      <el-form :model="addFormInline">
        <el-form-item label="流程">
          <el-select
            v-model="flowDetailSelectValue"
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
              :key="item.id"
              :label="item.flow_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配置名称">
          <el-input
            v-model="addFormInline.config_name"
            placeholder="请输入配置名称"
          />
        </el-form-item>
        <el-form-item label="配置描述">
          <el-input
            v-model="addFormInline.config_description"
            placeholder="请输入配置描述"
          />
        </el-form-item>
        <el-form-item label="配置信息">
          <el-input
            v-model="addFormInline.config_json"
            placeholder="请输入配置信息"
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
        <el-form-item label="配置ID">
          <el-input v-model="updateFormInline.id" disabled />
        </el-form-item>
        <el-form-item label="流程名称">
          <el-select
            v-model="flowDetailSelectUpdateValue"
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
              :key="item.id"
              :label="item.flow_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="配置名称">
          <el-input
            v-model="updateFormInline.config_name"
            placeholder="请输入配置名称"
          />
        </el-form-item>
        <el-form-item label="配置描述">
          <el-input
            v-model="updateFormInline.config_description"
            placeholder="请输入配置描述"
          />
        </el-form-item>
        <el-form-item label="配置信息">
          <el-input
            v-model="updateFormInline.config_json"
            placeholder="请输入配置信息"
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
  </div>
</template>
