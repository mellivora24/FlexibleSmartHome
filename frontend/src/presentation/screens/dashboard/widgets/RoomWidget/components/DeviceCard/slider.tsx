import React, { useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, PanResponder, PanResponderGestureState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomSliderProps {
    state?: boolean;
    initialValue?: number;
    onValueChange?: (value: number) => void;
}

const SLIDER_HEIGHT = 140;
const BLOCK_HEIGHT = SLIDER_HEIGHT / 3;

export const CustomSlider: React.FC<CustomSliderProps> = ({
    state = true,
    initialValue = 1,
    onValueChange,
}) => {
    const [value, setValue] = useState(initialValue);
    const sliderRef = useRef<View>(null);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => state,
            onMoveShouldSetPanResponder: () => state,
            onPanResponderMove: (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
                if (!state) return;
                sliderRef.current?.measure((_, __, ___, height, ____, pageY) => {
                    const touchY = gestureState.moveY - pageY;
                    let newValue = 3 - Math.floor((touchY / height) * 3);
                    newValue = Math.max(1, Math.min(3, newValue));
                    setValue(newValue);
                });
            },
            onPanResponderRelease: () => {
                if (state && onValueChange) {
                    onValueChange(value);
                }
            },
        })
    ).current;

    const blocks = [
        { level: 3, style: styles.block_1, top: 0 },
        { level: 2, style: styles.block_2, top: BLOCK_HEIGHT },
        { level: 1, style: styles.block_3, top: BLOCK_HEIGHT * 2 },
    ];

    const handleBlockPress = (level: number) => {
        if (!state) return;
        setValue(level);
        if (onValueChange) {
            onValueChange(level);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.valueText}>{value}</Text>
            <View style={styles.sliderContainer} ref={sliderRef} {...(state ? panResponder.panHandlers : {})}>
                {blocks.map(({ level, style, top }) => (
                    <TouchableOpacity
                        key={level}
                        style={[
                            value >= level && (level !== 1 || state) ? style : { ...styles.unreachedBlock, top },
                        ]}
                        onPress={() => handleBlockPress(level)}
                        disabled={!state}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    sliderContainer: {
        width: '36%',
        height: SLIDER_HEIGHT,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        position: 'relative',
    },
    valueText: {
        fontSize: 32,
        marginRight: 48,
        fontWeight: 'bold',
    },
    block_1: {
        position: 'absolute',
        width: '100%',
        height: BLOCK_HEIGHT,
        backgroundColor: 'rgba(255, 93, 64, 0.9)',
        top: 0,
    },
    block_2: {
        position: 'absolute',
        width: '100%',
        height: BLOCK_HEIGHT,
        backgroundColor: 'rgba(255, 93, 64, 0.6)',
        top: BLOCK_HEIGHT,
    },
    block_3: {
        position: 'absolute',
        width: '100%',
        height: BLOCK_HEIGHT,
        backgroundColor: 'rgba(255, 93, 64, 0.3)',
        top: BLOCK_HEIGHT * 2,
    },
    unreachedBlock: {
        position: 'absolute',
        width: '100%',
        height: BLOCK_HEIGHT,
        backgroundColor: 'rgba(94, 94, 94, 0.42)',
    },
});
