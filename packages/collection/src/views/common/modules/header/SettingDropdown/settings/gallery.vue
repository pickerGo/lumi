<script lang="tsx">
import { defineComponent, PropType, computed, toRef } from 'vue';
import { Select } from 'ant-design-vue';

import { updateViewCardConfig$ } from '@collection/events';
import { CollectionSchemaType, ColumnTypeEnum } from '@collection/interface';
import { getColumnTypeText } from '@collection/shared/column';

export default defineComponent({
    props: {
        id: String,
        schema: Object as PropType<CollectionSchemaType>,
    },
    setup(props) {
        const schemaRef = toRef(props, 'schema');

        const coverColumnOptions = computed(() => {
            return schemaRef.value?.columns.filter(column => column.type === ColumnTypeEnum.IMAGE).map(column => ({
                label: column.title || getColumnTypeText(column.type),
                value: column.id,
            }));
        });

        const titleColumnOptions = computed(() => {
            return schemaRef.value?.columns.filter(column => column.type === ColumnTypeEnum.TEXT).map(column => ({
                label: column.title,
                value: column.id,
            }));
        });

        const tagColumnOptions = computed(() => {
            return schemaRef.value?.columns.filter(column => column.type === ColumnTypeEnum.SELECT).map(column => ({
                label: column.title,
                value: column.id,
            }));
        });

        const renderCoverConfig = () => {
            
            if (!coverColumnOptions.value?.length) {
                return '';
            }

            const view = schemaRef.value?.views.find(view => view.id === schemaRef.value?.viewId);
            return (
                <div class="flex items-center">
                    <div class="fieldTitle truncate">封面字段</div>
                    <Select
                        class="flex-1"
                        size="small"
                        placeholder="请选择"
                        options={coverColumnOptions.value}
                        value={view?.cardConfig?.coverColumnId}
                        onChange={value => {
                            updateViewCardConfig$.next({
                                id: props.id!,
                                viewId: view?.id!,
                                config: {
                                    coverColumnId: value as string,
                                },
                            })
                        }}
                    />
                </div>
            )
        }

        const renderTitleConfig = () => {
            if (!titleColumnOptions.value?.length) {
                return '';
            }

            const view = schemaRef.value?.views.find(view => view.id === schemaRef.value?.viewId);
            return (
                <div class="flex items-center">
                    <div class="fieldTitle truncate">标题字段</div>
                    <Select
                        class="flex-1"
                        size="small"
                        placeholder="请选择"
                        options={titleColumnOptions.value}
                        value={view?.cardConfig?.titleColumnId}
                        onChange={value => {
                            updateViewCardConfig$.next({
                                id: props.id!,
                                viewId: view?.id!,
                                config: {
                                    titleColumnId: value as string,
                                },
                            })
                        }}
                    />
                </div>
            )
        }

        const renderTagConfig = () => {
            if (!tagColumnOptions.value?.length) {
                return '';
            }

            const view = schemaRef.value?.views.find(view => view.id === schemaRef.value?.viewId);
            return (
                <div class="flex items-center">
                    <div class="fieldTitle truncate">标签字段</div>
                    <Select
                        class="flex-1"
                        size="small"
                        placeholder="请选择"
                        options={tagColumnOptions.value}
                        value={view?.cardConfig?.tagColumnId}
                        onChange={value => {
                            updateViewCardConfig$.next({
                                id: props.id!,
                                viewId: view?.id!,
                                config: {
                                    tagColumnId: value as string,
                                },
                            })
                        }}
                    />
                </div>
            )
        }

        return () => (
            <div class="container py-2 px-3 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                {renderCoverConfig()}
                {renderTitleConfig()}
                {renderTagConfig()}
            </div>
        )
    }
})
</script>

<style scoped>
.fieldTitle {
    width: 60px;
    font-size: 12px;
}

.container {
    padding-bottom: 12px;
    border-bottom: 1px solid var(--default-border-color);
}
</style>