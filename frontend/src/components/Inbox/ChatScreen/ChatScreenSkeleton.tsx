import React from "react";
import { ChevronLeft, FolderOpen, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ChatScreenSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 7rem)" }}>
      <header
        className="flex items-center justify-between p-4 bg-white shadow gap-4 flex-shrink-0"
        style={{ borderRadius: "0 0 1rem 1rem" }}
      >
        <div className="flex flex-grow items-center gap-4">
          <Button
            className="rounded-xl font-semibold"
            variant="outline"
            aria-label="back"
          >
            <ChevronLeft />
            <p className="sm:block hidden">Back</p>
          </Button>
          <div className="flex items-center flex-grow gap-3">
            <div
              className="animate-skeleton rounded-full"
              style={{ width: "36px", height: "36px" }}
            />
            <div
              className="animate-skeleton rounded"
              style={{ width: "120px", height: "24px" }}
            />
          </div>
          <div className="w-10 h-10 flex items-center justify-center"></div>
        </div>
      </header>

      <div className="overflow-y-auto flex-1 mt-4 px-4 flex flex-col justify-end">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={`mb-4 flex items-end gap-2 ${
              index % 2 === 0 ? "justify-end" : ""
            }`}
          >
            {index % 2 !== 0 && (
              <div className="flex items-end">
                <div
                  className="animate-skeleton rounded-full"
                  style={{ width: "32px", height: "32px" }}
                />
              </div>
            )}

            <div
              className={`flex flex-col ${
                index % 2 === 0 ? "items-end" : "items-start"
              }`}
              style={{ maxWidth: "80%" }}
            >
              {index % 2 !== 0 && (
                <div className="px-3 mb-1">
                  <div
                    className="animate-skeleton rounded"
                    style={{ width: "70px", height: "12px" }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 items-end max-w-full">
                <div
                  className="animate-skeleton rounded-2xl"
                  style={{
                    width: `${Math.floor(Math.random() * 150) + 80}px`,
                    height: "36px",
                  }}
                />
              </div>

              {index % 2 === 0 && index === 0 && (
                <div
                  className="animate-skeleton rounded mt-1"
                  style={{ width: "60px", height: "14px" }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <form className="flex items-end gap-3 px-4 py-3 bg-white shadow flex-shrink-0">
        <div className="flex justify-center items-center px-2 h-full">
          <FolderOpen
            className="text-gray-800 folder-size cursor-pointer"
            size={24}
            strokeWidth={1.5}
          />
          <input
            id="fileInput"
            type="file"
            className="hidden"
            multiple={true}
          />
        </div>

        <textarea
          id="chatScreenInputArea"
          placeholder="Send a message..."
          className="flex-1 px-4 py-2 border bg-white rounded-xl text-sm focus:outline-none resize-none h-auto"
          style={{ scrollbarWidth: "none" }}
          rows={1}
          disabled
        />

        <Button
          type="submit"
          variant="ghost"
          aria-label="Send"
          className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
          style={{ transform: "rotate(45deg)" }}
          disabled
        >
          <Send
            className="faded-primary-colour folder-size"
            size={20}
            strokeWidth={2}
            style={{ position: "relative", left: "-1.5px", top: "1.5px" }}
          />
        </Button>
      </form>
    </div>
  );
};

export default ChatScreenSkeleton;
