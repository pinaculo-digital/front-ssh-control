import api from "../api";
import type {
  QueryChats,
  ResponseListChat,
  ResponseListMessages,
} from "../entitys/chat.dto";
import type { QueryPagination } from "../entitys/util.dto";

export class ChatController {
  async delete(id: string) {
    return await api.delete(`/chats/${id}/`);
  }
  async list(querys: QueryChats): Promise<ResponseListChat> {
    return await api.get("/chats/list-chats", {
      params: {
        ...querys,
      },
    });
  }
  async getMessages(
    chatID: string,
    querys: QueryPagination
  ): Promise<ResponseListMessages> {
    return await api.get(`/chats/${chatID}/list-messages`, {
      params: {
        ...querys,
      },
    });
  }

  async createChat(title: string): Promise<{ id: string }> {
    return await api.post(`/chats/new-chat`, {
      title,
    });
  }

  async sendMessage(
    chatID: string,
    content: string
  ): Promise<{
    idHuman: string;
    idIA: string;
    iaContent: string;
    links: string[];
  }> {
    return await api.post(`/chats/${chatID}/new-message`, {
      content,
    });
  }
}
