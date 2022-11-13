var content,time,resloveFn,selectTxt
setTimeout(() => {
    buildDiv();
    stopProp();
})


//创建显示翻译内容块  先隐藏
function buildDiv(){
    content = document.createElement('div')
    content.className = "k-chorme-extensions-fanyi"
    content.style.display = 'none'
    document.body.appendChild(content)
}


document.onmouseup = function (env) {
    let selection = window.getSelection();
    selectTxt = selection.toString().trim();
    if(selectTxt !== "" && selectTxt !== null){
        sendMessage(env,selectTxt);
    }


};
document.onmousedown = function (event) {
    //选择新的词语 隐藏翻译过的div
    content.style.display = 'none';
}

function sendMessage(env,value){
    chrome.runtime.sendMessage({
        "method": "translate-query",
        "value": value
    }, function (data) {
        console.log(data);
        // const description = parseDescription(data);
        // const isph = isPhrase(description);
        // console.log(description);
        // console.log(isph);
        // var phrase = parsePhrase(description);
        // console.log(phrase);
        //display(value, time);
    });
}

//选中翻译过的内容  不执行
  function stopProp () {
    content.addEventListener('mousedown', function(ev){
        ev.stopPropagation()
    })
    content.addEventListener('mouseup', function(ev){
        ev.stopPropagation()
    })
}

function parseDescription(html) {
    const descReg = /<meta name="description" content="([^"]+?)" \/>/;
    return html.match(descReg)[1];
  }

function isPhrase(description) {
    return !!description && description.indexOf('释义') !== -1
  }


function parsePhrase(description) {
    const contentArr = description.split(/(释义|])，/);
    var arrLength = contentArr.length;
    const info = contentArr[arrLength - 1];
  
    function parseInfo(infoStr) {
      const partReg = /(.+?\.|网络释义：) (.*?)； /g;
      let part;
      const info = {};
      while (part = partReg.exec(infoStr)) {
        for (let i = 1; i < part.length; i++) {
          const key = part[1].replace(/\.|：/g, '');
          info[key] = part[2].split(/; |；/);
        }
      }
      return info;
    }
  
    const phrase = parseInfo(info);
  
    function merge(phrase) {
      var values = [];
      for (let key in phrase) {
        phrase[key].map(x => values.push(x))
      }
      phrase.result = unique(values);
      if (phrase.result.length === 0) {
        throw new Error('未找到');
      }
    }
  
    merge(phrase);
    return phrase;
  }

function unique(arr) {
    var Set = {};
    var newArr = [];
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (!Set[item]) {
        Set[item] = true;
        newArr.push(item);
      }
    }
    return newArr;
  }