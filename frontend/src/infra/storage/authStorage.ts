import * as SecureStore from 'expo-secure-store';

import { LoginResponse, RegisterResponse } from '@domain/model/Auth';

const TOKEN_KEY = 'USER_TOKEN';
const USER_INFO_KEY = 'USER_INFO';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  return token || null;
}

export async function saveUserInfo(user: RegisterResponse | LoginResponse) {
  await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(user));
}

export async function getUserInfo(): Promise<RegisterResponse | LoginResponse | null> {
  const userInfo = await SecureStore.getItemAsync(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
}

export async function clearAuthData() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_INFO_KEY);
}
