import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventTableWidget } from '@components/EventTableWidget';
import { SearchWidget } from '@components/SearchTableWidget';
import { TopBarWidget } from '@components/TopBarWidget';
import { Event } from '@src/domain/model/Event';
import { BACKGROUND } from '@theme/colors';
import { mockEventList } from 'test/mockData';
import { eventScreenStyle } from './eventScreenStyle';

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  column: keyof Event | null;
  direction: SortDirection;
}

export function EventScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [data, setData] = useState<Event[]>([...mockEventList.list]);
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });

  const searchOptions = [
    { label: t('searchWidget.searchType.all'), value: 'all' },
    { label: t('searchWidget.searchType.name'), value: 'deviceName' },
    { label: t('searchWidget.searchType.action'), value: 'action' },
  ];

  const handleSort = (column: keyof Event, direction: SortDirection) => {
    setSortState({ column, direction });
    if (direction === null) {
      setData([...mockEventList.list]);
      return;
    }

    const sortedData = [...data].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });
    setData(sortedData);
  };

  const handleSearchPress = (searchType: string, searchText: string) => {
    if (searchText.trim() === '') {
      setData([...mockEventList.list]);
    } else {
      const text = searchText.toLowerCase();
      const filteredData = mockEventList.list.filter((item) => {
        if (searchType === 'all') {
          return (
            item.deviceName.toLowerCase().includes(text) ||
            item.action.toLowerCase().includes(text)
          );
        }
        const fieldValue = (item as any)[searchType];
        return String(fieldValue).toLowerCase().includes(text);
      });
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
      <SafeAreaView style={eventScreenStyle.container}>
        <TopBarWidget
          onAvatarPress={() => router.push('/add-on/account')}
          onNotificationPress={() => router.push('/add-on/notification')}
        />

        <View style={eventScreenStyle.body}>
          <SearchWidget
            placeholder={t('searchWidget.placeholder')}
            value=""
            dropdownItems={searchOptions}
            onSearchPress={handleSearchPress}
          />

          <View style={eventScreenStyle.tableContainer}>
            <EventTableWidget
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
