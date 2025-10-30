import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchWidget } from '@components/SearchTableWidget';
import { SensorDataTableWidget } from '@components/SensorDataTableWidget';
import { TopBarWidget } from '@components/TopBarWidget';
import { SensorDataDB } from '@model/SensorData';
import { BACKGROUND } from '@theme/colors';
import { mockSensorData } from 'test/mockData';
import { sensorScreenStyle } from './sensorScreenStyle';

type SortDirection = 'asc' | 'desc' | null;
interface SortState {
    column: keyof SensorDataDB | null;
    direction: SortDirection;
}

export function SensorScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const [sortState, setSortState] = useState<SortState>({
        column: null,
        direction: null,
    });
    const [data, setData] = useState<SensorDataDB[]>(mockSensorData);

    const searchOptions = [
        { label: t('searchWidget.searchType.all'), value: 'all' },
        { label: t('searchWidget.searchType.name'), value: 'name' },
        { label: t('searchWidget.searchType.value'), value: 'value' },
        { label: t('searchWidget.searchType.timeRange'), value: 'timeRange' },
    ];

    const handleSort = (column: keyof SensorDataDB, direction: SortDirection) => {
        setSortState({ column, direction });

        // TODO: Call API to get sorted data
        setData([...mockSensorData]);
    };

    const handleSearchPress = (searchType: string, searchText: string) => {
        if (searchText.trim() === '') {
            setData([...mockSensorData]);
        } else {
            const filteredData = mockSensorData.filter((item) => {
                if (searchType === 'all') {
                    return (
                        item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.value?.toString().toLowerCase().includes(searchText.toLowerCase())
                    );
                } else if (searchType === 'name') {
                    return item.name?.toLowerCase().includes(searchText.toLowerCase());
                } else if (searchType === 'value') {
                    return item.value?.toString().toLowerCase().includes(searchText.toLowerCase());
                } else {
                    return false;
                }
            });
            console.log('Filtered Data:', filteredData);
            setData(filteredData);
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
                        placeholder="Search sensors..."
                        value=""
                        dropdownItems={searchOptions}
                        onSearchPress={handleSearchPress}
                    />

                    <View style={sensorScreenStyle.tableContainer}>
                        <SensorDataTableWidget
                            data={data}
                            currentSort={sortState}
                            onSort={handleSort}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}
