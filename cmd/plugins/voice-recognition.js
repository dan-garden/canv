new Canv('canvas', {
    setup() {
        window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        let recognition = new window.SpeechRecognition();
        recognition.interimResults = true;
        recognition.maxAlternatives = 10;
        recognition.continuous = true;
        recognition.onresult = (event) => {
            for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
                let transcript = event.results[i][0].transcript.toLowerCase().trim();
                if (event.results[i].isFinal) {
                    cmd.lines[cmd.lines.length - 1].text = cmd.prefix + transcript;
                    cmd.run(transcript);
                } else {

                }
            }
        }
        recognition.start();
    }
})