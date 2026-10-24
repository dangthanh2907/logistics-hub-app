import { Tabs } from 'expo-router';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import "../../global.css"; // Điều chỉnh đường dẫn tương ứng cho đúng vị trí file global.css so với _layout.tsx 
import { NativeTabs } from 'expo-router/unstable-native-tabs'
//SplashScreen.preventAutoHideAsync();
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ẩn thanh header mặc định
        tabBarActiveTintColor: '#00193C', // Màu khi đang bấm chọn tab
        tabBarInactiveTintColor: '#8E8E93', // Màu xám khi chưa chọn
      }}
    >
      {/* 1. Tab Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Tab Đơn hàng */}
      <Tabs.Screen
        name="order_driver"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'cube' : 'cube-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
} 