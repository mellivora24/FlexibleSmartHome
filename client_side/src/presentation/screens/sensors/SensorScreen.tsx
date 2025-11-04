import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchWidget } from '@components/SearchTableWidget';
import { SensorDataTableWidget } from '@components/SensorDataTableWidget';
import { TopBarWidget } from '@components/TopBarWidget';
import { useSensorViewModel } from '@hooks/useSensorViewModel';
import { BACKGROUND } from '@theme/colors';
import { sensorScreenStyle } from './sensorScreenStyle';

export function SensorScreen() {
    const router = useRouter();
    const { t } = useTranslation();

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
    } = useSensorViewModel();

    const searchOptions = [
        { label: t('searchWidget.searchType.all'), value: 'all' },
        { label: t('searchWidget.searchType.name'), value: 'name' },
        { label: t('searchWidget.searchType.value'), value: 'value' },
        { label: t('searchWidget.searchType.timeRange'), value: 'timeRange' },
    ];

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
                        placeholder={t('searchWidget.placeholder', 'Search sensors...')}
                        value=""
                        dropdownItems={searchOptions}
                        onSearchPress={handleSearch}
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
