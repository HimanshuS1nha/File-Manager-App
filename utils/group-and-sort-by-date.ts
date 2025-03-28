import type { FileOrFolderType } from "@/types";

export const groupAndSortByDate = (
  main: {
    title: Date;
    data: FileOrFolderType[];
  }[],
  other: FileOrFolderType[]
) => {
  other.map((asset) => {
    const assetDate = new Date(asset.modificationTime).setHours(0, 0, 0, 0);
    if (main.find((file) => file.title.getTime() === assetDate)) {
      main.find((file) => file.title.getTime() === assetDate)?.data.push(asset);
    } else {
      main.push({ title: new Date(assetDate), data: [asset] });
    }
  });
  return main.sort((a, b) => b.title.getTime() - a.title.getTime());
};
