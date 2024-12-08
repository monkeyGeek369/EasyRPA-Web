<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import type {
  RobotDetailModel,
  RobotSearchReqModel,
  MetaDataBaseModel
} from "@/api/robot";
import { searchRobots, getAllRobotStatus, deleteRobot } from "@/api/robot";
import { message } from "@/utils/message";
const router = useRouter();
const deleteVisible = ref(false);

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
  robot_code: undefined,
  robot_ip: undefined,
  status: undefined,
  current_task_id: undefined
});
const selectValues = ref<RobotDetailModel[]>([]);
const robotStatus = ref<MetaDataBaseModel[]>([]);

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: RobotSearchReqModel = {
    robot_code: formInline.robot_code,
    robot_ip: formInline.robot_ip,
    status: formInline.status,
    current_task_id: formInline.current_task_id,
    page: page,
    page_size: pageSize,
    sorts: [{ prop: prop, order: order }]
  };

  searchRobots(datatest).then(res => {
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
  formInline.robot_code = undefined;
  formInline.robot_ip = undefined;
  formInline.status = undefined;
  formInline.current_task_id = undefined;
};

// 跳转机器人日志
const handleOperationClick = (row: RobotDetailModel) => {
  //console.log(row);
  const route = router.resolve({
    path: "/robot/log/list",
    query: { id: row.id }
  });
  window.open(route.href, "_blank");
};

// 查询所有机器人状态
const getRobotStatus = () => {
  getAllRobotStatus().then(res => {
    if (res?.status) {
      robotStatus.value = res.data;
    } else {
      message(res.message + "(" + res.data?.message + ")", { type: "error" });
    }
  });
};
getRobotStatus();

// 删除
const handleDelete = (row: RobotDetailModel) => {
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

  Promise.all(selectValues.value.map(v => deleteRobot(v.robot_code))).then(
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
</script>
<template>
  <div>
    <!-- 搜索表单行 -->
    <el-row style="padding-top: 30px">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="code">
            <el-input
              v-model="formInline.robot_code"
              placeholder="请输入robot code"
            />
          </el-form-item>
          <el-form-item label="ip">
            <el-input
              v-model="formInline.robot_ip"
              placeholder="请输入robot ip"
            />
          </el-form-item>
          <el-form-item label="status">
            <el-select
              v-model="formInline.status"
              placeholder="请选择status"
              collapse-tags-tooltip
              style="width: 240px"
            >
              <el-option
                v-for="item in robotStatus"
                :key="item.id"
                :label="item.des"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="taskId">
            <el-input
              v-model="formInline.current_task_id"
              placeholder="请输入任务ID"
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
          <el-table-column
            prop="robot_code"
            label="code"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="robot_ip"
            label="ip"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column prop="status_name" label="status" width="180" />
          <el-table-column prop="port" label="port" width="180" />
          <el-table-column prop="current_task_id" label="taskId" width="180" />
          <el-table-column prop="created_id" label="创建人ID" />
          <el-table-column
            prop="created_time"
            label="创建日期"
            :formatter="dateFormat"
            show-overflow-tooltip
          />
          <el-table-column prop="modify_id" label="修改人ID" />
          <el-table-column
            prop="modify_time"
            label="修改日期"
            show-overflow-tooltip
            :formatter="dateFormat"
          />
          <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="handleOperationClick(scope.row)"
              >
                详情
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
  </div>
</template>
