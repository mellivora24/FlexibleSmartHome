import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchWidget } from '@components/SearchTableWidget';
import { SensorDataTableWidget } from '@components/SensorDataTableWidget';
import { TopBarWidget } from '@components/TopBarWidget';
import { SensorData } from '@src/domain/model/SensorData';
import { BACKGROUND } from '@theme/colors';
import { mockSensorData } from 'test/mockData';
import { sensorScreenStyle } from './sensorScreenStyle';

type SortDirection = 'asc' | 'desc' | null;
interface SortState {
    column: keyof SensorData | null;
    direction: SortDirection;
}

export function SensorScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    const [sortState, setSortState] = useState<SortState>({
        column: null,
        direction: null,
    });
    const [data, setData] = useState<SensorData[]>(mockSensorData);

    const searchOptions = [
        { label: t('searchWidget.searchType.all'), value: 'all' },
        { label: t('searchWidget.searchType.name'), value: 'name' },
        { label: t('searchWidget.searchType.room'), value: 'room' },
        { label: t('searchWidget.searchType.value'), value: 'value' },
        { label: t('searchWidget.searchType.timeRange'), value: 'timeRange' },
    ];

    const handleSort = (column: keyof SensorData, direction: SortDirection) => {
        console.log(`Request sort: ${column} ${direction}`);
        setSortState({ column, direction });

        // TODO: Call API to get sorted data
        setData([...mockSensorData]);
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
                    username="Quyet Thanh"
                    isHavingNotification={false}
                    onAvatarPress={() => router.push('/add-on/account')}
                    onNotificationPress={() => router.push('/add-on/notification')}
                />

                <View style={sensorScreenStyle.body}>
                    <SearchWidget
                        placeholder="Search sensors..."
                        value=""
                        dropdownItems={searchOptions}
                        onChangeText={(text) => console.log(text)}
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
