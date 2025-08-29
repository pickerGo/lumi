import { ViewEnum } from '@collection/interface';

export const getViewTypeText = (type: ViewEnum) => {
    const map = {
        [ViewEnum.GRID]: '表格',
        [ViewEnum.BOARD]: '看板',
        [ViewEnum.GALLERY]: '画廊',
    };

    return map[type];
}