window.onload=function(){
    document.getElementById("entire-web").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log("tabs",tabs);
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
    console.log("request",request);
    if (request.msg === 'capturePage') {
        await capturePage(request,sender);
    }else{

    }
    
});
async function capturePage(data, sender, sendResponse) {
    return new Promise((resolve, reject) => {
    var screenshot = {};
    var canvas;
    if (!screenshot.canvas) {
        canvas = document.createElement('canvas');
        canvas.width = data.totalWidth;
        canvas.height = data.totalHeight;
        screenshot.canvas = canvas;
        screenshot.ctx = canvas.getContext('2d');
    }

    chrome.tabs.captureVisibleTab(
        null, {format: 'png', quality: 100}, function(dataURI) {
            console.log("dataURI",dataURI);
            if (dataURI) {
                var image = new Image();
                image.onload = function() {
                    console.log('draw img postions: ' + data.x + ', ' + data.y);
                    screenshot.ctx.drawImage(image, data.x, data.y);// 将当前片段图片放到相应位置
                    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
                        let tab = tabs[0]
                        sendScrollMessage1(tab);
                        resolve(); 
                    }); 
                };
                image.src = dataURI;
            }
        });

        console.log("screenshot.canvas",screenshot.canvas);
    });
}

