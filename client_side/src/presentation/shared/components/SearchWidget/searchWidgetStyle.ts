import { StyleSheet } from 'react-native';

export const searchWidgetStyle = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 3,
        paddingHorizontal: 12,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: '#fff',
        color: '#000',
    },
    button: {
        height: '100%',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        backgroundColor: '#007BFF',
    },
});
