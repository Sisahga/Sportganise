import React from "react";
import WebSocketService from "@/services/WebSocketService.ts";

export enum DeleteChannelRequestMemberStatus {
  APPROVED = "APPROVED",
  PENDING = "PENDING",
  DENIED = "DENIED",
}

export interface DeleteRequestProps {
  deleteRequestActive: boolean;
  deleteRequest: DeleteChannelRequestResponseDto | null;
  currentUserId: number;
  currentUserApproverStatus: DeleteChannelRequestMemberStatus | undefined;
  setDeleteRequestActive: React.Dispatch<React.SetStateAction<boolean>>;
  websocketRef: WebSocketService | null;
  setDeleteRequest: React.Dispatch<
    React.SetStateAction<DeleteChannelRequestResponseDto | null>
  >;
}

export interface DeleteChannelRequestDto {
  deleteRequestId: number | null;
  channelId: number;
  creatorId: number;
  channelType: string;
  creatorName: string | null;
}

export interface DeleteChannelRequestMembersDto {
  accountId: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | undefined;
  status: DeleteChannelRequestMemberStatus;
}

export interface DeleteChannelRequestResponseDto {
  deleteChannelRequestDto: DeleteChannelRequestDto;
  channelMembers: DeleteChannelRequestMembersDto[];
}

export interface SetDeleteApproverStatusDto {
  deleteRequestId: number;
  channelId: number;
  accountId: number;
  status: DeleteChannelRequestMemberStatus;
}
