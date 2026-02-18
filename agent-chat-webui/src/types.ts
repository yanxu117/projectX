export interface Agent {
  id: string;
  sessionKey: string;
  name: string;
  emoji: string;
  role: string;
  online: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

export interface WebSocketMessage {
  type: string;
  method?: string;
  params?: any;
  result?: any;
  error?: any;
}
