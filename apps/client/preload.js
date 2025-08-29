// 预加载脚本
const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('clientAPI', {
  send: (channel, ...args) => {
    ipcRenderer.send(channel, ...args);
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  once: (channel, func) => {
    ipcRenderer.once(channel, (event, ...args) => func(...args));
  },

  // 选择目录
  selectDirectory: () => ipcRenderer.invoke('selectDirectory'),
  
  // 保存设置
  saveSetting: (data) => {
    ipcRenderer.invoke('saveSetting', data);
  },
  // 获取设置
  getSetting: (key) =>  {
    return ipcRenderer.invoke('getSetting', key);
  },

  upload: (params) => {
    return ipcRenderer.invoke('upload', params);
  },

  getMachineId: () => {
    return ipcRenderer.invoke('getMachineId');
  }
});