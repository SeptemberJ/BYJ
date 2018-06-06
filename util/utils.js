let hub = new Vue();

Date.prototype.format = function(fmt) {
    if (this === '') {
       return ''
    }
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};
function getTimeStr(date) {
    console.log("getTimeStr date" + date)
    if (date) {
        if (typeof date === "object") {
            date = +date
        }
        if (typeof date === "number") {
            return new Date(date).format("yyyy-MM-dd hh:mm:ss")
        }
    }
    return date
}
function callRemoteURL(remoteUrl, data, success, fail) {
    $.ajax({
        type: 'post',
        url: remoteUrl,
        data: data,
        dataType: 'json',
        success: success,
        error: fail
    })
}
function getFormatDate(number) {
    if (!number) {
        return ''
    }
    return new Date(number).format("yyyy-MM-dd h:m:s")
}
function DisableElements(container,blnHidenButton, needActivity)
{
    if (!container)
        return;
    var aEle;
    if (navigator.appName =="Microsoft Internet Explorer") //IE
    {
        for (var i=0;i<container.all.length;i++)
        {
            aEle = container.all[i];
            tagName = aEle.tagName.toUpperCase();
            if ((tagName=="SELECT"))
            {
                aEle.disabled = true;
                if(tagName=="BUTTON" && blnHidenButton)
                {
                    //aEle.style.display = "none";//对button不做处理
                }
            }
            else if (tagName=="INPUT")
            {
                if (aEle.type.toUpperCase()!="HIDDEN")
                {
                    if (aEle.type.toUpperCase()=="TEXT")
                    {
                        ReadonlyText(aEle);
                    }
                    else if (aEle.type.toUpperCase()=="BUTTON")
                    {
                        //do nothing;
                    }
                    else
                    {
                        aEle.disabled = true;
                    }
                }
                if((aEle.type.toUpperCase()=="BUTTON"||aEle.type.toUpperCase()=="SUBMIT") && blnHidenButton)
                {
                    //aEle.style.display = "none";//对button不处理
                }
            }
            else if (tagName=="TEXTAREA")
            {
                ReadonlyText(aEle);
            }
        }
    }
    else//非IE浏览器
    {
        var aEle = container.getElementsByTagName("select");
        for (var i=0;i< aEle.length;i++)
        {
            aEle[i].disabled = true;
        }
        aEle = container.getElementsByTagName("button");
        for (var i=0;i< aEle.length;i++)
        {
            aEle[i].disabled = true;
        }
        aEle = container.getElementsByTagName("textarea");
        for (var i=0;i< aEle.length;i++)
        {
            if (needActivity) {
                continue;
            }
            ReadonlyText(aEle[i]);
        }
        aEle = container.getElementsByTagName("input");
        for (var i=0;i< aEle.length;i++)
        {
            if ((i < 5 || i === 7)&& needActivity) {
                continue;
            }
            if (aEle[i].type.toUpperCase()!="HIDDEN")
            {
                if (aEle[i].type.toUpperCase()=="TEXT")
                {
                    ReadonlyText(aEle[i]);
                }
                else
                {
                    aEle[i].disabled = true;
                }
            }
            if((aEle[i].type.toUpperCase()=="BUTTON"||aEle[i].type.toUpperCase()=="SUBMIT")&&blnHidenButton)
            {
                aEle[i].style.display = "none";
            }
        }
    }
}
function ReadonlyText(objText)
{
    if (objText){
        //objText.style.backgroundColor = "menu";
        objText.style.background = "#E6E6E6";
        //objText.style.color = "black";
        objText.readOnly=true;
    }
}