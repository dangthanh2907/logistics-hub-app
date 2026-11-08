import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

const person = () => {

    const router = useRouter();
    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("role");

        router.replace("/login");
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} >
                <Text style={styles.logoutText} >Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    )

}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FF' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    welcomeTitle: { fontSize: 22, fontWeight: '700', color: '#00193C', marginBottom: 8 },
    roleText: { fontSize: 16, color: '#006591', marginBottom: 24 },
    logoutButton: { backgroundColor: '#D32F2F', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    logoutText: { color: '#fff', fontWeight: '600' }
});
export default person