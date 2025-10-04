import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { SensorData } from '@src/domain/model/SensorData';
import { columnStyles, tableStyles } from './tableStyle';

interface Column {
  key: keyof SensorData;
  title: string;
  width: number;
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
}

export function SensorDataTableWidget({
  data,
  headerStyle = {},
  cellStyle = {},
  onSort,
  currentSort
}: SensorDataTableWidgetProps) {
  const columns: Column[] = [
    {
      key: 'id',
      title: 'ID',
      width: 35,
      sortable: false,
    },
    {
      key: 'sensorName',
      title: 'Cảm biến',
      width: 110,
      sortable: true,
    },
    {
      key: 'value',
      title: 'Giá trị',
      width: 70,
      sortable: true,
      render: (value) => Number(value).toFixed(1)
    },
    {
      key: 'unit',
      title: 'Đơn vị',
      width: 65,
      sortable: false,
    },
    {
      key: 'createdAt',
      title: 'Thời gian',
      width: 100,
      sortable: true,
      render: (value) => new Date(value).toLocaleTimeString('vi-VN', {
        day: '2-digit',
        year: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ];

  const handleSort = (column: keyof SensorData) => {
    if (!onSort) return;

    let newDirection: SortDirection = 'asc';

    if (currentSort?.column === column) {
      if (currentSort.direction === 'asc') {
        newDirection = 'desc';
      } else if (currentSort.direction === 'desc') {
        newDirection = null;
      } else {
        newDirection = 'asc';
      }
    }

    onSort(column, newDirection);
  };

  const getSortIcon = (column: keyof SensorData) => {
    if (currentSort?.column !== column) {
      return '-';
    }

    if (currentSort.direction === 'asc') {
      return '^';
    } else if (currentSort.direction === 'desc') {
      return 'v';
    }
    return '-';
  };

  if (!data || data.length === 0) {
    return (
      <View style={tableStyles.emptyContainer}>
        <Text style={tableStyles.emptyText}>Không có dữ liệu sensor</Text>
      </View>
    );
  }

  const renderRow = ({ item }: { item: SensorData }) => (
    <View style={tableStyles.row}>
      {columns.map((column) => {
        const value = item[column.key];
        const displayValue = column.render
          ? column.render(value, item)
          : String(value);

        const customTextStyle = columnStyles[column.key as keyof typeof columnStyles];

        return (
          <View
            key={column.key}
            style={[
              tableStyles.cell,
              { width: column.width, minWidth: column.width },
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

  return (
    <View style={tableStyles.container}>
      <View style={tableStyles.table}>
        <View style={[tableStyles.row, tableStyles.headerRow]}>
          {columns.map((column) => (
            <TouchableOpacity
              key={column.key}
              activeOpacity={column.sortable ? 0.7 : 1}
              onPress={() => column.sortable && handleSort(column.key)}
              style={[
                tableStyles.cell,
                tableStyles.headerCell,
                { width: column.width, minWidth: column.width },
                headerStyle
              ]}
            >
              <View style={tableStyles.headerContent}>
                <Text style={tableStyles.headerText}>{column.title}</Text>
                {column.sortable && (
                  <Text style={tableStyles.sortIcon}>{getSortIcon(column.key)}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={data}
          renderItem={renderRow}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          style={tableStyles.flatList}
        />
      </View>
    </View>
  );
}
