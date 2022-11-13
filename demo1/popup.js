// const baiduCheckbox = document.querySelector('#baidu'),
//       googleCheckbox = document.querySelector('#google')


//       chrome.storage.sync.get(['baiduTranslate', 'googleTranslate'], function(result) {
//         baiduCheckbox.checked = result.baiduTranslate
//         googleCheckbox.checked = result.googleTranslate
//       });
      
//       baiduCheckbox.addEventListener('change', checkBoxChangeListener)
//       googleCheckbox.addEventListener('change', checkBoxChangeListener)
      
//       function checkBoxChangeListener(event) {
//         console.log(event.target)
//         const { checked, id } = event.target
//         console.log(`${id}Translate`, checked)
//         chrome.storage.sync.set({
//           [`${id}Translate`]: checked
//         })
//       }

// const background = chrome.runtime.getBackgroundPage();
// console.log("background",background);
// window.onload = function () {
//   sendMessage({action: 'open'});
//     // if (background.getStatus()) {
//     //     changeColor('open', '#1890ff')
//     //     changeColor('close', '#000')
//     // } else {
//     //     changeColor('close', '#1890ff')
//     //     changeColor('open', '#000')
//     // }
//     // document.getElementById('open').addEventListener('click', function() {
//     //     background.setStatus(true);
//     //     changeColor('open', '#1890ff')
//     //     changeColor('close', '#000')
//     //     sendMessage({action: 'open'})
//     // })
//     // document.getElementById('close').addEventListener('click', function() {
//     //     background.setStatus(false);
//     //     changeColor('close', '#1890ff')
//     //     changeColor('open', '#000')
//     //     sendMessage({action: 'close'})
//     // });
//     function sendMessage (data) {
//         chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tab) {
//           console.log(tab)
//             chrome.runtime.sendMessage({key:'config'}, function(response) {
//               console.log(response);
//             });
//         });
//     }
// }
