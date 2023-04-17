//整个网页的大小
let scrollHeight,
    scrollWidth;
//当前窗口的大小
let innerWidth,
    innerHeight;
//最初的像素点位置 和滚动条状态
let initialX,
    initialY,
    initialOverflow;
//需要滚动的距离
let residueX,
    residueY;

    chrome.runtime.onMessage.addListener(async function(request, sender,callback) {
        console.log("request",request);
        callback();
        return true;
    });
