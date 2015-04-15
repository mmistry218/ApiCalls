self.addEventListener('message', function (e) {
    var ServiceUrl = e.data.url;
    debugger;
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('get', ServiceUrl, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var responseJson = xhr.responseText;
                responseJson.split('<string xmlns="http://schemas.microsoft.com/2003/10/Serialization/">').pop();
                responseJson.split('</string>').pop();
                var json = JSON.parse(responseJson);
                postMessage({ 'cmd': e.data.cmd, 'callData': json});
            }
            else {
                postMessage({'error':xhr.readyState, 'stats':xhr.status, 'url':ServiceUrl});
            }
        };
        xhr.send(null);
    } catch (e) {
        postMessage(null);
    }
}, false);