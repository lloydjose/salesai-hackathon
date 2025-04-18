"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';
import { generateSystemPrompt } from '@/lib/ai/utils'; 
import { PersonaDetails } from '@/lib/ai/types'; 
import { useSession } from '@/lib/auth-client';

export function useVapiController(
    simulationId: string | null, 
    personaDetails: PersonaDetails | null, 
) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatusMessage, setCallStatusMessage] = useState("Initializing...");
  const [transcript, setTranscript] = useState<any[]>([]); // State for re-rendering UI if needed
  const transcriptRef = useRef<any[]>([]); // Ref to hold latest transcript data for saving
  const [vapiError, setVapiError] = useState<string | null>(null);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const vapiRef = useRef<Vapi | null>(null);
  const isSavingRef = useRef(false); 
  const elapsedTimeRef = useRef(0); 
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); 
  const [displayElapsedTime, setDisplayElapsedTime] = useState(0);

  // Ref to prevent multiple saves on call end
  const callEndHandledRef = useRef<boolean>(false);

  // Initialize VAPI and Setup Listeners
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!key) {
      console.error("[useVapi] VAPI Public Key missing.");
      setVapiError("VAPI configuration error.");
      setCallStatusMessage("Config Error");
      return;
    }
    if (vapiRef.current) return; // Prevent re-initialization

    console.log("[useVapi] Initializing VAPI SDK");
    const vapiInstance = new Vapi(key);
    vapiRef.current = vapiInstance;
    setCallStatusMessage("Ready");

    const onCallStart = () => {
       console.log("[useVapi] Event: call-start");
      setCallStatusMessage("Call connected");
      setIsCallActive(true);
      setVapiError(null);
      setIsAssistantSpeaking(false);
      elapsedTimeRef.current = 0; // Reset elapsed time ref
      setDisplayElapsedTime(0); // Reset display timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
           elapsedTimeRef.current += 1;
           setDisplayElapsedTime(t => t + 1);
       }, 1000);
       // No VAPI mute state needed here now
    };

    const onCallEnd = () => {
      console.log("[useVapi] Event: call-end");
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsCallActive(false); 
      setCallStatusMessage("Call ended");
      setIsAssistantSpeaking(false);
      // Trigger save AFTER state updates settle
      setTimeout(() => saveSimulationResults(elapsedTimeRef.current), 0); 
    };
    
     const onSpeechStart = () => { 
         console.log("[useVapi] Event: speech-start");
         setCallStatusMessage("Prospect speaking..."); 
         setIsAssistantSpeaking(true);
     };
     const onSpeechEnd = () => { 
         console.log("[useVapi] Event: speech-end");
         setCallStatusMessage("Call connected"); 
         setIsAssistantSpeaking(false);
     };
     const onVolumeLevel = (level: number) => { /* Handle volume if needed */ };
    
     const onMessage = (message: any) => {
       console.log('[useVapi] Event: message', message);
       if (message.type === 'transcript' && message.transcriptType === 'final') {
         // Update state for potential UI display
         setTranscript((prev) => [...prev, message]); 
         // Also update the ref to ensure the save function gets the latest data
         transcriptRef.current = [...transcriptRef.current, message];
       }
     };

     const onError = (e: any) => {
       console.error("[useVapi] Event: error", e);
       const message = `Call error: ${e?.message || 'Unknown VAPI error'}`;
       setVapiError(message);
       toast.error(message);
       if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
       setIsCallActive(false);
       setIsAssistantSpeaking(false);
       setCallStatusMessage("Call Failed");
     };

     vapiRef.current?.on("call-start", onCallStart);
     vapiRef.current?.on("call-end", onCallEnd);
     vapiRef.current?.on("speech-start", onSpeechStart);
     vapiRef.current?.on("speech-end", onSpeechEnd);
     vapiRef.current?.on("volume-level", onVolumeLevel);
     vapiRef.current?.on("message", onMessage);
     vapiRef.current?.on("error", onError);

    return () => {
      console.log("[useVapi] Cleaning up VAPI listeners");
      vapiRef.current?.removeAllListeners();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Save Results Function
   const saveSimulationResults = useCallback(async (finalDuration: number) => {
        const finalTranscript = transcriptRef.current; 
        let saveSuccess = false; // Flag to track success

       if (!simulationId || isSavingRef.current) {
          console.warn("[useVapi] Save aborted. No simulation ID or already saving.");
          return;
      }
      isSavingRef.current = true;
      
      console.log("[useVapi] Saving simulation results:", { duration: finalDuration, transcriptLength: finalTranscript.length });
      setCallStatusMessage("Saving results...");

      try {
           const response = await fetch(`/api/simulations/${simulationId}`, {
               method: 'PATCH',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                   duration: finalDuration,
                   transcript: finalTranscript,
                   callStatus: 'COMPLETED',
               }),
           });

           if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
               throw new Error(errorData.message || `Failed to save results (${response.status})`);
           }
           toast.success("Simulation results saved.");
           setCallStatusMessage("Results saved");
           saveSuccess = true; // Mark save as successful
           setTranscript([]); 
           transcriptRef.current = []; 

      } catch (err) {
           console.error("[useVapi] Failed to save simulation results:", err);
           const message = `Error saving results: ${err instanceof Error ? err.message : 'Unknown error'}`;
           toast.error(message);
           setVapiError(message);
           setCallStatusMessage("Save failed");
           // Keep transcript data if save fails? Maybe not clear state here.
           // setTranscript([]); 
           // transcriptRef.current = []; 
      } finally {
          isSavingRef.current = false;
          // Redirect ONLY if save was successful
          if (saveSuccess && simulationId) {
              console.log("[useVapi] Save successful, redirecting to feedback...");
              router.push(`/dashboard/realtime-simulator/${simulationId}/feedback`);
          } else if (simulationId) {
              console.log("[useVapi] Save failed, not redirecting.");
              // Optionally redirect to a generic error page or back to simulator?
              // For now, we stay on the simulator page if save fails.
          }
      }
   }, [simulationId, router]);

  // Call Control Handlers
  const handleToggleCall = useCallback(async () => {
    const vapi = vapiRef.current;
    if (!vapi) return toast.error("VAPI not initialized.");

    if (isCallActive) {
      // This part is now triggered by the AlertDialog confirmation
      console.log("[useVapi] AlertDialog confirmed stop call");
      setCallStatusMessage("Ending call...");
      vapi.stop(); // Only stop the call here
      // Saving and redirecting is handled by onCallEnd -> saveSimulationResults
    } else {
       // Start Call Logic (remains the same)
      if (!personaDetails) return toast.error("Persona details not loaded.");
      
      console.log("[useVapi] Starting call sequence. Vapi will request mic permissions.");
      setCallStatusMessage("Connecting call...");
      // Reset transcript state and ref when starting a new call
      setTranscript([]); 
      transcriptRef.current = [];
      setVapiError(null);
      elapsedTimeRef.current = 0;
      setDisplayElapsedTime(0);

      // ... determine firstMessage ...
      let firstMessage = "";
      switch (personaDetails.arroganceLevel) {
        case 'Low': firstMessage = "Hello?"; break;
        case 'Medium': firstMessage = `Hello, this is ${personaDetails.prospectName}.`; break;
        case 'High': firstMessage = `${personaDetails.prospectName}.`; break;
        default: firstMessage = "Yes?"; break;
      }

      // ... generate system prompt ...
      console.log("[useVapi] Persona Details for prompt:", personaDetails);
      const systemPrompt = generateSystemPrompt(personaDetails);
      console.log("[useVapi] Generated System Prompt:", systemPrompt);

      // Define the config inline, letting TS infer where possible but specifying literals
      const assistantConfig = {
         transcriber: { provider: "deepgram" as const, model: "nova-2", language: "en-US" },
         model: { provider: "openai" as const, model: "gpt-4o-mini", messages: [{ role: "system" as const, content: systemPrompt }] },
         voice: { provider: "playht" as const, voiceId: "jennifer" },
         firstMessage: firstMessage, 
         clientMessages: ["transcript" as const], 
         recordingEnabled: true,
      };
      console.log("[useVapi] Starting VAPI with config:", assistantConfig);
      // Type assertion might be needed if inference isn't enough
      vapi.start(assistantConfig as any); // Use 'as any' as a temporary workaround if needed
    }
  }, [isCallActive, personaDetails, vapiRef]); // vapiRef added if needed

  return {
    isCallActive,
    callStatusMessage,
    transcript, // Still return for potential UI display
    vapiError,
    isAssistantSpeaking,
    displayElapsedTime,
    handleToggleCall, // Keep exposing this for the dialog action
  };
} 