//
// let body = document.body;
//可视区域屏幕的大小
let screenHeight,
    screenWidth;
//整个页面大小 全网页截屏用到
let fullHeight,
    fullWidth;
//获取最开始的像素点  截图后用于恢复最初状态
let primeX,
    primeY;

let arrangements = [],
    scrollPad,
    yDelta,
    xDelta,
    yPos,
    xPos,
    numArrangements;

let screenshot = {};
//隐藏掉滚动条
function forbiddenOverflow(){
    document.documentElement.style.overflow = 'hidden';
}
//恢复滚动条
function resumeOverflow(){
    document.documentElement.style.overflow = '';
}
//获取整个页面的大小
function initFull(){
    let widths = [
        document.documentElement.clientWidth,
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth
    ];
    let heights = [
        document.documentElement.clientHeight,
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
    ];
    //选择最大的值
    fullWidth = max(widths);
    fullHeight = max(heights);
}

function max(nums) {
    return Math.max.apply(Math, nums.filter(function(x) { return x; }));
}

//获取可视区域的大小
function initScreen() {
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
}
//获取最开始的像素点
function initScroll(){
    originalX = window.scrollX;
    originalY = window.scrollY;
}


// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if(request.cmd == 'prepare capture'){
        // self.forbiddenOverflow();
        self.initFull();
        self.initScreen();
        self.initScroll();
        self.getPositions();
    }
    
    sendResponse();
});

function aaa(x,y){
    return new Promise((resolve, reject) => {
        window.scrollTo(x, y);
        resolve(true)
    })
}

async function bbbb(x,y){
            window.scrollTo(x, y);
            //window.innerWidth = 100;
            //window.innerHeight = 100;
            await new Promise(resolve => setTimeout(resolve, 4000));
            chrome.runtime.sendMessage({msg: 'capturePage'},(response) => {
                if(response.url != undefined && response.url != 'undefined'){
                    console.log("url",response.url);

                    let image = new Image();

                    // 加载截图
                    image.src = response.url;

                    // 等待图像加载完成
                    image.onload = function() {
                    // 创建一个 canvas 元素
                    let canvas = document.createElement('canvas');

                    // 设置 canvas 尺寸
                    canvas.width = 300;
                    canvas.height = 500;

                    // 将截图裁剪为所选区域
                    let context = canvas.getContext('2d');
                    context.drawImage(image, x, y, 300, 500, 0, 0, 300, 500);
console.log("canvas",canvas.toDataURL("image/png"))

                                }
            }
            });
}

