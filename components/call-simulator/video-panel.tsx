"use client";

import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Mic, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudioVisualizer } from "./audio-visualizer"; // Import sibling component

interface VideoPanelProps {
  name: string;
  image?: string | null;
  isUser?: boolean;
  isMainView: boolean;
  stream?: MediaStream | null;
  isMicActive?: boolean;
  onClick?: () => void;
  isSpeaking?: boolean;
}

export const VideoPanel = ({ 
  name, 
  image, 
  isUser, 
  isMainView, 
  stream,
  isMicActive,
  onClick,
  isSpeaking
}: VideoPanelProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    } else if (videoRef.current) {
       videoRef.current.srcObject = null;
    }
  }, [stream]);

  return (
    <Card 
      className={cn(
        "bg-card text-card-foreground rounded-lg overflow-hidden flex items-center justify-center relative shadow-md transition-all duration-300 ease-in-out",
        isMainView ? "w-full h-full aspect-video" : "w-1/4 max-w-[200px] min-w-[100px] aspect-video cursor-pointer hover:ring-2 hover:ring-primary",
        !isMainView && "border-2 border-background/70",
        isSpeaking && "ring-2 ring-offset-2 ring-offset-background ring-green-500"
      )}
      onClick={!isMainView ? onClick : undefined}
    >
      {stream && (
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted={isUser} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {!stream && (
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/50 flex items-center justify-center">
            <Avatar className={cn(
              "border-2 border-background/50",
              isMainView ? "w-20 h-20 sm:w-28 sm:h-28" : "w-10 h-10 sm:w-12 sm:h-12"
            )}>
              <AvatarImage src={image ?? undefined} alt={name} className="object-cover" />
              <AvatarFallback className={cn(isMainView ? "text-3xl sm:text-5xl" : "text-lg sm:text-xl")}>
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
      )}
      {/* Name Tag and Mic Indicator Overlay */}
      <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 z-10 flex items-center gap-1.5 bg-black/60 text-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md">
         {isUser && isMicActive && isMainView && stream && <AudioVisualizer stream={stream} />} 
         <p className={cn(
            "font-medium",
            isMainView ? "text-sm" : "text-[10px] sm:text-xs"
         )}>
           {name} {isUser && !isMainView ? "(You)" : ""}
         </p>
         {isUser && isMicActive && !isMainView && <Mic className="w-3 h-3 text-green-400" />} 
      </div>
      {/* Switch Icon Overlay */} 
      {!isMainView && (
          <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 z-10">
              <Repeat className="w-6 h-6 sm:w-6 sm:h-6 text-white" />
          </div>
      )}
    </Card>
  );
}; 