import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
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
    onSearchPress?: () => void;
    onChangeText: (text: string) => void;
    onSearchTypeChange?: (value: string) => void;
}

export function SearchWidget({
    placeholder = 'Search...',
    value,
    dropdownItems,
    onChangeText,
    onSearchPress,
    onSearchTypeChange,
    searchTypeDefault = 'all',
}: SearchWidgetProps) {
    const { t } = useTranslation();
    const [searchTypeOpen, setSearchTypeOpen] = useState(false);
    const [searchTypeValue, setSearchTypeValue] = useState(searchTypeDefault);
    const [searchTypeItems, setSearchTypeItems] = useState(dropdownItems || []);

    function handleSearchPress() {
        if (onSearchPress) {
            onSearchPress();
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
            <TextInput
                style={dropdownItems !== undefined && dropdownItems.length > 0 ? searchWidgetStyle.inputWithDropdown : searchWidgetStyle.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#888"
            />
            <FlexButton
                // title="Search"
                icon={ICONS.SEARCH_ICON}
                onPress={handleSearchPress}
                style={searchWidgetStyle.button}
            />
        </View>
    );
};
