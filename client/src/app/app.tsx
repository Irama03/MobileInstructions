'use client'
import {Commands} from "@/types";
import React, {createContext, useState} from "react";
import Animation from "@/components/Animation";
import VoiceRecognition from "@/components/VoiceRecognition/VoiceRecognition";

export const ActionContext = createContext<any>(null);

const App = ({children}: {
    children: React.ReactNode
}) => {
    const [action, setAction] = useState({
        command: Commands.DO_NOTHING,
        argument: null
    });

    return (
        <ActionContext.Provider value={{action, setAction}}>
            {children}
            <VoiceRecognition />
            <Animation />
        </ActionContext.Provider>
    );
}

export default App;
