/* eslint-disable @typescript-eslint/no-explicit-any */
import { Frame, Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { MessageComponent, SendMessageComponent } from "@/types/messaging.ts";
import { getBearerToken } from "@/services/apiHelper.ts";

export default class WebSocketService {
  private stompClient: Client | null = null;
  private url = import.meta.env.VITE_API_BASE_URL + "/ws";
  onMessageReceivedCallback: (message: MessageComponent) => void;
  private activeSubscriptions: Map<number, StompSubscription> = new Map();

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

  subscribeToConversation(channelId: number): void {
    if (this.stompClient && this.stompClient.connected) {
      // Unsubscribe if already subscribed
      if (this.activeSubscriptions.has(channelId)) {
        return;
      }

      const subscription = this.stompClient.subscribe(
        `/directmessage/${channelId}`,
        this.onMessageReceived,
      );

      this.activeSubscriptions.set(channelId, subscription);
      console.log(`Subscribed to conversation: ${channelId}`);
    } else {
      console.error("WebSocket not connected");
    }
  }

  unsubscribeFromConversation(channelId: number): void {
    const subscription = this.activeSubscriptions.get(channelId);
    if (subscription) {
      subscription.unsubscribe();
      this.activeSubscriptions.delete(channelId);
      console.log(`Unsubscribed from conversation: ${channelId}`);
    }
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
      if (this.stompClient && this.stompClient.connected) {
        try {
          this.subscribeToConversation(msgPayload.channelId); // Ensure user subscribed to the channel.

          // One-time message listener for this specific message (to get message id).
          const messageListener = this.stompClient.subscribe(
            `/directmessage/${msgPayload.channelId}`,
            (payload) => {
              const response = JSON.parse(payload.body);
              if (
                response.senderId === msgPayload.senderId &&
                response.messageContent === msgPayload.messageContent
              ) {
                // Unsubscribe from this temporary subscription
                messageListener.unsubscribe();
                resolve(response);
              }
            },
          );

          // Timeout if message not received within 10 seconds
          setTimeout(() => {
            messageListener.unsubscribe();
            reject(new Error("Message sending timed out"));
          }, 10000);

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
