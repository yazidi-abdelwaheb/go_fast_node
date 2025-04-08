//****** USER ENUMS *******
const UserTypeEnum = {
  super: "super",
  admin: "admin",
  user: "user",
};
Object.freeze(UserTypeEnum);

const userState = {
  newInvalidCode: "newInvalidCode",
  old: "old",
};
Object.freeze(userState);

const UserLanguagesEnum = {
  en: "en",
  fr: "fr",
  es: "es",
  ar: "ar",
};

const UserStatusEnum = {
  online : "online",
  away : "away",
  invisible : "not-visible",
  busy : "busy",
};

//****** FEATURES ENUMS *******
const FeaturesTypeEnum = {
  group: "group",
  collapsable: "collapsable",
  basic: "basic",
};
Object.freeze(FeaturesTypeEnum);

const FeaturesStatusEnum = {
  active: "active",
  suspended: "suspended",
};
Object.freeze(FeaturesStatusEnum);

const featureStatus = {
  active: "active",
  notActive: "notActive",
};
Object.freeze(featureStatus);

const featuresCodeEnum = {
  setting: "setting",
  account: "account",
  profile: "profile",
  administration: "administration",
  company: "company",
  features: "features",
  groups: "groups",
  users: "users",
};
Object.freeze(featuresCodeEnum);

const featuresActionsEnum = {
  list: "list",
  create: "create",
  read: "read",
  update: "update",
  delete: "delete",
};
Object.freeze(featuresActionsEnum);

//****** ORDERS ENUMS *******

const Orderstatus = {
  pending: "pending",
  confirmed: "confirmed",
  shipped: "shipped",
  delivered: "delivered",
  canceled: "canceled",
  returned: "returned",
};
Object.freeze(Orderstatus);



export {
  UserTypeEnum,
  FeaturesTypeEnum,
  FeaturesStatusEnum,
  userState,
  featureStatus,
  Orderstatus,
  featuresCodeEnum,
  featuresActionsEnum,
  UserLanguagesEnum,
  UserStatusEnum
};
