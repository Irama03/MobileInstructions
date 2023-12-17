'use client'
import {Commands} from "@/types";
import React, {createContext, useState} from "react";
import Animation from "@/components/Animation";
import VoiceRecognition from "@/components/VoiceRecognition/VoiceRecognition";
import { usePathname, useRouter } from "next/navigation";

export const ActionContext = createContext<any>(null);

const adminRoutes = ['/sign-in', '/admin']
type CharacterState = 'Explain' | 'Hello' | 'Listen'

const App = ({children}: {
    children: React.ReactNode
}) => {
    const [action, setAction] = useState({
        command: Commands.DO_NOTHING,
        argument: null,
        characterState: 'Hello'
    });
    const router = useRouter();
    const pathname = usePathname();
    console.log(pathname)

    return (
        <ActionContext.Provider value={{action, setAction}}>
            {children}
            {!adminRoutes.includes(pathname) && <>
                <VoiceRecognition />
                <Animation />
            </>}
        </ActionContext.Provider>
    );
}

export default App;
