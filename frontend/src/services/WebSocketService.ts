/* eslint-disable @typescript-eslint/no-explicit-any */
import { Frame, Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { MessageComponent, SendMessageComponent } from "@/types/messaging.ts";

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

  sendMessage(msgPayload: SendMessageComponent) {
    if (this.stompClient) {
      try {
        this.stompClient.publish({
          destination: "/app/chat.send-message",
          body: JSON.stringify(msgPayload),
        });
        console.log("Message sent successfully");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  }

  private onMessageReceived = (payload: any) => {
    console.log("Message received:", payload);
    const message = JSON.parse(payload.body);
    this.onMessageReceivedCallback(message);
  };

  private onError(error: any) {
    console.error("Error connecting to WebSocket:", error);
    return false;
  }
}
