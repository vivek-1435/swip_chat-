export type User = {
  id: number;
  username: string;
  phone?: string | null;
  display_name: string;
  avatar_url?: string | null;
  is_online: boolean;
  last_seen?: string | null;
  created_at: string;
};
