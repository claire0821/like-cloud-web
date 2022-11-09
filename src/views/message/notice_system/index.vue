<template>
  <div class="index-lists">
    <el-card class="!border-none" shadow="never">
      <el-form
        ref="formRef"
        class="mb-[-16px]"
        :model="queryParams"
        :inline="true"
      >
        <el-form-item label="读取状态 1-已读 0-未读" prop="readState">
          <el-select
            v-model="queryParams.readState"
            class="w-[280px]"
            clearable
          >
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="推送状态1-已推送 0-未推送" prop="pushState">
          <el-select
            v-model="queryParams.pushState"
            class="w-[280px]"
            clearable
          >
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="系统通知ID" prop="systemNoticeId">
          <el-input class="w-[280px]" v-model="queryParams.systemNoticeId" />
        </el-form-item>
        <el-form-item label="读取时间" prop="readTime">
          <el-input class="w-[280px]" v-model="queryParams.readTime" />
        </el-form-item>
        <el-form-item label="拉取通知时间" prop="pullTime">
          <el-input class="w-[280px]" v-model="queryParams.pullTime" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPage">查询</el-button>
          <el-button @click="resetParams">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="!border-none mt-4" shadow="never">
      <div>
        <el-button
          v-perms="['notice_system:add']"
          type="primary"
          @click="handleAdd()"
        >
          <template #icon>
            <icon name="el-icon-Plus" />
          </template>
          新增
        </el-button>
      </div>
      <el-table
        class="mt-4"
        size="large"
        v-loading="pager.loading"
        :data="pager.lists"
      >
        <el-table-column
          label="读取状态 1-已读 0-未读"
          prop="readState"
          min-width="100"
        />
        <el-table-column
          label="推送状态1-已推送 0-未推送"
          prop="pushState"
          min-width="100"
        />
        <el-table-column
          label="系统通知ID"
          prop="systemNoticeId"
          min-width="100"
        />
        <el-table-column label="读取时间" prop="readTime" min-width="100" />
        <el-table-column label="拉取通知时间" prop="pullTime" min-width="100" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              v-perms="['notice_system:edit']"
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-perms="['notice_system:del']"
              type="danger"
              link
              @click="handleDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-4">
        <pagination v-model="pager" @change="getLists" />
      </div>
    </el-card>
    <edit-popup
      v-if="showEdit"
      ref="editRef"
      @success="getLists"
      @close="showEdit = false"
    />
  </div>
</template>
<script lang="ts" setup name="notice_system">
import { notice_systemDelete, notice_systemLists } from "@/api/notice_system";
import { usePaging } from "@/hooks/usePaging";
import feedback from "@/utils/feedback";
import EditPopup from "./edit.vue";
const editRef = shallowRef<InstanceType<typeof EditPopup>>();
const showEdit = ref(false);
const queryParams = reactive({
  readState: "",
  pushState: "",
  systemNoticeId: "",
  readTime: "",
  pullTime: "",
});

const { pager, getLists, resetPage, resetParams } = usePaging({
  fetchFun: notice_systemLists,
  params: queryParams,
});

const handleAdd = async () => {
  showEdit.value = true;
  await nextTick();
  editRef.value?.open("add");
};

const handleEdit = async (data: any) => {
  showEdit.value = true;
  await nextTick();
  editRef.value?.open("edit");
  editRef.value?.getDetail(data);
};

const handleDelete = async (id: number) => {
  await feedback.confirm("确定要删除？");
  await notice_systemDelete({ id });
  feedback.msgSuccess("删除成功");
  getLists();
};

getLists();
</script>
