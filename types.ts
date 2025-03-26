export type FileOrFolderType = {
  id: string;
  name: string;
  uri: string;
  path: string;
  type: "file" | "folder";
  modificationTime: number;
  fileType?: "image" | "video" | "audio" | "pdf" | "zip" | "apk" | "other";
  size: number;
};
