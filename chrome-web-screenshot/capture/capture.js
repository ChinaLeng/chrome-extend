// 获取本地存储的图片数据，显示在页面上
let captureImg, fileName;
chrome.storage.local.get(['croppingimg'], function(result) {
    captureImg = result['croppingimg'];
    document.getElementById('screenCaptureImg').src = captureImg;
});

//图片下载
function downloadFile(imgData) {
    try {
        let aLink = document.createElement('a');
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", true, true);
        aLink.download =  "图片裁剪.png";
        aLink.href = imgData;
        aLink.click()
        showAlert('下载成功成功!', 'success')
    }catch (err) {
        showAlert('下载失败,稍后再试!', 'error')
    }
}
//图片拷贝
async function copyimages(imgData) {
    try {
        const data = await fetch(imgData);
        const blob = await data.blob();
        await navigator.clipboard.write([
            new window.ClipboardItem({
                [blob.type]: blob
            })
        ]);
        showAlert('拷贝成功!', 'success')
    }catch (err) {
        showAlert('拷贝失败,稍后再试!', 'error')
    }
    
}
// 下载按钮绑定点击事件，将图片下载到本地
document.getElementById('downloadimages').addEventListener('click', function() {
    if (captureImg) {
        downloadFile(captureImg);
    }
});
//拷贝按钮绑定
document.getElementById('copyimages').addEventListener('click', function() {
    if (captureImg) {
        copyimages(captureImg);
    }
});

//显示提示信息
function showAlert(msg, type) {
    let a = document.createElement('div');
    a.id = 'messageAlert';
    a.classList.add('messageAlert');
    switch (type) {
        case 'success':
          a.innerHTML = `<i class="iconfont icon-success"></i><p class="text">${msg}</p>`;
          break;
        case 'error':
          a.innerHTML = `<i class="iconfont icon-error"></i><p class="text">${msg}</p>`;
          break;
        case 'loading':
          a.innerHTML = `<i class="iconfont icon-loading"></i><p class="text">${msg}</p>`;
          break;
        default:
          a.innerHTML = `<p class="text">${msg}</p>`;
          break;
      }
    let msgId = document.getElementById('messageAlert');
    if(msgId==null){
        document.body.appendChild(a);
        msgId = document.getElementById('messageAlert');
        msgId.classList.add('messageAlertIn');

        let hideTimeOut = setTimeout(()=> {
            msgId.classList.remove('messageAlertIn');
            clearInterval(hideTimeOut)
            document.body.removeChild(a)
          }, 3000);
    }

}