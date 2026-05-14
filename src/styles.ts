import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    innerContainer: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    img: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    txt: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    search: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
    }
});
