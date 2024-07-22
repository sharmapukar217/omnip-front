import type { TypedPathParameter } from "@typed-router/__paths";
import type { RoutesNamesList } from "@typed-router/__routes";

export const usePreviousRoute = () => {
  return useState<TypedPathParameter<RoutesNamesList>>("previous-route", () => "/");
};
