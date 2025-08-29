<script lang="tsx">
import { defineComponent, inject } from 'vue';
import type { Ref } from 'vue';
import { set } from 'lodash-es';
import { Form, Select, InputNumber } from 'ant-design-vue';

import { CurrencyColumnType, CurrencyEnum } from '@collection/interface';

import { currencyList, getCurrencySign } from '@collection/shared/currency';

const FormItem = Form.Item;

export default defineComponent({
    setup() {
        const formModel = inject<Ref<CurrencyColumnType>>('formModel')!;

        return () => (
            <div>
                 <div class="mt-3">
                    <div class="mb-1">币种</div>
                    <FormItem label="币种" name="currency" noStyle  autoLink={false}>
                        <Select 
                            placeholder="请选择币种"
                            value={formModel.value?.config?.currency} 
                            onSelect={(val: string) => set(formModel.value, 'config.currency', val as CurrencyEnum)}
                        >
                            {
                                currencyList.map(item => (
                                    <Select.Option value={item}>
                                        <div class="flex items-center justify-between">
                                            <div>{item}</div>

                                            <div class="lightText">
                                                {getCurrencySign(item)}
                                            </div>
                                        </div>
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </FormItem>
                 </div>
            </div>
        );
    }
});
</script>