async function getPositions(){
    window.scrollTo({ top: 0, behavior: "smooth" });
    const scrollHeight = Math.ceil(fullHeight / 10);

    window.scrollTo(0,0);
    //根据可视区域计算整个网页可以拆分成多少行多少列
    let columns = Math.ceil(fullWidth*1.0 /  screenWidth);
    let rows = Math.ceil(fullHeight*1.0 /  screenHeight);
    let r = 0;
    let lastH = fullHeight - screenHeight;
    // chrome.runtime.sendMessage({});
    while(r < rows){
        let c = 0;
        while(c < columns){
            console.log("r*screenHeight",r*screenHeight);
            console.log("c*screenWidth",c*screenWidth);
            // await this.aaa(c*screenWidth,r*screenHeight);
            await this.bbbb(c*screenWidth,r*screenHeight);
            // console.log("y",window.scrollY);
            // window.scrollTo(r*fullHeight,(r+1)*fullHeight);
            // arrangements.push([c*screenWidth, r*screenHeight]);
            // window.scrollTo(0,r*screenHeight);
            // chrome.runtime.sendMessage({msg: 'capturePage'},(response) => {
            //     if(response.url != undefined && response.url != 'undefined'){
            //         // console.log(response.url);
            //         arrangements.push(response.url);
            //     }
            // });
            c++;
        }
        r++;
    }
    // for(var r=0; r<rows; r++) {
    //     document.body.scrollHeight = r*fullHeight;
    //     for(var c=0; c<columns; c++) {
    //       document.body.scrollLeft = c*fullWidth;
    //       window.scrollTo(r*fullHeight,(r+1)*fullHeight);
    //       chrome.runtime.sendMessage({msg: 'capturePage'},(response) => {
    //         if(response.url != undefined && response.url != 'undefined'){
    //             arrangements.push(response.url);
    //         }
    //       });
    //     }
    // }


//  scrollPad = screenHeight;
//  yDelta = screenHeight - (screenHeight > scrollPad ? scrollPad : 0);
//  xDelta = screenWidth;
//  yPos = fullHeight - screenHeight;
//     while (yPos > -yDelta) {// 如果没有滚动到最后，就一直执行
//         xPos = 0;
//         while (xPos < fullWidth) {// 横向滚动页面的位置信息
//             arrangements.push([xPos, yPos]);// 页面片段的位置信息
//             xPos += xDelta;
//         }
//         yPos -= yDelta; // 页面竖向位置信息
//     }
//     numArrangements = arrangements.length;
//     var next = arrangements.shift(),
//     x = next[0], y = next[1];
//     window.scrollTo(x, y);

//     canvas = document.createElement('canvas');
//     canvas.width = fullWidth;
//     canvas.height = fullHeight;
//     screenshot.canvas = canvas;
//     screenshot.ctx = canvas.getContext('2d');

//     var data = {
//         msg: 'capturePage',
//         x: window.scrollX,
//         y: window.scrollY,
//         complete: (numArrangements-arrangements.length)/numArrangements,
//         totalWidth: fullWidth,
//         totalHeight: fullHeight,
//         screenshot:screenshot
//     };
//     console.log("data",data);
//     setTimeout(() => {
//         // 将滚动后获取的网页的可视位置坐标数据发送消息给popup.js
//         chrome.runtime.sendMessage(data);
//     }, 550)
}
// mergeImgs(arrangements).then(base64 => {
//     console.log("list",arrangements);
//     console.log("0",arrangements[0]);
// });
function mergeImgs(arrangements){
    console.log("list",arrangements);
    console.log("0",arrangements[0]);
    // const imgDom = document.createElement('img');
	// imgDom.src = base64;
    // list.map((item, index) => {
    //     const img = new Image();
    //     img.src = item;
    // })
    return new Promise((resolve, reject) => {
        const baseList = [];
        const canvas = document.createElement('canvas');
        canvas.width = fullWidth;
        canvas.height = fullHeight;

        arrangements.map((item, index) => {
            console.log("item",item);
            const img = new Image();
            // 跨域
            //img.crossOrigin = 'Anonymous';
            img.onload = () => {
                canvas.getContext('2d').drawImage(img, 0, 0,0,0);
                // const base64 = canvas.toDataURL('image/png');
                // baseList.push(base64);

                // if (baseList[list.length - 1]) {
                //     // 返回新的图片
                //     resolve(baseList[list.length - 1])
                // }
            }
            img.src = item;
        });
        var combinedImage = canvas.toDataURL();
        console.log("combinedImage",combinedImage);
        resolve(combinedImage);
    })
}























// 屏幕大小
// let clientHeight,
//     clientWidth;

// // 页面元素
// let page,
//     guide,
//     capture,
//     baseInfoArea,
//     cameraBtn,
//     frameNumArea,
//     secondNumArea,
//     videoBtn,
//     closeBtn;

// // 左上角和右下角坐标
// let startX,
//     startY,
//     endX,
//     endY,
//     topX,
//     topY,
//     bottomX,
//     bottomY;

// // 鼠标位置
// let mouseX,
//     mouseY;

// // 录屏
// let recordTimer,
//     countTimer,
//     frameNum = 0,
//     secondNum = 0,
//     isRecording,
//     port;

// // 接收来自后台的消息
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     dispatchEvent(request);
//     sendResponse({});
//     return true;
// });

