import * as v from "valibot";

export function getFileSize(bytes: number) {
  let size = "";
  if (bytes < 1024) size = bytes + " B";
  else if (bytes < 1024 * 1024) size = (bytes / 1024).toFixed(2) + " KB";
  else if (bytes < 1024 * 1024 * 1024) size = (bytes / 1024 / 1024).toFixed(2) + " MB";

  return size;
}

export const DAYS = [
  "dimanche", // Sunday
  "lundi", // Monday
  "mardi", // Tuesday
  "mercredi", // Wednesday
  "jeudi", // Thursday
  "vendredi", // Friday
  "samedi" // Saturday
] as const;

export const PASSWORD_MIN_LENGTH = 6;
export const DOC_FILE_MAX_SIZE = 10 * 1024 * 1024;
export const IMAGE_FILE_MAX_SIZE = 10 * 1024 * 1024;
export const ACCOUNT_DELETION_CONFIRM_PHRASE = "delete my account";

export const IMAGE_FILE_ALLOWED_MIME_TYPE = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/svg+xml"
] as const;

export const DOC_FILE_ALLOWED_MIME_TYPE = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf"
] as const;
export const ACCOUNT_TYPES = ["freelancer", "institute", "laser_institute"] as const;

const REQUIRED_FIRST_NAME_MESSAGE = `Please enter your first name.`;
const REQUIRED_LAST_NAME_MESSAGE = `Please enter your last name.`;

const REQUIRED_EMAIL_MESSAGE = `Please enter an email address.`;
const INVALID_EMAIL_MESSAGE = `Please enter a valid email address.`;

const INVALID_PASSWORD_MESSAGE = `Invalid password.`;
const REQUIRED_PASSWORD_MESSAGE = `Please enter your password.`;
const REQUIRED_NEW_PASSWORD_MESSAGE = `Please enter a new password.`;
const NEW_PASSWORD_MATCHED_MESSAGE = "The two passwords can't be same.";
const PASSWORD_MIN_LENGTH_MESSAGE = `Passwod must be atleast ${PASSWORD_MIN_LENGTH} character(s) long`;

const INVALID_IMAGE_FILE_TYPE_MESSAGE = `Please upload only image file. e: jpg, png, jpeg`;
const INVALID_IMAGE_FILE_SIZE = `Please upload file smaller than ${getFileSize(IMAGE_FILE_MAX_SIZE)}`;

const ACCOUNT_DELETION_CONFIRM_PHRASE_MESSAGE = `Please type \`${ACCOUNT_DELETION_CONFIRM_PHRASE}\` to confirm.`;

const DOC_FILE_REQUIRED_MESSAGE = `Please upload a document file.`;

const ACCOUNT_TYPE_REQUIRED_MESSAGE = `Please select the account type.`;
const ACCOUNT_TYPE_INVALID_MESSAGE = `Please select one of the following: ${ACCOUNT_TYPES.join(", ")}`;

export const emailField = v.pipe(
  v.string(REQUIRED_EMAIL_MESSAGE),
  v.email(INVALID_EMAIL_MESSAGE)
);

export const passwordField = v.pipe(
  v.string(REQUIRED_PASSWORD_MESSAGE),
  v.minLength(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE)
);

export const newPasswordField = v.pipe(
  v.string(REQUIRED_NEW_PASSWORD_MESSAGE),
  v.minLength(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE)
);

export const firstNameField = v.pipe(
  v.string(REQUIRED_FIRST_NAME_MESSAGE),
  v.minLength(1, REQUIRED_FIRST_NAME_MESSAGE)
);

export const lastNameField = v.pipe(
  v.string(REQUIRED_LAST_NAME_MESSAGE),
  v.minLength(1, REQUIRED_LAST_NAME_MESSAGE)
);

export const avatarField = v.pipe(
  v.instance(File),
  v.mimeType([...IMAGE_FILE_ALLOWED_MIME_TYPE], INVALID_IMAGE_FILE_TYPE_MESSAGE),
  v.maxSize(IMAGE_FILE_MAX_SIZE, INVALID_IMAGE_FILE_SIZE)
);

