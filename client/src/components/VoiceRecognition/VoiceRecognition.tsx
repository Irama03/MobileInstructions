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

    const {action, setAction} = useContext(ActionContext);

    const processCommand = (command, argument = null) => {
        console.log(`Ви дали команду: "${command}"` +
            (argument ? ' з аргументом - ' + argument : ''));
        setAction(prev => ({ ...prev, command, argument}));
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
        {
            command: ['Очистити фільтр', 'Очистити фільтри', 'Очистити фільтрацію'],
            callback: () => processCommand(Commands.CLEAR_FILTER),
            matchInterim: true
        },
        {
            command: ['Фільтрація за :criterion', 'Фільтр за :criterion'],
            callback: (criterion) => processCommand(Commands.FILTER, criterion),
            matchInterim: true
        },
        {
            command: ['Фільтрація.', 'Фільтр.', /*'Фільтрація *', 'Фільтр *'*/],
            callback: () => processCommand(Commands.FILTER, ''),
            matchInterim: true
        },
        {
            command: 'За девайсом',
            callback: () => {
                if (action.command === Commands.WAIT_FOR_FILTER_TYPE_REPLAY)
                    processCommand(Commands.FILTER, 'девайсом')
                else console.log('Ignoring за девайсом. Команда: ' + action.command);
            },
            matchInterim: true
        },
        {
            command: 'За категорією',
            callback: () => {
                if (action.command === Commands.WAIT_FOR_FILTER_TYPE_REPLAY)
                    processCommand(Commands.FILTER, 'категорією')
                else console.log('Ignoring за категорією. Команда: ' + action.command);
            },
            matchInterim: true
        },
        {
            command: 'Девайс *',
            callback: (device) => {
                if (action.command === Commands.WAIT_FOR_FILTER_BY_DEVICE_REPLAY)
                    processCommand(Commands.FILTER_BY_PARTICULAR_DEVICE, device)
                else console.log('Ignoring девайс ' + device + '. Команда: ' + action.command);
            },
            matchInterim: true
        },
        {
            command: 'Категорія *',
            callback: (category) => {
                if (action.command === Commands.WAIT_FOR_FILTER_BY_CATEGORY_REPLAY)
                    processCommand(Commands.FILTER_BY_PARTICULAR_CATEGORY, category)
                else console.log('Ignoring категорія ' + category + '. Команда: ' + action.command);
            },
            matchInterim: true
        },
        {
            command: ['Перейти на *', 'Перейди на *', 'Відкрити *', 'Відкрий *'],
            callback: (instruction) => processCommand(Commands.GO_TO_INSTRUCTION, instruction),
            matchInterim: true
        }
    ]

    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition,
        resetTranscript
    } = useSpeechRecognition({ commands });
    
    useEffect(() => {
            setAction(prev => ({...prev, characterState: listening ? 'Listen' : 'Hello'}));
    }, [listening])

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
