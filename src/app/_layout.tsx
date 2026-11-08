import { Stack, useRouter } from 'expo-router';
import "../global.css";
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // state xem đã có token chưa
  const [isloading, setIsloading] = useState(true); // state loading
  const [role, setRole] = useState("");
  const router = useRouter();


  //useEffect để lấy token 
  useEffect(() => {
    const checkauth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userRole = await AsyncStorage.getItem("role");
        if (token) {
          setIsLoggedIn(true)
          setRole(userRole || "")
        }
        else {
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.log('Lỗi kiểm tra token:', error);
        setIsLoggedIn(false);
      }
      finally {
        setIsloading(false);
      }

    }


    checkauth();
  }, []);



  if (isloading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }



  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(sender)" />
      <Stack.Screen name="(driver)" />
    </Stack>
  );
}