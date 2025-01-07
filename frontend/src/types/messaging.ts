export default interface sendDmRequestDto {
    senderId: number;
    channelId: number;
    messageContent: string;
    attachments: File[];
    sentAt: string;
    type: string;
}