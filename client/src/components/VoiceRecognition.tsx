'use client'
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceRecognition = () => {

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser does not support speech recognition.</span>;
    }

    const startListeningUkr = () => {
        return SpeechRecognition.startListening({ language: 'uk-UA' });
    }

    return (
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={startListeningUkr}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
        </div>
    );
}

export default VoiceRecognition;
