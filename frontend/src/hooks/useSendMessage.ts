import { SendMessageComponent } from "@/types/messaging.ts";
import WebSocketService from "@/services/WebSocketService.ts";

function useSendMessage() {
  const sendDirectMessage = (
    messagePayload: SendMessageComponent,
    webSocketServiceRef: WebSocketService | null,
  ) => {
    webSocketServiceRef?.sendMessage(messagePayload);
  };
  return {
    sendDirectMessage,
  };
}
export default useSendMessage;
