
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

