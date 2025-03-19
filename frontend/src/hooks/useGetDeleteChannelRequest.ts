import directMessagingApi from "@/services/api/directMessagingApi.ts";
import { useEffect, useState } from "react";
import log from "loglevel";
import {
  DeleteChannelRequestMemberStatus,
  DeleteChannelRequestResponseDto,
} from "@/types/deleteRequest.ts";
import ResponseDto from "@/types/response.ts";

function useGetDeleteChannelRequest(channelId: number, currentUserId: number) {
  const [deleteRequestActive, setDeleteRequestActive] =
    useState<boolean>(false);
  const [deleteRequest, setDeleteRequest] =
    useState<DeleteChannelRequestResponseDto | null>(null);
  const [currentMemberStatus, setCurrentMemberStatus] =
    useState<DeleteChannelRequestMemberStatus>();
  useEffect(() => {
    const fetchDeleteRequest = async () => {
      try {
        const response:
          | ResponseDto<null>
          | ResponseDto<DeleteChannelRequestResponseDto> =
          await directMessagingApi.getIsDeleteChannelRequestActive(channelId);
        if (response.statusCode === 200) {
          setDeleteRequestActive(true);
          setDeleteRequest(response.data);
          log.debug("Delete request active:", response);
          setCurrentMemberStatus(
            response.data?.channelMembers.find(
              (member) => member.accountId === currentUserId,
            )?.status,
          );
        } else if (response.statusCode === 204) {
          setDeleteRequestActive(false);
          setDeleteRequest(null);
          log.debug("No delete request active:", response);
        } else {
          log.error("Error fetching delete request:", response);
        }
      } catch (error) {
        log.error("Error fetching delete request:", error);
      }
    };
    fetchDeleteRequest().then((r) => r);
  }, [deleteRequestActive]);

  return {
    deleteRequestActive,
    setDeleteRequest,
    setDeleteRequestActive,
    deleteRequest,
    currentMemberStatus,
  };
}
export default useGetDeleteChannelRequest;
