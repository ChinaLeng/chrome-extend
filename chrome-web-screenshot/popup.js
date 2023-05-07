var screenshot;
window.onload=function(){
    document.getElementById("entire-web").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            screenshot = {}
            sendScrollMessage(tabs[0],{msg: 'entirePage'});
        })
    });
    document.getElementById("visual-web").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            screenshot = {}
            sendScrollMessage(tabs[0],{msg: 'visualPage'});
        })
    });
    document.getElementById("custom-web").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            screenshot = {}
            sendScrollMessage(tabs[0],{msg: 'customPage',custom:true});
        })
    })
}


function sendScrollMessage(tab,data) {
    chrome.tabs.sendMessage(tab.id, data, function() {
        // 发送后的回调函数
        console.log("after send scrollPage message")
    });
}

chrome.runtime.onMessage.addListener(async function(request, sender) {
    console.log("request",request)
    if (request.msg === 'capturePage' || request.msg === 'visualRegion') {
        await capturePage(request,sender);
    } else if( request.msg === 'endPage'){
        endPage();
    }else if(request.msg === 'customScreenshot'){
        customScreenshotPage(request.rect);
    }
    
});

function text1(rect){
    let canvas = document.createElement('canvas');
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.getContext('2d').drawWindow(window, rect.left, rect.top, rect.width, rect.height, 'rgb(255,255,255)');
    let dataURL = canvas.toDataURL('image/png');
    console.log("dataURL",dataURL);
}

function customScreenshotPage(data){
    chrome.tabs.captureVisibleTab(null, {format: 'png', quality: 100}, (dataUrl) => {
        //第一次截图 创建画布
        createCanvas(data);
        let image = new Image();
        image.src = dataUrl;
        image.onload = () => {
            screenshot.ctx.drawImage(image, data.left, data.top, data.totalWidth, data.totalHeight,0, 0, data.totalWidth, data.totalHeight);
        };
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let tab = tabs[0];
            sendScrollMessage(tab,{msg: 'ccaptureVisiblePage'});
        }); 
        
      });
}

async function capturePage(data, sender, sendResponse) {
    return new Promise((resolve, reject) => {
    //第一次截图 创建画布
    createCanvas(data);
    chrome.tabs.captureVisibleTab(
        null, {format: 'png', quality: 100}, function(dataURI) {
            console.log("dataURI",dataURI)
            if (dataURI) {
                let image = new Image();
                image.onload = function() {
                    //把截图的图片 根据滚动的像素 放到指定位置
                    screenshot.ctx.drawImage(image, data.x, data.y);
                    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        let tab = tabs[0];
                        if(data.msg === 'capturePage'){
                            sendScrollMessage(tab,{msg: 'continuePage'});
                        }else if(data.msg === 'visualRegion'){
                            sendScrollMessage(tab,{msg: 'visualRegionPage'});
                        }
                        resolve(); 
                    }); 
                };
                image.src = dataURI;
            }
        });
    });
}

function createCanvas(data){
    if (!screenshot.canvas) {
        let canvas = document.createElement('canvas');
        canvas.width = data.totalWidth;
        canvas.height = data.totalHeight;
        screenshot.canvas = canvas;
        screenshot.ctx = canvas.getContext('2d');
    }
}
//截图结束后  打开新的标签页  查看或者编辑图片
function endPage(){
    let dataURI = screenshot.canvas.toDataURL();
    let canvaswidth = screenshot.canvas.width;
    let canvasheight = screenshot.canvas.height;
    //删除前一次存储的图片
    chrome.storage.local.remove(['croppingimg','canvaswidth','canvasheight'], function(obj){
        console.log("remove success");
    });
    //存储最新的截图
    chrome.storage.local.set({'croppingimg': dataURI,'canvaswidth':canvaswidth,'canvasheight':canvasheight}, function() {
        //打开新的页面 编辑图片
        chrome.tabs.create({'url': chrome.runtime.getURL('capture/capture.html')}, function(tab) {
            console.log("after created")
        });
    });
}
