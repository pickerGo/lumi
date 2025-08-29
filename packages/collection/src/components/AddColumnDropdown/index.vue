<script lang="tsx">
import { defineComponent, ref, provide, PropType, watch } from 'vue';
import { Dropdown, Form, Input, Menu, Space, Button } from 'ant-design-vue';
import { ChevronRight } from 'lucide-vue-next';
import { nanoid } from 'nanoid';
import { useSubscription } from '@vueuse/rxjs';
import { tap } from 'rxjs/operators';

import { themeTokens } from '@collection/shared/theme';

import ColumnIcon from '../ColumnIcon.vue';

import { getColumnTypeText } from '@collection/shared/column';

import { ColumnTypeEnum, ColumnType, ColumnTypeValue } from '@collection/interface';

import CurrencyFields from './Currency.vue';
import NumberFields from './Number.vue';
import DateFields from './Date.vue';
import SelectFields from './Select/index.vue';

import { hideDropdown$ } from '@collection/events';

const FormItem = Form.Item;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

export default defineComponent({
    props: {
        column: Object as PropType<ColumnType>,
        values: Object as PropType<Record<string, any>>,
    },
    emits: ['confirm'],
    setup(props, { slots, emit }) {
        const visibleRef = ref(false);

        useSubscription(
            hideDropdown$.pipe(
                tap(() => {
                    visibleRef.value = false;
                })
            ).subscribe()
        )

        const getDefaultFormModel = () => {
            if (props.column) {
                return {
                    ...props.column,
                    config: {
                        ...(props.column.config || {}),
                    },
                } as ColumnType;
            }

            return {
                id: nanoid(8),
                title: '',
                width: 180,
                type: ColumnTypeEnum.TEXT,
                config: {},
            } as ColumnType;
        }

        const formModel = ref<ColumnType>(getDefaultFormModel());

        watch(visibleRef, (visible) => {
            if (visible && !props.column) {
                formModel.value.id = nanoid(8);
            }
        });

        const containerRef = ref();

        provide('formModel', formModel);

        const handleStopPropagation = (e) => e.stopPropagation();

        const handleShowDropdown = () => {
            hideDropdown$.next();

            visibleRef.value = true;
        }

        // 切换type， 清空config
        const handleSelectType = (type: ColumnTypeEnum) => {
            formModel.value.config = {};

            formModel.value.type = type;
        }

        const handleCancel = () => {
            formModel.value.title = '';
            formModel.value.type = ColumnTypeEnum.TEXT;
            formModel.value.config = {};

            // 隐藏dropdown
            visibleRef.value = false;

        };

        const handleConfirm = () => {
            emit('confirm', {
                ...formModel.value
            });

            handleCancel();
        };

        const renderOverlay = () => {
            return (
                <div class="dropdownContainer w-[280px]" ref={containerRef} onMousedown={handleStopPropagation}>
                    <Form layout='vertical' model={formModel.value}>
                        <div class="mx-3 mt-1">
                            <div class="mb-1">字段</div>
                            <div class="fieldControl">
                                <FormItem label="字段名" name="title" class="mb-3" noStyle>
                                    <Input 
                                        placeholder="请输入字段名" 
                                        autofocus
                                        value={formModel.value?.title} 
                                        onChange={(e) => formModel.value.title = e.target.value || ''}
                                    />
                                </FormItem>

                                <Menu class="fieldTypeMenu">
                                    <SubMenu>
                                        {{
                                            title: () => (
                                                <div class="fieldTypeField px-3 flex items-center justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <ColumnIcon type={formModel.value.type} />
                                                        {getColumnTypeText(formModel.value.type)}
                                                    </div>
                                                    <div>
                                                        <ChevronRight width="16px" height="16px" color={themeTokens.lightTextColor()} />
                                                    </div>
                                                </div>
                                            ),
                                            default: () => (
                                                <div class="fieldTypeMenuContainer">
                                                    <MenuItem key={ColumnTypeEnum.TEXT} onClick={() => handleSelectType(ColumnTypeEnum.TEXT)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.TEXT} />
                                                            文本
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem key={ColumnTypeEnum.NUMBER} onClick={() => handleSelectType(ColumnTypeEnum.NUMBER)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.NUMBER} />
                                                            数字
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem key={ColumnTypeEnum.CURRENCY} onClick={() => handleSelectType(ColumnTypeEnum.CURRENCY)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.CURRENCY} />
                                                            金额
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem key={ColumnTypeEnum.DATE} onClick={() => handleSelectType(ColumnTypeEnum.DATE)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.DATE} />
                                                            日期    
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem key={ColumnTypeEnum.SELECT} onClick={() => handleSelectType(ColumnTypeEnum.SELECT)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.SELECT} />
                                                            选项
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem key={ColumnTypeEnum.IMAGE} onClick={() => handleSelectType(ColumnTypeEnum.IMAGE)}>
                                                        <div class="flex items-center gap-2">
                                                            <ColumnIcon type={ColumnTypeEnum.IMAGE} />
                                                            图片
                                                        </div>
                                                    </MenuItem>
                                                </div>
                                            )
                                        }}
                                    </SubMenu>
                                </Menu>                                
                            </div>
                        </div>

                        <div class="mx-3">
                            {
                                formModel.value?.type === ColumnTypeEnum.CURRENCY ? (
                                    <CurrencyFields />
                                ) : ''
                            }

                            {
                                [ColumnTypeEnum.NUMBER, ColumnTypeEnum.CURRENCY].includes(formModel.value?.type) ? (
                                    <NumberFields />
                                ) : ''
                            }

                            {
                                formModel.value?.type === ColumnTypeEnum.DATE ? (
                                    <DateFields />
                                ) : ''
                            }

                            {
                                formModel.value?.type === ColumnTypeEnum.SELECT ? (
                                    <SelectFields />
                                ) : ''
                            }
                        </div>
                    </Form>

                    <div class="flex items-center justify-end pr-3 pb-4 mt-4">
                        <Space>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type="primary" onClick={handleConfirm}>Confirm</Button>
                        </Space>
                    </div>
                </div>
            );
        }

        return () => (
            <Dropdown open={visibleRef.value} placement='bottomRight' destroyPopupOnHide>
                {{
                    default: () => (
                        <div onClick={handleShowDropdown}>
                            {slots.default?.()}
                        </div>
                    ),
                    overlay: renderOverlay,
                }}
            </Dropdown>
        );
    }
})
</script>

<style scoped>

.fieldTypeMenuContainer {
    width: 280px;
    padding: 4px;
    background: #fff;
    color: rgb(100, 106, 115);

    border: 1px solid #dee0e3;
    border-radius: 6px;
    box-shadow: rgba(31, 35, 41, 0.1) 0px 4px 8px 0px;
}

.divider {
    height: 1px;
    background: rgba(31, 35, 41, 0.15);
}

.fieldControl {
    border: 1px solid #dee0e3;
    border-radius: 6px;
    overflow: hidden;
}

.fieldControl :deep(.ant-input) {
    border: none!important;
    box-shadow: none!important;
    outline: none!important;
}

.fieldTypeField {
    height: 32px;
    background: rgb(245, 246, 247);
}

.fieldTypeMenu {
    padding: 0;
}

.fieldTypeMenu :deep(.ant-dropdown-menu-submenu-title) {
    padding: 0;
}
</style>