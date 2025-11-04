import type { EventModel as Event } from '@src/domain/model/Event';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { columnStyles, tableStyles } from './tableStyle';

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  column: keyof Event | null;
  direction: SortDirection;
}

interface Column {
  key: keyof Event;
  title: string;
  flex: number;
  sortable?: boolean;
  render?: (value: any, item: Event) => string;
}

interface EventTableWidgetProps {
  data?: Event[] | null;
  headerStyle?: object;
  cellStyle?: object;
  onSort?: (column: keyof Event, direction: SortDirection) => void;
  currentSort?: SortState;
  showIdColumn?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function EventTableWidget({
  data = [],
  headerStyle = {},
  cellStyle = {},
  onSort,
  currentSort,
  showIdColumn = false,
  currentPage,
  totalPages,
  onPageChange,
  onRefresh,
  refreshing = false
}: EventTableWidgetProps) {
  const { width: screenWidth } = useWindowDimensions();

  const allColumns: Column[] = useMemo(
    () => [
      { key: 'id', title: 'ID', flex: 0.5, sortable: false },
      { key: 'deviceName', title: 'Thiết bị', flex: 1.8, sortable: true },
      {
        key: 'action',
        title: 'Hành động',
        flex: 2,
        sortable: false,
        render: (value, item) => {
          switch (value) {
            case 'SET_TEMPERATURE':
              return `${item.payload.temperature}°C`;
            case 'TURN_ON':
              return `Bật (${item.payload.brightness}%)`;
            case 'TURN_OFF':
              return `Tắt (${item.payload.reason})`;
            case 'LOCK':
              return item.payload.status;
            default:
              return String(value);
          }
        },
      },
      {
        key: 'createdAt',
        title: 'Thời gian',
        flex: 1.5,
        sortable: true,
        render: (value) =>
          new Date(value).toLocaleTimeString('vi-VN', {
            day: '2-digit',
            year: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
      },
    ],
    []
  );

  const columns = useMemo(
    () => (showIdColumn ? allColumns : allColumns.filter((col) => col.key !== 'id')),
    [showIdColumn, allColumns]
  );

  const totalFlex = columns.reduce((sum, col) => sum + col.flex, 0);
  const tableWidth = screenWidth - 32;
  const getColumnWidth = (flex: number) => (tableWidth * flex) / totalFlex;

  const handleSort = (column: keyof Event) => {
    if (!onSort) return;
    let newDirection: SortDirection = 'asc';
    if (currentSort?.column === column) {
      if (currentSort.direction === 'asc') newDirection = 'desc';
      else if (currentSort.direction === 'desc') newDirection = null;
    }
    onSort(column, newDirection);
  };

  const renderSortIcon = (column: keyof Event) => {
    const size = 14;
    const color = '#fff';
    if (currentSort?.column !== column)
      return <ArrowUpDown size={size} color={color} opacity={0.6} />;
    if (currentSort.direction === 'asc') return <ArrowUp size={size} color={color} />;
    if (currentSort.direction === 'desc') return <ArrowDown size={size} color={color} />;
    return <ArrowUpDown size={size} color={color} opacity={0.6} />;
  };

  const renderRow = ({ item, index }: { item: Event; index: number }) => (
    <View
      style={[
        tableStyles.row,
        index % 2 === 0 ? tableStyles.evenRow : tableStyles.oddRow,
      ]}
    >
      {columns.map((column) => {
        const value = item[column.key];
        const displayValue = column.render
          ? column.render(value, item)
          : String(value);
        const width = getColumnWidth(column.flex);
        const customTextStyle =
          columnStyles[column.key as keyof typeof columnStyles];

        return (
          <View
            key={column.key as string}
            style={[
              tableStyles.cell,
              { width, minWidth: width },
              cellStyle,
            ]}
          >
            <Text
              style={[tableStyles.cellText, customTextStyle]}
              numberOfLines={2}
            >
              {displayValue}
            </Text>
          </View>
        );
      })}
    </View>
  );

  if (!data || data.length === 0)
    return (
      <View style={tableStyles.emptyContainer}>
        <Text style={tableStyles.emptyText}>Không có dữ liệu điều khiển</Text>
      </View>
    );

  return (
    <View style={tableStyles.container}>
      <View style={[tableStyles.table, { width: tableWidth }]}>
        <View style={[tableStyles.row, tableStyles.headerRow]}>
          {columns.map((column) => {
            const width = getColumnWidth(column.flex);
            return (
              <TouchableOpacity
                key={column.key as string}
                activeOpacity={column.sortable ? 0.7 : 1}
                onPress={() => column.sortable && handleSort(column.key)}
                style={[
                  tableStyles.cell,
                  tableStyles.headerCell,
                  { width, minWidth: width },
                  headerStyle,
                ]}
              >
                <View style={tableStyles.headerContent}>
                  <Text style={tableStyles.headerText}>{column.title}</Text>
                  {column.sortable && renderSortIcon(column.key)}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={data}
          renderItem={renderRow}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          style={tableStyles.flatList}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#412180']}
                tintColor="#412180"
                progressBackgroundColor="#fff"
              />
            ) : undefined
          }
        />
      </View>

      {totalPages && totalPages > 0 && onPageChange && (
        <View style={tableStyles.paginationContainer}>
          <TouchableOpacity
            style={[
              tableStyles.paginationButton,
              currentPage === 1 && tableStyles.paginationButtonDisabled,
            ]}
            onPress={() =>
              currentPage && currentPage > 1 && onPageChange(currentPage - 1)
            }
            disabled={currentPage === 1}
          >
            <Text
              style={[
                tableStyles.paginationButtonText,
                currentPage === 1 && tableStyles.paginationButtonTextDisabled,
              ]}
            >
              ←
            </Text>
          </TouchableOpacity>

          <View style={tableStyles.paginationInfo}>
            <Text style={tableStyles.paginationText}>
              Trang {currentPage} / {totalPages}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              tableStyles.paginationButton,
              currentPage === totalPages && tableStyles.paginationButtonDisabled,
            ]}
            onPress={() =>
              currentPage &&
              totalPages &&
              currentPage < totalPages &&
              onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          >
            <Text
              style={[
                tableStyles.paginationButtonText,
                currentPage === totalPages &&
                  tableStyles.paginationButtonTextDisabled,
              ]}
            >
              →
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
