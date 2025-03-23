import { Attachment, AttachmentType } from "@/types/messaging.ts";
import { FileIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";

const ChatMessageAttachments = ({
  attachments,
  senderId,
  currentUserId,
}: {
  attachments: Attachment[];
  senderId: number;
  currentUserId: number;
}) => {
  const extractFileName = (url: string) => {
    const segments = url.split("/");
    const lastSegment = segments[segments.length - 1];
    return lastSegment.split("_").slice(1).join("_");
  };

  const [imageOpen, setImageOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] =
    useState<Attachment | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageClicked = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setImageOpen(true);
  };

  useEffect(() => {}, [isLoaded]);

  return (
    <>
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]" />
          <DialogContent
            title={extractFileName(selectedAttachment?.attachmentUrl || "")}
            className="fixed inset-0 border-none bg-transparent p-0 max-w-none z-[999]"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <DialogClose className="absolute right-4 top-4 z-[999] focus:outline-none focus-visible:outline-none">
                <div className="rounded-full p-2">
                  <XIcon className="h-6 w-6 text-black" strokeWidth={2} />
                </div>
              </DialogClose>
              {selectedAttachment && (
                <img
                  src={selectedAttachment.attachmentUrl}
                  alt={selectedAttachment.attachmentUrl}
                  className="max-w-[90vw] max-h-[90vh] object-contain rounded"
                />
              )}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Images */}
      {attachments.some((att) => att.fileType === AttachmentType.IMAGE) && (
        <div className="overflow-x-auto w-full">
          <div
            className={`flex gap-2 items-end min-w-min
                           ${senderId === currentUserId ? "justify-end" : "justify-start"}`}
          >
            {attachments
              .filter((att) => att.fileType === AttachmentType.IMAGE)
              .map((attachment) => (
                <div key={attachment.attachmentUrl} className="shadow-lg h-fit">
                  <button
                    className="p-0 border-0 bg-transparent"
                    onClick={() => {
                      handleImageClicked(attachment);
                    }}
                    aria-label={`View ${extractFileName(attachment.attachmentUrl)}`}
                  >
                    <img
                      src={attachment.attachmentUrl}
                      alt={attachment.attachmentUrl}
                      className={`
                                  min-w-20 min-h-20 max-w-28 max-h-36 rounded object-cover cursor-pointer
                                  ${isLoaded ? "" : "animate-skeleton"}
                                `}
                      onLoad={() => {
                        setIsLoaded(true);
                      }}
                      loading={"lazy"}
                    />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {attachments.some((att) => att.fileType === AttachmentType.VIDEO) && (
        <div className="flex gap-2 justify-start">
          {attachments
            .filter((att) => att.fileType === AttachmentType.VIDEO)
            .map((attachment) => (
              <div key={attachment.attachmentUrl} className="shadow-lg">
                <video
                  src={attachment.attachmentUrl}
                  className="min-w-20 min-h-20 max-w-28 max-h-36 rounded object-cover cursor-pointer"
                  controls
                >
                  <track
                    kind="captions"
                    src=""
                    label="English"
                    srcLang="en"
                    default
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
        </div>
      )}

      {/* Files */}
      {attachments.some((att) => att.fileType === AttachmentType.FILE) && (
        <div
          className={`flex flex-col gap-2 ${senderId === currentUserId ? "items-end" : "items-start"}`}
        >
          {attachments
            .filter((att) => att.fileType === AttachmentType.FILE)
            .map((attachment) => (
              <div
                key={attachment.attachmentUrl}
                className="flex items-center text-sm gap-2 bg-gray-200 text-gray-800 px-3 py-2 rounded-2xl shadow-lg w-fit"
              >
                <FileIcon className="h-4 w-4"></FileIcon>
                <a
                  href={attachment.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={true}
                >
                  {extractFileName(attachment.attachmentUrl)}
                </a>
              </div>
            ))}
        </div>
      )}
    </>
  );
};
export default ChatMessageAttachments;
