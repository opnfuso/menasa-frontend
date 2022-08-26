import type { User } from "./user.interface";

export interface ReceiveMessage {
  content: string;
  isImage: boolean;
  userId: string;
  user: User;
}

export interface SendMessage {
  token: string;
  content: string;
  isImage: boolean;
}
