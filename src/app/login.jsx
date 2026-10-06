import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // dùng để lưu token 
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axiosClient from '../api/axiosClient'; // gọi axiousClient vào



export default function LoginScreen() {
  const [username, setUsername] = useState(''); // lấy username
  const [password, setPassword] = useState(''); // lấy password
  const [showPassword, setShowPassword] = useState(false); // hiện thị mk
  const router = useRouter(); // điều hướng 
  const [rememberdevice, setRememberdevice] = useState(false);

  // hàm xử lý khi bấm đăng nhập , sẽ gửi 
  const handleLogin = async () => {
    // kiểm tra text có trông không
    if (!username || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin và mật khẩu');
      return;
    }
    try {
      //nếu có thông tin thì
      const respone = await axiosClient.post("auth/login", {// gửi 1 http post lên backend
        username: String(username).trim(),
        password: String(password).trim()
      });
      //console.log("server trả dề: ",respone);


      await AsyncStorage.setItem("userToken", respone.data.token); // cất token vào 
      await AsyncStorage.setItem("role", respone.data.role); // cất role vào 

      // 2. Xử lý ghi nhớ thiết bị[cite: 2]
      if (rememberdevice) {
        // Lưu trạng thái đã nhớ thiết bị và tên tài khoản
        await AsyncStorage.setItem("rememberDevice", "true");
        await AsyncStorage.setItem("savedUsername", String(username).trim());
      } else {
        // Nếu không chọn nhớ: xóa cờ để lần sau mở app bắt đăng nhập lại
        await AsyncStorage.removeItem("rememberDevice");
        await AsyncStorage.removeItem("savedUsername");
      }

      // phân quyền
      if (respone.data.role === "SENDER") {
        router.replace('/(sender)')
      }
      else {
        router.replace('/(driver)')
      }
    }
    catch (error) {
      const errorMsg = error.response?.data?.message || 'Tài khoản hoặc mật khẩu không chính xác!';
      Alert.alert('Đăng nhập thất bại', errorMsg);
    }

  }
  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>

        <View style={styles.statusBadge}>
          <View style={styles.dot} />

          <Text style={styles.statusText}>
            CỔNG THÔNG TIN VẬN TẢI LOGISTICS HUB
          </Text>

          <Text style={styles.onlineText}>
            Trực tuyến
          </Text>
        </View>

        <View style={styles.logoBox}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida/AEtjO1UhF_1eO14RUuRJv4WKATPRx5N68gkmwCpRCD-D9B2nsGEPinjb-3S7JfYGauQiZHYSAR3T6ZCeVFjK3hkX3rQoXhcrWwUlM5wYBFSQRt6tefgkKwWGtiM-9mgwCNh_sH6ZXpUYJDL4LsUtkfVXW-bVjrheRp-veODn9NVnUcT9sRwJdJBuCAPRYM_TIMHZsrVcmyKBgdqZKTUVZzKQ8eFLAk-RJaapicLv7nNtqAJBLPXsw5P6EcINnMs',
            }}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>
          Logistics Hub
        </Text>

        <Text style={styles.description}>
          Nền tảng quản lý vận tải, điều phối hành trình và
          giám sát lộ trình hàng hóa thời gian thực.
        </Text>

      </View>


      {/* Login Card */}
      <View style={styles.card}>

        {/* Username */}
        <Text style={styles.label}>
          Tên tài khoản
        </Text>

        <View style={styles.inputBox}>

          <Ionicons
            name="id-card-outline"
            size={20}
            color="#006591"
          />

          <TextInput
            style={styles.input}
            placeholder="Tên người dùng"
            placeholderTextColor="#747780"
            value={username} // lấy biến đưa vào text 
            onChangeText={setUsername} // lắng nghe thay đổi có thay đổi gì thì đưa vào setUsername để cập nhật username
          />

          <Ionicons
            name="checkmark-circle"
            size={18}
            color="#006591"
          />

        </View>


        {/* Password */}
        <View style={styles.passwordHeader}>

          <Text style={styles.label}>
            Mật khẩu
          </Text>

          <TouchableOpacity>
            <Text style={styles.forgot}>
              Quên mật khẩu?
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.inputBox}>

          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#006591"
          />

          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#747780"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#44474f"
            />
          </TouchableOpacity>

        </View>


        {/* Remember */}
        {/* Remember */}
        <View style={styles.rememberRow}>
          <TouchableOpacity
            style={styles.rememberLeft}
            activeOpacity={0.7}
            onPress={() => setRememberdevice((prev) => !prev)}
          >
            <View
              style={[
                styles.checkbox,
                rememberdevice && styles.checkboxChecked, // Đổi màu nền & viền khi true
              ]}
            >
              {rememberdevice && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="#FFFFFF"
                />
              )}
            </View>

            <Text style={styles.rememberText}>
              Ghi nhớ thiết bị này
            </Text>
          </TouchableOpacity>
        </View>


        {/* Login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>

          <Text style={styles.loginText}>
            Đăng nhập hệ thống
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#fff"
          />

        </TouchableOpacity>
        {/* Register */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>
            Chưa có tài khoản?
          </Text>

          <TouchableOpacity>
            <Text style={styles.registerLink}>
              Tạo tài khoản mới
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>

          <View style={styles.line} />

          <Text style={styles.dividerText}>
            HOẶC XÁC THỰC NHANH
          </Text>

          <View style={styles.line} />

        </View>




        {/* Quick Login */}
        <View style={styles.quickRow}>

          <TouchableOpacity style={styles.quickButton}>

            <Ionicons
              name="finger-print-outline"
              size={20}
              color="#006591"
            />

            <Text style={styles.quickText}>
              Face ID / Vân tay
            </Text>

          </TouchableOpacity>


        </View>

      </View>


      {/* Footer */}
      <View style={styles.footer}>

        <View style={styles.securityRow}>

          <Ionicons
            name="lock-closed"
            size={15}
            color="#006591"
          />

          <Text style={styles.securityText}>
            Bảo vệ mã hóa 256-bit SSL tiêu chuẩn logistics hàng hải
          </Text>

        </View>

        <Text style={styles.version}>
          Phiên bản v2.6.4 (Build 2025) • Hỗ trợ 24/7: 1900 6868
        </Text>

      </View>

    </SafeAreaView>
  );


}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5EEFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#39B8FD',
    marginRight: 6,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#44474F',
    marginRight: 8,
  },

  onlineText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#006591',
  },

  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 8,
    elevation: 4,
  },

  logo: {
    width: '100%',
    height: '100%',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00193C',
    paddingTop: 20,
  },

  description: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: '#44474F',
    maxWidth: 330,
    paddingTop: 20,
    paddingBottom: 20,
  },

  card: {
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 5,

  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0B1C30',
    marginBottom: 6,
  },

  inputBox: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF4FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#0B1C30',
  },

  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  forgot: {
    fontSize: 11,
    fontWeight: '600',
    color: '#006591',
  },

  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#747780',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  checkboxChecked: {
    backgroundColor: '#006591', // Màu nền xanh khi được chọn
    borderColor: '#006591',     // Viền xanh đồng bộ
  },

  rememberText: {
    fontSize: 11,
    color: '#44474F',
  },




  loginButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#0F2E5A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#DCE9FF',
  },

  dividerText: {
    marginHorizontal: 10,
    fontSize: 10,
    color: '#747780',
    fontWeight: '600',
  },

  quickRow: {
    flexDirection: 'row',
    gap: 8,
  },

  quickButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E5EEFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quickText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '600',
    color: '#0B1C30',
  },

  footer: {
    alignItems: 'center',
    marginTop: 16,
  },

  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  securityText: {
    marginLeft: 5,
    fontSize: 10,
    color: '#44474F',
    textAlign: 'center',
  },

  version: {
    fontSize: 10,
    color: '#747780',
    textAlign: 'center',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  registerText: {
    fontSize: 12,
    color: '#747780',
  },

  registerLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#006591',
    marginLeft: 5,
  },
});