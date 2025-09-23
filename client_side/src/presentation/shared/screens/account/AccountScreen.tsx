import React from 'react';
import { Text, View } from 'react-native';

import { accountScreenStyle } from './accountScreenStyle';

interface AccountScreenProps {}

export const AccountScreen: React.FC<AccountScreenProps> = () => {
    return (
        <View style={accountScreenStyle.container}>
            <Text style={accountScreenStyle.text}>Account Screen</Text>
        </View>
    );
};
