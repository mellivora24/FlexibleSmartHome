import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export interface CreateDeviceRequest {
  mid: number;
  rid: number;
  name: string;
  type: string;
  port: number;
}

export const AddDeviceScreen: React.FC = () => {
  const { t } = useTranslation();

  const [form, setForm] = useState<CreateDeviceRequest>({
    mid: 1, // mặc định, có thể thay đổi nếu người dùng chọn MCU khác
    rid: 0,
    name: "",
    type: "digitalDevice",
    port: 0,
  });

  const handleChange = (key: keyof CreateDeviceRequest, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.port || !form.rid) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường bắt buộc.");
      return;
    }

    try {
      // ⚙️ Gửi API tạo thiết bị (ví dụ)
      const res = await fetch("https://your-api-url.com/device/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      Alert.alert("Thành công", "Thiết bị đã được thêm!");
      setForm({ mid: 1, rid: 0, name: "", type: "digitalDevice", port: 0 });
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể thêm thiết bị.");
    }
  };

  return (
    <LinearGradient colors={["#2B275D", "#030912"]} style={{ flex: 1, padding: 20 }}>
      <ScrollView>
        <Text style={styles.title}>{t("addDevice.title") || "Thêm Thiết Bị Mới"}</Text>

        {/* MCU ID */}
        <Text style={styles.label}>MID (ID của MCU)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập MID"
          keyboardType="numeric"
          placeholderTextColor="#aaa"
          value={form.mid.toString()}
          onChangeText={(text) => handleChange("mid", Number(text))}
        />

        {/* Room ID */}
        <Text style={styles.label}>RID (ID phòng)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập RID"
          keyboardType="numeric"
          placeholderTextColor="#aaa"
          value={form.rid.toString()}
          onChangeText={(text) => handleChange("rid", Number(text))}
        />

        {/* Device Name */}
        <Text style={styles.label}>Tên thiết bị</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên thiết bị"
          placeholderTextColor="#aaa"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />

        {/* Device Type */}
        <Text style={styles.label}>Loại thiết bị</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              form.type === "digitalDevice" && styles.typeButtonActive,
            ]}
            onPress={() => handleChange("type", "digitalDevice")}
          >
            <Text style={styles.typeText}>Digital</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              form.type === "analogDevice" && styles.typeButtonActive,
            ]}
            onPress={() => handleChange("type", "analogDevice")}
          >
            <Text style={styles.typeText}>Analog</Text>
          </TouchableOpacity>
        </View>

        {/* Port */}
        <Text style={styles.label}>Cổng (Port)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số cổng"
          keyboardType="numeric"
          placeholderTextColor="#aaa"
          value={form.port ? form.port.toString() : ""}
          onChangeText={(text) => handleChange("port", Number(text))}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Thêm thiết bị</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  label: {
    color: "#ddd",
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: "#555",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  typeButtonActive: {
    backgroundColor: "#6B21A8",
    borderColor: "#A855F7",
  },
  typeText: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#6B21A8",
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
