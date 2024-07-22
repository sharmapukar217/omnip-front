import type { DirectusFiles } from "@/types/directus";
import { twMerge } from "tailwind-merge";
import { type ClassValue, cnBase } from "tailwind-variants";

export const useShouldRediect = () => ref<boolean>(true);

export function cn(...inputs: ClassValue[]) {
  return twMerge(cnBase(inputs));
}

/** get full asset url from asset id */
export function getDirectusAssetUrl(asset: string | DirectusFiles) {
  const assetUrl = typeof asset === "string" ? asset : asset.id;
  return new URL(
    `/assets/${assetUrl}`,
    import.meta.env.NUXT_PUBLIC_DIRECTUS_URL
  ).toString();
}

/** helper fn to rename file */
export const renameFile = (file: File, idOrName: string) => {
  const ext = getFileExtension(file.type);
  return new File([file], `${idOrName}.${ext}`, { type: file.type });
};

/** helper function to debounce action */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay = 500
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/** get file size in string */
export function getFileSize(bytes: number, fixedTo = 1) {
  let size = "";
  if (bytes < 1024) size = bytes + " B";
  else if (bytes < 1024 * 1024) size = (bytes / 1024).toFixed(fixedTo) + " KB";
  else if (bytes < 1024 * 1024 * 1024)
    size = (bytes / 1024 / 1024).toFixed(fixedTo) + " MB";

  return size;
}

export const getFileExtension = (fileType: string) => {
  return fileType.split("/")[1]?.split(".").pop();
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/** pick certain values from object */
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
