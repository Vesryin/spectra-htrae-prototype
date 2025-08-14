import { useState, useRef } from "react";
import { LeftSidebar } from "@/components/LeftSidebar";
import { MainWorldView } from "@/components/MainWorldView";
import { RightSidebar } from "@/components/RightSidebar";
import { useWebSocket } from "@/hooks/use-websocket";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export default function Simulation() {
  const { connected, worldData, sendMessage } = useWebSocket();
  const [showMessageInput, setShowMessageInput] = useState(false);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (content?: string) => {
    if (content) {
      sendMessage(content);
    } else {
      setShowMessageInput(true);
      // Focus the input in the RightSidebar
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-cyber-darker bg-cyber-grid flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-16 w-16 text-cyber-blue mx-auto mb-4 animate-pulse" />
          <div className="text-cyber-blue text-xl font-cyber">
            Connecting to Htrae...
          </div>
          <div className="text-cyber-blue/70 text-sm mt-2">
            Establishing neural link with Spectra
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-darker font-mono text-cyber-blue min-h-screen bg-cyber-grid overflow-hidden">
      <div className="flex h-screen">
        <LeftSidebar
          spectra={worldData.spectra}
          currentLocation={worldData.currentLocation}
          npcsInLocation={worldData.npcsInLocation}
        />
        
        <MainWorldView
          spectra={worldData.spectra}
          worldState={worldData.worldState}
          currentLocation={worldData.currentLocation}
          npcsInLocation={worldData.npcsInLocation}
          onSendMessage={() => handleSendMessage()}
        />
        
        <RightSidebar
          messages={worldData.messages}
          worldState={worldData.worldState}
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* Status indicator overlay */}
      <div className="fixed top-4 right-4 flex items-center space-x-2 bg-cyber-dark/80 border border-cyber-green/50 rounded-lg px-3 py-2 glow-green">
        <div className={`w-2 h-2 rounded-full animate-pulse ${connected ? 'bg-cyber-green' : 'bg-red-500'}`}></div>
        <Badge variant="outline" className="text-cyber-green border-cyber-green font-mono text-sm">
          {connected ? 'SIMULATION ACTIVE' : 'DISCONNECTED'}
        </Badge>
      </div>
    </div>
  );
}
