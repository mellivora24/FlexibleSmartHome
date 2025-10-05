import { StyleSheet } from "react-native";

export const accountScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    infoContainer: {
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    firmwareContainer: {
        maxWidth: 300,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'space-between',
    },
});
