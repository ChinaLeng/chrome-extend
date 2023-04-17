//注入文件是否成功标识
let initial = false;
//当点击popup页面时  注入js和css文件
// chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
//     let tab = tabs[0];
//     chrome.scripting.executeScript({target: {tabId: tab.id} , files: ['page.js'],}, function() {
//         sendScrollMessage(tab); // 发送消息通知
//     });
// });

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

