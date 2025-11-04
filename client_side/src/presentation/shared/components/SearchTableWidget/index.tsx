import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { FlexButton } from '@components/FlexButton';
import { ICONS } from '@constants/images';
import { useTranslation } from 'react-i18next';
import { searchWidgetStyle } from './searchWidgetStyle';

interface SearchWidgetProps {
    value: string;
    dropdownItems?: { label: string; value: string }[];
    filterVisible?: boolean;
    searchTypeVisible?: boolean;
    placeholder?: string;
    searchTypeDefault?: string;
    onSearchPress?: (searchType: string, searchText: string, startTime?: string, endTime?: string) => void;
    onSearchTypeChange?: (value: string) => void;
}

export function SearchWidget({
    placeholder = 'Search...',
    value,
    dropdownItems,
    onSearchPress,
    onSearchTypeChange,
    searchTypeDefault = 'all',
}: SearchWidgetProps) {
    const { t } = useTranslation();
    const [searchTypeOpen, setSearchTypeOpen] = useState(false);
    const [searchTypeValue, setSearchTypeValue] = useState(searchTypeDefault);
    const [searchTypeItems, setSearchTypeItems] = useState(dropdownItems || []);
    const [searchText, setSearchText] = useState(value);

    const [showTimeRangePicker, setShowTimeRangePicker] = useState(false);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [isSelectingStart, setIsSelectingStart] = useState(true);

    function handleSearchPress() {
        if (onSearchPress) {
            if (searchTypeValue === 'timeRange' && startDate && endDate) {
                const startTime = startDate.toISOString();
                const endTime = endDate.toISOString();
                onSearchPress(searchTypeValue, '', startTime, endTime);
            } else {
                onSearchPress(searchTypeValue, searchText);
            }
        }
    }

    function handleSearchTypeChange(value: string) {
        if (onSearchTypeChange) {
            onSearchTypeChange(value);
        }
        // Show time picker modal if timeRange is selected
        if (value === 'timeRange') {
            setShowTimeRangePicker(true);
        }
    }

    function handleSetSearchTypeValue(callback: (current: string) => string) {
        setSearchTypeValue((current) => {
            const newValue = callback(current);
            handleSearchTypeChange(newValue);
            return newValue;
        });
    }

    function onChangeText(text: string) {
        setSearchText(text);
    }

    function onDateChange(event: any, selectedDate?: Date) {
        if (selectedDate) {
            if (isSelectingStart) {
                setStartDate(selectedDate);
                setIsSelectingStart(false);
            } else {
                setEndDate(selectedDate);
                setShowTimeRangePicker(false);
                setIsSelectingStart(true);
            }
        }
    }

    const isTimeRangeType = searchTypeValue === 'timeRange';
    const timeRangeText = startDate && endDate 
        ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
        : 'Select date range';

    return (
        <View style={searchWidgetStyle.container}>
            {dropdownItems && dropdownItems.length > 0 && (
                <DropDownPicker
                    open={searchTypeOpen}
                    value={searchTypeValue}
                    items={searchTypeItems}
                    setOpen={setSearchTypeOpen}
                    setItems={setSearchTypeItems}
                    setValue={handleSetSearchTypeValue}
                    style={searchWidgetStyle.dropdown}
                    containerStyle={searchWidgetStyle.dropdownContainer}
                    dropDownContainerStyle={{
                        zIndex: 1000,
                        margin: 0,
                        padding: 0,
                        borderRadius: 0
                    }}
                    labelProps={{ numberOfLines: 1 }}
                />
            )}
            
            {isTimeRangeType ? (
                <TouchableOpacity 
                    style={[searchWidgetStyle.inputWithDropdown, searchWidgetStyle.timeRangeButton]}
                    onPress={() => setShowTimeRangePicker(true)}
                >
                    <Text style={searchWidgetStyle.timeRangeText}>
                        {timeRangeText}
                    </Text>
                </TouchableOpacity>
            ) : (
                <TextInput
                    style={dropdownItems !== undefined && dropdownItems.length > 0 
                        ? searchWidgetStyle.inputWithDropdown 
                        : searchWidgetStyle.input
                    }
                    placeholder={placeholder}
                    value={searchText}
                    onChangeText={onChangeText}
                    placeholderTextColor="#888"
                    keyboardType={searchTypeValue === 'value' ? 'numeric' : 'default'}
                />
            )}
            
            <FlexButton
                icon={ICONS.SEARCH_ICON}
                onPress={handleSearchPress}
                style={searchWidgetStyle.button}
            />

            {/* Time Range Picker Modal */}
            {showTimeRangePicker && (
                <Modal
                    transparent
                    visible={showTimeRangePicker}
                    onRequestClose={() => setShowTimeRangePicker(false)}
                >
                    <View style={searchWidgetStyle.modalOverlay}>
                        <View style={searchWidgetStyle.modalContent}>
                            <Text style={searchWidgetStyle.modalTitle}>
                                {isSelectingStart ? 'Select Start Date' : 'Select End Date'}
                            </Text>
                            <DateTimePicker
                                value={isSelectingStart ? (startDate || new Date()) : (endDate || new Date())}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                            <TouchableOpacity 
                                style={searchWidgetStyle.modalButton}
                                onPress={() => {
                                    setShowTimeRangePicker(false);
                                    setIsSelectingStart(true);
                                }}
                            >
                                <Text style={searchWidgetStyle.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}