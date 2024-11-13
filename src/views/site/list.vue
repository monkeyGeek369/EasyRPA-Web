<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import { searchSites, deleteSite } from "@/api/site";
import type { SiteSearchReqModel, SiteDetailModel } from "@/api/site";
import { message } from "@/utils/message";
import { Delete, Edit } from "@element-plus/icons-vue";

defineOptions({
  name: "site_list"
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
  site_name: undefined,
  site_description: undefined,
  is_active: undefined
});
const selectValues = ref<SiteDetailModel[]>([]);
const deleteVisible = ref(false);

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: SiteSearchReqModel = {
    id: formInline.id,
    site_name: formInline.site_name,
    site_description: formInline.site_description,
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

  searchSites(datatest).then(res => {
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

// 搜索
const onSubmit = () => {
  getData(currentPage.value, pageSize.value, sortProp.value, sortOrder.value);
};

// 重置
const cleanForm = () => {
  formInline.id = undefined;
  formInline.site_name = undefined;
  formInline.site_description = undefined;
  formInline.is_active = undefined;
};

// 选择行
const handleSelectionChange = (val: SiteDetailModel[]) => {
  selectValues.value = val;
};

// 删除
const handleDelete = () => {
  if (selectValues.value.length === 0) {
    message("未选择数据", { type: "error" });
    return;
  }
  deleteVisible.value = true;
};
const handleDeleteConfirm = () => {
  Promise.all(selectValues.value.map(v => deleteSite(v.id))).then(responses => {
    responses.forEach(res => {
      if (res?.status) {
        message(res.message, { type: "success" });
      } else {
        message(res.message + "(" + res.data?.message + ")", { type: "error" });
      }
    });
    onSubmit();
  });
  deleteVisible.value = false;
};

const router = useRouter();
</script>

<template>
  <!-- 搜索表单行 -->
  <el-row style="padding-top: 30px">
    <el-col :span="24">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="ID">
          <el-input v-model="formInline.id" placeholder="请输入站点ID" />
        </el-form-item>
        <el-form-item label="站点名称">
          <el-input
            v-model="formInline.site_name"
            placeholder="请输入站点名称"
          />
        </el-form-item>
        <el-form-item label="站点描述">
          <el-input
            v-model="formInline.site_description"
            placeholder="请输入站点描述"
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
      <el-button type="primary" round>新增</el-button>
      <el-button type="primary" :icon="Edit" circle />
      <el-button type="danger" :icon="Delete" circle @click="handleDelete" />
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
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" sortable="custom" />
        <el-table-column prop="site_name" label="站点名称" width="180" />
        <el-table-column prop="site_description" label="站点描述" width="180" />
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
</template>
