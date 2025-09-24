export type User = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
};

export type UserClaims = {
  sub: string
  name?: string
  email?: string
  is_admin?: boolean
  [k: string]: unknown
}