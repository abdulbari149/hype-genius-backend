export interface JwtAccessPayload {
  user_id: number;
  role_id: number;
  role: string;
  business_id?: number;
  channel_id?: number;
}
