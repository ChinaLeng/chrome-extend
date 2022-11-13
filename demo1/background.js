const path = 'http://fanyi.youdao.com/translate?&doctype=json&type=AUTO';
//https://www.youdao.com/result?word=%E4%BD%A0%E5%A5%BD&lang=en
//https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4 
/**
 * q: 你好
le: en
t: 9
client: web
sign: 4d58e79991a4d93e72dc82041d4c7fe7
keyfrom: webdict
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.log(111)
	if(message.method == "translate-query"){
		let url = path + "&i=" + encodeURIComponent(message.value);
		fetch(url)
		// .then(function(response){
		// 	sendResponse(response)
		// })
          .then(response => response.text())
          .then(text => sendResponse(text))
        //   .catch(error => sendResponse('未找到'))
      return true;

		// var options = {
		// 	'method' : 'get',
		// 	"Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
		// 	"followRedirects":false
		//   };
		// var response = UrlFetchApp.fetch(path+"?mkt=zh-cn&q="+encodeURIComponent(message.value), options);
		// console.log(response.getContentText());
		//第一步：建立所需的对象
		// let httpRequest = new XMLHttpRequest();
		// //第二步：打开连接  将请求参数写在url中
        // httpRequest.open('GET', path, true);
		// //第三步：发送请求  将请求参数写在URL中
        // httpRequest.send("mkt=zh-cn&q=" + encodeURIComponent(message.value));
		// //获取数据后的处理程序
        // httpRequest.onreadystatechange = function () {
		// 	console.log(httpRequest);
        // };
		// sendResponse(1);
	}

    // if (message.method = "translate") {
    //     let xhr = new XMLHttpRequest();
    //     xhr.open("POST", "https://translate.google.cn/translate_a/single", true);
    //     xhr.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === 4 && xhr.status === 200) {
    //             let data = JSON.parse(xhr.responseText);
    //             let content = data[0];
    //             let dictionary = data[1];
    //             let sourceLanguage = data[2];
    //             let cocaIdx = null;
    //             if (sourceLanguage === "en" && dictionary) {
    //                 let word = content[0][1].toLowerCase();
    //                 cocaIdx = window.getIndex(word)
    //             }
    //             sendResponse({
    //                 "data": data,
    //                 "cocaIdx": cocaIdx,
    //                 "sourceLanguage": getLanguage(sourceLanguage)
    //             });
    //         }
    //     };
    //     // sl:source language, tl:translation language, q:query, dj:detail json(value: 1)
    //     // dt:detail translation(value: t-translation, bd-dictionary)
    //     xhr.send("client=gtx&sl=auto&tl=zh-CN&dt=t&dt=bd&q=" + encodeURIComponent(message.value));
    //     return true;
    // }
});