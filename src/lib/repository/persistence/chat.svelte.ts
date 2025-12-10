import { SvelteMap } from "svelte/reactivity";
import { ChatController } from "../controllers/chat.controller";
import type {
  ChatManager,
  Message,
  QueryChats,
  ResponseListChat,
} from "../entitys/chat.dto";
import { randomString } from "$lib/utils";
import api from "../api";
import { isTauri } from "@tauri-apps/api/core";
import { onMount } from "svelte";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import signal from "$lib/global/signal.svelte";
import userSession from "./user.svelte";

//Controle em memoria dos chats
class ChatPersistence {
  chats = $state<SvelteMap<string, ChatManager>>(new SvelteMap());
  filters = $state<QueryChats>({
    page: 1,
    limit: 10,
  });
  controller = new ChatController();
  selectedChat = $state<string>("");
  openSide = $state(false);

  isCreatingChat = $state(false);

  derivedChatSelect = $derived.by(() => {
    if (!this.selectedChat) return;
    const chat = this.chats.get(this.selectedChat);
    return chat;
  });

  async list() {
    const response = await this.controller.list(this.filters);
    response.data.forEach((c) => {
      if (this.chats.has(c.id)) return;
      this.chats.set(c.id, {
        ...c,
        messages: [],
        pageFetched: 1,
        input: {
          message: "",
          sendingMessage: false,
        },
      });
    });
  }

  async delete(id: string) {
    this.controller.delete(id);
    this.chats.delete(id);
  }

  async listMessages(chatID: string, page: number) {
    const response = await this.controller.getMessages(chatID, {
      limit: 10,
      page,
    });

    const chatData = this.chats.get(chatID);
    if (!chatData) return;

    response.data.forEach((m) => {
      this.addMessageInMapChat(chatID, m);
    });
  }

  async createChat() {
    this.isCreatingChat = true;
    const title = " New chat";
    const response = await this.controller.createChat(title);
    this.chats.set(response.id, {
      createdAt: new Date().toString(),
      id: response.id,
      title: "New Chat",
      userId: userSession.info?.id ?? "",
      messages: [],
      pageFetched: 1,
      input: {
        message: "",
        sendingMessage: false,
      },
    });
    this.select(response.id);
    this.isCreatingChat = false;
  }

  async sendMessage(chatID: string) {
    let chatData = this.chats.get(chatID);
    if (!chatData) return;
    this.chats.set(chatID, {
      ...chatData,
      input: {
        ...chatData.input,
        sendingMessage: true,
      },
    });

    this.setLoading(chatID, true);

    const mockHumanID = randomString(12);
    const mockIAID = randomString(12);

    this.addMessageInMapChat(chatID, {
      id: mockHumanID,
      assistant: false,
      content: chatData.input.message,
      createdAt: new Date().toISOString(),
      chatId: chatID,
      mocked: true,
      links: [],
    });
    this.addMessageInMapChat(chatID, {
      id: mockIAID,
      assistant: true,
      content: "",
      createdAt: new Date().toISOString(),
      chatId: chatID,
      mocked: true,
      links: [],
    });

    let alreadyProcessedLength = 0;

    let accContent = "";

    let links: string[] = [];

    await api
      .post(
        `/chats/${chatID}/new-message`,
        {
          content: chatData.input.message,
        },
        {
          responseType: "stream",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          onDownloadProgress: (progressEvent) => {
            const xhr = progressEvent.event.target;
            const text = xhr.responseText;
            const newText = text.slice(alreadyProcessedLength);
            alreadyProcessedLength = text.length;

            if (!newText) return;
            // Processa apenas as linhas novas
            const lines = newText.split("\n");
            for (let i = 0; i < lines.length; i += 2) {
              if (lines[i].startsWith("data: ")) {
                const dataStr = lines[i].substring(6).trim();

                if (dataStr === "[DONE]" || dataStr.includes('"done":true')) {
                  this.replaceMessageInfo(chatID, mockIAID, {
                    id: mockIAID,
                    assistant: true,
                    content: accContent,
                    createdAt: new Date().toISOString(),
                    chatId: chatID,
                    mocked: false,
                    links: links,
                  });

                  if (isTauri()) {
                    isPermissionGranted().then((canNotify) => {
                      if (canNotify) {
                        sendNotification({
                          title: "Sua resposta foi computada",
                          body: accContent,
                        });
                      }
                    });
                  }

                  this.scrollTop();
                  return;
                }

                try {
                  const data = JSON.parse(dataStr);
                  links = data.links;

                  accContent += data.content;
                  this.replaceMessageInfo(chatID, mockIAID, {
                    id: mockIAID,
                    assistant: true,
                    content: accContent,
                    createdAt: new Date().toISOString(),
                    chatId: chatID,
                    mocked: true,
                    links: links,
                  });
                  this.scrollTop();
                } catch (e) {}
              }
            }
          },
        }
      )
      .catch((err) => {
        if (err.statusCode === 401) {
          signal.sendSignal("spawnAdvice", {
            title: "Parece que atingiu seu limite com o chat",
            desc: "Tente novamente amanhã, e aprenda um pouco com o que vistes hoje comigo :D",
          });
          this.deleteMessageMemory(chatID, mockIAID);
          this.deleteMessageMemory(chatID, mockHumanID);
        }
      });

    this.setLoading(chatID, false);
    this.resetInput(chatID);
  }
  select(id: string) {
    this.selectedChat = id;
    this.openSide = false;
  }

  private resetInput(chatID: string) {
    const chatData = this.chats.get(chatID);
    if (!chatData) return;
    this.chats.set(chatID, {
      ...chatData,
      input: {
        message: "",
        sendingMessage: false,
      },
    });
  }

  private scrollTop() {
    const div = document.getElementById("message-container");
    if (!div) return;
    setTimeout(() => {
      div.scrollTo({
        behavior: "smooth",
        top: div.scrollHeight,
      });
    }, 500);
  }

  private setLoading(chatID: string, loading: boolean) {
    const chatData = this.chats.get(chatID);
    if (!chatData) return;
    this.chats.set(chatID, {
      ...chatData,
      input: {
        ...chatData.input,
        sendingMessage: loading,
      },
    });
  }

  private replaceMessageInfo(
    chatID: string,
    messageID: string,
    newMessageInfo: Message
  ) {
    const chatData = this.chats.get(chatID);
    if (!chatData) return;

    const messages = chatData.messages.map((m) => {
      if (m.id === messageID) {
        return newMessageInfo;
      }
      return m;
    });
    this.chats.set(chatID, {
      ...chatData,
      messages,
    });
  }

  private deleteMessageMemory(chatID: string, messageID: string) {
    const chatData = this.chats.get(chatID);
    if (!chatData) return;

    const messages = chatData.messages.filter((m) => m.id !== messageID);
    this.chats.set(chatID, {
      ...chatData,
      messages,
    });
  }

  private addMessageInMapChat(chatID: string, message: Message) {
    const chatData = this.chats.get(chatID);
    if (!chatData) return;

    const existingMessages: Message[] = Array.isArray(chatData.messages)
      ? chatData.messages
      : [];

    const allMessages = [...existingMessages, message].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    this.chats.set(chatID, {
      ...chatData,
      messages: allMessages,
    });
  }
}
const chatPersistence = new ChatPersistence();
export default chatPersistence;
