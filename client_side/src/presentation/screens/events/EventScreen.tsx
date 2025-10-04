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
    { label: t('searchWidget.searchType.device'), value: 'name' },
    { label: t('searchWidget.searchType.value'), value: 'value' },
    { label: t('searchWidget.searchType.timeRange'), value: 'timeRange' },
  ];

  const handleSort = (column: keyof Event, direction: SortDirection) => {
    console.log(`Request sort: ${column} ${direction}`);
    setSortState({ column, direction });

    // TODO: Call API to get sorted data
    setData([...mockEventList.list]);
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
          username="Quyet Thanh"
          isHavingNotification={false}
          onAvatarPress={() => router.push('/add-on/account')}
          onNotificationPress={() => router.push('/add-on/notification')}
        />

        <View style={eventScreenStyle.body}>
          <SearchWidget
            placeholder="Search events..."
            value=""
            onChangeText={(text) => console.log(text)}
            dropdownItems={searchOptions}
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
