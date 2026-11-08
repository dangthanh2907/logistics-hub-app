import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Touchable,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../../api/axiosClient';
/* ───────────── Tokens ───────────── */
const C = {
  surface: '#f8f9ff',
  onSurface: '#0b1c30',
  onSurfaceVariant: '#44474f',
  primary: '#00193c',
  onPrimary: '#ffffff',
  primaryContainer: '#0f2e5a',
  secondary: '#006591',
  onSecondary: '#ffffff',
  secondaryContainer: '#39b8fd',
  onSecondaryContainer: '#004666',
  inversePrimary: '#adc7fc',
  error: '#ba1a1a',
  onError: '#ffffff',
  onErrorContainer: '#93000a',
  outline: '#747780',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerHigh: '#dce9ff',
  surfaceContainerHighest: '#d3e4fe',
};

const F = {
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  head: 'PlusJakartaSans_600SemiBold',
  headBold: 'PlusJakartaSans_700Bold',
  mono: Platform.select({ ios: 'Menlo', android: 'monospace' }),
};

const T = {
  bodySm: { fontFamily: F.body, fontSize: 12, lineHeight: 16 },
  labelSm: { fontFamily: F.semibold, fontSize: 11, lineHeight: 14 },
  labelMd: { fontFamily: F.medium, fontSize: 12, lineHeight: 16 },
  labelLg: { fontFamily: F.semibold, fontSize: 14, lineHeight: 18 },
  headSm: { fontFamily: F.head, fontSize: 16, lineHeight: 22 },
  headMd: { fontFamily: F.head, fontSize: 20, lineHeight: 26 },
  headLgMobile: { fontFamily: F.head, fontSize: 22, lineHeight: 28 },
};

const SH_TINY = { shadowColor: '#0f2e5a', shadowOpacity: 0.06, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 };
const SH_SM = { shadowColor: '#0f2e5a', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 };
const SH_MD = { shadowColor: '#0f2e5a', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 };
const SH_LG = { shadowColor: '#0f2e5a', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 5 };
const SH_BTN = { shadowColor: '#0f2e5a', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 };
const SH_NAV = { shadowColor: '#0f2e5a', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -2 }, elevation: 8 };

