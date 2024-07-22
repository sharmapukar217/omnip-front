export const BIOMETRY_MAX_ATTEMPTS = 3;

export const FILTER_STORE_STORAGE_KEY = "saved_filters";
export const ACCESS_TOKEN_STORAGE_KEY = "directus-access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "directus_refresh_token";

/** mappings for Role to their respective ids */
export const ROLE = {
  admin: "77cd6269-b578-4e9a-aa2b-06f824a5dd47",
  freelancer: "86394932-4bf8-4fc6-a96a-fee57c18bebc",
  institute: "d9d66bf9-dff2-4786-b294-d5425bb19b72",
  laser_institute: "d9d66bf9-dff2-4786-b294-d5425bb19b72"
};

/** mappings for folder name to their respective ids */
export const FILE_FOLDER = {
  /**
   * for documents
   */

  cni: "10e1950f-04f3-4f09-8280-ba04a98f2e5e",
  kbis: "0d917527-b368-4fb3-9743-c76ef5aed071",
  diplome: "537ec577-88ef-4a4d-aafa-cb613e5f7bd3",
  assurance: "c4235862-4b5c-4054-b26e-7aae1f325451",

  /**
   * for profile pictures
   */
  avatars: "5f63ee0c-e1c7-4ea5-a0d3-cb1bdc9d5040"
};

// 3 minutes
export const HIRE_REUQESTS_TIMEOUT_MS = 1000 * 60 * 3;

export const queryKeys = {
  // related to current user
  logout: ["logout"],
  currentUser: ["current-user"],
  currentUserProfile: () => [...queryKeys.currentUser, "profile"],

  // related to biometric
  biometricType: ["biometric-type"],
  hasBiometricCredential: ["has-biometric-credential"]
} as const;

export const toastKeys = {
  AUTH: "TOAST__AUTH",
  PROFILE: "TOAST__PROFILE",
  BIOMETRY: "TOAST__BIOMETRY"
};
