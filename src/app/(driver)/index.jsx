import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';


export default function HomeScreen() {

  const [userRole, setUserRole] = useState(""); //có thể 2 giá trị , 1 là String:sender 2 là null , và ("")  là giá trị ban đầu
  const [checkingAuth, setCheckingAuth] = useState(true);  // kiẻm tra xem sđăng nahapj xong chưa , chưa xong thì heienj loading
  const router = useRouter();


  useEffect(() => { // useEffect dùng để chạy phần trong nó khi component được tạo / mở lần đầu , nhưng có [] phía sau , còn kh có thì chạy khi mỗi lần render
    const verifyToken = async () => {
      const token = await AsyncStorage.getItem("userToken");// lấy usertoken
      const role = await AsyncStorage.getItem("role"); //lấy role
      if (!token) {
        router.replace("/login") // chưua đăng nhập kh có token thì đưua ra login
      }
      else {
        setUserRole(role)
        setCheckingAuth(false)// tắt loading
      }
    }
    verifyToken();
  }, [])

  if (checkingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#006591" />
      </View>
    );
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("role");

    router.replace("/login");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeTitle}>Trang Chủ Logistics Hub</Text>
      <Text style={styles.roleText}>Vai trò hiện tại: {userRole}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} >
        <Text style={styles.logoutText} >Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcomeTitle: { fontSize: 22, fontWeight: '700', color: '#00193C', marginBottom: 8 },
  roleText: { fontSize: 16, color: '#006591', marginBottom: 24 },
  logoutButton: { backgroundColor: '#D32F2F', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: '600' }
});

