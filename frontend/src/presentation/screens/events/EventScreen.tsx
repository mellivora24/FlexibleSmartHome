import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventTableWidget } from '@components/EventTableWidget';
import { SearchWidget } from '@components/SearchTableWidget';
import { TopBarWidget } from '@components/TopBarWidget';
import { useAuthContext } from '@hooks/useAppContext';
import { useDevicesViewModel } from '@hooks/useDevicesViewModel';
import { useEventViewModel } from '@hooks/useEventViewModel';
import type { EventModel as Event } from '@src/domain/model/Event';
import { BACKGROUND } from '@theme/colors';
import { eventScreenStyle } from './eventScreenStyle';

export function EventScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { authData } = useAuthContext();
  const token = authData?.token || '';

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
    fetchEventByIdAndAction,
    clearFilters,
  } = useEventViewModel();

  const { devices, loading: devicesLoading } = useDevicesViewModel(token);

  const [selectedSearchType, setSelectedSearchType] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    console.log('Devices loaded for EventScreen:', devices.length, 'devices');
  }, [devices]);

  const searchOptions = useMemo(() => {
    const baseOptions = [
      { label: t('searchWidget.searchType.all'), value: 'all' },
      { label: t('searchWidget.searchType.name'), value: 'name' },
      { label: t('searchWidget.searchType.value'), value: 'value' },
      { label: t('searchWidget.searchType.timeRange'), value: 'timeRange' },
    ];

    const deviceOptions = devices.filter(device =>
      [
        'digitalDevice',
        'analogDevice',
      ].includes(device.type)
    )
      .map(device => ({
        label: device.name,
        value: `device_${device.id}`,
        did: device.id,
      }));

    return [...baseOptions, ...deviceOptions];
  }, [devices, t]);

  const currentSort = useMemo(() => ({
    column: sort.field as keyof Event,
    direction: sort.direction as 'asc' | 'desc' | null
  }), [sort.field, sort.direction]);

  const handleSearchPress = async (
    searchType: string,
    searchText: string,
    startTime?: string,
    endTime?: string
  ) => {
    setSelectedSearchType(searchType);
    setSearchValue(searchText);

    // Clear filters if no search text and not time range
    if (!searchText && searchType !== 'timeRange') {
      clearFilters();
      return;
    }

    // Handle time range search
    if (searchType === 'timeRange' && startTime && endTime) {
      filterByTimeRange(startTime, endTime);
      return;
    }

    // Handle device-specific search
    if (searchType.startsWith('device_')) {
      const did = parseInt(searchType.replace('device_', ''));

      if (searchText.trim()) {
        // Search by device ID and action
        const actionMapping: Record<string, string> = {
          'bật': 'TURN_ON',
          'tắt': 'TURN_OFF',
          'khóa': 'LOCK',
          'mở khóa': 'UNLOCK',
          'nhiệt độ': 'SET_TEMPERATURE',
        };

        const lowerText = searchText.toLowerCase().trim();
        const action = actionMapping[lowerText] || searchText.toUpperCase();

        await fetchEventByIdAndAction(did, action, token);
      } else {
        console.warn('No action provided for device search');
      }
      return;
    }

    // Action mapping for Vietnamese
    const actionMapping: Record<string, string> = {
      'bật': 'TURN_ON',
      'tắt': 'TURN_OFF',
      'khóa': 'LOCK',
      'mở khóa': 'UNLOCK',
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
            placeholder={
              selectedSearchType.startsWith('device_')
                ? t('searchWidget.placeholder.deviceAction', 'Nhập hành động...')
                : t('searchWidget.placeholder.event', 'Tìm kiếm sự kiện...')
            }
            value={searchValue}
            dropdownItems={searchOptions}
            onSearchPress={handleSearchPress}
          />

          {devicesLoading && (
            <View style={eventScreenStyle.infoContainer}>
              <Text style={eventScreenStyle.infoText}>
                {t('common.loadingDevices', 'Đang tải danh sách thiết bị...')}
              </Text>
            </View>
          )}

          {error && !loading ? (
            <View style={eventScreenStyle.errorContainer}>
              <Text style={eventScreenStyle.errorText}>{error}</Text>
              <Text style={eventScreenStyle.retryText} onPress={refresh}>
                {t('common.retry', 'Thử lại')}
              </Text>
            </View>
          ) : loading && !hasEvents ? (
            <View style={eventScreenStyle.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={eventScreenStyle.loadingText}>
                {t('common.loading', 'Đang tải...')}
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
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
