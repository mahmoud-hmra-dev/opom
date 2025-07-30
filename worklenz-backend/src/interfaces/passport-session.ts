import {IUser} from "./user";

export interface IPassportSession extends IUser {
  id?: string;
  email?: string;
  name?: string;
  owner?: boolean;
  team_id?: string;
  team_member_id?: string;
  team_name?: string;
  is_admin?: boolean;
  is_member?: boolean;
  is_google?: boolean;
  build_v?: string;
  timezone?: string;
  timezone_name?: string;
  socket_id?: string;
  is_expired?: boolean;
  owner_id?: string;
}
