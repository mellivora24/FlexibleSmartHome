import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

import { TopBarWidget } from "@components/TopBarWidget";
import { useDevicesViewModel } from "@presentation/hooks/useDevicesViewModel";
import { useAuthContext } from "@src/presentation/hooks/useAppContext";
import { BACKGROUND } from "@theme/colors";
import { AddModalComponent } from "./components/addModal/AddModal";
import { DeviceCard } from "./components/deviceCard/DeviceCard";
import { FloatingActionButton } from "./components/FloatButton";
import { deviceScreenStyle } from "./deviceStyle";

export const DeviceScreen: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { token } = useAuthContext();

    const {
        devices,
        loading,
        error,
        openModal,
        showErrorModal,
        showSuccessModal,
        successMessage,
        setShowErrorModal,
        setShowSuccessModal,
        setOpenModal,
        handleCreateDevice,
        handleEditDevice,
        handleDeleteDevice,
    } = useDevicesViewModel(token);

    const renderShimmer = () => (
        <>
            {[...Array(5)].map((_, idx) => (
                <ShimmerPlaceholder
                    key={idx}
                    LinearGradient={LinearGradient}
                    visible={false}
                    shimmerColors={["#ebebeb", "#c5c5c5", "#ebebeb"]}
                    style={deviceScreenStyle.shimmerItem}
                />
            ))}
        </>
    );

    return (
        <LinearGradient
            colors={BACKGROUND.GRADIENT as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={deviceScreenStyle.container}>
                <TopBarWidget
                    username="Quyet Thanh"
                    isHavingNotification={false}
                    onAvatarPress={() => router.push("/add-on/account")}
                    onNotificationPress={() => router.push("/add-on/notification")}
                />

                <View style={deviceScreenStyle.body}>
                    <ScrollView
                        style={deviceScreenStyle.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 16 }}
                    >
                        {loading ? (
                            renderShimmer()
                        ) : devices.length > 0 ? (
                            devices.map((device) => (
                                <DeviceCard
                                    key={device.id}
                                    device={device}
                                    onEdit={handleEditDevice}
                                    onDelete={handleDeleteDevice}
                                />
                            ))
                        ) : (
                            <View style={deviceScreenStyle.noDeviceContainer}>
                                <Text style={deviceScreenStyle.noDeviceContext}>
                                    {t("deviceList.noDevice")}
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>

                {openModal && (
                    <AddModalComponent
                        visible={openModal}
                        onClose={() => setOpenModal(false)}
                        onSave={handleCreateDevice}
                        availablePorts={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
                    />
                )}
            </SafeAreaView>

            <FloatingActionButton onPress={() => setOpenModal(true)} />

            <Modal
                isVisible={showErrorModal}
                onBackdropPress={() => setShowErrorModal(false)}
                backdropOpacity={0.5}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                useNativeDriver
            >
                <View
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: 16,
                        padding: 20,
                        alignItems: "center",
                    }}
                >
                    <Ionicons name="alert-circle" size={60} color="#ff4d4f" />
                    <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 10 }}>
                        Có lỗi rồi!
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            textAlign: "center",
                            marginVertical: 10,
                            color: "#333",
                        }}
                    >
                        {error || "Vui lòng thử lại sau."}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setShowErrorModal(false)}
                        style={{
                            backgroundColor: "#ff4d4f",
                            paddingHorizontal: 24,
                            paddingVertical: 10,
                            borderRadius: 12,
                            marginTop: 8,
                        }}
                    >
                        <Text style={{ color: "white", fontWeight: "600" }}>
                            Hoan hỉ bỏ qua
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal
                isVisible={showSuccessModal}
                onBackdropPress={() => setShowSuccessModal(false)}
                backdropOpacity={0.5}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                useNativeDriver
            >
                <View
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: 16,
                        padding: 20,
                        alignItems: "center",
                    }}
                >
                    <Ionicons name="checkmark-circle" size={60} color="#52c41a" />
                    <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 10 }}>
                        Thành công!
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            textAlign: "center",
                            marginVertical: 10,
                            color: "#333",
                        }}
                    >
                        {successMessage}
                    </Text>
                    <TouchableOpacity
                        onPress={() => setShowSuccessModal(false)}
                        style={{
                            backgroundColor: "#52c41a",
                            paddingHorizontal: 24,
                            paddingVertical: 10,
                            borderRadius: 12,
                            marginTop: 8,
                        }}
                    >
                        <Text style={{ color: "white", fontWeight: "600" }}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </LinearGradient>
    );
};
