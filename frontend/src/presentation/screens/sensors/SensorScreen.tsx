import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchWidget } from '@components/SearchTableWidget';
import { SensorDataTableWidget } from '@components/SensorDataTableWidget';
import { TopBarWidget } from '@components/TopBarWidget';
import { useAuthContext } from '@hooks/useAppContext';
import { useDevicesViewModel } from '@hooks/useDevicesViewModel';
import { useSensorViewModel } from '@hooks/useSensorViewModel';
import { BACKGROUND } from '@theme/colors';
import { sensorScreenStyle } from './sensorScreenStyle';

export function SensorScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { authData } = useAuthContext();
    const token = authData?.token || '';

    const {
        sortState,
        paginatedData,
        currentPage,
        totalPages,
        totalItems,
        refreshing,
        loading,
        error,
        handleSort,
        handleSearch,
        handlePageChange,
        handleRefresh,
        fetchDataByDIDAndValue,
    } = useSensorViewModel();

    const { devices, loading: devicesLoading } = useDevicesViewModel(token);

    const [selectedSearchType, setSelectedSearchType] = useState<string>('all');
    const [searchValue, setSearchValue] = useState<string>('');

    const searchOptions = useMemo(() => {
        const baseOptions = [
            { label: t('searchWidget.searchType.all'), value: 'all' },
            { label: t('searchWidget.searchType.name'), value: 'name' },
            { label: t('searchWidget.searchType.value'), value: 'value' },
            { label: t('searchWidget.searchType.timeRange'), value: 'timeRange' },
        ];

        const deviceOptions = devices.filter(device =>
                [
                    'digitalSensor',
                    'analogSensor',
                    'temperatureSensor',
                    'humiditySensor'
                ].includes(device.type)
            )
            .map(device => ({
                label: device.name,
                value: `device_${device.id}`,
                did: device.id,
            }));

        return [...baseOptions, ...deviceOptions];
    }, [devices, t]);

    const handleSearchPress = async (searchType: string, searchText: string) => {
        setSelectedSearchType(searchType);
        setSearchValue(searchText);

        if (searchType.startsWith('device_')) {
            const did = parseInt(searchType.replace('device_', ''));

            if (searchText.trim()) {
                const value = parseFloat(searchText);
                if (!isNaN(value)) {
                    await fetchDataByDIDAndValue(did, value);
                } else {
                    console.warn('Invalid value for device search');
                }
            } else {
                handleSearch('did', did.toString());
            }
        } else {
            handleSearch(searchType, searchText);
        }
    };

    return (
        <LinearGradient
            colors={BACKGROUND.GRADIENT as [string, string]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.8, y: 0 }}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={sensorScreenStyle.container}>
                <TopBarWidget
                    onAvatarPress={() => router.push('/add-on/account')}
                    onNotificationPress={() => router.push('/add-on/notification')}
                />

                <View style={sensorScreenStyle.body}>
                    <SearchWidget
                        placeholder={
                            selectedSearchType.startsWith('device_')
                                ? t('searchWidget.placeholder.deviceValue', 'Enter sensor value...')
                                : t('searchWidget.placeholder', 'Search sensors...')
                        }
                        value={searchValue}
                        dropdownItems={searchOptions}
                        onSearchPress={handleSearchPress}
                    />

                    {error && !loading && !refreshing ? (
                        <View style={sensorScreenStyle.errorContainer}>
                            <Text style={sensorScreenStyle.errorText}>{error}</Text>
                            <Text
                                style={sensorScreenStyle.retryText}
                                onPress={handleRefresh}
                            >
                                {t('common.retry')}
                            </Text>
                        </View>
                    ) : loading && !refreshing ? (
                        <View style={sensorScreenStyle.loadingContainer}>
                            <ActivityIndicator size="large" color="#007AFF" />
                            <Text style={sensorScreenStyle.loadingText}>
                                {t('common.loading')}
                            </Text>
                        </View>
                    ) : (
                        <View style={sensorScreenStyle.tableContainer}>
                            <SensorDataTableWidget
                                data={paginatedData}
                                currentSort={sortState}
                                onSort={handleSort}
                                showIdColumn={false}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                onRefresh={handleRefresh}
                                refreshing={refreshing}
                            />
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
