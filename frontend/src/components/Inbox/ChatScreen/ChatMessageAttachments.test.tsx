import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import ChatMessageAttachments from "./ChatMessageAttachments";
import { AttachmentType } from "@/types/messaging";
import { describe, it, expect } from "vitest";

describe("ChatMessageAttachments", () => {
  const imageAttachment = {
    attachmentUrl: "https://example.com/123_image.png",
    fileType: AttachmentType.IMAGE,
  };

  const videoAttachment = {
    attachmentUrl: "https://example.com/456_video.mp4",
    fileType: AttachmentType.VIDEO,
  };

  const fileAttachment = {
    attachmentUrl: "https://example.com/789_file_document.pdf",
    fileType: AttachmentType.FILE,
  };

  it("renders image attachments and opens dialog on click", async () => {
    render(
      <ChatMessageAttachments
        attachments={[imageAttachment]}
        currentUserId={1}
        senderId={1}
      />,
    );

    const imageButton = screen.getByLabelText("View image.png");
    expect(imageButton).toBeDefined();

    fireEvent.click(imageButton);

    await waitFor(() => {
      const overlay = document.querySelector('[class*="bg-black/80"]');
      expect(overlay).toBeTruthy();
    });

    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog).toBeTruthy();
    const dialogImage = within(dialog).getByAltText(
      imageAttachment.attachmentUrl,
    );
    expect(dialogImage).toBeDefined();
  });

  it("renders video attachments", () => {
    render(
      <ChatMessageAttachments
        attachments={[videoAttachment]}
        currentUserId={1}
        senderId={1}
      />,
    );
    const video = document.querySelector("video");
    expect(video).toBeTruthy();
    expect(video?.getAttribute("controls")).not.toBeNull();
    expect(video?.getAttribute("src")).toBe(videoAttachment.attachmentUrl);
  });

  it("renders file attachments", () => {
    render(
      <ChatMessageAttachments
        attachments={[fileAttachment]}
        currentUserId={1}
        senderId={1}
      />,
    );
    const fileLink = screen.getByRole("link", { name: /file_document\.pdf/i });
    expect(fileLink).toBeDefined();
    expect(fileLink.getAttribute("download")).not.toBeNull();
    expect(fileLink.getAttribute("href")).toBe(fileAttachment.attachmentUrl);
  });
});
