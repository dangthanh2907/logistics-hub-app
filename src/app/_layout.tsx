import { Stack } from 'expo-router';
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown:false}}>
      <Stack.Screen name="login" />
      {/* khai báo chuyển đến sender */}
      <Stack.Screen name="(sender)" /> 
      {/* khai báo chuyển đến driver */}
      <Stack.Screen name="(driver)" />
    </Stack>
  );
}