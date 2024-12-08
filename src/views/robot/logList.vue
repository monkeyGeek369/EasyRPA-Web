<script setup lang="ts">
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { computed, ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import type {
  RobotLogDetailModel,
  RobotLogSearchReqModel,
  MetaDataBaseModel
} from "@/api/robot";
import { searchRobotLogs, getAllRobotLogTypes } from "@/api/robot";
import { message } from "@/utils/message";
const router = useRouter();

// 参数设置
const route = useRoute();
const robotId = route.query.id;

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
  robot_id: undefined,
  task_id: undefined,
  log_type: undefined
});
const selectValues = ref<RobotLogDetailModel[]>([]);
const robotLogTypes = ref<MetaDataBaseModel[]>([]);

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: RobotLogSearchReqModel = {
    robot_id: Number(robotId),
    task_id: formInline.task_id,
    log_type: formInline.log_type,
    page: page,
    page_size: pageSize,
    sorts: [{ prop: prop, order: order }]
  };

  searchRobotLogs(datatest).then(res => {
    if (res?.status) {
      total.value = res.data.total;
      tableData.value = res.data.data;
      //console.log(tableData.value);
    } else {
      message(res.message + "(" + res.data?.message + ")", { type: "error" });
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
  formInline.log_type = undefined;
  formInline.task_id = undefined;
};

// 查询机器人日志状态
const getRobotLogTypes = () => {
  getAllRobotLogTypes().then(res => {
    if (res?.status) {
      robotLogTypes.value = res.data;
    } else {
      message(res.message + "(" + res.data?.message + ")", { type: "error" });
    }
  });
};

getRobotLogTypes();
</script>
<template>
  <div>
    <!-- 搜索表单行 -->
    <el-row style="padding-top: 30px">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="TaskId">
            <el-input v-model="formInline.task_id" placeholder="请输入taskId" />
          </el-form-item>
          <el-form-item label="logType">
            <el-select
              v-model="formInline.log_type"
              placeholder="请选择logType"
              collapse-tags-tooltip
              style="width: 240px"
            >
              <el-option
                v-for="item in robotLogTypes"
                :key="item.id"
                :label="item.des"
                :value="item.id"
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
          <el-table-column
            prop="robot_id"
            label="RobotId"
            width="80"
            show-overflow-tooltip
          />
          <el-table-column
            prop="task_id"
            label="taskId"
            width="80"
            show-overflow-tooltip
          />
          <el-table-column prop="log_type_name" label="logType" width="180" />
          <el-table-column
            prop="message"
            label="message"
            show-overflow-tooltip
          />
          <el-table-column prop="created_id" label="创建人ID" />
          <el-table-column
            prop="created_time"
            label="创建日期"
            :formatter="dateFormat"
            show-overflow-tooltip
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
