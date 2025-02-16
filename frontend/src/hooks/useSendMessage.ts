import {MessageComponent, SendMessageComponent} from "@/types/messaging.ts";
import WebSocketService from "@/services/WebSocketService.ts";

function useSendMessage() {
  const sendDirectMessage = async (
    messagePayload: SendMessageComponent,
    webSocketServiceRef: WebSocketService | null,
  ): Promise<MessageComponent | undefined> => {
    if (!webSocketServiceRef) { return undefined; }
    return webSocketServiceRef.sendMessage(messagePayload);
  };
  return {
    sendDirectMessage,
  };
}
export default useSendMessage;
