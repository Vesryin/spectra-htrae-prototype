import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, List, Send } from "lucide-react";
import { type Message, type WorldState } from "@shared/schema";

interface RightSidebarProps {
  messages: Message[];
  worldState: WorldState | null;
  onSendMessage: (content: string) => void;
}

export function RightSidebar({ messages, worldState, onSendMessage }: RightSidebarProps) {
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'spectra': return 'text-cyber-green';
      case 'player': return 'text-cyber-purple';
      case 'system': return 'text-cyber-orange';
      default: return 'text-cyber-blue';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'discovery': return 'border-cyber-green';
      case 'npc_arrival': return 'border-cyber-purple';
      case 'npc_action': return 'border-cyber-blue';
      case 'weather': return 'border-cyber-orange';
      default: return 'border-cyber-blue/50';
    }
  };

  return (
    <div className="w-1/4 bg-cyber-dark border-l border-cyber-blue/30 flex flex-col">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col p-4">
        <h2 className="font-cyber text-xl text-cyber-blue text-glow mb-3 flex items-center">
          <MessageSquare className="mr-2" />
          COMMUNICATION
        </h2>
        
        {/* Chat Messages */}
        <Card className="flex-1 border-cyber bg-cyber-light/10 rounded-lg p-3 mb-4 overflow-hidden">
          <ScrollArea className="h-full pr-2" data-testid="chat-messages">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-cyber-blue/50 py-8">
                  No messages yet. Say hello to Spectra!
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="p-2 rounded" data-testid={`message-${message.id}`}>
                    <div className="flex items-center mb-1 justify-between">
                      <span className={`font-bold text-sm ${getSenderColor(message.sender)}`}>
                        {message.sender === 'spectra' ? 'Spectra' : 
                         message.sender === 'player' ? 'You' : 
                         'System'}
                      </span>
                      <span className="text-xs text-cyber-blue/50">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm text-cyber-blue/90">
                      {message.content}
                    </div>
                    {message.messageType !== 'chat' && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {message.messageType}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Message Spectra..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-cyber-darker border-cyber-blue/30 text-cyber-blue placeholder-cyber-blue/50 focus:border-cyber-blue"
            data-testid="input-message"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-cyber-blue/20 hover:bg-cyber-blue/30 border border-cyber-blue"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Events Log */}
      <div className="border-t border-cyber-blue/30 p-4">
        <h3 className="font-cyber text-lg text-cyber-orange text-glow mb-3 flex items-center">
          <List className="mr-2" />
          WORLD EVENTS
        </h3>
        <ScrollArea className="max-h-48" data-testid="world-events">
          <div className="space-y-2">
            {worldState?.globalEvents.length === 0 ? (
              <div className="text-xs text-cyber-blue/50 text-center py-4">
                No recent events
              </div>
            ) : (
              worldState?.globalEvents.map((event) => (
                <div
                  key={event.id}
                  className={`text-xs p-2 bg-cyber-light/10 rounded border-l-2 ${getEventTypeColor(event.type)}`}
                  data-testid={`event-${event.id}`}
                >
                  <div className="text-cyber-orange font-bold mb-1">
                    {event.timestamp}
                  </div>
                  <div className="text-cyber-blue/80">
                    {event.description}
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {event.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