// // 事件分发
// function dispatchEvent(request) {
//     switch (request.cmd) {
//         case 'prepare capture':
//           // 生成外层节点
//           generateSection();
//           initSection();
//           // ESC 监听
//           initESCListener();
//             // 显示遮罩层
//             page.show();
//             guide.show();
//             // 初始化样式
//             initPage();
//             // 绑定鼠标事件
//             bindMouseEvent();
//             break;
//         case 'capture screen data':
//             captureScreenData(request);
//             break;
//         default:
//             return false;
//     }
// }

// function initESCListener() {
//     $(document).keydown(function(event){
//         if (event.keyCode === 27) {
//             $(document).unbind('mousemove');

//             if (capture) {
//                 capture.unbind();
//             }

//             if (page) {
//                 page.unbind();
//                 page.hide();
//             }
//         }
//     });
// }

// // 根据鼠标位置更新上下坐标
// function updateTopBottomPosition() {
//     topX = startX < endX? startX: endX;
//     topY = startY < endY? startY: endY;

//     bottomX = startX < endX? endX: startX;
//     bottomY = startY < endY? endY: startY;
// }

// // 更新遮罩层大小
// function updateCaptureArea() {
//     const borderRight = clientWidth - bottomX;
//     const borderBottom = clientHeight - bottomY;

//     page.css("border-width",`${topY}px ${borderRight}px ${borderBottom}px ${topX}px`);
//     page.css("background-color","unset");
// }

// // 初始化 page 的样式
// function initPage() {
//     page.css("pointer-events","auto");
//     page.css("background-color","rgba(0, 0, 0, 0.3)");
//     page.css("border-width","1px");
//     page.children().remove('.chrome-extension-capture-gif-capture-section')
// }

// function bindMouseEvent() {
//     // 开始绘制选区
//     page.on("mousedown", function (e) {
//         startX = e.clientX;
//         startY = e.clientY;
//         // 删除引导文字
//         guide.hide();
//         // 恢复 page 样式
//         initPage();
//         // 创建截图区域
//         initCaptureArea();
//         // 绑定鼠标移动事件
//         page.on("mousemove", function (e) {
//             endX = e.clientX;
//             endY = e.clientY;

//             // 计算起点终点
//             updateTopBottomPosition();
//             // 更新截图文字
//             updateCaptureSizeText();
//             // 跟新截图大小
//             updateCaptureArea();
//         });
//         // 选区绘制结束
//         page.on("mouseup", function (e) {
//             endX = e.clientX;
//             endY = e.clientY;

//             page.unbind('mousemove');
//             page.unbind('mouseup');
//             // 计算起点终点
//             updateTopBottomPosition();
//             // 更新截图文字
//             updateCaptureSizeText();
//             // 跟新截图大小
//             updateCaptureArea();
//         });
//     });

//     // 决定鼠标事件落在哪个层级上
//     adjustPagePointEvent();
// }

// // 根据鼠标位置的不同,page 的样式不同
// function adjustPagePointEvent() {
//     $(document).mousemove(function(e){
//         mouseX = e.pageX;
//         mouseY = e.pageY;

//         if( mouseX < bottomX - 10 &&
//             mouseX > topX + 10 &&
//             mouseY < bottomY -50 &&
//             mouseY > topY + 50){
//             page.css('pointer-events','none');
//         } else {
//             page.css('pointer-events','auto');
//         }
//     });
// }

// // 初始化 DOM
// function initSection() {
//     clientHeight = window.innerHeight;
//     clientWidth = window.innerWidth;

//     page = $('.chrome-extension-capture-gif-section');
//     guide= $('.chrome-extension-capture-gif-guide');
// }

