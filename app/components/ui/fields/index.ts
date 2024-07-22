import DocUploader from "./DocUploader.vue";
import PasswordField from "./PasswordField.vue";
import UserEmailField from "./UserEmailField.vue";

export { DocUploader, PasswordField, UserEmailField };

export const Field = {
  Password: PasswordField,
  UserEmail: UserEmailField,
  DocUploader
} as const;
