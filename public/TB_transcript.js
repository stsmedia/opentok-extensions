if (typeof window["TB"] === "undefined") window.TB = {};

/**
 * The <code>TB.registerTranscript()</code> method is an extension to the TokBox API. It allows the creation of a 
 * text transcript of the conversation. This feature is only available if the browser supports speech recognition.
 *
 * @method TB.registerTranscript
 * @memberof TB
 * @param {TB.session} session The session for which the transcript should be created
 * @param {function} messageCallback the callback function that will be invoked when a new transcript message is available
 * @param {bool} sendIterimResults (optional) should interim results be sent to the callback or final results
 */
TB.registerTranscript = function (session, messageCallback, sendInterimResults) {

    if (!session) return;
    if (!sendInterimResults) sendInterimResults = false;
    
    // listen on the transcript channel to transcripts captured by session participants
    session.addEventListener("signal:transcript", function (event) {
        console.info("transcript signal sent from connection " + event.from.id + " " + event.data);
        if (!event) return;
        
        // invoke callback
        if (messageCallback)
            messageCallback(event.data, event.from.id);
    });
    
    // simple function to send all captured messages through the TB signal API
    var sendSignal = function(message, type) {
            session.signal({
                type: type,
                data: message,
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
    
    //test for feature
    var recognition = function () {
        if ('speechRecognition' in window) {
            return new speechRecognition();
        } else if ('msSpeechRecognition' in window) {
            return new msSpeechRecognition();
        } else if ('mozSpeechRecognition' in window) {
            return new mozSpeechRecognition();
        } else if ('webkitSpeechRecognition' in window  ) {
            return new webkitSpeechRecognition();
        } else return false;
    };

    // return if feature is not supported
    var speech = recognition();
    if (!speech) {
        if (onError)
            onError('This browser does not support speech recognition');
        return;
    }

    // speech recognition settings
    speech.continuous = true;
    speech.interimResults = true;

    speech.onerror = function (event) {
        if (onError)
            onError(event);
    }
    
    speech.onend = function () {
        speech.start();
    }

    var final_transcript = '';
    speech.start();

    speech.onresult = function (event) {
        var interim_transcript = '';

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else if (sendInterimResults) {
                sendSignal(event.results[i][0].transcript.toUpperCase(), "transcript");
            }
        }
        final_transcript = final_transcript.toUpperCase();
        if (!sendInterimResults)
            sendSignal(final_transcript, "transcript");
        final_transcript = '';
    }
}