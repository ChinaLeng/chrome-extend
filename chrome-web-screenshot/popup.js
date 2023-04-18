window.onload=function(){
    document.getElementById("entire-web").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var image = new Image();
            sendScrollMessage(tabs[0]);
        })
    })
}


function sendScrollMessage(tab) {
    chrome.tabs.sendMessage(tab.id, {msg: 'scrollPage'}, function() {
        // 发送后的回调函数
        console.log("after send scrollPage message")
    });
}

function sendScrollMessage1(tab) {
    chrome.tabs.sendMessage(tab.id, {msg: 'continuePage'}, function() {
        // 发送后的回调函数
        console.log("after send continuePage message")
    });
}

chrome.runtime.onMessage.addListener(async function(request, sender) {
    if (request.msg === 'capturePage') {
        await capturePage(request,sender);
    }else{
        endPage();
    }
    
});
var screenshot = {};
async function capturePage(data, sender, sendResponse) {
    return new Promise((resolve, reject) => {
    let canvas;
    console.log("totalWidth",data.totalWidth);
    console.log("totalHeight",data.totalHeight);
    if (!screenshot.canvas) {
        canvas = document.createElement('canvas');
        canvas.width = data.totalWidth;
        canvas.height = data.totalHeight;
        screenshot.canvas = canvas;
        screenshot.ctx = canvas.getContext('2d');
    }

    console.log("data.x",data.x);
    console.log("data.y",data.y);
    chrome.tabs.captureVisibleTab(
        null, {format: 'png', quality: 100}, function(dataURI) {
            if (dataURI) {
                let image = new Image();
                image.onload = function() {
                    //把截图的图片 根据滚动的像素 放到指定位置
                    screenshot.ctx.drawImage(image, data.x, data.y);
                    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        let tab = tabs[0]
                        sendScrollMessage1(tab);
                        resolve(); 
                    }); 
                };
                image.src = dataURI;
            }
        });

    });
}

function endPage(){
    let dataURI = screenshot.canvas.toDataURL();
    console.log("dataURI",dataURI);
}
