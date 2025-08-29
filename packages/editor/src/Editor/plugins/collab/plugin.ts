import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror';

import { getSharedDoc, getProvider } from './core';

import { getUndoManager } from './history';

// 创建协同编辑插件，需要传入 fileId
export const createCollabPlugin = (fileId: string, isLocalMode: boolean) => {
  const sharedDoc = getSharedDoc(fileId);
  const provider = getProvider(fileId);
  
  // 创建基础的同步插件，但不立即连接
  const syncPlugin = ySyncPlugin(sharedDoc);
  
  // 创建光标插件（需要延迟初始化）
  const cursorPlugin = yCursorPlugin(provider.awareness, {});

  const base = [
    syncPlugin,
    cursorPlugin,
  ];

  // 本地模式， 加yUndoPlugin会导致无法undo
  if (!isLocalMode) {
    const undoPlugin = yUndoPlugin({
      undoManager: getUndoManager(fileId),
    });

    base.push(undoPlugin);
  }
  

  return base;
};