// function initCaptureArea() {
//     capture = $(
//         "<div class='chrome-extension-capture-gif-capture-section'>" +
//             "<div class='chrome-extension-capture-gif-column'>" +
//                 "<div type='RESIZE-XY' class='chrome-extension-capture-gif-resize-xy'>" +
//                 "</div>" +
//                 "<div type='RESIZE-X' class='chrome-extension-capture-gif-resize-x'>" +
//                 "</div>" +
//                 "<div type='RESIZE-XY2' class='chrome-extension-capture-gif-resize-xy2'>" +
//                 "</div>" +
//             "</div>" +
//             "<div class='chrome-extension-capture-gif-column' style='flex-grow: 1'>" +
//                 "<div type='RESIZE-Y' class='chrome-extension-capture-gif-resize-y'>" +
//                 "</div>" +
//                 "<div class='chrome-extension-capture-gif-center'>" +
//                 "</div>" +
//                 "<div type ='RESIZE-Y2' class='chrome-extension-capture-gif-resize-y2'>" +
//                 "</div>" +
//             "</div>" +
//             "<div class='chrome-extension-capture-gif-column'>" +
//                 "<div type ='RESIZE-X2Y' class='chrome-extension-capture-gif-resize-x2y'>" +
//                 "</div>" +
//                 "<div type ='RESIZE-X2' class='chrome-extension-capture-gif-resize-x2'>" +
//                 "</div>" +
//                 "<div type ='RESIZE-X2Y2' class='chrome-extension-capture-gif-resize-x2y2'>" +
//                 "</div>" +
//             "</div>" +
//         "</div>"
//     );

//     page.append(capture);
//     // 获得 capture 内部的 dom 结构
//     initCaptureDom();
//     // 绑定拖动事件
//     bindCaptureMoveEvent();
//     // 绑定其它事件
//     bindCaptureEvent();
// }

// function initCaptureDom() {
//     closeBtn = $('.chrome-extension-capture-gif-close');
//     baseInfoArea = $('.chrome-extension-capture-gif-range-info');
//     frameNumArea = $('.chrome-extension-capture-gif-frame-info');
//     secondNumArea = $('.chrome-extension-capture-gif-time-info');
//     cameraBtn = $('.chrome-extension-capture-gif-camera-button');
//     videoBtn = $('.chrome-extension-capture-gif-video-button');
// }

// function bindCaptureEvent() {
//     // 关闭截屏区域
//     closeBtn.on('click', function (e) {
//         e.stopPropagation();

//         $(document).unbind('mousemove');
//         page.unbind();
//         capture.unbind();

//         page.hide();
//     });

//     // 普通截图
//     cameraBtn.on('click', function (e) {
//         e.stopPropagation();
//         chrome.storage.sync.get({quality: 10}, function(items) {
//             const quality = items.quality;

//             const params = {
//                 sx: topX + 10,
//                 sy: topY + 50,
//                 sWidth: bottomX - topX - 20,
//                 sHeight: bottomY - topY - 100,
//                 clientHeight,
//                 clientWidth,
//                 quality
//             };

//             chrome.runtime.sendMessage({cmd: 'capture screen', params});
//         });
//     });

//     // gif 截图点击事件
//     videoBtn.on('click', function (e) {
//         e.stopPropagation();

//         if (isRecording) {
//             stopRecording();
//         } else {
//             startRecording();
//         }

//         isRecording = !isRecording;
//     });
// }

// // 开始记录页面信息
// function startRecording() {
//     // 初始化显示
//     frameNum = 0;
//     secondNum = 0;
//     secondNumArea.text(`${secondNum} 秒`);
//     frameNumArea.text(`${frameNum} 帧`);

//     chrome.storage.sync.get({frame: 10, quality: 10}, function(items) {
//         const frame = items.frame;
//         const quality = items.quality;

//         //通道名称
//         port = chrome.runtime.connect({name: "shenmax"});

//         chrome.storage.sync.get({frame: 10, quality: 10}, function(items) {
//             //发送消息
//             port.postMessage({cmd: "start recording", params: {
//                     width: clientWidth,
//                     height: clientHeight,
//                     quality,
//                     frame
//                 }});

//             // 定时发送截图信息
//             recordTimer = setInterval(recordingFrame, 1e3 / frame);
//         });

//     });

//     countTimer = setInterval(function () {
//         secondNum ++;
//         secondNumArea.text(`${secondNum} 秒`);
//     }, 1e3);
// }

