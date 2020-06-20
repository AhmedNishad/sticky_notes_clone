// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog} = require('electron')
const path = require('path')
const url = require('url');
const { ipcMain } = require('electron')

const {
  IPCActions
} = require("./src/utils/constants");

let main_Window; 
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    x: 50,
    y: 50,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    autoHideMenuBar: true,
  })

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `./dist/app/index.html`),
      protocol: 'file:',
      slashes: true,
    })
  ) 
    main_Window = mainWindow;
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let openNotes = []

let windowCount = 0;

const addNoteWindow = (event, args)=>{

  if(openNotes.length == 5){
    dialog.showErrorBox("Cannot Open!", "Maximum notes you can open is 5")
    return
  }
  
  if(openNotes.map(n=> n.id).includes(args.id))
    return

  let x = 220, y= 220;
  if(BrowserWindow.getFocusedWindow()){
    let win = BrowserWindow.getFocusedWindow().getPosition();
    x = win[0] + 300;
    y = win[1];
  }

  const noteWindow = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      nodeIntegration: true
    },
    x,
    y,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hiddenInset'
  })
  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  let urlToMoveTo = url.format({
    pathname: path.join(__dirname, `./dist/app/index.html`),
    protocol: 'file:',
    slashes: true,
  }) + '#/edit/' + args.id;
  console.log(urlToMoveTo)
  noteWindow.loadURL(
    urlToMoveTo
  ).then(()=>{
    noteWindow.webContents.send(IPCActions.SEND_NOTE_FROM_LIST, args)  
    noteWindow.focus();
    //console.log(args);
  })

  openNotes.push({id:args.id, window: noteWindow});  
  console.log("Open notes : " + openNotes.length)

  ipcMain.on(IPCActions.SEND_NOTE_TO_LIST, (e,d)=>{
    //console.log(d);
    main_Window.webContents.send(IPCActions.UPDATE_NOTE, d); 
  })

  ipcMain.on('close', (e, noteId)=>{
    if(noteId == 0){
      openNotes.map(n => n.window).forEach(w => w.close())
      try{
        main_Window.close();
      }catch(e){

      }
    }
    let index = openNotes.map(n => n.id).indexOf(noteId);
    if(index == -1)
      return
    console.log(index)
    openNotes[index].window.close();
    openNotes = openNotes.filter(n => n.id != args.id)
  })

  //noteWindow.close();

  noteWindow.on('close', ()=>{
    openNotes = openNotes.filter(n => n.id != args.id)
  })
  /* noteWindow.once('show',
  ()=>{
  }) */
}

// Listen to note click events. Open new window with 
ipcMain.on(IPCActions.OPEN_NOTE,  addNoteWindow)

ipcMain.on(IPCActions.ADD_NOTE_FROM_LIST, addNoteWindow)

ipcMain.on(IPCActions.ADD_NOTE_FROM_EDIT, ()=>{
  main_Window.webContents.send(IPCActions.ADD_NOTE_FROM_EDIT, null);
})
