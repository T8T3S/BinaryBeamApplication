const electron = require('electron');
const io = require("socket.io");
const server = io.listen(3000);
const fs = require('fs');
const {
    app,
    BrowserWindow,
    Menu
} = electron;



app.on('ready', function () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 550,
        height: 245,
        maxWidth: 550,
        maxHeight: 245,
        frame: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    //build menu from template
       const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert Menu
       Menu.setApplicationMenu(mainMenu);
});
function newWin() {
    let child = new BrowserWindow({ modal: true, show: false, height:245, width:550, })
    child.loadFile('export.html')
    child.once('ready-to-show', () => {
      child.show()
    })
  }
  
//Create Template
const mainMenuTemplate = [
    {
      label: 'File',
        submenu:[
            {
                label:'Create From TXT',
                click(){newWin()}
            },
          {
            label: 'Exit',
                click(){app.quit()}
          },
        ] 
        
  
    }
  ]
  

server.on('connection', (socket) => {
    socket.on('writeData', function (FPI, FPO) {
        let filePathIn = FPI;
        let filePathOut = FPO;
        var filepathToImport = __dirname + '\\WorkingFolder\\' + filePathIn;
        var filepathToExport = __dirname + '\\WorkingFolder\\' + filePathOut;
        console.log(FPI + '\n' + FPO)
        fs.readFile(filepathToImport, function (err, data) {
            if (err) {
                console.log(err);
            }
            console.log('something');
            console.log(data);
            var bufferSting = new Uint8Array(Buffer.from(data));
            fs.writeFile(filepathToExport, bufferSting, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('The file has been saved');
                socket.emit('callbackFromJS');
            })
        })
    })
    socket.on('createFile', function(RFI, RFO){
        var filepathToRead = __dirname + '\\WorkingFolder\\' + RFI;
        var filepathToWrite = __dirname + '\\Exported\\' + RFO;
        fs.readFile(filepathToRead, (err, data)=>{
            if(err){
                console.log(err);
            }
            var tempData = data;
            fs.writeFile(filepathToWrite, tempData, (err)=>{
                if(err){
                    console.log(err);
                }
                console.log('The file has been saved');
                socket.emit('callbackFromJSExport');
            })
        })
    })
})

