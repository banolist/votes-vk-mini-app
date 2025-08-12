export const hasRights = (targget: number, r: UserRights) => (targget & r) == r;

export enum UserRights {
  None = 1,
  Admin = 2,
  User = 4,
  Expert = 8,
  Organizator = 16,
  PreExpert = 32,
  Verified = 64,
}
