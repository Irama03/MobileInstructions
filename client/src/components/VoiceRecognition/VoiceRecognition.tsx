'use client'
import 'regenerator-runtime/runtime';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import Mic from "@mui/icons-material/Mic";
import MicNone from "@mui/icons-material/MicNone";
import {IconButton} from "@mui/material";
import './VoiceRecognition.css';
import {useContext, useEffect} from "react";
import {Commands} from "@/types";
import {ActionContext} from "@/app/app";

const VoiceRecognition = () => {

    const {setAction} = useContext(ActionContext);

    const processCommand = (command) => {
        console.log(`Ви дали команду: "${command}"`);
        setAction({command: command});
        resetTranscript();
    }

    const commands = [
        {
            command: ['Старт', 'Починай', 'Почни', 'Розпочинай', 'Розпочни', 'Читай'],
            callback: () => processCommand(Commands.START_READ_STEP),
            matchInterim: true
        },
        {
            command: ['Стоп', 'Пауза', 'Зупинись', 'Почекай', 'Припини'],
            callback: () => processCommand(Commands.STOP_READ_STEP),
            matchInterim: true
        },
        {
            command: ['Повтори', 'Повтор', 'Ще раз'],
            callback: () => processCommand(Commands.REPEAT_READ_STEP),
            matchInterim: true
        },
        {
            command: ['Готово', 'Виконано', 'Виконав', 'Виконала', 'Є', 'Так',
                'Зроблено', 'Зробив', 'Зробила'],
            callback: () => processCommand(Commands.STEP_IS_DONE),
            matchInterim: true
        },
    ]

    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition,
        resetTranscript
    } = useSpeechRecognition({ commands });

    useEffect(() => {
        if (transcript !== '') {
            console.log(transcript)
        }
    }, [transcript]);

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
        </div>
    );
}

export default VoiceRecognition;
