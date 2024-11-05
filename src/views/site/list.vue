<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import type { ComponentSize } from "element-plus";

defineOptions({
  name: "site_list"
});

const tableData = ref([
  {
    id: 1,
    date: "2016-05-02",
    name: "王小虎1",
    address: "上海市普陀区金沙江路 1518 弄"
  },
  {
    id: 2,
    date: "2016-05-04",
    name: "王小虎2",
    address: "上海市普陀区金沙江路 1517 弄"
  },
  {
    id: 3,
    date: "2016-05-01",
    name: "王小虎3",
    address: "上海市普陀区金沙江路 1519 弄"
  },
  {
    id: 4,
    date: "2016-05-03",
    name: "王小虎4",
    address: "上海市普陀区金沙江路 1516 弄"
  },
  {
    id: 5,
    date: "2016-05-02",
    name: "王小虎5",
    address: "上海市普陀区金沙江路 1518 弄"
  },
  {
    id: 6,
    date: "2016-05-04",
    name: "王小虎6",
    address: "上海市普陀区金沙江路 1517 弄"
  },
  {
    id: 7,
    date: "2016-05-01",
    name: "王小虎7",
    address: "上海市普陀区金沙江路 1519 弄"
  },
  {
    id: 8,
    date: "2016-05-03",
    name: "王小虎8",
    address: "上海市普陀区金沙江路 1516 弄"
  },
  {
    id: 9,
    date: "2016-05-02",
    name: "王小虎9",
    address: "上海市普陀区金沙江路 1518 弄"
  },
  {
    id: 10,
    date: "2016-05-04",
    name: "王小虎10",
    address: "上海市普陀区金沙江路 1517 弄"
  },
  {
    id: 11,
    date: "2016-05-01",
    name: "王小虎11",
    address: "上海市普陀区金沙江路 1519 弄"
  },
  {
    id: 12,
    date: "2016-05-03",
    name: "王小虎12",
    address: "上海市普陀区金沙江路 1516 弄"
  },
  {
    id: 13,
    date: "2016-05-02",
    name: "王小虎13",
    address: "上海市普陀区金沙江路 1518 弄"
  },
  {
    id: 14,
    date: "2016-05-04",
    name: "王小虎14",
    address: "上海市普陀区金沙江路 1517 弄"
  },
  {
    id: 15,
    date: "2016-05-01",
    name: "王小虎15",
    address: "上海市普陀区金沙江路 1519 弄"
  },
  {
    id: 16,
    date: "2016-05-03",
    name: "王小虎16",
    address: "上海市普陀区金沙江路 1516 弄"
  }
]);

const total = ref(tableData.value.length);
const pageSize = ref(2);
const currentPage = ref(1);

// 控制组件大小
const size = ref<ComponentSize>("default");
const disabled = ref(false);
const background = ref(false);

const getData = (page, pageSize) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return tableData.value.slice(startIndex, endIndex);
};

const showData = ref([]);
showData.value = getData(currentPage.value, pageSize.value);

const handleCurrentChange = (val: number) => {
  // val 为当前页
  console.log(`${val} handleCurrentChange`);
  currentPage.value = val;
  // 更新 tableData
  showData.value = getData(currentPage.value, pageSize.value);
};
const handleSizeChange = (val: number) => {
  // val 为当前页展示条数
  console.log(`${val} handleSizeChange`);
  pageSize.value = val;
  // 更新 tableData
  showData.value = getData(currentPage.value, pageSize.value);
};

const sortChange = column => {
  // 排序字段"prop": "id", 排序顺序"order": null/"ascending"/"descending"
  console.log(column, "sortChange");
};

const router = useRouter();
</script>

<template>
  <div>
    <el-table
      :data="showData"
      :stripe="true"
      :default-sort="{ prop: 'id', order: 'descending' }"
      :border="true"
      style="width: 100%; height: 100%"
      @sort-change="sortChange"
    >
      <el-table-column prop="id" label="ID" width="80" sortable="custom" />
      <el-table-column prop="date" label="日期" width="180" sortable="custom" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="address" label="地址" />
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 20, 50, 100, 200]"
      :size="size"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
