"use client";

import { VideoPanel } from "./video-panel";

// Define participant structure for clarity
interface Participant {
    name: string | null;
    image?: string | null;
}

interface SimulationViewProps {
    user: Participant;
    prospect: Participant;
    mainView: "user" | "prospect";
    handleSwitchView: () => void;
    callStatusMessage: string;
    isAssistantSpeaking: boolean;
}

export const SimulationView = ({
    user,
    prospect,
    mainView,
    handleSwitchView,
    callStatusMessage,
    isAssistantSpeaking
}: SimulationViewProps) => {

    const mainParticipant = mainView === "user" ? user : prospect;
    const cornerParticipant = mainView === "user" ? prospect : user;
    const isUserInMain = mainView === "user";

    return (
        <div className="relative flex-grow bg-muted/30 overflow-hidden">
            {/* Status Message */} 
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
                <div className="text-xs sm:text-sm font-medium bg-black/60 text-white px-2 py-1 rounded shadow-lg">
                    {callStatusMessage}
                </div>
            </div>

            {/* Main View Area */} 
            <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2">
                <VideoPanel 
                    name={mainParticipant.name || (isUserInMain ? 'User' : 'Prospect')}
                    image={isUserInMain ? mainParticipant.image : undefined} 
                    isUser={isUserInMain}
                    isMainView={true}
                    isSpeaking={isAssistantSpeaking && !isUserInMain}
                />
            </div>
            
            {/* Corner View Area */} 
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10">
                <VideoPanel 
                    name={cornerParticipant.name || (!isUserInMain ? 'User' : 'Prospect')}
                    image={!isUserInMain ? cornerParticipant.image : undefined} 
                    isUser={!isUserInMain}
                    isMainView={false}
                    onClick={handleSwitchView}
                    isSpeaking={isAssistantSpeaking && isUserInMain}
                />
            </div>
        </div>
    );
}; 