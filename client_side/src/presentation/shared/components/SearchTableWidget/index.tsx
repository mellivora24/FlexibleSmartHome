import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { FlexButton } from '@components/FlexButton';
import { ICONS } from '@constants/images';
import { useTranslation } from 'react-i18next';
import { searchWidgetStyle } from './searchWidgetStyle';

interface SearchWidgetProps {
    value: string;
    filterVisible?: boolean;
    searchTypeVisible?: boolean;
    placeholder?: string;
    filterDefault?: string;
    searchTypeDefault?: string;
    onSearchPress?: () => void;
    onFilterChange?: () => void;
    onChangeText: (text: string) => void;
    onSearchTypeChange?: (value: string) => void;
}

export function SearchWidget({
    placeholder = 'Search...',
    value,
    onChangeText,
    onSearchPress,
    onFilterChange,
    onSearchTypeChange,
    filterDefault = 'none',
    searchTypeDefault = 'all',
}: SearchWidgetProps) {
    const { t } = useTranslation();

    const searchOptions = [
        { label: t('searchWidget.searchType.all'), value: 'all' },
        { label: t('searchWidget.searchType.name'), value: 'name' },
        { label: t('searchWidget.searchType.room'), value: 'room' },
        { label: t('searchWidget.searchType.value'), value: 'value' },
        { label: t('searchWidget.searchType.timeRange'), value: 'timeRange' },
    ];

    const [searchTypeOpen, setSearchTypeOpen] = useState(false);
    const [searchTypeValue, setSearchTypeValue] = useState(searchTypeDefault);
    const [searchTypeItems, setSearchTypeItems] = useState(searchOptions);

    function handleSearchPress() {
        if (onSearchPress) {
            onSearchPress();
        }
    }

    function handleFilterChange() {
        if (onFilterChange) {
            onFilterChange();
        }
    }

    function handleSearchTypeChange() {
        if (onSearchTypeChange) {
            onSearchTypeChange(searchTypeValue);
        }
    }

    function handleSetSearchTypeValue(callback) {
        setSearchTypeValue((current) => {
            const value = callback(current);
            if (onSearchTypeChange) {
                onSearchTypeChange(value);
            }
            handleSearchTypeChange();
            return value;
        });
    }

    return (
        <View style={searchWidgetStyle.container}>
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
            <TextInput
                style={searchWidgetStyle.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#888"
            />
            <FlexButton
                // title="Search"
                icon={ICONS.SEARCH_ICON}
                onPress={() => console.log('Search button pressed')}
                style={searchWidgetStyle.button}
            />
        </View>
    );
};
