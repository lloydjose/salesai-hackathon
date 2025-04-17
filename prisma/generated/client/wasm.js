
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  emailVerified: 'emailVerified',
  image: 'image',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  twoFactorEnabled: 'twoFactorEnabled',
  role: 'role',
  banned: 'banned',
  banReason: 'banReason',
  banExpires: 'banExpires',
  stripeCustomerId: 'stripeCustomerId'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  expiresAt: 'expiresAt',
  token: 'token',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  userId: 'userId',
  activeOrganizationId: 'activeOrganizationId',
  impersonatedBy: 'impersonatedBy'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  providerId: 'providerId',
  userId: 'userId',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  idToken: 'idToken',
  accessTokenExpiresAt: 'accessTokenExpiresAt',
  refreshTokenExpiresAt: 'refreshTokenExpiresAt',
  scope: 'scope',
  password: 'password',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VerificationScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  value: 'value',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logo: 'logo',
  createdAt: 'createdAt',
  metadata: 'metadata'
};

exports.Prisma.MemberScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  userId: 'userId',
  role: 'role',
  createdAt: 'createdAt'
};

exports.Prisma.InvitationScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  email: 'email',
  role: 'role',
  status: 'status',
  expiresAt: 'expiresAt',
  inviterId: 'inviterId'
};

exports.Prisma.TwoFactorScalarFieldEnum = {
  id: 'id',
  secret: 'secret',
  backupCodes: 'backupCodes',
  userId: 'userId'
};

exports.Prisma.PasskeyScalarFieldEnum = {
  id: 'id',
  name: 'name',
  publicKey: 'publicKey',
  userId: 'userId',
  credentialID: 'credentialID',
  counter: 'counter',
  deviceType: 'deviceType',
  backedUp: 'backedUp',
  transports: 'transports',
  createdAt: 'createdAt'
};

exports.Prisma.OauthApplicationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  icon: 'icon',
  metadata: 'metadata',
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  redirectURLs: 'redirectURLs',
  type: 'type',
  disabled: 'disabled',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OauthAccessTokenScalarFieldEnum = {
  id: 'id',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  accessTokenExpiresAt: 'accessTokenExpiresAt',
  refreshTokenExpiresAt: 'refreshTokenExpiresAt',
  clientId: 'clientId',
  userId: 'userId',
  scopes: 'scopes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OauthConsentScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  userId: 'userId',
  scopes: 'scopes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  consentGiven: 'consentGiven'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  plan: 'plan',
  referenceId: 'referenceId',
  stripeCustomerId: 'stripeCustomerId',
  stripeSubscriptionId: 'stripeSubscriptionId',
  status: 'status',
  periodStart: 'periodStart',
  periodEnd: 'periodEnd',
  cancelAtPeriodEnd: 'cancelAtPeriodEnd',
  seats: 'seats'
};

exports.Prisma.UserProfileScalarFieldEnum = {
  id: 'id',
  roleTitle: 'roleTitle',
  currentCompany: 'currentCompany',
  yearsOfExperience: 'yearsOfExperience',
  salesMethodology: 'salesMethodology',
  sellingStyle: 'sellingStyle',
  targetICP: 'targetICP',
  verticals: 'verticals',
  averageDealSize: 'averageDealSize',
  toolsUsed: 'toolsUsed',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CallSimulationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  personaDetails: 'personaDetails',
  callStatus: 'callStatus',
  recordingUrl: 'recordingUrl',
  transcript: 'transcript',
  duration: 'duration',
  feedback: 'feedback',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProspectScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  name: 'name',
  linkedinProfileUrl: 'linkedinProfileUrl',
  customData: 'customData',
  source: 'source',
  linkedinData: 'linkedinData',
  aiAnalysis: 'aiAnalysis',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CallPrepBriefScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  prospectId: 'prospectId',
  formInput: 'formInput',
  aiCallPrep: 'aiCallPrep',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.ProspectSource = exports.$Enums.ProspectSource = {
  MANUAL: 'MANUAL',
  LINKEDIN: 'LINKEDIN',
  CRM: 'CRM',
  OTHER: 'OTHER'
};

exports.Prisma.ModelName = {
  User: 'User',
  Session: 'Session',
  Account: 'Account',
  Verification: 'Verification',
  Organization: 'Organization',
  Member: 'Member',
  Invitation: 'Invitation',
  TwoFactor: 'TwoFactor',
  Passkey: 'Passkey',
  OauthApplication: 'OauthApplication',
  OauthAccessToken: 'OauthAccessToken',
  OauthConsent: 'OauthConsent',
  Subscription: 'Subscription',
  UserProfile: 'UserProfile',
  CallSimulation: 'CallSimulation',
  Prospect: 'Prospect',
  CallPrepBrief: 'CallPrepBrief'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
