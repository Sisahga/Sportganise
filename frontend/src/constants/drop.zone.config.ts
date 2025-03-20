import { MAX_NUMBER_OF_FILES } from "@/constants/file.constants";
import { MAX_SINGLE_FILE_SIZE } from "@/constants/file.constants";

// File Configs for Creating Program and Modifying Program
export const dropZoneConfig = {
  maxFiles: MAX_NUMBER_OF_FILES,
  maxSize: MAX_SINGLE_FILE_SIZE,
  multiple: true,
  accept: {
    "image/*": [".png", ".jpg", ".jpeg"],
    "application/pdf": [".pdf"],
  },
};
