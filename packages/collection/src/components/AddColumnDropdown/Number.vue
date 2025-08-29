<script lang="tsx">
import { defineComponent, inject } from 'vue';
import type { Ref } from 'vue';
import { Form, Select, InputNumber, Checkbox } from 'ant-design-vue';
import { set } from 'lodash-es';

import { NumberColumnType, NumberFormatEnum } from '@collection/interface';

const FormItem = Form.Item;

export default defineComponent({
    setup() {
        const formModel = inject<Ref<NumberColumnType>>('formModel')!;

        return () => (
            <div>
                 <div class="mt-3 mb-3">
                    <div class="mb-1">格式</div>
                    <FormItem label="格式" name="title" noStyle autoLink={false}>
                        <Select 
                            placeholder="请选择格式"
                            value={formModel.value?.config?.format} 
                            onSelect={(val: string) => set(formModel.value, 'config.format', val as NumberFormatEnum)}
                        >
                            <Select.Option value={NumberFormatEnum.INT}>整数</Select.Option>
                            <Select.Option value={NumberFormatEnum.FLOAT}>小数</Select.Option>
                            <Select.Option value={NumberFormatEnum.PERCENT}>百分数</Select.Option>
                        </Select>
                    </FormItem>
                 </div>

                <div class="mb-1">精度</div>
                <FormItem label="精度" name="title" class="mb-3" noStyle autoLink={false}>
                    <InputNumber 
                        style="width: 100%;"
                        placeholder="请输入精度"
                        max={4}
                        min={0}
                        step={1}
                        value={formModel.value?.config?.precision} 
                        onChange={val => set(formModel.value, 'config.precision', val as number)}
                    ></InputNumber>
                </FormItem>

                <div class="inline-flex items-center mt-2 select-none cursor-pointer text-xs" onClick={() => set(formModel.value, 'config.digitGroup', !formModel.value?.config.digitGroup)}>
                    <Checkbox 
                        class="mr-1"
                        checked={formModel.value?.config.digitGroup}
                    /> 千分位格式
                </div>
            </div>
        );
    }
});
</script>