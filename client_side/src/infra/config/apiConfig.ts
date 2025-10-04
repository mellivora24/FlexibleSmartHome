import Constants from 'expo-constants';

const { API_BASE_URL } = Constants.manifest?.extra || {};

export const API_CONFIG = {
  BASE_URL: API_BASE_URL || "http://192.168.1.108:8081/api/v1",
};
