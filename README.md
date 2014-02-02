####OpenTok Extensions

This repository is a playground for two extensions for the OpenTok JS client API:

1. [TB_transcript.js](https://github.com/stsmedia/opentok-extensions/blob/master/public/TB_highlight_speaker.js) - a small extension which leverages the speech recognition API and the TB signal API to keep synchronized video chat transcripts.
2. [TB_highlight_speaker.js](https://github.com/stsmedia/opentok-extensions/blob/master/public/TB_transcript.js) - another small extension which highlights the window of the current speaker in a TB session.

####Sample application
The sample application requires node.js and npm and is configured to run on port 8000. Steps to get going:

1. edit server.js and enter your TB API key and secret
2. run npm to download node dependencies ```npm install ```
3. run node to start the server ```node server.js ```
4. navigate to [localhost port 8000](http:\\localhost:8000) and accept the video cam / microphone sharing requests
