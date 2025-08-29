<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { Dropdown, Menu, InputNumber } from 'ant-design-vue';
import { ArrowUp, ArrowDown, ScrollText, Trash2 } from 'lucide-vue-next';

import { useContextStore } from '@collection/store/index';
import { addRow$, deleteRow$ } from '@collection/events';

const MenuItem = Menu.Item;

export default defineComponent({
    props: {
        id: {
            type: String,
            default: '',
        },
        row: {
            type: Object,
            default: () => ({}),
        }
    },
    setup(props, { slots }) {
        const { contextStore } = useContextStore();

        const insertUpLines = ref(1);
        const insertDownLines = ref(1);

        const handleInsertUp = () => {
            addRow$.next({
                id: props.id,
                direction: 'above',
                rowId: props.row?.id, 
                count: insertUpLines.value ?? 1,
            });
        }

        const handleInsertDown = () => {
            addRow$.next({
                id: props.id,
                direction: 'below',
                rowId: props.row?.id, 
                count: insertDownLines.value ?? 1,
            });
        }

        const handleViewDetail = () => {
            contextStore.getState().setActiveRow(props.row);
        }

        const handleDeleteRow = () => {
            contextStore.getState().setActiveRow(null);

            deleteRow$.next({
                id: props.id,
                rowId: props.row?.id,
            });
        }

        const renderOverlay = () => {
            return (
                <div class="dropdownContainer w-[180px]">
                    <Menu selectedKeys={[]}>
                        <MenuItem key="1" onClick={handleInsertUp}>
                            <div class="flex items-center">
                                <ArrowUp class="mr-2" width={16} height={16} />
                                向前插入
                                <div onClick={e => e.stopPropagation()}>
                                    <InputNumber 
                                        controls={false} 
                                        style="width: 40px;" 
                                        class="mx-1" 
                                        size="small"
                                        min={1}
                                        max={100}
                                        value={insertUpLines.value}
                                        onChange={(val) => insertUpLines.value = val as number}
                                    />
                                </div>
                                条
                            </div>
                        </MenuItem>
                        
                        <MenuItem key="2" onClick={handleInsertDown}>
                            <div class="flex items-center">
                                <ArrowDown class="mr-2" width={16} height={16} />
                                向后插入
                                <div onClick={e => e.stopPropagation()}>
                                    <InputNumber 
                                        controls={false} 
                                        style="width: 40px;" 
                                        class="mx-1" 
                                        size="small"
                                        min={1}
                                        max={100}
                                        value={insertDownLines.value}
                                        onChange={(val) => insertDownLines.value = val as number}
                                    />
                                </div>
                                条
                            </div>
                        </MenuItem>
                        
                        <div class="divider"></div>

                        <MenuItem key="3" onClick={handleViewDetail}>
                            <div class="flex items-center">
                                <ScrollText class="mr-2" width={16} height={16} />
                                查看详情
                            </div>
                        </MenuItem>
                        <MenuItem key="4" onClick={handleDeleteRow}>
                            <div class="flex items-center">
                                <Trash2 class="mr-2" width={16} height={16} />
                                删除记录
                            </div>
                        </MenuItem>
                    </Menu>
                </div>
            )
        }

        return () => (
            <Dropdown trigger="contextmenu" placement='bottomRight' destroyPopupOnHide>
                {{
                    default: slots.default,
                    overlay: renderOverlay,
                }}
            </Dropdown>
        )
    }
});
</script>

<style scoped>
.divider {
    height: 1px;
    background: var(--default-border-color);
    margin: 4px 0;
}
</style>