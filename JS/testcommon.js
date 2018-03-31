//RESTful API
function restFulApiGet(method, obj, service, header, callback) {
    var data = "";
    for(key in obj) {
        data = data + key +'=' + obj[key] + '&';
    }
    $.ajax({
        type: "get",
        url: "http://192.168.1.248:8088/qdadp/"+ service +"/"+ method,
        dataType: "json",
        data: data,
        timeout: 120000,
        headers: header,
        error: function(jqXHR, textStatus, errorThrown) {
            if(textStatus=="timeout"){  
                alert("加载超时，请稍后重试");  
            }
        },
        success: function(json) {
            if(json !== "") {
                if(console)console.log("调用方法："+method, json, obj);
                callback(json);
            }
        }
    });
}

//post 方法会传递json对象给后台
function restFulApiPost(method, obj, service, header, pager, callback) {
    var item = "";
    for(key in pager) {
        if(key) {
            item = item + key +'=' + pager[key] + '&';
        }
    }
    var url = "http://192.168.1.248:8088/qdadp/"+ service +"/"+ method +"?"+ item;
    $.ajax({
        type: "post",
        url: url,
        contentType: "application/json; charset=utf-8",
        processData: false, //不要处理发送数据，直接传对象
        dataType: "json",
        data: JSON.stringify(obj),
        timeout: 120000,
        headers: header,
        error: function(jqXHR, textStatus, errorThrown) {
            if(textStatus=="timeout"){  
                alert("加载超时，请稍后重试");  
            }
        },
        success: function(json) {
            if(json !== "") {
                if(console)console.log("调用方法："+method, json, obj);
                callback(json);
            }
        }
    });
}

//soap API
function soapApi(method, obj, callback, server) {
    var data, key, resXml, json, uname, pwd, apikey, startTag, endTag,
        headerObj = {},
        url = 'http://192.168.1.248:8088';//top2.topsunny.cn     192.168.1.89:8080
    
    startTag = '<'+ method + ' xmlns="http://'+ url +'/qdadp/services/'+ server +'">';
    endTag = '</'+ method +'>';
    data = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body>';
    data = data + startTag;
    for(key in obj) {
        data = data + '<'+ key +'>' + obj[key] + '</'+ key +'>';
        if(key == "uname") uname = obj[key];
        if(key == "pwd") pwd = obj[key];
        if(key == "apikey") apikey = obj[key];
    }
    data = data + endTag + '</soap:Body></soap:Envelope>';
    var ns = "http://"+ url +"/qdadp/services/"+ server;
        soapaction = ((ns.lastIndexOf("/") != ns.length - 1) ? ns + "/" : ns) + method;
    if(!server) {
        server = "StoreAppService";
    }
    $.ajax({
        type: "post",
        contentType: "text/xml; charset=utf-8",
        url: "http://"+ url +"/qdadp/services/"+ server,
        dataType: "xml",
        data: data,
        timeout: 120000,
        headers: {
            "SOAPAction":soapaction,
            "loginno":"tmqjd",
            "password":"123456",
            "domain":"ts"
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if(textStatus=="timeout"){  
                alert("加载超时，请稍后重试");  
            }
        },
        success: function(xml) {
            resXml = $(xml).children().children().children().text();
            if(resXml !== "") {
                resXml = resXml.replace(/\\n/mg,"n");
                resXml = resXml.replace(/\n/mg,"");//这行是历史问题，将来可删
                try{
                    json = JSON.parse(resXml);
                }catch(e) {
                    json = resXml
                }
                if(console)console.log("调用方法："+method, json, obj);
                callback(json);
            }
        }
    });
};

//获取hash数据
function getHashObj() {
    var args = {}; 
    var query = location.search.substring(1);
    if(query){ 
        if(query.indexOf('=') == -1) { 
            return false; 
        }else { 
            var pairs = query.split('&'); 
            for(var i = 0; i < pairs.length; i++) { 
                var pos = pairs[i].indexOf('='); 
                if(pos == -1) continue; 
                var name = pairs[i].substring(0, pos); 
                if(!name) { 
                    return false; 
                } 
                var value = pairs[i].substring(pos + 1); 
                value = decodeURIComponent(value); 
                args[name] = value; 
            } 
        } 
    }else { 
        return false; 
    } 
    return args; 
}