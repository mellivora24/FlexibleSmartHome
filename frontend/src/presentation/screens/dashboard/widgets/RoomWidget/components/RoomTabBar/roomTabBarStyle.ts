import { StyleSheet } from 'react-native';

export const roomTabBarStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#050041',
    },
    inactiveTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#050041'
    },
    activeTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(160, 149, 255)',
    },
    tabLabel: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
