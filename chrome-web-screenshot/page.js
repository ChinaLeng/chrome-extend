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
    
let arrangements = [];

    chrome.runtime.onMessage.addListener(async function(request, sender,callback) {
        if (request.msg === 'scrollPage') {
            initScroll();
            initInner();
            callback();
            geyCountCoordinate();
            getScreenshot();
        }else{
            getScreenshot();
        }
        
        return true;
    });

function initialization(){
    initialX = window.scrollX, 
    initialY = window.scrollY,
    initialOverflow = document.documentElement.style.overflow;
}

function initScroll(){
    scrollWidth = document.documentElement.scrollWidth,
    scrollHeight = document.documentElement.scrollHeight;
}

function initInner(){
    innerWidth = window.innerWidth,
    innerHeight = window.innerHeight;
}

function overflowHidden(){
    //把滚动条隐藏，截图的图片不需要滚动条
    document.documentElement.style.overflow = 'hidden';
}

function geyCountCoordinate(){
    //剩余需要滚动的高度 
    let residueY = scrollHeight - innerHeight;
    let residueX;
    //y轴页面滚动到最底层时 停止
    while(residueY > -innerHeight){
        residueX = 0;
        //x轴页面也需要滚动
        while(residueX < scrollWidth){
            arrangements.push([residueX, residueY]);
            residueX += innerWidth;
        }
        //减去滚动的高度
        residueY -= innerHeight;
    }
    console.log("arrangements",arrangements);
}

function getScreenshot(){
    if(arrangements.length == 0){
        chrome.runtime.sendMessage({msg:"endPage"});
        return;
    }
    
    let next = arrangements.shift();
    let x = next[0], y = next[1];
    window.scrollTo(x, y);

    let data = {
        msg: 'capturePage',
        x: window.scrollX,
        y: window.scrollY,
        complete: 3,
        totalWidth: scrollWidth,
        totalHeight: scrollHeight,
        devicePixelRatio: window.devicePixelRatio //当前显示设备的物理像素分辨率与CSS 像素分辨率之比
    };

    setTimeout(() => {
        // 将滚动后获取的网页的可视位置坐标数据发送消息给popup.js
        chrome.runtime.sendMessage(data);
    }, 550)
}