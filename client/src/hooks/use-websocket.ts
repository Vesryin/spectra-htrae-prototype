import { useState, useEffect, useRef } from 'react';
import { type Spectra, type WorldState, type Location, type NPC, type Message } from '@shared/schema';

export interface WorldData {
  spectra: Spectra | null;
  worldState: WorldState | null;
  currentLocation: Location | null;
  npcsInLocation: NPC[];
  locations: Location[];
  messages: Message[];
}

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [worldData, setWorldData] = useState<WorldData>({
    spectra: null,
    worldState: null,
    currentLocation: null,
    npcsInLocation: [],
    locations: [],
    messages: [],
  });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/simulation`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      
      // Join as a player
      ws.send(JSON.stringify({
        type: 'player_join',
        data: { name: 'Player' }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleMessage = (message: any) => {
    switch (message.type) {
      case 'world_update':
        setWorldData(message.data);
        break;
      case 'messages_update':
        setWorldData(prev => ({
          ...prev,
          messages: message.data.messages
        }));
        break;
      case 'error':
        console.error('WebSocket error:', message.data.message);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const sendMessage = (content: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        data: { content }
      }));
    }
  };

  const requestWorldUpdate = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'request_world_update',
        data: {}
      }));
    }
  };

  return {
    connected,
    worldData,
    sendMessage,
    requestWorldUpdate,
  };
}
