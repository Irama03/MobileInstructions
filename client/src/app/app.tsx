'use client'
import {Commands} from "@/types";
import React, {createContext} from "react";
import Animation from "@/components/Animation";
import VoiceRecognition from "@/components/VoiceRecognition/VoiceRecognition";

const action = {
    command: Commands.DO_NOTHING
};

export const ActionContext = createContext(action);

const App = ({children}: {
    children: React.ReactNode
}) => {
    return (
        <ActionContext.Provider value={action}>
            {children}
            <VoiceRecognition />
            <Animation />
        </ActionContext.Provider>
    );
}

export default App;
