export type Actualites = {
  categories?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  id: number;
  image_principale?: string | DirectusFiles | null;
  meta_description?: string | null;
  slug?: string | null;
  taxonomie?: unknown | null;
  texte?: string | null;
  titre?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Avis = {
  date_created?: string | null;
  date_updated?: string | null;
  fonction?: string | null;
  id: number;
  nom?: string | null;
  note?: number | null;
  slug?: string | null;
  temoignage?: string | null;
  titre?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type DirectusActivity = {
  action: string;
  collection: string;
  comment?: string | null;
  id: number;
  ip?: string | null;
  item: string;
  origin?: string | null;
  revisions: any[] | DirectusRevisions[];
  timestamp: string;
  user?: string | DirectusUsers | null;
  user_agent?: string | null;
};

export type DirectusCollections = {
  accountability?: string | null;
  archive_app_filter: boolean;
  archive_field?: string | null;
  archive_value?: string | null;
  collapse: string;
  collection: string;
  color?: string | null;
  display_template?: string | null;
  group?: string | DirectusCollections | null;
  hidden: boolean;
  icon?: string | null;
  item_duplication_fields?: unknown | null;
  note?: string | null;
  preview_url?: string | null;
  singleton: boolean;
  sort?: number | null;
  sort_field?: string | null;
  translations?: unknown | null;
  unarchive_value?: string | null;
  versioning: boolean;
};

export type DirectusDashboards = {
  color?: string | null;
  date_created?: string | null;
  icon: string;
  id: string;
  name: string;
  note?: string | null;
  panels: any[] | DirectusPanels[];
  user_created?: string | DirectusUsers | null;
};

export type DirectusExtensions = {
  bundle?: string | null;
  enabled: boolean;
  folder: string;
  id: string;
  source: string;
};

export type DirectusFields = {
  collection: string | DirectusCollections;
  conditions?: unknown | null;
  display?: string | null;
  display_options?: unknown | null;
  field: string;
  group?: string | DirectusFields | null;
  hidden: boolean;
  id: number;
  interface?: string | null;
  note?: string | null;
  options?: unknown | null;
  readonly: boolean;
  required?: boolean | null;
  sort?: number | null;
  special?: unknown | null;
  translations?: unknown | null;
  validation?: unknown | null;
  validation_message?: string | null;
  width?: string | null;
};

export type DirectusFiles = {
  charset?: string | null;
  description?: string | null;
  duration?: number | null;
  embed?: string | null;
  filename_disk?: string | null;
  filename_download: string;
  filesize?: number | null;
  focal_point_x?: number | null;
  focal_point_y?: number | null;
  folder?: string | DirectusFolders | null;
  height?: number | null;
  id: string;
  location?: string | null;
  metadata?: unknown | null;
  modified_by?: string | DirectusUsers | null;
  modified_on: string;
  storage: string;
  tags?: unknown | null;
  title?: string | null;
  type?: string | null;
  uploaded_by?: string | DirectusUsers | null;
  uploaded_on: string;
  valide?: boolean | null;
  width?: number | null;
};

export type DirectusFlows = {
  accountability?: string | null;
  color?: string | null;
  date_created?: string | null;
  description?: string | null;
  icon?: string | null;
  id: string;
  name: string;
  operation?: string | DirectusOperations | null;
  operations: any[] | DirectusOperations[];
  options?: unknown | null;
  status: string;
  trigger?: string | null;
  user_created?: string | DirectusUsers | null;
};

export type DirectusFolders = {
  id: string;
  name: string;
  parent?: string | DirectusFolders | null;
};

export type DirectusMigrations = {
  name: string;
  timestamp?: string | null;
  version: string;
};

export type DirectusNotifications = {
  collection?: string | null;
  id: number;
  item?: string | null;
  message?: string | null;
  recipient: string | DirectusUsers;
  sender?: string | DirectusUsers | null;
  status?: string | null;
  subject: string;
  timestamp?: string | null;
};

export type DirectusOperations = {
  date_created?: string | null;
  flow: string | DirectusFlows;
  id: string;
  key: string;
  name?: string | null;
  options?: unknown | null;
  position_x: number;
  position_y: number;
  reject?: string | DirectusOperations | null;
  resolve?: string | DirectusOperations | null;
  type: string;
  user_created?: string | DirectusUsers | null;
};

export type DirectusPanels = {
  color?: string | null;
  dashboard: string | DirectusDashboards;
  date_created?: string | null;
  height: number;
  icon?: string | null;
  id: string;
  name?: string | null;
  note?: string | null;
  options?: unknown | null;
  position_x: number;
  position_y: number;
  show_header: boolean;
  type: string;
  user_created?: string | DirectusUsers | null;
  width: number;
};

export type DirectusPermissions = {
  action: string;
  collection: string;
  fields?: unknown | null;
  id: number;
  permissions?: unknown | null;
  presets?: unknown | null;
  role?: string | DirectusRoles | null;
  validation?: unknown | null;
};

export type DirectusPresets = {
  bookmark?: string | null;
  collection?: string | null;
  color?: string | null;
  filter?: unknown | null;
  icon?: string | null;
  id: number;
  layout?: string | null;
  layout_options?: unknown | null;
  layout_query?: unknown | null;
  refresh_interval?: number | null;
  role?: string | DirectusRoles | null;
  search?: string | null;
  user?: string | DirectusUsers | null;
};

export type DirectusRelations = {
  id: number;
  junction_field?: string | null;
  many_collection: string;
  many_field: string;
  one_allowed_collections?: unknown | null;
  one_collection?: string | null;
  one_collection_field?: string | null;
  one_deselect_action: string;
  one_field?: string | null;
  sort_field?: string | null;
};

export type DirectusRevisions = {
  activity: number | DirectusActivity;
  collection: string;
  data?: unknown | null;
  delta?: unknown | null;
  id: number;
  item: string;
  parent?: number | DirectusRevisions | null;
  version?: string | DirectusVersions | null;
};

export type DirectusRoles = {
  admin_access: boolean;
  app_access: boolean;
  description?: string | null;
  enforce_tfa: boolean;
  icon: string;
  id: string;
  ip_access?: unknown | null;
  name: string;
  users: any[] | DirectusUsers[];
};

export type DirectusSessions = {
  expires: string;
  ip?: string | null;
  next_token?: string | null;
  origin?: string | null;
  share?: string | DirectusShares | null;
  token: string;
  user?: string | DirectusUsers | null;
  user_agent?: string | null;
};

export type DirectusSettings = {
  auth_login_attempts?: number | null;
  auth_password_policy?: string | null;
  basemaps?: unknown | null;
  custom_aspect_ratios?: unknown | null;
  custom_css?: string | null;
  default_appearance: string;
  default_language: string;
  default_theme_dark?: string | null;
  default_theme_light?: string | null;
  id: number;
  mapbox_key?: string | null;
  module_bar?: unknown | null;
  project_color: string;
  project_descriptor?: string | null;
  project_logo?: string | DirectusFiles | null;
  project_name: string;
  project_url?: string | null;
  public_background?: string | DirectusFiles | null;
  public_favicon?: string | DirectusFiles | null;
  public_foreground?: string | DirectusFiles | null;
  public_note?: string | null;
  public_registration: boolean;
  public_registration_email_filter?: unknown | null;
  public_registration_role?: string | DirectusRoles | null;
  public_registration_verify_email: boolean;
  report_bug_url?: string | null;
  report_error_url?: string | null;
  report_feature_url?: string | null;
  storage_asset_presets?: unknown | null;
  storage_asset_transform?: string | null;
  storage_default_folder?: string | DirectusFolders | null;
  theme_dark_overrides?: unknown | null;
  theme_light_overrides?: unknown | null;
  theming_group: string;
};

export type DirectusShares = {
  collection: string | DirectusCollections;
  date_created?: string | null;
  date_end?: string | null;
  date_start?: string | null;
  id: string;
  item: string;
  max_uses?: number | null;
  name?: string | null;
  password?: string | null;
  role?: string | DirectusRoles | null;
  times_used?: number | null;
  user_created?: string | DirectusUsers | null;
};

export type DirectusTranslations = {
  id: string;
  key: string;
  language: string;
  value: string;
};

export type DirectusUsers = {
  account_type?: string | null;
  adresse?: string | null;
  adresse2?: string | null;
  appearance?: string | null;
  assurance?: string | DirectusFiles | null;
  auth_data?: unknown | null;
  avatar?: string | DirectusFiles | null;
  cgu?: string | null;
  cni?: string | DirectusFiles | null;
  code_postal?: string | null;
  description?: string | null;
  diplome?: string | DirectusFiles | null;
  email?: string | null;
  email_notifications?: boolean | null;
  entreprise?: string | null;
  external_identifier?: string | null;
  first_name?: string | null;
  hire_requests?: number | HireRequests | null;
  iban?: string | null;
  id: string;
  kbis?: string | DirectusFiles | null;
  language?: string | null;
  last_access?: string | null;
  last_name?: string | null;
  last_page?: string | null;
  location?: string | null;
  password?: string | null;
  provider: string;
  push_notification_tokens: any[] | PushNotifications[];
  role?: string | DirectusRoles | null;
  siret?: string | null;
  status: string;
  stripe_id?: string | null;
  tags?: unknown | null;
  telephone?: string | null;
  tfa_secret?: string | null;
  theme_dark?: string | null;
  theme_dark_overrides?: unknown | null;
  theme_light?: string | null;
  theme_light_overrides?: unknown | null;
  title?: string | null;
  token?: string | null;
  type_entreprise?: string | null;
  ville?: string | null;
};

export type DirectusVersions = {
  collection: string | DirectusCollections;
  date_created?: string | null;
  date_updated?: string | null;
  hash?: string | null;
  id: string;
  item: string;
  key: string;
  name?: string | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type DirectusWebhooks = {
  actions: unknown;
  collections: unknown;
  data: boolean;
  headers?: unknown | null;
  id: number;
  method: string;
  migrated_flow?: string | DirectusFlows | null;
  name: string;
  status: string;
  url: string;
  was_active_before_deprecation: boolean;
};

export type Disponibilite = {
  date_created?: string | null;
  date_updated?: string | null;
  dimanche?: boolean | null;
  id: number;
  jeudi?: boolean | null;
  lundi?: boolean | null;
  mardi?: boolean | null;
  mercredi?: boolean | null;
  samedi?: boolean | null;
  sort?: number | null;
  user: string | DirectusUsers;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
  vendredi?: boolean | null;
};

export type Faq = {
  date_created?: string | null;
  date_updated?: string | null;
  id: number;
  question?: string | null;
  reponse?: string | null;
  sort?: number | null;
  status: string;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type HireRequests = {
  created_at?: string | null;
  id: number;
  requested_users: any[] | DirectusUsers[];
  sent_by?: string | DirectusUsers | null;
};

export type Messages = {
  date_created?: string | null;
  id: string;
  recipient?: string | DirectusUsers | null;
  text?: string | null;
  user_created?: string | DirectusUsers | null;
};

export type Notation = {
  affinite?: number | null;
  ambiance?: number | null;
  date_created?: string | null;
  date_updated?: string | null;
  destinataire?: string | DirectusUsers | null;
  id: number;
  proprete?: number | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type Prestation = {
  Appareils?: unknown | null;
  Beaute_du_regard?: unknown | null;
  date_created?: string | null;
  date_updated?: string | null;
  Epilations?: unknown | null;
  Epilations_maillot?: unknown | null;
  Hommes?: unknown | null;
  id: number;
  Modelages?: unknown | null;
  Protocoles?: unknown | null;
  Soins_corps?: unknown | null;
  Soins_mains_pieds?: unknown | null;
  Soins_visages?: unknown | null;
  sort?: number | null;
  Techniques_epilations?: unknown | null;
  user: string | DirectusUsers;
};

export type Prices = {
  commission_3_days_and_more?: number | null;
  commission_3_days_and_more_without_subscription?: number | null;
  commission_5_days_and_more?: number | null;
  commission_5_days_and_more_without_subscription?: number | null;
  commission_laser_3_days_and_more?: number | null;
  commission_laser_3_days_and_more_without_subscription?: number | null;
  commission_laser_5_days_and_more?: number | null;
  commission_laser_5_days_and_more_without_subscription?: number | null;
  commission_laser_one_service?: number | null;
  commission_laser_one_service_without_subscription?: number | null;
  commission_one_service?: number | null;
  commission_one_service_without_subscription?: number | null;
  date_updated?: string | null;
  freelance_monthly_subscription_price?: number | null;
  id: number;
  institute_monthly_subscription_price?: number | null;
  price_of_daily_laser_service?: number | null;
  price_of_daily_service?: number | null;
  user_updated?: string | DirectusUsers | null;
};

export type PushNotifications = {
  created_at?: string | null;
  id: number;
  token: string;
  user: string | DirectusUsers;
};

export type Rdv = {
  commentaire?: string | null;
  confirme?: string | null;
  date?: string | null;
  date_created?: string | null;
  date_updated?: string | null;
  facture?: string | null;
  freelance?: string | DirectusUsers | null;
  id: number;
  institut?: string | DirectusUsers | null;
  paye?: string | null;
  prestation?: unknown | null;
  sort?: number | null;
  user_created?: string | DirectusUsers | null;
  user_updated?: string | DirectusUsers | null;
};

export type CustomDirectusTypes = {
  actualites: Actualites[];
  avis: Avis[];
  directus_activity: DirectusActivity[];
  directus_collections: DirectusCollections[];
  directus_dashboards: DirectusDashboards[];
  directus_extensions: DirectusExtensions[];
  directus_fields: DirectusFields[];
  directus_files: DirectusFiles[];
  directus_flows: DirectusFlows[];
  directus_folders: DirectusFolders[];
  directus_migrations: DirectusMigrations[];
  directus_notifications: DirectusNotifications[];
  directus_operations: DirectusOperations[];
  directus_panels: DirectusPanels[];
  directus_permissions: DirectusPermissions[];
  directus_presets: DirectusPresets[];
  directus_relations: DirectusRelations[];
  directus_revisions: DirectusRevisions[];
  directus_roles: DirectusRoles[];
  directus_sessions: DirectusSessions[];
  directus_settings: DirectusSettings;
  directus_shares: DirectusShares[];
  directus_translations: DirectusTranslations[];
  directus_users: DirectusUsers[];
  directus_versions: DirectusVersions[];
  directus_webhooks: DirectusWebhooks[];
  disponibilite: Disponibilite[];
  faq: Faq[];
  hire_requests: HireRequests[];
  messages: Messages[];
  notation: Notation[];
  prestation: Prestation[];
  prices: Prices;
  push_notifications: PushNotifications[];
  rdv: Rdv[];
};
