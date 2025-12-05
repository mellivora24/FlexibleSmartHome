import { API_CONFIG } from "@infra/config/apiConfig";
import {
  GetListByDIDResponse,
  GetListSensorRequest,
  GetListSensorResponse,
} from "@model/SensorData";
import axios from "axios";

export const sensorDataApi = {
  getList: async (
    params: GetListSensorRequest,
    token: string
  ): Promise<GetListSensorResponse> => {
    try {
      const res = await axios.get(`${API_CONFIG.BASE_URL}/core/sensor-data`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data || res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  },

  getListByDID: async (
    did: number,
    limit: number,
    token: string
  ): Promise<GetListSensorResponse> => {
    try {
      const res = await axios.get<GetListByDIDResponse>(
        `${API_CONFIG.BASE_URL}/core/sensor-data/list/${did}`,
        {
          params: { limit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const normalizedData = res.data.data.map((item: any) => ({
        id: item.ID,
        uid: item.UID,
        did: item.DID,
        value: item.Value,
        unit: item.Unit,
        createdAt: item.CreatedAt,
        sensorName: item.SensorName || `Sensor ${item.DID}`,
      }));

      return {
        total: normalizedData.length,
        list: normalizedData,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  },
  getByIdAndValue: async (
    did: number,
    value: number,
    token: string
  ): Promise<GetListSensorResponse> => {
    try {
      const res = await axios.get<{ success: boolean; data: any }>(
        `${API_CONFIG.BASE_URL}/core/sensor-data/:1`,
        {
          params: {
            did: did,
            value: value,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const item = res.data.data;
      const normalizedData = [
        {
          id: item.id,
          uid: item.uid || 0,
          did: item.did,
          value: item.value,
          unit: item.unit,
          createdAt: item.createdAt,
          sensorName: item.sensorName || `Sensor ${item.did}`,
        },
      ];

      return {
        total: 1,
        list: normalizedData,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
      }
      throw error;
    }
  },
};
