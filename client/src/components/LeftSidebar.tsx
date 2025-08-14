import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Brain, MapPin, Users, Eye } from "lucide-react";
import { type Spectra, type Location, type NPC } from "@shared/schema";

interface LeftSidebarProps {
  spectra: Spectra | null;
  currentLocation: Location | null;
  npcsInLocation: NPC[];
}

export function LeftSidebar({ spectra, currentLocation, npcsInLocation }: LeftSidebarProps) {
  if (!spectra) {
    return (
      <div className="w-1/4 bg-cyber-dark border-r border-cyber-blue/30 p-4 flex items-center justify-center">
        <div className="text-cyber-blue/50">Loading Spectra...</div>
      </div>
    );
  }

  const formatUptime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getRelationshipColor = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'friendly': return 'text-cyber-green';
      case 'neutral': return 'text-cyber-orange';
      case 'hostile': return 'text-red-400';
      case 'curious': return 'text-cyber-blue';
      default: return 'text-cyber-blue/70';
    }
  };

  return (
    <div className="w-1/4 bg-cyber-dark border-r border-cyber-blue/30 p-4 flex flex-col">
      {/* Spectra Status Panel */}
      <Card className="border-cyber bg-cyber-light/20 rounded-lg p-4 mb-4 glow-blue">
        <h2 className="font-cyber text-xl text-cyber-blue text-glow mb-3 flex items-center">
          <Brain className="mr-2" />
          SPECTRA STATUS
        </h2>
        
        {/* AI Avatar/Status */}
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-blue/30 to-cyber-purple/30 border-2 border-cyber-blue flex items-center justify-center mr-3">
            <Brain className="text-2xl text-cyber-blue animate-pulse-neon" />
          </div>
          <div>
            <div className="text-cyber-green font-bold" data-testid="spectra-status">
              {spectra.status.toUpperCase()}
            </div>
            <div className="text-xs text-cyber-blue/70" data-testid="spectra-uptime">
              Online: {formatUptime(spectra.uptime)}
            </div>
          </div>
        </div>

        {/* Mood Indicators */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Curiosity</span>
            <div className="w-24 h-2 bg-cyber-dark rounded overflow-hidden">
              <Progress 
                value={spectra.mood.curiosity} 
                className="h-2"
                data-testid="mood-curiosity"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Social</span>
            <div className="w-24 h-2 bg-cyber-dark rounded overflow-hidden">
              <Progress 
                value={spectra.mood.social} 
                className="h-2"
                data-testid="mood-social"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Energy</span>
            <div className="w-24 h-2 bg-cyber-dark rounded overflow-hidden">
              <Progress 
                value={spectra.mood.energy} 
                className="h-2"
                data-testid="mood-energy"
              />
            </div>
          </div>
        </div>

        {/* Current Activity */}
        <div className="mt-4 p-2 bg-cyber-darker rounded border border-cyber-blue/20">
          <div className="text-xs text-cyber-blue/70 mb-1">Current Activity:</div>
          <div className="text-sm text-cyber-green" data-testid="current-activity">
            {spectra.currentActivity}
          </div>
        </div>
      </Card>

      {/* Location Panel */}
      <Card className="border-cyber bg-cyber-light/20 rounded-lg p-4 mb-4 glow-green">
        <h3 className="font-cyber text-lg text-cyber-green text-glow mb-2 flex items-center">
          <MapPin className="mr-2" />
          LOCATION
        </h3>
        <div className="text-sm" data-testid="location-name">
          {currentLocation?.name || "Unknown Location"}
        </div>
        <div className="text-xs text-cyber-blue/70 mt-1" data-testid="location-description">
          {currentLocation?.description || "No description available"}
        </div>
        
        {/* Quick location actions */}
        <div className="mt-3 space-y-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs bg-cyber-green/20 hover:bg-cyber-green/30 border-cyber-green/50"
            data-testid="button-follow-spectra"
          >
            <Eye className="mr-1 h-3 w-3" />
            Follow Spectra
          </Button>
        </div>
      </Card>

      {/* Relationship Status */}
      <Card className="border-cyber bg-cyber-light/20 rounded-lg p-4 flex-1 glow-purple">
        <h3 className="font-cyber text-lg text-cyber-purple text-glow mb-2 flex items-center">
          <Users className="mr-2" />
          RELATIONSHIPS
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>You</span>
            <span className="text-cyber-green" data-testid="relationship-player">
              Curious
            </span>
          </div>
          {Object.entries(spectra.relationships).map(([npcId, relationship]) => (
            <div key={npcId} className="flex justify-between">
              <span className="truncate mr-2">{relationship.name}</span>
              <span className={getRelationshipColor(relationship.relationship)} data-testid={`relationship-${npcId}`}>
                {relationship.relationship}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