export const telephoneField = v.string();

export const updateProfileSchema = v.object({
  first_name: firstNameField,
  last_name: lastNameField,
  email: emailField,
  telephone: v.optional(telephoneField)
});

export const credentialSchema = v.object({ email: emailField, password: passwordField });

export const profileSchema = v.object({
  first_name: firstNameField,
  last_name: lastNameField,
  telephone: v.optional(telephoneField)
});

export const passwordUpdateSchema = v.pipe(
  v.object({ currentPassword: passwordField, newPassword: newPasswordField }),
  v.forward(
    v.check(
      (input) => input.newPassword !== input.currentPassword,
      NEW_PASSWORD_MATCHED_MESSAGE
    ),
    ["newPassword"]
  )
);

export const accountDeletionSchema = v.object({
  password: v.pipe(
    v.string(REQUIRED_PASSWORD_MESSAGE),
    v.minLength(PASSWORD_MIN_LENGTH, INVALID_PASSWORD_MESSAGE)
  ),
  verify: v.picklist(
    [ACCOUNT_DELETION_CONFIRM_PHRASE],
    ACCOUNT_DELETION_CONFIRM_PHRASE_MESSAGE
  )
});

export const siretField = v.pipe(v.string(), v.length(14), v.trim());

export const instituteInfoSchema = v.object({
  siret: siretField,
  entreprise: v.pipe(v.string(), v.trim(), v.minLength(1)),
  adresse: v.pipe(v.string(), v.trim(), v.minLength(1)),
  adresse2: v.optional(v.pipe(v.string(), v.trim())),
  ville: v.pipe(v.string(), v.trim(), v.minLength(1)),
  code_postal: v.pipe(v.string(), v.trim(), v.minLength(1)),
  type_entreprise: v.pipe(v.string(), v.trim(), v.minLength(1))
});

export const accountTypeSchema = v.pipe(
  v.string(ACCOUNT_TYPE_REQUIRED_MESSAGE),
  v.picklist(["freelancer", "institute", "laser_institute"], ACCOUNT_TYPE_INVALID_MESSAGE)
);

export const documentsSchema = v.object({
  assurance: v.pipe(
    v.instance(File),
    v.mimeType([...IMAGE_FILE_ALLOWED_MIME_TYPE, ...DOC_FILE_ALLOWED_MIME_TYPE]),
    v.maxSize(DOC_FILE_MAX_SIZE)
  ),
  kbis: v.pipe(
    v.instance(File),
    v.mimeType([...IMAGE_FILE_ALLOWED_MIME_TYPE, ...DOC_FILE_ALLOWED_MIME_TYPE]),
    v.maxSize(DOC_FILE_MAX_SIZE)
  ),
  cni: v.pipe(
    v.instance(File),
    v.mimeType([...IMAGE_FILE_ALLOWED_MIME_TYPE, ...DOC_FILE_ALLOWED_MIME_TYPE]),
    v.maxSize(DOC_FILE_MAX_SIZE)
  ),
  diplome: v.union([
    v.null_(),
    v.undefined_(),
    v.pipe(
      v.instance(File, DOC_FILE_REQUIRED_MESSAGE),
      v.maxSize(DOC_FILE_MAX_SIZE),
      v.mimeType([...IMAGE_FILE_ALLOWED_MIME_TYPE, ...DOC_FILE_ALLOWED_MIME_TYPE])
    )
  ])
});

export const registerSchema = v.pipe(
  v.object({
    credentials: credentialSchema,
    profile: v.object({
      avatar: v.optional(avatarField),
      first_name: firstNameField,
      last_name: lastNameField,
      telephone: v.optional(telephoneField)
    }),
    accountType: accountTypeSchema,
    institute: instituteInfoSchema,
    documents: documentsSchema
  }),
  v.forward(
    v.check(
      (v) =>
        v.accountType === "freelancer" ? v.documents.diplome instanceof File : true,
      DOC_FILE_REQUIRED_MESSAGE
    ),
    ["documents", "diplome"]
  )
);
