export const getFileType = (
  filename: string
): "audio" | "video" | "apk" | "pdf" | "zip" | "image" | "other" => {
  const lowecaseFilename = filename.toLowerCase();

  if (lowecaseFilename.endsWith(".mp3")) {
    return "audio";
  } else if (lowecaseFilename.endsWith(".mp4")) {
    return "video";
  } else if (lowecaseFilename.endsWith("apk")) {
    return "apk";
  } else if (lowecaseFilename.endsWith("zip")) {
    return "zip";
  } else if (lowecaseFilename.endsWith("pdf")) {
    return "pdf";
  } else if (
    ["jpg", "png", "webp", "gif", "jpeg"].some((ext) =>
      lowecaseFilename.endsWith(ext)
    )
  ) {
    return "image";
  } else {
    return "other";
  }
};
