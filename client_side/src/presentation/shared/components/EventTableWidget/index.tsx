import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

import type { Event } from "@src/domain/model/Event";
import { columnStyles, tableStyles } from "./tableStyle";

type SortDirection = "asc" | "desc" | null;

interface SortState {
  column: keyof Event | null;
  direction: SortDirection;
}

interface Column<T> {
  key: keyof T;
  title: string;
  width: number;
  sortable?: boolean;
  render?: (value: any, item: T) => string;
}

interface EventTableWidgetProps {
  data?: Event[] | null;
  headerStyle?: object;
  cellStyle?: object;
  onSort?: (column: keyof Event, direction: SortDirection) => void;
  currentSort?: SortState;
  loading?: boolean;
}

export function EventTableWidget({
  data,
  headerStyle = {},
  cellStyle = {},
  onSort,
  currentSort,
  loading = false,
}: EventTableWidgetProps) {
  const columns: Column<Event>[] = [
    { key: "id", title: "ID", width: 35, sortable: false },
    { key: "deviceName", title: "Thiết bị", width: 110, sortable: true },
    {
      key: "action",
      title: "Giá trị",
      width: 135,
      sortable: false,
      render: (value, item) => {
        switch (value) {
          case "SET_TEMPERATURE":
            return `${item.payload.temperature}°C`;
          case "TURN_ON":
            return `Bật (${item.payload.brightness}%)`;
          case "TURN_OFF":
            return `Tắt (${item.payload.reason})`;
          case "LOCK":
            return item.payload.status;
          default:
            return String(value);
        }
      },
    },
    {
      key: "createdAt",
      title: "Thời gian",
      width: 100,
      sortable: true,
      render: (value) =>
        new Date(value).toLocaleTimeString("vi-VN", {
          day: "2-digit",
          year: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  const handleSort = (column: keyof Event) => {
    if (!onSort) return;

    let newDirection: SortDirection = "asc";

    if (currentSort?.column === column) {
      if (currentSort.direction === "asc") {
        newDirection = "desc";
      } else if (currentSort.direction === "desc") {
        newDirection = null;
      } else {
        newDirection = "asc";
      }
    }

    onSort(column, newDirection);
  };

  const getSortIcon = (column: keyof Event) => {
    if (currentSort?.column !== column) return "-";
    if (currentSort.direction === "asc") return "^";
    if (currentSort.direction === "desc") return "v";
    return "-";
  };

  if (loading) {
    return (
      <View style={tableStyles.container}>
        <View style={tableStyles.table}>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={tableStyles.row}>
              {columns.map((col) => (
                <ShimmerPlaceholder
                  key={col.key as string}
                  style={{
                    width: col.width - 10,
                    height: 20,
                    margin: 5,
                    borderRadius: 4,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={tableStyles.emptyContainer}>
        <Text style={tableStyles.emptyText}>Không có dữ liệu sensor</Text>
      </View>
    );
  }

  const renderRow = ({ item }: { item: Event }) => (
    <View style={tableStyles.row}>
      {columns.map((column) => {
        const value = item[column.key];
        const displayValue = column.render
          ? column.render(value, item)
          : String(value);

        const customTextStyle =
          columnStyles[column.key as keyof typeof columnStyles];

        return (
          <View
            key={column.key as string}
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
              key={column.key as string}
              activeOpacity={column.sortable ? 0.7 : 1}
              onPress={() => column.sortable && handleSort(column.key)}
              style={[
                tableStyles.cell,
                tableStyles.headerCell,
                { width: column.width, minWidth: column.width },
                headerStyle,
              ]}
            >
              <View style={tableStyles.headerContent}>
                <Text style={tableStyles.headerText}>{column.title}</Text>
                {column.sortable && (
                  <Text style={tableStyles.sortIcon}>
                    {getSortIcon(column.key)}
                  </Text>
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
