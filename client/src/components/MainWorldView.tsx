import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Search, Settings, Zap } from "lucide-react";
import { type Spectra, type WorldState, type Location, type NPC } from "@shared/schema";

interface MainWorldViewProps {
  spectra: Spectra | null;
  worldState: WorldState | null;
  currentLocation: Location | null;
  npcsInLocation: NPC[];
  onSendMessage: () => void;
}

export function MainWorldView({ 
  spectra, 
  worldState, 
  currentLocation, 
  npcsInLocation,
  onSendMessage 
}: MainWorldViewProps) {
  const getTimeOfDay = (time: string) => {
    const [hours] = time.split(':').map(Number);
    if (hours >= 6 && hours < 12) return "Morning";
    if (hours >= 12 && hours < 18) return "Afternoon";
    if (hours >= 18 && hours < 22) return "Evening";
    return "Night";
  };

  const getNPCTypeColor = (type: string) => {
    switch (type) {
      case 'dragon': return 'text-cyber-green';
      case 'human': return 'text-cyber-orange';
      case 'elf': return 'text-cyber-purple';
      case 'cyborg': return 'text-cyber-blue';
      default: return 'text-cyber-blue/70';
    }
  };

  const getNPCTypeIcon = (type: string) => {
    // Using simple text representations since we don't have specific icons
    switch (type) {
      case 'dragon': return '🐉';
      case 'human': return '👤';
      case 'elf': return '🧝';
      case 'cyborg': return '🤖';
      default: return '👤';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header Bar */}
      <div className="bg-cyber-dark border-b border-cyber-blue/30 p-4 flex justify-between items-center">
        <div>
          <h1 className="font-cyber text-2xl text-cyber-blue text-glow" data-testid="world-title">
            HTRAE SIMULATION
          </h1>
          <div className="text-sm text-cyber-green" data-testid="world-time">
            {worldState ? `Day ${worldState.currentDay}, ${worldState.currentTime} - ${getTimeOfDay(worldState.currentTime)}` : "Loading..."}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-cyber-green rounded-full mr-2 animate-pulse"></div>
            <span data-testid="simulation-status">
              {worldState?.simulationActive ? "Real-time Active" : "Simulation Paused"}
            </span>
          </div>
          <Button 
            variant="outline"
            className="bg-cyber-blue/20 hover:bg-cyber-blue/30 border-cyber-blue"
            data-testid="button-settings"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* World Description Area */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-cyber">
        {/* Current Scene */}
        <Card className="border-cyber bg-cyber-light/10 rounded-lg p-6 mb-6 glow-blue">
          <h2 className="font-cyber text-xl text-cyber-blue mb-4 flex items-center">
            <Eye className="mr-2" />
            CURRENT SCENE
          </h2>
          
          {/* Scene Image Placeholder */}
          <div className="w-full h-48 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-lg mb-4 border border-cyber-blue/30 flex items-center justify-center">
            <div className="text-center text-cyber-blue/70">
              <Zap className="h-16 w-16 mx-auto mb-2" />
              <div>Cyberpunk Marketplace Scene</div>
              <div className="text-xs">Real-time visualization</div>
            </div>
          </div>
          
          <div className="text-base leading-relaxed text-cyber-blue/90" data-testid="scene-description">
            {currentLocation ? (
              <>
                {currentLocation.description}
                <br /><br />
                {spectra && (
                  <>Spectra moves through this space with fluid grace, her digital presence manifesting as subtle glitches in nearby displays. The air shimmers with data streams visible only to those with enhanced perception.</>
                )}
              </>
            ) : (
              "Loading scene description..."
            )}
          </div>
        </Card>

        {/* NPCs in Scene */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {npcsInLocation.map((npc) => (
            <Card key={npc.id} className="border-cyber bg-cyber-light/10 rounded-lg p-4 glow-green">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">{getNPCTypeIcon(npc.type)}</span>
                <span className="font-bold text-cyber-green" data-testid={`npc-name-${npc.id}`}>
                  {npc.name}
                </span>
                <Badge 
                  variant="outline" 
                  className={`ml-auto text-xs ${getNPCTypeColor(npc.type)} border-current`}
                  data-testid={`npc-type-${npc.id}`}
                >
                  {npc.type}
                </Badge>
              </div>
              <div className="text-sm text-cyber-blue/90 mb-2" data-testid={`npc-action-${npc.id}`}>
                {npc.currentAction}
              </div>
              <div className="text-xs text-cyber-purple/70" data-testid={`npc-relationship-${npc.id}`}>
                Relationship: {npc.personality.relationshipToSpectra}
              </div>
            </Card>
          ))}
          
          {npcsInLocation.length === 0 && (
            <Card className="border-cyber bg-cyber-light/10 rounded-lg p-4 col-span-2">
              <div className="text-center text-cyber-blue/50">
                No NPCs currently in this location
              </div>
            </Card>
          )}
        </div>

        {/* Available Actions/Choices */}
        <Card className="border-cyber bg-cyber-light/10 rounded-lg p-4 glow-purple">
          <h3 className="font-cyber text-lg text-cyber-purple mb-3 flex items-center">
            <Search className="mr-2" />
            POSSIBLE ACTIONS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="p-3 bg-cyber-green/20 hover:bg-cyber-green/30 border-cyber-green/50 h-auto flex-col items-start"
              data-testid="button-observe"
            >
              <div className="font-bold text-cyber-green mb-1">Observe</div>
              <div className="text-xs text-cyber-blue/70">Watch Spectra's next move</div>
            </Button>
            
            <Button
              variant="outline"
              onClick={onSendMessage}
              className="p-3 bg-cyber-blue/20 hover:bg-cyber-blue/30 border-cyber-blue/50 h-auto flex-col items-start"
              data-testid="button-message"
            >
              <div className="font-bold text-cyber-blue mb-1 flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                Message
              </div>
              <div className="text-xs text-cyber-blue/70">Send a message to Spectra</div>
            </Button>
            
            <Button
              variant="outline"
              className="p-3 bg-cyber-purple/20 hover:bg-cyber-purple/30 border-cyber-purple/50 h-auto flex-col items-start"
              data-testid="button-explore"
            >
              <div className="font-bold text-cyber-purple mb-1">Explore</div>
              <div className="text-xs text-cyber-blue/70">Examine the environment</div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
