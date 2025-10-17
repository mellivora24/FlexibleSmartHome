import { StyleSheet } from 'react-native';

export const accountScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
    },

    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },

    image: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        opacity: 0.9,
    },

    glassCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(168, 85, 247, 0.12)',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.3)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
    },

    divider: {
        height: 1,
        backgroundColor: 'rgba(192, 132, 252, 0.2)',
        marginVertical: 16,
    },

    firmwareContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },

    firmwareButton: {
        marginBottom: -16,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.4)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },

    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.4)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        alignSelf: 'center',
    },
});
