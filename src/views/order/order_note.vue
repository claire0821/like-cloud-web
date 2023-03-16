<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="500px"
            :clickModalClose="true"
            @confirm="handleUpdateNote"
            @close="handleClose"
            confirm-button-text="保存"
        >
            <el-input
                v-model="note"
                maxlength="500"
                placeholder="备注信息"
                show-word-limit
                type="textarea"
            />
        </popup>
    </div>
</template>
<script lang="ts" setup>
import { updateNote } from '@/api/order/order'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
import type { PropType } from 'vue'
defineProps({
    dictData: {
        type: Object as PropType<Record<string, any[]>>,
        default: () => ({})
    }
})
const note = ref<string>('')
let orderSn: string

const emit = defineEmits(['close'])
const popupRef = shallowRef<InstanceType<typeof Popup>>()

const popupTitle = computed(() => {
    return '备注信息'
})

const open = (str1: string, str2: string) => {
    popupRef.value?.open()
    orderSn = str1
    note.value = str2
}

const handleClose = () => {
    emit('close')
}

//更改备注
const handleUpdateNote = async () => {
    updateNote({
        orderSn: orderSn,
        note: note.value
    })
    handleClose()
}
defineExpose({
    open
})
</script>
