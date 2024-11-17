<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import { message } from "@/utils/message";
import { Delete, Edit } from "@element-plus/icons-vue";
import { is } from "@pureadmin/utils";
import type {
  MetaDataSearchReqModel,
  MetaDataDetailModel,
  MetaDataAddReqModel,
  MetaDataUpdateReqModel
} from "@/api/metaData";
import {
  searchMetaData,
  deleteMetaData,
  addMetaData,
  updateMetaData
} from "@/api/metaData";

defineOptions({
  name: "metaDataList"
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
  name: undefined,
  code: undefined,
  description: undefined,
  is_active: undefined
});
const selectValues = ref<MetaDataDetailModel[]>([]);
const deleteVisible = ref(false);
const addFormInline = reactive<MetaDataAddReqModel>({
  name: undefined,
  code: undefined,
  description: undefined
});
const addVisible = ref(false);
const updateFormInline = reactive({
  id: undefined,
  name: undefined,
  code: undefined,
  description: undefined,
  is_active: undefined
});
const updateVisible = ref(false);
const router = useRouter();

// 分页数据获取
const getData = (page, pageSize, prop, order) => {
  // search sites
  const datatest: MetaDataSearchReqModel = {
    id: formInline.id,
    name: formInline.name,
    code: formInline.code,
    description: formInline.description,
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

  searchMetaData(datatest).then(res => {
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
  formInline.name = undefined;
  formInline.code = undefined;
  formInline.description = undefined;
  formInline.is_active = undefined;
};

// 删除
const handleDelete = (row: MetaDataDetailModel) => {
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

  Promise.all(selectValues.value.map(v => deleteMetaData(v.id))).then(
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
  if (addFormInline.name === undefined) {
    message("请输入元数据名称", { type: "error" });
    return;
  }
  if (addFormInline.code === undefined) {
    message("请输入元数据code", { type: "error" });
    return;
  }
  if (addFormInline.description === undefined) {
    message("请输入元数据描述", { type: "error" });
    return;
  }

  addMetaData(addFormInline).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
      onSubmit();
      // clean
      addFormInline.name = undefined;
      addFormInline.code = undefined;
      addFormInline.description = undefined;
      addVisible.value = false;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};

// 修改
const showUpdateDialog = (showRow: MetaDataDetailModel) => {
  if (showRow == undefined) {
    message("未选择数据", { type: "error" });
    return;
  }

  selectValues.value = [showRow];

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
  updateFormInline.name = row.name;
  updateFormInline.code = row.code;
  updateFormInline.description = row.description;
  updateFormInline.is_active = row.is_active ? "1" : "0";
  updateFormInline.id = row.id;
};
const updateDialog = () => {
  if (updateFormInline.id === undefined) {
    message("未选择数据", { type: "error" });
    return;
  }
  if (updateFormInline.name === undefined) {
    message("请输入元数据名称", { type: "error" });
    return;
  }
  if (updateFormInline.code === undefined) {
    message("请输入元数据code", { type: "error" });
    return;
  }
  if (updateFormInline.description === undefined) {
    message("请输入元数据描述", { type: "error" });
    return;
  }

  const updateData: MetaDataUpdateReqModel = {
    id: updateFormInline.id,
    name: updateFormInline.name,
    code: updateFormInline.code,
    description: updateFormInline.description,
    is_active: updateFormInline.is_active == "1" ? true : false
  };

  updateMetaData(updateData).then(res => {
    //console.log(res);
    if (res?.status) {
      message(res.message, { type: "success" });
      onSubmit();
      updateVisible.value = false;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};

// 元数据项配置
const handleOperationClick = (row: MetaDataDetailModel) => {
  //console.log(row);
  const route = router.resolve({
    path: "/metaData/item/list",
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
            <el-input v-model="formInline.id" placeholder="请输入元数据ID" />
          </el-form-item>
          <el-form-item label="元数据名称">
            <el-input
              v-model="formInline.name"
              placeholder="请输入元数据名称"
            />
          </el-form-item>
          <el-form-item label="元数据code">
            <el-input
              v-model="formInline.code"
              placeholder="请输入元数据code"
            />
          </el-form-item>
          <el-form-item label="元数据描述">
            <el-input
              v-model="formInline.description"
              placeholder="请输入元数据描述"
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
          <el-table-column prop="name" label="元数据名称" width="180" />
          <el-table-column prop="code" label="元数据code" width="180" />
          <el-table-column prop="description" label="元数据描述" width="180" />
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
                @click="handleOperationClick(scope.row)"
              >
                配置
              </el-button>
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
        <el-form-item label="元数据名称">
          <el-input
            v-model="addFormInline.name"
            placeholder="请输入元数据名称"
          />
        </el-form-item>
        <el-form-item label="元数据code">
          <el-input
            v-model="addFormInline.code"
            placeholder="请输入元数据code"
          />
        </el-form-item>
        <el-form-item label="元数据描述">
          <el-input
            v-model="addFormInline.description"
            placeholder="请输入元数据描述"
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
        <el-form-item label="元数据ID">
          <el-input v-model="updateFormInline.id" disabled />
        </el-form-item>
        <el-form-item label="元数据名称">
          <el-input
            v-model="updateFormInline.name"
            placeholder="请输入元数据名称"
          />
        </el-form-item>
        <el-form-item label="元数据code">
          <el-input
            v-model="updateFormInline.code"
            placeholder="请输入元数据code"
          />
        </el-form-item>
        <el-form-item label="元数据描述">
          <el-input
            v-model="updateFormInline.description"
            placeholder="请输入元数据描述"
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
