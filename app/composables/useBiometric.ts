import { appConfig } from "@/lib/appConfig";
import { queryKeys } from "@/lib/constants";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { BiometryType, NativeBiometric } from "capacitor-native-biometric";

async function checkBiometricAvailability() {
  return NativeBiometric.isAvailable().then((result) => result.biometryType);
}

export const useBiometricTypeQuery = () => {
  const { data } = useQuery({
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    initialData: BiometryType.NONE,
    queryKey: queryKeys.biometricType,
    queryFn: checkBiometricAvailability
  });

  return { biometricType: data };
};

export const useHasBiometricCredential = () => {
  const { biometricType } = useBiometricTypeQuery();

  const { data, refetch } = useQuery({
    initialData: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    queryKey: queryKeys.hasBiometricCredential,
    enabled: () => biometricType.value !== BiometryType.NONE,
    queryFn: () => {
      return NativeBiometric.getCredentials({ server: appConfig.appId })
        .then((creds) => !!creds)
        .catch(() => false);
    }
  });

  return { hasCredential: data, biometricType, refetch };
};

export const useBiometricCredential = () => {
  return useMutation({
    mutationKey: queryKeys.biometricType,
    async mutationFn() {
      const status = await checkBiometricAvailability();
      if (!status) return undefined;

      return NativeBiometric.verifyIdentity().then(() =>
        NativeBiometric.getCredentials({ server: appConfig.appId })
      );
    }
  });
};
