// chrome.contextMenus.create({
//     id: 'baidu-search',
//     title: '使用度娘搜索：%s',
//     contexts: ['selection']
// });
// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//     switch(info.menuItemId){
//         case 'baidu-search':
//             chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(info.selectionText)});
//             break;
//     }
// });

chrome.contextMenus.create({
    id: 'baidu-search',
	title: '菜单的名字', // 显示的文字，除非为“separator”类型否则此参数必需，如果类型为“selection”，可以使用%s显示选定的文本
	contexts: ['selection'], // 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
});
