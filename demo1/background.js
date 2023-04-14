
  chrome.contextMenus.create({
    id:"myMenu",
    title: "文字识别",
    contexts: ['all'],
  })

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({active: true,currentWindow: true}, (tabs) => {
    console.log(tabs)
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          // if(callback) callback(response);
          console.log("1111",response)
      });
  });
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === 'myMenu') {
      sendMessageToContentScript({cmd:'prepare capture'});
  }
});

chrome.runtime.onMessage.addListener(function(request, sender,sendResponse) {
  // capturePage(request,sender).then(temp => {
  //   console.log("temp",temp);
  //   sendResponse(temp);
  // });
  // return true;
  chrome.tabs.captureVisibleTab(null, {format:'png'}, function(screenshotUrl) {
    console.log("screenshotUrl",screenshotUrl);
    sendResponse({cmd:'img capture',url:screenshotUrl});
  });
  return true;
});


function capturePage(data, sender, sendResponse) {
  
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(null, {format:'png'}, function(screenshotUrl) {
      console.log("screenshotUrl",screenshotUrl);
      resolve({cmd:'img capture',url:screenshotUrl});
    });
  })
  




  // screenshot = data.screenshot;
  // chrome.tabs.captureVisibleTab(
  //   null, {format: 'png', quality: 100}, function(dataURI) {
  //     console.log("dataURI",dataURI)
  //       if (dataURI) {
  //           var image = new Image();
  //           image.onload = function() {
  //               screenshot.ctx.drawImage(image, data.x, data.y);// 将当前片段图片放到相应位置
  //                   let queryOptions = { active: true, lastFocusedWindow: true };
  //                   chrome.tabs.query(queryOptions, function(tabs) {
  //                       let tab = tabs[0]
  //                       resolve(); 
  //                   });
  //           };
  //           image.src = dataURI;
  //           console.log("image",image);
  //       }
  //   });
  //   console.log(screenshot)
}