// function recordingFrame() {
//     const params = {
//         sx: topX + 10,
//         sy: topY + 50,
//         sWidth: bottomX - topX - 20,
//         sHeight: bottomY - topY - 100,
//         clientWidth,
//         clientHeight
//     };

//     port.postMessage({cmd: 'capture gif', params});

//     frameNum ++;
//     frameNumArea.text(`${frameNum} 帧`);
// }

// // 完成记录
// function stopRecording() {
//     countTimer && clearInterval(countTimer);
//     recordTimer && clearInterval(recordTimer);

//     const params = {
//         sx: topX + 10,
//         sy: topY + 50,
//         sWidth: bottomX - topX - 20,
//         sHeight: bottomY - topY - 100,
//         clientWidth,
//         clientHeight
//     };

//     port.postMessage({cmd: "stop recording", params});

//     countTimer = null;
//     recordTimer = null;
//     port = null;
// }

// // 窗口拖动事件
// function bindCaptureMoveEvent() {
//     capture.on("mousedown", function (e) {
//         e.stopPropagation();
//         // 恢复 page 样式
//         $(document).unbind('mousemove');
//         page.css('pointer-events','auto');
//         // 记录起始位置
//         const startX = e.clientX;
//         const startY = e.clientY;
//         // 记录节点初始位置
//         const originPosition = [topX, topY, bottomX, bottomY];
//         // 移动的类型
//         let typeStr = '';
//         if (e.target.attributes.getNamedItem('type')) {
//             typeStr = e.target.attributes.getNamedItem('type').textContent;
//         }

//         // 绑定鼠标移动事件
//         page.on("mousemove", function (e) {
//             e.stopPropagation();

//             const x = e.clientX;
//             const y = e.clientY;

//             // 根据鼠标位置调整捕捉区域大小
//             adjustTopBottomPosition(typeStr, x, y, startX, startY, originPosition);
//             // 更新截图文字
//             updateCaptureSizeText();
//             // 更新大小
//             updateCaptureArea();
//         });

//         page.on("mouseup", function (e) {
//             e.stopPropagation();
//             const x = e.clientX;
//             const y = e.clientY;

//             page.unbind('mousemove');
//             page.unbind('mouseup');

//             // 根据鼠标位置调整捕捉区域大小
//             adjustTopBottomPosition(typeStr, x, y, startX, startY, originPosition);
//             // 更新截图文字
//             updateCaptureSizeText();
//             // 更新大小
//             updateCaptureArea();
//             // 恢复 page 样式监听
//             adjustPagePointEvent();
//         });
//     });
// }

// // 更新区域大小文本
// function updateCaptureSizeText() {
//     const width = Math.ceil(bottomX - topX) - 20;
//     const height = Math.ceil(bottomY - topY) - 100;

//     baseInfoArea.text(`GIF截图 ${width} x ${height}`);
// }

// // 根据拖动行为调整截图区域的大小
// function adjustTopBottomPosition(typeStr, x, y, startX, startY, originPosition) {
//     if (typeStr.indexOf('RESIZE') !== -1) {
//         if (typeStr.indexOf('X2') !== -1) {
//             bottomX = x;
//         } else if (typeStr.indexOf('X') !== -1) {
//             topX = x;
//         }

//         if (typeStr.indexOf('Y2') !== -1) {
//             bottomY = y;
//         } else if (typeStr.indexOf('Y') !== -1) {
//             topY = y;
//         }
//     } else if (typeStr.indexOf('MOVE') !== -1) {
//         const difX = x - startX;
//         const difY = y - startY;

//         bottomX = originPosition[2] + difX;
//         topX = originPosition[0] + difX;
//         bottomY = originPosition[3] + difY;
//         topY = originPosition[1] + difY;
//     }
// }

// function generateSection() {
//     const page = $(
//         "<div class='chrome-extension-capture-gif-section'>" +
//             "<div class='chrome-extension-capture-gif-guide'>" +
//                 "单击并拖动选择区域" +
//             "</div>" +
//         "</div>"
//     );

//     $("body").append(page);
// }