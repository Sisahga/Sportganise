import { MAX_SINGLE_FILE_SIZE } from "@/constants/file.constants";
import { MAX_NUMBER_OF_FILES } from "@/constants/file.constants";

// File Configs for Uploading Training Plans
export const dropZoneConfig = {
  maxFiles: MAX_NUMBER_OF_FILES,
  maxSize: MAX_SINGLE_FILE_SIZE,
  multiple: true,
  accept: {
    "application/msword": [".doc", ".dot"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template": [
      ".dotx",
    ],
    "application/vnd.ms-word.document.macroEnabled.12": [".docm"],
    "application/vnd.ms-word.template.macroEnabled.12": [".dotm"],
  },
};
