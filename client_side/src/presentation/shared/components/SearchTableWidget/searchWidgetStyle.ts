import { StyleSheet } from 'react-native';

export const searchWidgetStyle = StyleSheet.create({
    container: {
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    dropdownContainer: {
        width: '25%',
        height: '100%',
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
    },
    dropdown: {
        height: '100%',
        marginTop: 0,
        borderWidth: 0,
        borderRadius: 0,
        borderLeftWidth: 1,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        backgroundColor: '#ccc'
    },
    input: {
        flex: 1,
        height: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        color: '#000',
    },
    button: {
        height: '100%',
        borderRadius: 0,
        paddingHorizontal: 16,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007BFF',
    },
});
