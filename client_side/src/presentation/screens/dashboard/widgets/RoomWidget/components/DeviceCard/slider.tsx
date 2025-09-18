import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const CustomSlider: React.FC = () => {
    const [value, setValue] = useState(0);

    return (
        <View style={styles.container}>
            <Text style={styles.valueText}>{value}</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={value}
                onValueChange={(val) => setValue(val)}
                minimumTrackTintColor="#1fb28a"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor="#b9e4c9"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        transform: [{ rotate: '-90deg' }],
    },
    slider: {
        width: 150,
        height: 40,
    },
    valueText: {
        fontSize: 16,
        marginBottom: 10,
    },
});
