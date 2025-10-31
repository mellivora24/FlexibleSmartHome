import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

import { SensorData } from '@src/domain/model/SensorData';
import { columnStyles, tableStyles } from './tableStyle';

interface Column {
  key: keyof SensorData;
  title: string;
  flex: number;
  sortable?: boolean;
  render?: (value: any, item: SensorData) => string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  column: keyof SensorData | null;
  direction: SortDirection;
}

interface SensorDataTableWidgetProps {
  data: SensorData[];
  headerStyle?: object;
  cellStyle?: object;
  onSort?: (column: keyof SensorData, direction: SortDirection) => void;
  currentSort?: SortState;
  showIdColumn?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function SensorDataTableWidget({
  data,
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
}: SensorDataTableWidgetProps) {
  const { width: screenWidth } = useWindowDimensions();
  
  const allColumns: Column[] = useMemo(() => [
    {
      key: 'id',
      title: 'ID',
      flex: 0.5,
      sortable: false,
    },
    {
      key: 'sensorName',
      title: 'Cảm biến',
      flex: 2,
      sortable: true,
    },
    {
      key: 'value',
      title: 'Giá trị',
      flex: 1.3,
      sortable: true,
      render: (value) => Number(value).toFixed(1)
    },
    {
      key: 'unit',
      title: 'Đơn vị',
      flex: 1,
      sortable: false,
    },
    {
      key: 'createdAt',
      title: 'Thời gian',
      flex: 1.5,
      sortable: true,
      render: (value) => new Date(value).toLocaleTimeString('vi-VN', {
        day: '2-digit',
        year: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ], []);

  const columns = useMemo(
    () => showIdColumn ? allColumns : allColumns.filter(col => col.key !== 'id'),
    [showIdColumn, allColumns]
  );

  const totalFlex = useMemo(
    () => columns.reduce((sum, col) => sum + col.flex, 0),
    [columns]
  );

  const tableWidth = useMemo(() => {
    return screenWidth - 32;
  }, [screenWidth]);

  const getColumnWidth = (flex: number) => {
    return (tableWidth * flex) / totalFlex;
  };

  const handleSort = (column: keyof SensorData) => {
    if (!onSort) return;

    let newDirection: SortDirection = 'asc';

    if (currentSort?.column === column) {
      if (currentSort.direction === 'asc') {
        newDirection = 'desc';
      } else if (currentSort.direction === 'desc') {
        newDirection = null;
      }
    }

    onSort(column, newDirection);
  };

  const renderSortIcon = (column: keyof SensorData) => {
    const iconSize = 14;
    const iconColor = '#fff';

    if (currentSort?.column !== column) {
      return <ArrowUpDown size={iconSize} color={iconColor} opacity={0.6} />;
    }

    if (currentSort.direction === 'asc') {
      return <ArrowUp size={iconSize} color={iconColor} />;
    } else if (currentSort.direction === 'desc') {
      return <ArrowDown size={iconSize} color={iconColor} />;
    }
    return <ArrowUpDown size={iconSize} color={iconColor} opacity={0.6} />;
  };

  const renderRow = ({ item, index }: { item: SensorData; index: number }) => (
    <View style={[
      tableStyles.row,
      index % 2 === 0 ? tableStyles.evenRow : tableStyles.oddRow
    ]}>
      {columns.map((column) => {
        const value = item[column.key];
        const displayValue = column.render
          ? column.render(value, item)
          : String(value);

        const customTextStyle = columnStyles[column.key as keyof typeof columnStyles];
        const width = getColumnWidth(column.flex);

        return (
          <View
            key={column.key}
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

  if (!data || data.length === 0) {
    return (
      <View style={tableStyles.emptyContainer}>
        <Text style={tableStyles.emptyText}>Không có dữ liệu sensor</Text>
      </View>
    );
  }

  return (
    <View style={tableStyles.container}>
      <View style={[tableStyles.table, { width: tableWidth }]}>
        <View style={[tableStyles.row, tableStyles.headerRow]}>
          {columns.map((column) => {
            const width = getColumnWidth(column.flex);
            
            return (
              <TouchableOpacity
                key={column.key}
                activeOpacity={column.sortable ? 0.7 : 1}
                onPress={() => column.sortable && handleSort(column.key)}
                style={[
                  tableStyles.cell,
                  tableStyles.headerCell,
                  { width, minWidth: width },
                  headerStyle
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
              currentPage === 1 && tableStyles.paginationButtonDisabled
            ]}
            onPress={() => currentPage && currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Text style={[
              tableStyles.paginationButtonText,
              currentPage === 1 && tableStyles.paginationButtonTextDisabled
            ]}>←</Text>
          </TouchableOpacity>
          
          <View style={tableStyles.paginationInfo}>
            <Text style={tableStyles.paginationText}>
              Trang {currentPage} / {totalPages}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              tableStyles.paginationButton,
              currentPage === totalPages && tableStyles.paginationButtonDisabled
            ]}
            onPress={() => currentPage && currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Text style={[
              tableStyles.paginationButtonText,
              currentPage === totalPages && tableStyles.paginationButtonTextDisabled
            ]}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
