const electron = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

function createWindow() {
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      // eslint-disable-next-line no-console
      .then((name) => console.log(`Added Extension:  ${name}`))
      // eslint-disable-next-line no-console
      .catch((err) => console.log('An error occurred: ', err));
  }

  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
    },
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();
    if (isDev) {
      // Open the DevTools.
      mainWindow.webContents.openDevTools();
      // add inspect element on right click menu
      mainWindow.webContents.on('context-menu', (e, props) => {
        Menu.buildFromTemplate([
          {
            label: 'Inspect element',
            click() {
              mainWindow.inspectElement(props.x, props.y);
            },
          },
        ]).popup(mainWindow);
      });
    }
  });

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
