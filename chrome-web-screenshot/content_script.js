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
    
let arrangements = []; 

let body;

let mask;

    chrome.runtime.onMessage.addListener(async function(request, sender,callback) {
        if (request.msg === 'entirePage') {
            initialization();
            initScroll();
            initInner();
            overflowHidden();
            geyCountCoordinate();
            getAllScreenshot();
        }else if (request.msg === 'visualPage'){
            initialization();
            overflowHidden();
            initInner();
            getVisualRegion();
        }else if(request.msg === 'continuePage'){
            getAllScreenshot();
        }else if( request.msg === 'visualRegionPage'){
            endScreenshot();
        }else if (request.msg === 'ccaptureVisiblePage'){
            removeMouseEvent();
        }else if(request.msg === 'customPage'){
            body = document.body;
            initialization();
            overflowHidden();
            initScroll();
            getCustomScreenshot();
            
        }
        callback();
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
function restoreState(){
    window.scrollTo(initialX, initialY);
    document.documentElement.style.overflow = initialOverflow;
}


function geyCountCoordinate(){
    window.scrollTo(0,0);
    new Promise(resolve => setTimeout(resolve, 1000));
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
    //arrangements.reverse();
}
//全页面截图
function getAllScreenshot(){
    //如果滚动结束  页面恢复截图前状态
    if(arrangements.length == 0){
        endScreenshot();
        return;
    }
    
    let next = arrangements.shift();
    let x = next[0], y = next[1];
    window.scrollTo(x, y);
    let data = {
        msg: 'capturePage',
        x: window.scrollX,
        y: window.scrollY,
        totalWidth: scrollWidth,
        totalHeight: scrollHeight
    };

    setTimeout(() => {
        // 将滚动后获取的网页的可视位置坐标数据发送消息给popup.js
        chrome.runtime.sendMessage(data);
    }, 550)
}
//可视页面截图
function getVisualRegion(){
    let data = {
        msg: 'visualRegion',
        x: 0,
        y: 0,
        totalWidth: innerWidth,
        totalHeight: innerHeight
    };

    setTimeout(() => {
        // 将滚动后获取的网页的可视位置坐标数据发送消息给popup.js
        chrome.runtime.sendMessage(data);
    }, 550)
}


function getCustomScreenshot(){
    mask.addEventListener('mousedown', getMousedown,false);
}


function getMousedown(e){
        //鼠标起始位置
        let startX,startY;
        //鼠标结束位置
        let endX,endY;
        startX = e.clientX,
        startY = e.clientY;

        mask.addEventListener('mousemove', (e1) => {
            
            endX = e1.clientX,
            endY = e1.clientY;
        });
        mask.addEventListener('mouseup', (e) => {
            box.classList.remove('selecting'); 
            console.log("鼠标抬起",e);
            // 水平方向移动距离
            let diffX = startX - endX;  
            // 垂直方向移动距离
            let diffY = startY - endY;
            // 选取区域的rectangle
            let rect = {
                left: Math.min(startX, endX), 
                top: Math.min(startY, endY),
                totalWidth: Math.abs(diffX),
                totalHeight: Math.abs(diffY)
            };
            let data = {
                msg: 'customScreenshot',
                rect:rect
            };
            // setTimeout(() => {
            //     // 将滚动后获取的网页的可视位置坐标数据发送消息给popup.js
            //     chrome.runtime.sendMessage(data);
            // }, 550)
        });
}

function removeMouseEvent(){
    mask.removeEventListener('mousedown', getMousedown,false);
    mask.style.display = 'none';
    restoreState();
    //document.removeEventListener('mousedown', getMousedown,true);
    //document.removeEventListener('mousemove', getMousedown(e),false);
    //document.removeEventListener('mouseup', getMousedown(e),false);
    //发送信息  结束截图
    chrome.runtime.sendMessage({msg:"endPage"});
}



function endScreenshot(){
    //发送信息  结束截图
    chrome.runtime.sendMessage({msg:"endPage"});
    //恢复初始化
    setTimeout(() => {
        restoreState();
    }, 1000)
}

// function aaa(){
//     let aa = "<div id='awesome_screenshot_wrapper'>"+
//     ""
//     +"</div>";
// }