const HEADER_H = 64;
const NAV_H = 64;
export default function HomeScreen() {
  const [userRole, setUserRole] = useState(""); //có thể 2 giá trị , 1 là String:sender 2 là null , và ("")  là giá trị ban đầu
  const [checkingAuth, setCheckingAuth] = useState(true);  // kiẻm tra xem sđăng nahapj xong chưa , chưa xong thì heienj loading
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(false);
  const [information, setInformation] = useState({ user: null, thongke: null });// load thông tin tài xế
  // Animation chấm "ping" (chỉ hiển thị)
  const ping = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(ping, { toValue: 1, duration: 1000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [ping]);
  const pingOpacity = ping.interpolate({ inputRange: [0, 1], outputRange: [0.75, 0] });
  const pingScale = ping.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });

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
    const get_inform = async () => {
      try {
        const response = await axiosClient.get('/users/search');
        setInformation(prev => ({
          ...prev,
          user: response.data
        }))
        console.log("USER DATA:", response.data);
      } catch (error) {
        console.log("STATUS:", error.response?.status);
        console.log("BACKEND ERROR:", error.response?.data);
        console.log("REQUEST URL:", error.config?.url);
      }
    };
    const getthong_ke = async () => {
      try {
        const response = await axiosClient.get('drivers/total_tk');
        setInformation(prev => ({
          ...prev,
          thongke: response.data
        }))
        console.log("USER DATA:", response.data);
      } catch (error) {
        console.log("STATUS:", error.response?.status);
        console.log("BACKEND ERROR:", error.response?.data);
        console.log("REQUEST URL:", error.config?.url);
      }
    }
    verifyToken();
    get_inform();
    getthong_ke();


  }, [])

  if (checkingAuth) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#006591" />
      </View>
    );
  }

  // const handleLogout = async () => {
  //   await AsyncStorage.removeItem("userToken");
  //   await AsyncStorage.removeItem("role");

  //   router.replace("/login");
  // };


  return (
    <View style={{ flex: 1, backgroundColor: C.surface }}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_H + insets.top,
          paddingBottom: NAV_H + insets.bottom + 32,
        }}
      >
        {/* ===== Thông tin tài xế & trạng thái ca ===== */}
        <View style={[s.section, { paddingTop: 4 }]}>
          <View style={[s.card, SH_MD, { gap: 16 }]}>
            <View style={s.rowBetween}>
              <View style={[s.rowCenter, { flex: 1 }]}>
                <View>
                  <Image
                    style={s.avatar}
                    source={{
                      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApKUAJi7W-2nkcxnuBPlnkh97vCYzvp_URXrGys9lY0-RJ2PnbnUpq2mGy3PEvrK4om1A7dk1W3ELmjoTazOREQLOt4bnZ7tQ7pgpKTb8AVPfLa0f5k6NdBjqjn6OBzA2qoF_6ND6q_TXNU6hppRgQrDjjCuXwuSQxlZ7a-dm-0mJj6FBX1UNPSZ67wV1jXIMXz3OkEtlCowUs_omneK-gg9HEHrrZAULK1EnmeGB1',
                    }}
                  />
                  <View style={s.avatarDot} />
                </View>

                <View style={{ marginLeft: 8, flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <Text style={[T.headSm, { color: C.onSurface }]} numberOfLines={1}>
                      {information.user?.fullName}
                    </Text>
                    <View style={s.verifiedBadge}>
                      <MaterialIcons name="verified" size={13} color={C.secondary} />
                      <Text style={[T.labelSm, { color: C.secondary, marginLeft: 2 }]}>ĐÃ XÁC THỰC</Text>
                    </View>
                  </View>
                  <View style={[s.rowCenter, { marginTop: 4, gap: 8, flexWrap: 'wrap' }]}>
                    <View style={s.plate}>
                      <Text style={{ fontFamily: F.mono, fontSize: 12, color: C.primary, letterSpacing: 1, fontWeight: '700' }}>
                        {information.user?.vehicleNumber}
                      </Text>
                    </View>
                    <View style={s.rowCenter}>
                      <MaterialIcons name="local-shipping" size={14} color={C.onSurfaceVariant} />
                      <Text style={[T.bodySm, { color: C.onSurfaceVariant, marginLeft: 4 }]}>
                        Đầu kéo {information.user?.vehicleType}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Trạng thái trực ca (điều khiển bằng prop isOnline) */}
            <View style={s.statusBox}>
              <View style={[s.rowCenter, { paddingLeft: 8, flex: 1 }]}>
                <View style={s.dotWrap}>
                  {isOnline && (
                    <Animated.View
                      style={{
                        position: 'absolute',
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: C.secondary,
                        opacity: pingOpacity,
                        transform: [{ scale: pingScale }],
                      }}
                    />
                  )}
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: isOnline ? C.secondary : C.outline,
                    }}
                  />
                </View>
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={[T.labelMd, { fontFamily: F.semibold, color: isOnline ? C.primary : C.onSurfaceVariant }]}>
                    {isOnline ? 'ĐANG TRỰC CA (SẴN SÀNG)' : 'NGHỈ NGƠI (OFFLINE)'}
                  </Text>
                  <Text style={[T.bodySm, { color: C.onSurfaceVariant }]}>
                    {isOnline ? 'Tự động nhận phân bổ cuốc tải gần' : 'Tạm dừng ghép đơn chuyến mới trên hệ thống'}
                  </Text>
                </View>
              </View>

              <Pressable
                style={[s.toggle, { backgroundColor: isOnline ? C.primaryContainer : C.surfaceContainerHigh }]}
              >
                <View
                  style={[
                    s.knob,
                    {
                      transform: [{ translateX: isOnline ? 28 : 0 }],
                      backgroundColor: isOnline ? C.secondaryContainer : C.surfaceContainerLowest,
                    },
                  ]}
                >
                  <MaterialIcons name="bolt" size={16} color={C.primary} />
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ===== Thống kê ===== */}
        <View style={[s.section, { marginTop: 16 }]}>
          <View style={[s.card, SH_SM, { flexDirection: 'row', gap: 8 }]}>
            <View style={{ flex: 1 }}>
              <Text style={[T.labelSm, { color: C.onSurfaceVariant }]}>Thu nhập tháng này </Text>
              <View style={s.baseline}>
                <Text style={[T.headMd, { color: C.primary }]}>{information.thongke?.totalEarnings}</Text>
                <Text style={[T.labelSm, { color: C.onSurfaceVariant, marginLeft: 4 }]}>đ</Text>
              </View>
            </View>

            <View style={{ flex: 1, paddingLeft: 4 }}>
              <Text style={[T.labelSm, { color: C.onSurfaceVariant }]}>Đơn hoàn thành</Text>
              <View style={s.baseline}>
                <Text style={[T.headMd, { color: C.primary }]}>{information.thongke?.completedTrips}</Text>
                <Text style={[T.labelSm, { color: C.onSurfaceVariant, marginLeft: 4 }]}>chuyến</Text>
              </View>
            </View>

            <View style={{ flex: 1, paddingLeft: 4 }}>
              <Text style={[T.labelSm, { color: C.onSurfaceVariant }]}>Đánh giá sao</Text>
              <View style={[s.rowCenter, { marginTop: 4 }]}>
                <Text style={[T.headMd, { color: C.primary }]}>4.9</Text>
                <MaterialIcons name="star" size={18} color={C.secondary} style={{ marginLeft: 4 }} />
              </View>
              <Text style={[T.bodySm, { color: C.onSurfaceVariant, marginTop: 4 }]} numberOfLines={1}>
                {information.thongke?.total_tripl} chuyến
              </Text>
            </View>
          </View>
        </View>

        {/* ===== Chuyến đang giao ===== */}
        
        <View style={[s.section, { marginTop: 16 }]}>
          <View style={[s.card, SH_LG, { overflow: 'hidden', gap: 16 }]}>
            <View style={s.accentBeam} />

            <View style={[s.rowBetween, { alignItems: 'flex-start', paddingLeft: 8 }]}>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={[s.rowCenter, { gap: 8 }]}>
                  <View style={s.livePill}>
                    <View style={{ width: 6, height: 6, marginRight: 4, alignItems: 'center', justifyContent: 'center' }}>
                      <Animated.View
                        style={{
                          position: 'absolute',
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: C.primary,
                          opacity: pingOpacity,
                          transform: [{ scale: pingScale }],
                        }}
                      />
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary }} />
                    </View>
                    <Text style={[T.labelSm, { color: C.onSecondaryContainer, fontFamily: F.bold }]}>ĐANG GIAO HÀNG</Text>
                  </View>
                  <Text style={[T.headSm, { color: C.primary }]}>#LOG-8821</Text>
                </View>
                <Text style={[T.bodySm, { color: C.onSurfaceVariant }]}>Container 40ft HC • Tải trọng 28 Tấn</Text>
              </View>

              <View style={s.sealBadge}>
                <MaterialIcons name="lock" size={16} color={C.secondary} />
                <View style={{ marginLeft: 6, alignItems: 'flex-end' }}>
                  <Text style={{ fontFamily: F.semibold, fontSize: 10, color: C.onSurfaceVariant }}>NIÊM CHÌ HQ</Text>
                  <Text style={{ fontFamily: F.mono, fontSize: 11, color: C.primary, fontWeight: '700' }}>ML-VN98421</Text>
                </View>
              </View>
            </View>

            {/* Lộ trình */}
            <View style={s.routeBox}>
              <View style={s.routeLine} />

              <View style={s.routeNode}>
                <View style={[s.nodeCircle, { backgroundColor: C.primaryContainer }]}>
                  <MaterialIcons name="warehouse" size={14} color={C.onPrimary} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <View style={s.rowBetween}>
                    <Text style={[T.labelSm, { color: C.secondary, fontFamily: F.bold }]}>ĐIỂM BỐC CONT (08:30)</Text>
                    <Text style={[T.labelSm, s.chipLight]}>Đã hoàn thành</Text>
                  </View>
                  <Text style={[T.labelLg, { fontFamily: F.head, color: C.onSurface }]} numberOfLines={1}>
                    Cảng Tiên Sa - Bãi Cont A2
                  </Text>
                  <Text style={[T.bodySm, { color: C.onSurfaceVariant }]}>P. Thọ Quang, Q. Sơn Trà, Đà Nẵng</Text>
                </View>
              </View>

              <View style={[s.rowBetween, { paddingLeft: 32, paddingVertical: 4 }]}>
                <View style={s.movingPill}>
                  <MaterialIcons name="local-shipping" size={16} color={C.secondary} />
                  <Text style={[T.labelSm, { color: C.primary, marginLeft: 6 }]}>Đang di chuyển trên QL1A • Cách 5.2 km</Text>
                </View>
                <Text style={[T.labelSm, { color: C.secondary, fontFamily: F.bold }]}>18 km</Text>
              </View>

              <View style={s.routeNode}>
                <View style={[s.nodeCircle, { backgroundColor: C.secondaryContainer }]}>
                  <MaterialIcons name="location-on" size={14} color={C.onSecondaryContainer} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <View style={s.rowBetween}>
                    <Text style={[T.labelSm, { color: C.secondary, fontFamily: F.bold, flexShrink: 1 }]} numberOfLines={1}>
                      ĐIỂM HẠ CONT (DỰ KIẾN 11:15)
                    </Text>
                    <Text style={[T.labelSm, s.chipOnTime]}>Đúng tiến độ</Text>
                  </View>
                  <Text style={[T.labelLg, { fontFamily: F.head, color: C.onSurface }]} numberOfLines={1}>
                    KCN Hòa Khánh, Đường số 5
                  </Text>
                  <Text style={[T.bodySm, { color: C.onSurfaceVariant }]}>P. Hòa Khánh Bắc, Q. Liên Chiểu, Đà Nẵng</Text>
                </View>
              </View>
            </View>

            {/* Nút hành động */}
            <View style={[s.rowCenter, { gap: 4, paddingTop: 4 }]}>
              <Pressable style={s.primaryAction}>
                <Text style={[T.labelLg, { color: C.onPrimary }]}>Xem Chi Tiết Đơn</Text>
                <MaterialIcons name="arrow-forward" size={18} color={C.onPrimary} style={{ marginLeft: 6 }} />
              </Pressable>
              <Pressable style={s.callBtn}>
                <MaterialIcons name="call" size={20} color={C.secondary} />
              </Pressable>
              <Pressable style={s.chatBtn}>
                <MaterialIcons name="chat-bubble" size={20} color={C.secondary} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* ===== Banner radar ===== */}
        <View style={[s.section, { marginTop: 16 }]}>
          <LinearGradient
            colors={[C.primaryContainer, C.primary, C.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.radar}
          >
            <View style={[s.rowCenter, { flex: 1 }]}>
              <View style={s.radarIcon}>
                <MaterialIcons name="explore" size={22} color={C.secondaryContainer} />
              </View>
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={[T.headSm, { color: C.onPrimary }]}>Bản đồ tải bãi cảng mở</Text>
                <Text style={[T.bodySm, { color: C.inversePrimary }]}>Tình trạng ùn ứ cầu cảng Cát Lái & Tiên Sa</Text>
              </View>
            </View>
            <Pressable style={s.radarBtn}>
              <Text style={[T.labelSm, { color: C.onSecondary }]}>Xem radar</Text>
              <MaterialIcons name="north-east" size={14} color={C.onSecondary} style={{ marginLeft: 4 }} />
            </Pressable>
          </LinearGradient>
        </View>

        {/* ===== Đơn hàng gần bạn ===== */}
        <View style={[s.section, { marginTop: 16, gap: 8 }]}>
          <View style={[s.rowBetween, { paddingTop: 4 }]}>
            <View style={[s.rowCenter, { gap: 8 }]}>
              <Text style={[T.headMd, { color: C.onSurface }]}>Đơn hàng gần bạn</Text>
              <Text style={[T.labelSm, s.chipNew]}>4 đơn mới</Text>
            </View>
            <Pressable style={s.rowCenter}>
              <MaterialIcons name="map" size={16} color={C.secondary} />
              <Text style={[T.labelMd, { color: C.secondary, marginLeft: 2 }]}>Bản đồ bãi</Text>
            </Pressable>
          </View>

          {/* Job 1 */}
          <View style={[s.card, SH_MD, { gap: 8 }]}>
            <View style={s.rowBetween}>
              <View style={s.baseline}>
                <Text style={[T.headLgMobile, { color: C.primary, fontFamily: F.headBold }]}>3.200.000</Text>
                <Text style={[T.labelMd, { color: C.onSurfaceVariant, marginLeft: 4 }]}>VNĐ</Text>
              </View>
              <View style={s.fastPill}>
                <MaterialIcons name="flash-on" size={14} color={C.secondary} />
                <Text style={[T.labelSm, { color: C.secondary, fontFamily: F.bold, marginLeft: 4 }]}>Cước nhanh</Text>
              </View>
            </View>

            <View style={s.tags}>
              <Text style={[s.tag, T.labelSm, { color: C.primary, fontFamily: F.medium }]}>Container 40' HC</Text>
              <Text style={[s.tag, T.labelSm, { color: C.onSurfaceVariant }]}>Nông sản xuất khẩu</Text>
              <Text style={[s.tag, T.labelSm, { color: C.onSurfaceVariant }]}>26 Tấn</Text>
            </View>

            <View style={s.jobRoute}>
              <View style={[s.rowCenter, { gap: 8 }]}>
                <MaterialIcons name="trip-origin" size={16} color={C.secondary} />
                <Text style={[T.labelMd, { color: C.onSurface, flex: 1 }]} numberOfLines={1}>
                  Depot Transimex (Cẩm Lệ, ĐN)
                </Text>
              </View>
              <View style={[s.rowCenter, { gap: 8, paddingLeft: 2 }]}>
                <MaterialIcons name="arrow-downward" size={14} color={C.onSurfaceVariant} />
                <Text style={[T.bodySm, { color: C.onSurfaceVariant }]}>Hành trình 82 km dọc Quốc Lộ 1A</Text>
              </View>
              <View style={[s.rowCenter, { gap: 8 }]}>
                <MaterialIcons name="pin-drop" size={16} color={C.primary} />
                <Text style={[T.labelMd, { color: C.onSurface, flex: 1 }]} numberOfLines={1}>
                  Cảng Chu Lai (Quảng Nam)
                </Text>
              </View>
            </View>

            <View style={[s.rowCenter, { paddingHorizontal: 4 }]}>
              <MaterialIcons name="schedule" size={15} color={C.error} />
              <Text style={[T.bodySm, { color: C.error, fontFamily: F.medium, marginLeft: 4 }]}>
                Hạn bốc: Trước 14:00 (Còn 1h 30m)
              </Text>
            </View>
            <Text style={[T.bodySm, { color: C.onSurfaceVariant, paddingHorizontal: 4 }]}>Phí cầu đường: Đã bao gồm</Text>

            <View style={[s.rowCenter, { gap: 4, paddingTop: 4 }]}>
              <Pressable style={[s.jobBtn, { backgroundColor: C.surfaceContainerHigh }]}>
                <Text style={[T.labelMd, { color: C.primary }]}>Xem chi tiết</Text>
              </Pressable>
              <Pressable style={[s.jobBtn, SH_BTN, { backgroundColor: C.primaryContainer, flexDirection: 'row' }]}>
                <MaterialIcons name="touch-app" size={18} color={C.secondaryContainer} />
                <Text style={[T.labelMd, { color: C.onPrimary, marginLeft: 4 }]}>Nhận chuyến ngay</Text>
              </Pressable>
            </View>
          </View>

          {/* Job 2 */}
          <View style={[s.card, SH_SM, { gap: 8 }]}>
            <View style={s.rowBetween}>
              <View style={s.baseline}>
                <Text style={[T.headMd, { color: C.primary, fontFamily: F.headBold }]}>1.650.000</Text>
                <Text style={[T.labelSm, { color: C.onSurfaceVariant, marginLeft: 4 }]}>VNĐ</Text>
              </View>
              <Text style={[T.labelSm, s.chipDistance]}>Cách bạn 3.5 km</Text>
            </View>

            <View style={s.tags}>
              <Text style={[s.tag, T.labelSm, { color: C.primary, fontFamily: F.medium }]}>Container 20' DC</Text>
              <Text style={[s.tag, T.labelSm, { color: C.onSurfaceVariant }]}>Phụ tùng cơ khí máy</Text>
              <Text style={[s.tag, T.labelSm, { color: C.onSurfaceVariant }]}>14 Tấn</Text>
            </View>

            <View style={{ gap: 4, paddingTop: 4 }}>
              <View style={[s.rowCenter, { gap: 8 }]}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.secondaryContainer }} />
                <Text style={[T.labelMd, { color: C.onSurface, flexShrink: 1 }]} numberOfLines={1}>
                  KCN Điện Nam - Điện Ngọc
                </Text>
                <Text style={{ color: C.onSurfaceVariant }}>➔</Text>
                <Text style={[T.labelMd, { color: C.onSurface, flexShrink: 1 }]} numberOfLines={1}>
                  Cảng Tiên Sa
                </Text>
              </View>
              <View style={[s.rowBetween, { paddingLeft: 16 }]}>
                <Text style={[T.bodySm, { color: C.onSurfaceVariant }]}>Quãng đường: 26 km</Text>
                <Text style={[T.bodySm, { color: C.onSurfaceVariant }]}>Hạn bốc: 15:30 chiều nay</Text>
              </View>
            </View>

            <View style={[s.rowCenter, { gap: 4, paddingTop: 4 }]}>
              <Pressable style={[s.jobBtn, { backgroundColor: C.surfaceContainerLow }]}>
                <Text style={[T.labelMd, { color: C.onSurface }]}>Xem chi tiết</Text>
              </Pressable>
              <Pressable style={[s.jobBtn, { backgroundColor: C.primaryContainer }]}>
                <Text style={[T.labelMd, { color: C.onPrimary }]}>Nhận chuyến ngay</Text>
              </Pressable>
            </View>
          </View>

          {/* Job 3 */}
          <View style={[s.card, SH_SM, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
            <View style={{ flex: 1 }}>
              <View style={[s.rowCenter, { gap: 8 }]}>
                <Text style={[T.headSm, { color: C.primary }]}>2.100.000 đ</Text>
                <Text style={[T.labelSm, s.chipCont]}>Cont 40' GP</Text>
              </View>
              <Text style={[T.bodySm, { color: C.onSurfaceVariant, marginTop: 2 }]} numberOfLines={1}>
                KCN Hòa Cầm ➔ Cảng Quy Nhơn • Hạn 17:00
              </Text>
              <Text style={{ fontFamily: F.body, fontSize: 11, color: C.onSurfaceVariant }}>
                Hàng dệt may • 19 Tấn • Phí lưu bãi hỗ trợ
              </Text>
            </View>
            <Pressable style={s.viewFareBtn}>
              <Text style={[T.labelSm, { color: C.onSecondary }]}>Xem cước</Text>
              <MaterialIcons name="chevron-right" size={16} color={C.onSecondary} />
            </Pressable>
          </View>
        </View>

        {/* ===== Thẻ xăng dầu ===== */}
        <View style={[s.section, { marginTop: 16 }]}>
          <View
            style={[
              s.card,
              { backgroundColor: C.surfaceContainerLow, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
            ]}
          >
            <View style={[s.rowCenter, { flex: 1 }]}>
              <View style={s.fuelIcon}>
                <MaterialIcons name="local-gas-station" size={18} color={C.secondary} />
              </View>
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={[T.labelSm, { color: C.primary, fontFamily: F.bold }]}>Thẻ xăng dầu Petrolimex Fleet</Text>
                <Text style={[T.bodySm, { color: C.onSurfaceVariant }]}>Số dư mức cấp: 4.500.000 đ</Text>
              </View>
            </View>
            <Pressable>
              <Text style={[T.labelSm, { color: C.secondary, fontFamily: F.semibold }]}>Quét mã đổ xăng</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* ===== Header cố định ===== */}
      <View style={[s.header, { paddingTop: insets.top, height: HEADER_H + insets.top }]}>
        <View style={s.headerRow}>
          <View style={s.rowCenter}>
            <View style={s.logoBox}>
              <MaterialIcons name="local-shipping" size={22} color={C.secondaryContainer} />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={[T.labelSm, { color: C.secondary, letterSpacing: 1 }]}>LOGISTICS FLEET</Text>
              <Text style={[T.headSm, { color: C.onSurface }]}>Trang Chủ</Text>
            </View>
          </View>
          <View style={s.rowCenter}>

            <Pressable style={s.iconBtn11} onPress={() => { router.push('notification') }}>
              <MaterialIcons name="notifications" size={24} color={C.onSurfaceVariant} />
            </Pressable>

            <Pressable onPress={() => router.push('person')}>
              <View style={s.miniAvatar}>
                <MaterialIcons name="person" size={18} color={C.onPrimary} />
              </View>
            </Pressable>

          </View>
        </View>
      </View>

    </View>
  );


}



