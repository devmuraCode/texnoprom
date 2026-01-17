export interface IAuthSchema {
  userInfo: IAuthData | null;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

export interface IAuthData {
  access: string;
  refresh: string;
}
