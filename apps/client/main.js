const { app, BrowserWindow, screen, Menu, ipcMain } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const { registerService } = require('./services/index');

app.setName('Lumi');

let splashWindow = null;
let mainWindow = null;

const createSplashWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const splashWidth = 340;
  const splashHeight = 400;

  splashWindow = new BrowserWindow({
    width: splashWidth,
    height: splashHeight,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    x: Math.floor((width - splashWidth) / 2),
    y: Math.floor((height - splashHeight) / 2),
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  splashWindow.setResizable(false);
}

const createWindow = () => {
  // 获取主屏幕的尺寸
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    // mac下需要隐藏， windows不能隐藏
    ...(process.platform === 'darwin' ? { titleBarStyle: 'hidden' } : {}),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // 开发环境可以禁用，生产环境应启用
    },
    icon: path.join(__dirname, 'public/icon.png'),
    show: false, // 初始时不显示窗口
  })

  // 当窗口准备好时显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (splashWindow) {
      splashWindow.destroy();
      splashWindow = null;
    }
  })

  if (process.platform === 'darwin') {
     app.dock.setIcon(path.join(__dirname, 'public/icon.png'));
  }

  // 隐藏 Windows 下的菜单栏
  if (process.platform !== 'darwin') {
    mainWindow.setMenuBarVisibility(false);
  }

  // 根据环境加载不同的资源
  if (isDev) {
    // 开发环境：加载开发服务器地址
    mainWindow.loadURL('http://localhost:5173');

    // 自动打开开发者工具
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境：加载预渲染的HTML文件
    mainWindow.loadFile(path.join(__dirname, 'web', 'index.html'));
    // mainWindow.webContents.openDevTools()
  }
}

const createMenu = () => {
  const template = [
    {
      label: app.name,
      submenu: [
        {
          label: '设置',
          accelerator: 'Cmd+,',
          click: () => {
            const win = BrowserWindow.getFocusedWindow();
            if (win) {
              win.webContents.send('open-setting');
            }
          }
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        // { role: 'resetZoom' },
        // { role: 'zoomIn' },
        // { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.whenReady().then(() => {
  createSplashWindow();
  createWindow();

  // mac显示菜单， windoow不要
  if (process.platform === 'darwin') {
    createMenu();
  }

  registerService();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplashWindow();
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

 // 添加 IPC 处理程序
 ipcMain.on('reload-window', () => {
  if (mainWindow) {
    mainWindow.reload();
  }
});