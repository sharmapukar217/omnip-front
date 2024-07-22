import type { CustomDirectusTypes } from "@/types/directus";

type UseDirectusClientConfig = Parameters<
  typeof useDirectusItems<CustomDirectusTypes>
>[0];

export const useDirectusClient = (config?: UseDirectusClientConfig) => {
  return useDirectusItems<CustomDirectusTypes>(config).client;
};
