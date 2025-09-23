import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { FlexButton } from '@components/FlexButton';
import { ICONS } from '@constants/images';
import { searchWidgetStyle } from './searchWidgetStyle';

interface SearchWidgetProps {
    value: string;
    placeholder?: string;
    filterDefault?: boolean;
    dropdownDefault?: string;
    onFilterPress?: () => void;
    onChangeText: (text: string) => void;
    onDropdownChange?: (value: string) => void;
}

export function SearchWidget({
    placeholder = 'Search...',
    value,
    onChangeText,
    onFilterPress,
    onDropdownChange
}: SearchWidgetProps) {
    const [open, setOpen] = useState(false);
    const [vl, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Orange', value: 'orange' },
    ]);

    return (
        <View style={searchWidgetStyle.container}>
            <DropDownPicker
                open={open}
                value={vl}
                items={items}
                setOpen={setOpen}
                setValue={(callback) => {
                    setValue(callback);
                    if (onDropdownChange) {
                        const value = callback(vl);
                        onDropdownChange(value as string);
                    }
                }}
                setItems={setItems}
                containerStyle={{ width: 50, marginRight: 5 }}
                style={{
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    backgroundColor: '#fff',
                }}
                dropDownContainerStyle={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                }}
            />
            <TextInput
                style={searchWidgetStyle.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#888"
            />
            <DropDownPicker
                open={open}
                value={vl}
                items={items}
                setOpen={setOpen}
                setValue={(callback) => {
                    setValue(callback);
                    if (onDropdownChange) {
                        const value = callback(vl);
                        onDropdownChange(value as string);
                    }
                }}
                setItems={setItems}
                containerStyle={{ width: 50, marginRight: 5 }}
                style={{
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    backgroundColor: '#fff',
                }}
                dropDownContainerStyle={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                }}
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
