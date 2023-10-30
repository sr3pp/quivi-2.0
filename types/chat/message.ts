export interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}
