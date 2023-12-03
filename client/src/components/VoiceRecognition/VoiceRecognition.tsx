'use client'
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Mic from "@mui/icons-material/Mic";
import MicNone from "@mui/icons-material/MicNone";
import {IconButton} from "@mui/material";
import './VoiceRecognition.css';

const VoiceRecognition = () => {

    const commands = [
        {
            command: 'Мене звати *',
            callback: (name) => console.log(`Вас звати: ${name}`),
            matchInterim: true
        },
        {
            command: ['Починай', 'Почни', 'Розпочинай', 'Розпочни', 'Читай'],
            callback: ({ command }) => console.log(`Ви дали команду: "${command}"`),
            matchInterim: true
        },
    ]

    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    if (!browserSupportsSpeechRecognition) {
        return <span>Ваш браузер не підтримує розпізнавання голосу</span>;
    }

    const startListeningUkr = () => {
        return SpeechRecognition.startListening({
            continuous: true,
            language: 'uk-UA'
        });
    }

    return (
        <div className="justify-end">
            <IconButton onClick={() => listening ? SpeechRecognition.stopListening() : startListeningUkr()}>
                {listening ? <Mic fontSize="large" /> : <MicNone fontSize="large" />}
            </IconButton>
            <p>{transcript}</p>
        </div>
    );
}

export default VoiceRecognition;
