/**
 * Retrieves file name from url of AWS bucket
 *
 * @param fileUrl
 * @return fileName
 */
export function getFileName(fileUrl: string) {
  const fileName = fileUrl
    .substring(fileUrl.indexOf("_") + 1)
    .replace(/\+/g, " ");
  return fileName;
}
