<script lang="tsx">
import { defineComponent, inject } from 'vue';
import type { Ref } from 'vue';
import { set } from 'lodash-es';
import { Form, Checkbox } from 'ant-design-vue';

import { SelectColumnType, SelectOptionType } from '@collection/interface';
import Options from './Options.vue';

const FormItem = Form.Item;

export default defineComponent({
    setup() {
        const formModel = inject<Ref<SelectColumnType>>('formModel')!;

        return () => (
            <div>
                 <div class="mt-3">
                    <div class="mb-1">选项</div>
                    <FormItem label="选项" noStyle autoLink={false}>
                        <Options
                            value={formModel.value?.config?.options} 
                            onChange={(val: SelectOptionType[]) => set(formModel.value, 'config.options', val)}
                        ></Options>
                    </FormItem>

                    <div class="inline-flex items-center mt-2 select-none cursor-pointer text-xs" onClick={() => set(formModel.value, 'config.multiple', !formModel.value?.config?.multiple)}>
                        <Checkbox
                            class="mr-1"
                            checked={formModel.value?.config?.multiple}
                        />
                        多选
                    </div>
                 </div>
            </div>
        );
    }
});
</script>

<style scoped>

</style>