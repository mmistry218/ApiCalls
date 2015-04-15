var availGroups = {
    //private fields
    _groups: '',

    //methods
    init: function() {
        availGroups.workerPostMsg('setGroups', 'http://54.149.167.236/webapi/api/values');
    },
    workerPostMsg: function (cmd, url) {
        var worker = new Worker('http://54.149.167.236/webapp/js/apiCall.js');
        worker.postMessage({ 'cmd': cmd, 'url': url });
        worker.addEventListener('message', function (e) {
            if (e.data.cmd == 'setGroups') {
                var jsonData = JSON.parse(e.data.callData);
                var groups = jsonData.results;
                availGroups.setGroups(groups);
            }
            else if (e.data.cmd == 'getCallData') {
                var jsonData = JSON.parse(e.data.callData);
                var calls = jsonData.results;
                availGroups.getCallData(calls);
            }
        }, false);
    },
    setCallGroup: function (groupid) {
        $("#overlay").fadeIn();
        var id = groupid.value;
        availGroups.workerPostMsg('getCallData', 'http://54.149.167.236/webapi/api/values/' + id);
    },
    getCallData: function(data) {
        var source = $("#call-template").html();
        var template = Handlebars.compile(source);
        var context = { calls: [] };
        //handlebars script
        for (var i = 0; i < data.length; i++) {
            context.calls.push({ calldate: data[i].calldate, caller_id: data[i].caller_id, disposition: data[i].disposition, id: data[i].id, repeat_call: data[i].repeat_call });
        }
        var html = template(context);
        $('#callList').html(html);
        $("#overlay").fadeOut();
    },
    setGroups: function (data) {
        var source = $("#group-template").html();
        var template = Handlebars.compile(source);
        var context = { groups: [] };
        //handlebars script
        for (var i = 0; i < data.length; i++) {
            context.groups.push({ groupname: data[i].name, id: data[i].ouid });
        }
        var html = template(context);
        $('#callGroups').html(html);
    }
}
$(document).ready(availGroups.init);

$t = $("#callList"); // CHANGE it to the table's id you have

$("#overlay").css({
    opacity: 0.5,
    top: $t.offset().top,
    width: $t.outerWidth(),
    height: $t.outerHeight()
});

$("#img-load").css({
    top: ($t.height() / 2),
    left: ($t.width() / 2)
});