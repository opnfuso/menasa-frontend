export interface ReceiveMessage {
  userId: string;
  content: string;
  isImage: boolean;
}

export interface SendMessage {
  token: string;
  content: string;
  isImage: boolean;
}
