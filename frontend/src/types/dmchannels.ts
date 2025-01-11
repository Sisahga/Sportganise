import React from "react";

export interface Channel {
    channelId: number;
    channelName: string;
    channelImageBlob: string;
    channelType: string;

    lastMessage: string | null;
    lastEvent: string | null;
    read: boolean;
}

export interface MessagesSectionProps {
    messageChannels: Channel[];
}

export interface GroupSectionProps {
    groupChannels: Channel[];
}

export interface ChannelItemProps {
    channel: Channel;
    layout?: "horizontal" | "vertical";
    extraInfo?: React.ReactNode; // Holds 'read' and 'lastEvent' info
}