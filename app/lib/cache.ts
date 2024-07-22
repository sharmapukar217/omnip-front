import { LRUCache } from "lru-cache";

export const userEmailResponse = new LRUCache({ max: 10 });
export const userSiretResponse = new LRUCache({ max: 10 });
