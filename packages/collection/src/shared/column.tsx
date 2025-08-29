import { ColumnTypeEnum } from '@collection/interface';

export const getColumnTypeText = (type: ColumnTypeEnum) => {
    const map = {
        [ColumnTypeEnum.TEXT]: '文本',
        [ColumnTypeEnum.NUMBER]: '数字',
        [ColumnTypeEnum.DATE]: '日期',
        [ColumnTypeEnum.SELECT]: '选项',
        [ColumnTypeEnum.CURRENCY]: '金额',
        [ColumnTypeEnum.IMAGE]: '图片',
    };

    return map[type];
}