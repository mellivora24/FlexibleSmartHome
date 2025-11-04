import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventTableWidget } from '@components/EventTableWidget';
import { SearchWidget } from '@components/SearchTableWidget';
import { TopBarWidget } from '@components/TopBarWidget';
import { useEventViewModel } from '@hooks/useEventViewModel';
import type { EventModel as Event } from '@src/domain/model/Event';
import { BACKGROUND } from '@theme/colors';
import { eventScreenStyle } from './eventScreenStyle';

export function EventScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
    events,
    loading,
    error,
    refresh,
    currentPage,
    totalPages,
    goToPage,
    sort,
    updateSort,
    search,
    filterByTimeRange,
    clearFilters,
  } = useEventViewModel();

  const searchOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Thiết bị', value: 'device' },
    { label: 'Hành động', value: 'action' },
    { label: 'Thời gian', value: 'timeRange' },
  ];

  const currentSort = useMemo(() => ({
    column: sort.field as keyof Event,
    direction: sort.direction as 'asc' | 'desc' | null
  }), [sort.field, sort.direction]);

  const handleSearchPress = (
    searchType: string, 
    searchText: string, 
    startTime?: string, 
    endTime?: string
  ) => {
    if (!searchText && searchType !== 'timeRange') {
      clearFilters();
      return;
    }

    if (searchType === 'timeRange' && startTime && endTime) {
      filterByTimeRange(startTime, endTime);
      return;
    }

    const actionMapping: Record<string, string> = {
      'bật': 'TURN_ON',
      'tắt': 'TURN_OFF',
      'khóa': 'LOCK',
      'nhiệt độ': 'SET_TEMPERATURE',
    };

    let searchValue = searchText;
    
    if (searchType === 'action' || searchType === 'all') {
      const lowerText = searchText.toLowerCase().trim();
      searchValue = actionMapping[lowerText] || searchText;
    }

    switch (searchType) {
      case 'all':
        search(searchValue, 'action');
        break;
      case 'device':
        search(searchValue, 'deviceName');
        break;
      case 'action':
        search(searchValue, 'action');
        break;
      default:
        search(searchValue, 'action');
    }
  };

  const handleSort = (column: keyof Event, direction: 'asc' | 'desc' | null) => {
    if (direction === null) {
      return;
    }
    updateSort(column as any);
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const safeEvents = events || [];
  const hasEvents = safeEvents.length > 0;

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
            placeholder="Tìm kiếm sự kiện..."
            value=""
            dropdownItems={searchOptions}
            onSearchPress={handleSearchPress}
          />

          {error && !loading ? (
            <View style={eventScreenStyle.errorContainer}>
              <Text style={eventScreenStyle.errorText}>{error}</Text>
              <Text style={eventScreenStyle.retryText} onPress={refresh}>
                Thử lại
              </Text>
            </View>
          ) : loading && !hasEvents ? (
            <View style={eventScreenStyle.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={eventScreenStyle.loadingText}>
                Đang tải...
              </Text>
            </View>
          ) : (
            <View style={eventScreenStyle.tableContainer}>
              <EventTableWidget
                data={safeEvents}
                currentSort={currentSort}
                onSort={handleSort}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onRefresh={refresh}
                refreshing={loading}
              />

              {!hasEvents && !loading && (
                <View style={eventScreenStyle.emptyContainer}>
                  <Text style={eventScreenStyle.emptyText}>
                    Không có dữ liệu
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}