import { SearchParams } from "@/types/pagination";

export type AgentRole = "owner" | "admin" | "manager" | "editor" | "viewer";

export type AgentUser = {
  id: string;
  full_name: string;
  role: AgentRole;
  agentId: string;
  username: string;
  avatarUrl?: string;
};

export type AgentUserCreateDTO = {
  full_name: string;
  username: string;
  password: string;
  role: AgentRole;
  agentId: string;
  avatar_url?: string;
};

export type AgentUserUpdateDTO = Partial<AgentUserCreateDTO> & {
  id: string;
};

export interface AgentUserSearchParams extends SearchParams {}
