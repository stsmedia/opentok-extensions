window.onload = function () {
    console.log('client loaded');

    var httpGet = function (url) {
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    var info = httpGet('/enter');

    if (!info) return;

    var subscribers = {};
    var connectionInfo = JSON.parse(info);
    var videoPanel = {
        width: 400,
        height: 300
    };

    console.log(connectionInfo);

    var sessionConnectedHandler = function (event) {
        session.publish(publisher);
        subscribeToStreams(event.streams);
    }

    var subscribeToStreams = function (streams) {
        for (var i = 0; i < streams.length; i++) {
            var stream = streams[i];
            if (stream.connection.connectionId != session.connection.connectionId) {
                $("#videopanels").append('<div id=' + stream.connection.connectionId + ' class="videocontainer"></div>');
                subscribers[stream.streamId] = session.subscribe(stream, stream.connection.connectionId, videoPanel);
            }
        }
    }

    var streamCreatedHandler = function (event) {
        subscribeToStreams(event.streams);
    }

    $("#videopanels").append('<div id="publisher"  class="videocontainer"></div>');
    var publisher = TB.initPublisher(connectionInfo.apiKey, 'publisher', videoPanel);
    var session = TB.initSession(connectionInfo.sessionId);

    session.connect(connectionInfo.apiKey, connectionInfo.token);
    session.addEventListener("sessionConnected", sessionConnectedHandler);

    session.addEventListener("streamCreated", streamCreatedHandler);

    // start using custom extensions

    // speaker highlighting
    TB.highlightSpeaker(session);

    // transcripts
    var onMessage = function (message, senderId) {
        if (message)
            $('#transcripts').append('<li>' + senderId + ': ' + message);
    }

    TB.registerTranscript(session, onMessage);
}