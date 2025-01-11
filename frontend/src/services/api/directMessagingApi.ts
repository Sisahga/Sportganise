import { Channel } from '@/types/dmchannels.ts';
import { MessageComponent } from "@/types/messaging.ts";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/messaging";

const directMessagingApi = {
    getDirectMessages: async (channelId: number | null) => {
        const response = await fetch(`${baseMappingUrl}/directmessage/get-messages/${channelId}`);
        const data:MessageComponent[] = await response.json();
        return data;
    },
    getChannels: async (accountId: number | null) => {
        const response = await fetch(`${baseMappingUrl}/channel/get-channels/${accountId}`);
        const data:Channel[]  = await response.json();
        return data;
    },
    markChannelAsRead: async (channelId: number, userId: number): Promise<void> => {
        await fetch(`${baseMappingUrl}/channelmember/${channelId}/${userId}/mark-as-read`, {
            method: "PUT",
        });
    }
}

export default directMessagingApi;