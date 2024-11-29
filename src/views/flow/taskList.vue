<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import type { TaskSearchReqModel, TaskDetailModel } from "@/api/flowTask";
import { searchFlowTasks } from "@/api/flowTask";
import { message } from "@/utils/message";

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
            <el-input v-model="formInline.site_id" placeholder="请选择站点" />
          </el-form-item>
          <el-form-item label="流程">
            <el-input v-model="formInline.flow_id" placeholder="请选择流程" />
          </el-form-item>
          <el-form-item label="业务编号">
            <el-input
              v-model="formInline.biz_no"
              placeholder="请输入业务编号"
            />
          </el-form-item>
          <el-form-item label="来源方">
            <el-input
              v-model="formInline.sub_source"
              placeholder="请选择任务来源"
            />
          </el-form-item>
          <el-form-item label="任务状态">
            <el-input
              v-model="formInline.status"
              placeholder="请选择任务状态"
            />
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
