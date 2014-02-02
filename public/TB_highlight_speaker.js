if (typeof window["TB"] === "undefined") window.TB = {};

/**
 * The <code>TB.highlightSpeaker()</code> method is an extension to the TokBox API. It attempts to highlight the window of
 * the current speaker.
 *
 * This extension depends on the hark.js library which needs to be loaded from https://github.com/latentflip/hark
 * 
 * This extension will dynamically add or remove the 'activevideo' CSS class to the active TB video. A simple example could
 * be implemented as:
 * <code>
 * .activevideo {
 *   border: 5px solid #009d7b;
 * }
 * </code>
 *
 * @method TB.highlightSpeaker
 * @memberof TB
 * @param {TB.session} session The session for which the transcript should be created
 */
TB.highlightSpeaker = function (session) {

    if (!session || !hark) return;

    // listen on the speaking channel to signals captured by session participants
    session.addEventListener("signal:speaking", function (event) {
        console.info("speaking signal sent from connection " + event.from.id + " " + event.data);
        if (!event) return;
        // avoid jQuery dependency
        var element = document.getElementById(event.from.id);
        if (!element) element = document.getElementById('publisher');
        if (event.data === 'start')
            element.className += ' activevideo';
        if (event.data === 'stop') 
            element.className = element.className.replace( /(?:^|\s)activevideo(?!\S)/g , '' );
    });

    // simple function to send all captured messages through the TB signal API
    var sendSpeakingSignal = function (event) {
        session.signal({
                type: "speaking",
                data: event,
            },
            function (error) {
                if (error) {
                    console.log("signal error: " + error.reason);
                } else {
                    console.log("signal sent");
                }
            }
        );
    }

    var onAudio = function (stream) {
        var options = {};
        var speechEvents = hark(stream, options);

        speechEvents.on('speaking', function () {
            sendSpeakingSignal('start');
        });

        speechEvents.on('stopped_speaking', function () {
            sendSpeakingSignal('stop');
        });
    };

    var onError = function (error) {
        TB.log("Audio capture error: ", error.code);
    }

    //test for feature
    var getUserMedia =
        (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.oGetUserMedia ||
        navigator.msieGetUserMedia ||
        false
    );

    if (getUserMedia) {
        getUserMedia.call(navigator, {
            "audio": true
        }, onAudio, onError);
    }
}