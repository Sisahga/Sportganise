export interface BlockUserRequestDto {
  channelId: number | null;
  userId: number;
  blockedId: number;
}