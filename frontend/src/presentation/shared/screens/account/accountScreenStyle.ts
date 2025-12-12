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
        borderRadius: 75,
        resizeMode: 'cover',
        opacity: 0.9,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 1)',
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

    updateProfileButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.4)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        marginTop: 8,
    },

    updateMCUButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.4)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
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
    
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: 'rgba(30, 20, 50, 0.95)',
        borderRadius: 24,
        padding: 28,
        width: '85%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.3)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },

    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E9D5FF',
        marginBottom: 8,
        textAlign: 'center',
        textShadowColor: 'rgba(168, 85, 247, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },

    modalSubtitle: {
        fontSize: 14,
        color: '#C4B5FD',
        marginBottom: 24,
        textAlign: 'center',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(168, 85, 247, 0.12)',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.3)',
    },

    inputIcon: {
        width: 20,
        height: 20,
        marginRight: 12,
        tintColor: '#E9D5FF',
    },

    input: {
        flex: 1,
        color: '#F3E8FF',
        fontSize: 16,
    },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 8,
    },

    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cancelButton: {
        backgroundColor: 'rgba(100, 100, 120, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.3)',
        shadowColor: '#6B7280',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },

    cancelButtonText: {
        color: '#E9D5FF',
        fontSize: 16,
        fontWeight: '600',
    },

    confirmButton: {
        backgroundColor: 'rgba(168, 85, 247, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(192, 132, 252, 0.5)',
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },

    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    disabledButton: {
        opacity: 0.5,
    },
});