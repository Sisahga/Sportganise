/* eslint-disable @typescript-eslint/no-explicit-any */
import { Frame, Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { MessageComponent, SendMessageComponent } from "@/types/messaging.ts";
import { getBearerToken } from "@/services/apiHelper.ts";

export default class WebSocketService {
  private stompClient: Client | null = null;
  private url = import.meta.env.VITE_API_BASE_URL + "/ws";
  onMessageReceivedCallback: (message: MessageComponent) => void;

  constructor(onMessageReceivedCallback: (message: MessageComponent) => void) {
    this.onMessageReceivedCallback = onMessageReceivedCallback;
  }

  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(this.url),
        connectHeaders: {
          Authorization: getBearerToken(),
        },
        onConnect: () => {
          console.log("WebSocket Connected!");
          this.stompClient?.subscribe(
            "/directmessage/public",
            this.onMessageReceived,
          );
          resolve(true);
        },
        onStompError: (frame: Frame) => {
          this.onError(frame);
          resolve(false);
        },
      });

      this.stompClient.activate();
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient
        .deactivate()
        .then(() => console.log("WebSocket Deactivated!"));
    }
  }

  sendMessage(msgPayload: SendMessageComponent): Promise<MessageComponent> {
    return new Promise((resolve, reject) => {
      if (this.stompClient) {
        try {
          const subscription = this.stompClient.subscribe(
            "/directmessage/public",
            (payload) => {
              const message = JSON.parse(payload.body);
              if (
                message.senderId === msgPayload.senderId &&
                message.messageContent === msgPayload.messageContent &&
                message.sentAt === msgPayload.sentAt
              ) {
                subscription.unsubscribe();
                resolve(message);
              }
            },
          );

          this.stompClient.publish({
            destination: "/app/chat.send-message",
            body: JSON.stringify(msgPayload),
          });
          console.log("Message sent successfully");
        } catch (error) {
          console.error("Error sending message:", error);
          reject(error);
        }
      } else {
        console.error("WebSocket not connected");
        reject("WebSocket not connected");
      }
    });
  }

  private onMessageReceived = (payload: any) => {
    console.log("Message received:", payload);
    const message: MessageComponent = JSON.parse(payload.body);
    this.onMessageReceivedCallback(message);
  };

  private onError(error: any) {
    console.error("Error connecting to WebSocket:", error);
    return false;
  }
}
