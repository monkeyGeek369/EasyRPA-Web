<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import { searchSites } from "@/api/site";
import type { SiteSearchReqModel } from "@/api/site";
import { message } from "@/utils/message";

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

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: SiteSearchReqModel = {
    //is_active: true,
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

const formInline = reactive({
  id: undefined,
  site_name: undefined,
  site_description: undefined,
  is_active: undefined
});

const onSubmit = () => {
  console.log(formInline);
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
          <el-button type="default" @click="onSubmit">重置</el-button>
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
</template>
