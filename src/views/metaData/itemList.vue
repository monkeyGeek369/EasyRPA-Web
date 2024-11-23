<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, reactive } from "vue";
import type { ComponentSize } from "element-plus";
import { message } from "@/utils/message";
import { Delete, Edit } from "@element-plus/icons-vue";
import { is } from "@pureadmin/utils";
import {
  searchMetaDataItems,
  addMetaDataItem,
  deleteMetaDataItem,
  updateMetaDataItem
} from "@/api/metaData";
import { number } from "vue-types";
import type {
  MetaDataItemDetailModel,
  MetaDataItemAddReqModel,
  MetaDataItemUpdateReqModel
} from "@/api/metaData";

// 参数设置
const route = useRoute();
const metaDataId = route.query.id;

// 响应式参数
const tableData = ref([]);
const selectValues = ref<MetaDataItemDetailModel[]>([]);
const addFormInline = reactive<MetaDataItemAddReqModel>({
  meta_id: undefined,
  business_code: undefined,
  name_en: undefined,
  name_cn: undefined
});
const addVisible = ref(false);
const deleteVisible = ref(false);
const updateFormInline = reactive({
  id: undefined,
  meta_id: undefined,
  business_code: undefined,
  name_en: undefined,
  name_cn: undefined,
  is_active: undefined
});
const updateVisible = ref(false);

defineOptions({
  name: "metaDataItemList"
});

// 分页数据获取
const getData = () => {
  if (metaDataId == undefined) {
    message("未传递元数据id，请联系管理员！", { type: "error" });
    return;
  }

  const metaDataIdNumber = Number(metaDataId);

  searchMetaDataItems(metaDataIdNumber).then(res => {
    if (res?.status) {
      tableData.value = res.data.data;
    } else {
      message(res.message + "(" + res.data?.message + ")", { type: "error" });
    }
  });
};

// 初始化
getData();

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

// 新增
const addDialog = () => {
  if (addFormInline.business_code === undefined) {
    message("请输入业务code", { type: "error" });
    return;
  }
  if (addFormInline.name_en === undefined) {
    message("请输入英文名称", { type: "error" });
    return;
  }
  if (addFormInline.name_cn === undefined) {
    message("请输入中文名称", { type: "error" });
    return;
  }

  addMetaDataItem(addFormInline).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
      getData();
      // clean
      addFormInline.meta_id = undefined;
      addFormInline.business_code = undefined;
      addFormInline.name_en = undefined;
      addFormInline.name_cn = undefined;
      addVisible.value = false;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};

// 删除
const handleDelete = (row: MetaDataItemDetailModel) => {
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

  deleteMetaDataItem(selectValues.value[0].id).then(res => {
    if (res?.status) {
      message(res.message, { type: "success" });
    } else {
      message(res.message + "(" + res.data?.message + ")", {
        type: "error"
      });
    }
    getData();
  });
  deleteVisible.value = false;
};

// 修改
const showUpdateDialog = (selectRow: MetaDataItemDetailModel) => {
  selectValues.value = [selectRow];

  if (selectValues.value.length === 0) {
    message("未选择数据", { type: "error" });
    return;
  }
  updateVisible.value = true;

  const row = selectValues.value[0];
  updateFormInline.id = row.id;
  updateFormInline.meta_id = row.meta_id;
  updateFormInline.business_code = row.business_code;
  updateFormInline.name_en = row.name_en;
  updateFormInline.name_cn = row.name_cn;
  updateFormInline.is_active = row.is_active ? "1" : "0";
};
const updateDialog = () => {
  if (updateFormInline.id === undefined) {
    message("未选择数据", { type: "error" });
    return;
  }
  if (updateFormInline.meta_id === undefined) {
    message("请输入元数据ID", { type: "error" });
    return;
  }
  if (updateFormInline.business_code === undefined) {
    message("请输入元数据业务code", { type: "error" });
    return;
  }
  if (updateFormInline.name_en === undefined) {
    message("请输入元数据英文名称", { type: "error" });
    return;
  }
  if (updateFormInline.name_cn === undefined) {
    message("请输入元数据中文名称", { type: "error" });
    return;
  }

  const updateData: MetaDataItemUpdateReqModel = {
    id: updateFormInline.id,
    meta_id: updateFormInline.meta_id,
    business_code: updateFormInline.business_code,
    name_en: updateFormInline.name_en,
    name_cn: updateFormInline.name_cn,
    is_active: updateFormInline.is_active == "1" ? true : false
  };

  updateMetaDataItem(updateData).then(res => {
    //console.log(res);
    if (res?.status) {
      message(res.message, { type: "success" });
      getData();
      updateVisible.value = false;
    } else {
      message(res.message + "(" + res.data + ")", { type: "error" });
    }
  });
};
</script>

<template>
  <div>
    <!-- 按钮行 -->
    <el-row>
      <el-col :span="24">
        <el-button
          type="primary"
          round
          @click="
            addVisible = true;
            addFormInline.meta_id = Number(metaDataId);
          "
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
        >
          <el-table-column prop="id" label="ID" width="80" sortable="custom" />
          <el-table-column
            prop="business_code"
            label="元数据对象业务code"
            width="180"
          />
          <el-table-column
            prop="name_en"
            label="元数据对象英文名称"
            width="180"
          />
          <el-table-column
            prop="name_cn"
            label="元数据对象中文名称"
            width="180"
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

    <!-- 新增对话框 -->
    <el-dialog v-model="addVisible" title="新增" width="500">
      <el-form :model="addFormInline">
        <el-form-item label="元数据ID">
          <el-input v-model="addFormInline.meta_id" disabled />
        </el-form-item>
        <el-form-item label="对象业务code">
          <el-input
            v-model="addFormInline.business_code"
            placeholder="请输入对象业务code"
          />
        </el-form-item>
        <el-form-item label="对象英文名称">
          <el-input
            v-model="addFormInline.name_en"
            placeholder="请输入对象英文名称"
          />
        </el-form-item>
        <el-form-item label="对象中文名称">
          <el-input
            v-model="addFormInline.name_cn"
            placeholder="请输入对象中文名称"
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

    <!-- 修改对话框 -->
    <el-dialog v-model="updateVisible" title="编辑" width="500">
      <el-form :model="updateFormInline">
        <el-form-item label="元数据ID">
          <el-input v-model="updateFormInline.id" disabled />
        </el-form-item>
        <el-form-item label="元数据对象ID">
          <el-input v-model="updateFormInline.meta_id" disabled />
        </el-form-item>
        <el-form-item label="元数据业务code">
          <el-input
            v-model="updateFormInline.business_code"
            placeholder="请输入元数据业务code"
          />
        </el-form-item>
        <el-form-item label="元数据英文名称">
          <el-input
            v-model="updateFormInline.name_en"
            placeholder="请输入元数据英文名称"
          />
        </el-form-item>
        <el-form-item label="元数据中文名称">
          <el-input
            v-model="updateFormInline.name_cn"
            placeholder="请输入元数据中文名称"
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