/* ───────────── Styles ───────────── */
const s = StyleSheet.create({
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  baseline: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },

  section: { paddingHorizontal: 16 },
  card: { backgroundColor: C.surfaceContainerLowest, borderRadius: 12, padding: 16 },

  /* chips */
  chipLight: {
    color: C.onSurfaceVariant,
    backgroundColor: C.surfaceContainerLowest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  chipOnTime: {
    color: C.onErrorContainer,
    fontFamily: F.bold,
    backgroundColor: 'rgba(255,218,214,0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  chipNew: {
    color: C.onSecondaryContainer,
    fontFamily: F.bold,
    backgroundColor: C.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  chipDistance: {
    color: C.onSurfaceVariant,
    backgroundColor: C.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  chipCont: {
    color: C.onSurfaceVariant,
    backgroundColor: C.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },

  /* header */
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(248,249,255,0.95)',
    ...SH_SM,
  },
  headerRow: {
    height: HEADER_H,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn11: { width: 44, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  /* driver card */
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.surfaceContainerHigh },
  avatarDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.secondaryContainer,
    borderWidth: 2,
    borderColor: C.surfaceContainerLowest,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: C.surfaceContainerLow,
  },
  plate: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: C.surfaceContainerHighest },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: C.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: C.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBox: {
    backgroundColor: C.surfaceContainerLow,
    padding: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotWrap: { width: 12, height: 12, alignItems: 'center', justifyContent: 'center' },
  toggle: { width: 64, height: 36, borderRadius: 18, padding: 4, justifyContent: 'center' },
  knob: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SH_TINY,
  },

  /* active trip */
  accentBeam: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, backgroundColor: C.secondaryContainer },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: C.secondaryContainer,
  },
  sealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  routeBox: {
    backgroundColor: 'rgba(239,244,255,0.7)',
    borderRadius: 12,
    padding: 16,
    paddingLeft: 24,
    gap: 16,
  },
  routeLine: { position: 'absolute', left: 28, top: 28, bottom: 28, width: 2, backgroundColor: C.surfaceContainerHigh },
  routeNode: { flexDirection: 'row', alignItems: 'flex-start', zIndex: 10 },
  nodeCircle: { width: 24, height: 24, borderRadius: 12, marginTop: 2, alignItems: 'center', justifyContent: 'center' },
  movingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: C.surfaceContainerLowest,
    flexShrink: 1,
    ...SH_TINY,
  },
  primaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: C.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SH_BTN,
  },
  callBtn: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: C.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtn: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: C.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* radar */
  radar: { borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  radarIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: C.secondary,
    marginLeft: 8,
  },

  /* job cards */
  fastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: C.surfaceContainer,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  tag: {
    backgroundColor: C.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  jobRoute: { backgroundColor: 'rgba(239,244,255,0.6)', borderRadius: 8, padding: 10, gap: 6, marginTop: 4 },
  jobBtn: { flex: 1, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  viewFareBtn: {
    height: 40,
    paddingLeft: 14,
    paddingRight: 8,
    borderRadius: 8,
    backgroundColor: C.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fuelIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: C.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* bottom nav */
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: 'rgba(248,249,255,0.96)',
    ...SH_NAV,
  },
  navRow: {
    height: NAV_H,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', minWidth: 44 },
  navDot: { width: 6, height: 6, borderRadius: 3, marginTop: 2, backgroundColor: C.secondaryContainer },
});