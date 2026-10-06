
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import "../../global.css"; // Điều chỉnh đường dẫn tương ứng cho đúng vị trí file global.css so với _layout.tsx 
import { NativeTabs } from 'expo-router/unstable-native-tabs'
//SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const colorScheme = useColorScheme();
    return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>
          Home
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>


        <NativeTabs.Trigger name="order_driver">
        <NativeTabs.Trigger.Label>
          Đơn hàng
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

    </NativeTabs>
  );
} 