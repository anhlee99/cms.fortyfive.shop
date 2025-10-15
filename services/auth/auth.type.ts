import { AgentRole } from "../agent-users/agent-user.type";

export type User = {
  id: string;
  name: string;
  role: AgentRole;
  agentId: string;
  email?: string;
  avatarUrl?: string;
};

export type UserClaims = {
  sub: string;
  app_metadata: [string, any];
  name?: string;
  email?: string;
  phone?: string;
  is_admin?: boolean;
  [k: string]: unknown;
};

export type UserSignUpData = {
  email: string;
  password: string;
  option?: { [key: string]: any };
};
