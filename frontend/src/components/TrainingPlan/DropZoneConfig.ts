// File Configs for Uploading Training Plans
export const dropZoneConfig = {
  maxFiles: 5,
  maxSize: 1024 * 1024 * 4,
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
