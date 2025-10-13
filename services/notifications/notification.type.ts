export type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  updated_at: string;
};

export type DeviceSubscription = {
  id: string;
  user_id: string;
  device_type: string;
  push_token: string;
  p256dh: string;
  auth: string;
  is_enabled: boolean;
  created_at: string;
};

export type CreateDeviceSubscriptionDTO = {
  user_id: string;
  push_token: string;
  device_type: string;
  p256dh?: string;
  auth?: string;
};
