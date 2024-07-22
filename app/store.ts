import type { DirectusUsers } from "./types/directus";

type HireRequestIncoming = {
  timestamp: string;
  requestedBy: Pick<
    DirectusUsers,
    "id" | "first_name" | "last_name" | "avatar" | "entreprise"
  >;
};

// type HireRequestStatus =
//   | "queue"
//   | "requesting"
//   | "cancelled"
//   | "rejected"
//   | "timeout"
//   | "accepted";

type HireRequestOutgoing = {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
};

export const outgoingRequests = ref<HireRequestOutgoing[]>([]);
export const incomingHireRequests = ref<HireRequestIncoming[]>([]);

type SearchStatus = "idle" | "searching";

export const searchStatus = ref<SearchStatus>("idle");
