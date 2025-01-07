import sendMessageRequestDto from '../../types/messaging.ts';

const baseMappingUrl = process.env.REACT_APP_API_BASE_URL + "/app/messaging/directmessage";

const directMessagingApi = {
    sendDirectMessage: async (message: sendMessageRequestDto) => {
        const response = await fetch(baseMappingUrl + "/", {
        method: 'POST',
        body: JSON.stringify({ message }),
        });
        return response.json();
    },
}

export default directMessagingApi;