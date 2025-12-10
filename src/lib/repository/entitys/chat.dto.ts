import type { QueryPagination, ResponseList } from "./util.dto";

export type Chat = {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
};

export type Message = {
  id: string;
  createdAt: string;
  content: string;
  chatId: string;
  assistant: boolean; //IA or HUMAN
  mocked?: boolean; //IA: Representa o carregamento da mensagem. HUMAN: representa a mensagem dele mesmo
  links: string[];
};

export type ChatManager = Chat & {
  messages: Message[];
  pageFetched: number;
  input: {
    message: string;
    sendingMessage: boolean;
  };
};

export type ResponseListChat = ResponseList<Chat>;

export type ResponseListMessages = ResponseList<Message>;

export type QueryChats = QueryPagination;
