import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddressPicker from '../components/address/AddressPicker';
import * as ImagePicker from 'expo-image-picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';
import axiosClient from '../api/axiosClient';
import { useRouter } from 'expo-router';
const COLORS = {
  primary: '#00193C',
  secondary: '#006591',
  background: '#F8F9FF',
  white: '#FFFFFF',
  surface: '#EFF4FF',
  surfaceHigh: '#DCE9FF',
  border: '#D3E4FE',
  text: '#0B1C30',
  muted: '#747780',
  error: '#BA1A1A',
};

function SectionTitle({ icon, title, badge }) {
  return (
    <View style={styles.sectionTitle}>
      <View style={styles.sectionIcon}>
        <Text style={styles.sectionIconText}>{icon}</Text>
      </View>

      <Text style={styles.sectionTitleText}>{title}</Text>

      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Field({ label, value, placeholder, multiline = false, suffix, onChangeText }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            suffix && styles.inputWithSuffix,
          ]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9299A6"
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onChangeText={onChangeText}
        />

        {suffix ? (
          <View style={styles.inputSuffix}>
            <Text style={styles.suffixText}>{suffix}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function StaticChip({ children, selected = false }) {
  return (
    <View style={[styles.chip, selected && styles.selectedChip]}>
      <Text
        style={[
          styles.chipText,
          selected && styles.selectedChipText,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}


export default function create_orders() {
  const [selectedImage, setSelectedImage] = useState(null); // ảnh minh hoạ
  const [showContainerTypes, setShowContainerTypes] = useState(false); // quy cách
  const [initialSenderAddress, setInitialSenderAddress] = useState(null); // địa chỉ của người toạ để gửi cho con 
  const [order, setOrder] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: { province: '', ward: '', addressDetail: '' },
    recipientName: '',
    recipientPhone: '',
    recipientAddress: { province: '', ward: '', addressDetail: '' },
    itemDescription: '',
    weight: '',
    selectedValue: '',
    sealnumber: '',
    payment: '',
    pickupDeadline: new Date(),
    note: ''
  });

  // hàm mở camera chụp ảnh
  const handlepickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync(); // xin quyền truy cập camera
    if (!permissionResult.granted) { //grated là thuộc tích của expo xem người dùng đã cấp quyền hay chưua
      alert("Bạn cần cấp quyền truy cập camera để chụp ảnh!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,        // Nén dung lượng ảnh lại một chút cho nhẹ
    });

    //  Nếu người dùng chụp và không bấm hủy, lưu lại đường dẫn ảnh
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  //hàm mơe thư viện chọn ảnh
  const handlepickGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) { //grated là thuộc tích của expo xem người dùng đã cấp quyền hay chưua
      alert("Bạn cần cấp quyền truy cập thư viện để chọn ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  // hàm lấy địa chỉ ở hàm con sender
  const getsenderaddRess = ({ province, ward, addressDetail }) => {
    setOrder(prev => ({
      ...prev,
      senderAddress: { province, ward, addressDetail },
    }))
  }
  // hàm lấy địa chỉ ở hàm con rêcviser
  const recipientAddress = ({ province, ward, addressDetail }) => {
    setOrder(prev => ({
      ...prev,
      recipientAddress: { province, ward, addressDetail },
    }))
  }




  //hàm submit
  const submit = async () => {

    if (!order.senderName.trim() ||
      !order.senderPhone.trim() ||
      !order.senderAddress.province ||
      !order.senderAddress.ward ||
      !order.senderAddress.addressDetail.trim() ||
      !order.recipientName.trim() ||
      !order.recipientPhone.trim() ||
      !order.recipientAddress.province ||
      !order.recipientAddress.ward ||
      !order.recipientAddress.addressDetail.trim() ||
      !order.weight.trim() ||
      !order.selectedValue) {
      Alert.alert(
        'Chưa thể tạo vận đơn',
        'Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc trước khi tiếp tục.',
        [
          {
            text: 'Đã hiểu',
            style: 'default',
          },
        ]
      );
      return;
    }
    console.log(order);
    try {
      const formData = new FormData();

      // định dạng lại thành String để phù hợp với kiểu ở springboot
      const formattedSenderAddress = `${order.senderAddress.addressDetail}, ${order.senderAddress.ward}, ${order.senderAddress.province}`;
      const formattedRecipientAddress = `${order.recipientAddress.addressDetail}, ${order.recipientAddress.ward}, ${order.recipientAddress.province}`;

      const orderDataToSend = {
        ...order,

        // Ghi đè địa chỉ thành dạng chuỗi String
        senderAddress: formattedSenderAddress,
        recipientAddress: formattedRecipientAddress,
      };

      formData.append('order', JSON.stringify(orderDataToSend));

      if (selectedImage) {
        formData.append("image", {
          uri: selectedImage,
          name: "container.jpg",
          type: 'image/jpeg',
        });
      }

      const response = await axiosClient.post("/orders", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Tạo đơn thành công:", response.data);
      alert("Tạo đơn hàng thành công!");
    } catch (error) {
      console.error(
        'Lỗi tạo đơn hàng:',
        error.response?.data || error.message
      );
    }
  }

  const CONTAINER_TYPES = [
    { id: '1', name: "Cont 20' DC (Khô chuẩn)" },
    { id: '2', name: "Cont 40' DC (Khô lớn)" },
    { id: '3', name: "Cont 40' HC (Cao - Phổ biến)" },
    { id: '4', name: "Cont Lạnh " },
    { id: '5', name: "Cont Mở mái " },
    { id: '6', name: "Khác)" },
  ];

  //hàm dịnh dạng lại ngày giờ
  const formatSlaDateTime = (d) => {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${hours}:${minutes} • ${day}/${month}/${year}`;
  };

  //hàm lấy ngày tháng năm
  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: order.pickupDeadline,
      mode: 'date',
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          setOrder(prev => {
            const pickupDeadline = new Date(prev.pickupDeadline);

            pickupDeadline.setFullYear(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            );

            return { ...prev, pickupDeadline };
          });
        }
      },
    });
  };
  // hàm lấy giừo phút
  const openTimePicker = () => {
    DateTimePickerAndroid.open({
      value: order.pickupDeadline,
      mode: 'time',
      is24Hour: true,
      onChange: (event, selectedTime) => {
        if (event.type === 'set' && selectedTime) {
          setOrder(prev => {
            const pickupDeadline = new Date(prev.pickupDeadline);

            pickupDeadline.setHours(
              selectedTime.getHours(),
              selectedTime.getMinutes()
            );

            return { ...prev, pickupDeadline };
          });
        }
      },
    });
  };

  // chạy mỗi khi compoment render để lấy thong tin user để vào form
  useEffect(() => {
    const getinforUser = async () => {
      const respone = await axiosClient.get('/users/search');
      const userData = respone.data;
      console.log("nhận thông tin từ backend: ", userData);

      const parts = (userData.address || '').split(',').map(s => s.trim());
      const address = {
        addressDetail: parts[0] || '',
        ward: parts[1] || '',
        province: parts[2] || '',
      };

      setOrder(prev => ({
        ...prev,
        senderName: userData.fullName,
        senderPhone: userData.phoneNumer,
        senderAddress: address,
      }))
      setInitialSenderAddress(address)
      //console.log(address);

    }
    getinforUser();
  }, []) // chỉ render khi mới mửo component
  const router = useRouter();
  return (

    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.backIcon}>‹</Text>

            <View style={styles.logo}>
              <Text style={styles.logoText}>LH</Text>
            </View>

            <Text style={styles.headerTitle} numberOfLines={1}>
              Tạo Vận Đơn Container
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.refreshText}>↻ Làm mới</Text>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
          </View>
        </View>

        <ScrollView

          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Notice */}
          <View style={styles.notice}>
            <Text style={styles.noticeIcon}>✓</Text>

            <View style={styles.noticeContent}>
              <Text style={styles.noticeHeading}>
                QUY CHUẨN ĐIỀU PHỐI
              </Text>

              <Text style={styles.noticeSubheading}>
                Tự động sinh mã
              </Text>

              <Text style={styles.noticeDescription}>
                Mã vận đơn tự động tạo dạng{' '}
                <Text style={styles.bold}>LH-XXXXXXXX</Text>.
                {' '}Trạng thái khởi tạo:{' '}
                <Text style={styles.secondaryBold}>
                  CHỜ NHẬN (PENDING)
                </Text>.
              </Text>
            </View>
          </View>

          {/* Five steps including Người gửi */}
          <View style={styles.stepper}>
            {[
              'Người gửi',
              'Người nhận',
              'Hàng & Cont',
              'Hạn SLA',
              'Ghi chú',
            ].map((step, index) => (
              <View style={styles.stepItem} key={step}>
                <View
                  style={[
                    styles.stepNumber,
                    index === 0 && styles.activeStepNumber,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumberText,
                      index === 0 && styles.activeStepNumberText,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.stepText,
                    index === 0 && styles.activeStepText,
                  ]}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>

          {/* SECTION MỚI BỔ SUNG: 1. Thông tin người gửi & Điểm bốc cont */}
          <View style={styles.card}>
            <SectionTitle
              icon="🏭"
              title="1. Thông tin người gửi & Điểm bốc cont"
              badge="Bắt buộc"
            />

            <Field
              label="Tên nhà máy / Đại diện kho lấy hàng *"
              placeholder={"Nguyen Van A"}
              onChangeText={(text) => setOrder(prev => ({
                ...prev,
                senderName: text,
              })
              )}
              value={order.senderName}
            />

            <Field
              label="Số điện thoại liên hệ *"
              suffix="☎"
              placeholder={"0123456789"}
              onChangeText={(text) => setOrder(prev => ({
                ...prev,
                senderPhone: text,
              })
              )}
              value={order.senderPhone}
            />
            <Text style={styles.label}>
              Địa chỉ bốc hàng *
            </Text>
            {/* form lấy địa chỉ */}
            <AddressPicker initialAddress={initialSenderAddress} getsenderaddRess={getsenderaddRess} />


          </View>

          {/* Section 2: Thông tin người nhận */}
          <View style={styles.card}>
            <SectionTitle
              icon="⌖"
              title="2. Thông tin người nhận & Điểm đến"
              badge="Bắt buộc"

            />

            <Field
              label="Họ tên người nhận / Đại diện bãi kho *"
              placeholder={"Nguyen Van B"}
              onChangeText={(text) => setOrder(prev => ({
                ...prev,
                recipientName: text,
              })
              )}
              value={order.recipientName}
            />

            <Field
              label="Số điện thoại liên hệ *"
              placeholder={"0123456789"}
              suffix="☎"
              onChangeText={(text) => setOrder(prev => ({
                ...prev,
                recipientPhone: text,
              })
              )}

              value={order.recipientPhone}
            />
            <Text style={styles.label}>
              Địa chỉ trả hàng *
            </Text>
            <AddressPicker recipientAddress={recipientAddress} />
          </View>

          {/* Section 3: Thông số hàng hóa */}
          <View style={styles.card}>
            <SectionTitle
              icon="▣"
              title="3. Thông số hàng hóa & Container"
            />

            <Field
              label="Mô tả hàng hóa *"
              value={order.itemDescription}
              onChangeText={(text) => setOrder(prev => ({
                ...prev,
                itemDescription: text,
              })
              )}
            />



            <View style={styles.twoColumns}>
              <View style={styles.column}>
                <Field
                  label="Tổng tải trọng *"
                  suffix="Tấn"
                  onChangeText={(text) => setOrder(prev => ({ ...prev, weight: text }))}
                  value={order.weight}
                />
              </View>

              <View style={styles.column}>
                <Text style={[styles.label, { marginBottom: 6 }]}>Quy cách cont <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity style={styles.containerTypeButton} onPress={() => { setShowContainerTypes(!showContainerTypes) }}>
                  <Text style={[
                    styles.containerTypeText,
                    !order.selectedValue && styles.placeholderText,
                  ]}>{order.selectedValue || "Chọn quy cách"}</Text>
                  <Text >⌄</Text>
                </TouchableOpacity>
                {showContainerTypes && (
                  <View style={styles.containerTypeList}>
                    {
                      CONTAINER_TYPES.map((type) => (
                        <TouchableOpacity key={type.id}
                          onPress={() => {
                            setShowContainerTypes(!showContainerTypes), setOrder(prev => ({
                              ...prev,
                              selectedValue: type.name,
                            }))
                          }}
                          style={styles.containerTypeItem}
                          activeOpacity={0.7}>
                          <Text >{type.name}</Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                )}
              </View>
            </View>



            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  Số chì niêm phong (Seal Number)
                </Text>

              </View>

              <TextInput
                style={styles.input}

                editable={true}
                onChangeText={(text) => setOrder(prev => ({
                  ...prev,
                  sealnumber: text,
                })
                )}
                value={order.sealnumber}
              />
            </View>

            <Field
              label="Tiền cước vận tải đề xuất (VNĐ)"
              onChangeText={(text) => setOrder(prev => ({
                ...prev,
                payment: Number(text.replace(/\D/g, '')),

              })
              )}
              value={order.payment}
              suffix="₫"
            />

            {/* // phần ảnh  */}
            <View style={styles.field}>
              <Text style={styles.label}>Chụp ảnh minh hoạ hàng / Container (Tùy chọn)</Text>

              {selectedImage ? (
                <View style={{ position: 'relative', marginTop: 8 }} >

                  <View style={styles.imageButtonRow}>
                    {/* Nút bấm để chụp lại nếu không ưng ý */}
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={handlepickImage}
                    >
                      <Text style={styles.cameraButtonText}>
                        📷 Chụp lại ảnh
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={handlepickGallery}
                    >
                      <Text style={styles.cameraButtonText}>
                        🖼️ Chọn ảnh khác từ thư viện
                      </Text>
                    </TouchableOpacity>
                  </View>


                  <TouchableOpacity
                    style={styles.deleteImageButton}
                    onPress={() => setSelectedImage(null)}
                  >
                    <Text style={styles.deleteImageButtonText}>
                      🗑️  Xóa ảnh
                    </Text>
                  </TouchableOpacity>

                  <Image
                    source={{ uri: selectedImage }}
                    style={{
                      width: '100%',
                      height: 180,
                      borderRadius: 8,
                      marginTop: 12,
                    }}
                  />
                </View>
              ) : (
                <View style={styles.imageButtonRow}>
                  <TouchableOpacity style={styles.cameraButton} onPress={handlepickImage}>
                    <Text style={styles.cameraButtonText}>📷 Mở Camera </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cameraButton} onPress={handlepickGallery}>
                    <Text style={styles.cameraButtonText}>🖼️ Thư viện</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Section 4: SLA */}
          <View style={[styles.card, styles.slaCard]}>
            <SectionTitle
              icon="◷"
              title="4. Hạn chót lấy hàng (Pickup SLA)"
            />

            <View style={styles.warningBox}>
              <Text style={styles.warningIcon}>⚠</Text>

              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>
                  CẢNH BÁO CẮT MÁNG & LỊCH TÀU
                </Text>

                <Text style={styles.warningDescription}>
                  Nếu quá thời hạn này mà tài xế chưa có mặt tại bãi bốc hàng, hệ thống kích hoạt quyền hủy chuyến và tái điều phối tài xế mới.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.slaSummary}
              onPress={openDatePicker}
            >
              <Text style={styles.slaTime}>
                ◷ Trước {formatSlaDateTime(order.pickupDeadline)}
              </Text>
              <Text style={{ fontSize: 12, color: '#006591', fontWeight: '600' }}>
                Thay đổi ngày
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.slaSummary}
              onPress={openTimePicker}
            >
              <Text style={styles.slaTime}>
                ◷ Giờ lấy hàng: {String(order.pickupDeadline.getHours()).padStart(2, '0')}:
                {String(order.pickupDeadline.getMinutes()).padStart(2, '0')}
              </Text>
              <Text style={{ fontSize: 12, color: '#006591', fontWeight: '600' }}>
                Thay đổi giờ
              </Text>
            </TouchableOpacity>




          </View>

          {/* Section 5: Ghi chú */}
          <View style={styles.card}>
            <SectionTitle
              icon="▤"
              title="5. Ghi chú cho tài xế & Điều độ"
            />

            <Field
              label="Yêu cầu vận hành"

              multiline
              onChangeText={(text) => setOrder(prev => ({
                ...prev,
                note: text,
              })
              )}
              value={order.note}
            />
          </View>


        </ScrollView>

        {/* Fixed bottom bar */}
        <View style={styles.bottomBar}>
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>TRẠNG THÁI BIỂU MẪU</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Sẵn sàng lưu</Text>
            </View>
          </View>


          <View style={styles.createButton}>
            <TouchableOpacity onPress={submit}>
              <Text style={styles.createButtonText}>✓ Tạo vận đơn</Text>
            </TouchableOpacity>
          </View>


        </View>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { minHeight: 64, paddingHorizontal: 12, backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#EEF1F6' },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  backIcon: { fontSize: 34, color: COLORS.primary, width: 28, textAlign: 'center' },
  logo: { width: 34, height: 34, borderRadius: 8, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  logoText: { color: COLORS.white, fontSize: 13, fontWeight: '800' },
  headerTitle: { flex: 1, color: COLORS.primary, fontSize: 14, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  refreshText: { fontSize: 11, fontWeight: '600', color: COLORS.secondary },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, gap: 14 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: COLORS.surfaceHigh, padding: 12, borderRadius: 12 },
  noticeIcon: { color: COLORS.secondary, fontSize: 23, fontWeight: '800' },
  noticeContent: { flex: 1 },
  noticeHeading: { color: COLORS.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  noticeSubheading: { color: COLORS.primary, fontSize: 12, fontWeight: '700', marginTop: 3 },
  noticeDescription: { color: '#44474F', fontSize: 12, lineHeight: 18, marginTop: 5 },
  bold: { color: COLORS.primary, fontWeight: '800' },
  secondaryBold: { color: COLORS.secondary, fontWeight: '800' },
  stepper: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 12, gap: 6 },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepNumber: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  activeStepNumber: { backgroundColor: COLORS.primary },
  stepNumberText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  activeStepNumberText: { color: COLORS.white },
  stepText: { color: COLORS.text, fontSize: 9, fontWeight: '500' },
  activeStepText: { color: COLORS.primary, fontWeight: '800' },
  card: { backgroundColor: COLORS.white, padding: 14, borderRadius: 12, gap: 14, borderWidth: 1, borderColor: '#F0F2F8' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  sectionIconText: { color: COLORS.primary, fontSize: 18, fontWeight: '700' },
  sectionTitleText: { flex: 1, color: COLORS.primary, fontSize: 13, lineHeight: 18, fontWeight: '700' },
  badge: { backgroundColor: COLORS.surface, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: COLORS.secondary, fontSize: 9, fontWeight: '700' },
  field: { gap: 6 },
  label: { color: '#44474F', fontSize: 12, lineHeight: 18, fontWeight: '600' },
  inputContainer: { position: 'relative', justifyContent: 'center' },
  input: { minHeight: 44, borderRadius: 8, borderWidth: 1, borderColor: '#E0E6F0', backgroundColor: COLORS.white, color: COLORS.text, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13 },
  multilineInput: { minHeight: 64, textAlignVertical: 'top', lineHeight: 18 },
  inputWithSuffix: { paddingRight: 55 },
  inputSuffix: { position: 'absolute', right: 8, backgroundColor: COLORS.surface, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 6 },
  suffixText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  suggestionBox: { backgroundColor: COLORS.surface, padding: 10, borderRadius: 9, gap: 8 },
  helperText: { color: COLORS.muted, fontSize: 11, lineHeight: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: COLORS.surface, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 6, borderWidth: 1, borderColor: '#E1EAF9' },
  chipText: { color: COLORS.secondary, fontSize: 10, fontWeight: '600' },
  selectedChip: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  selectedChipText: { color: COLORS.white },
  twoColumns: { flexDirection: 'row', gap: 10 },
  column: { flex: 1, minWidth: 0 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  optionalText: { color: COLORS.muted, fontSize: 10 },
  slaCard: { borderLeftWidth: 4, borderLeftColor: '#39B8FD' },
  warningBox: { backgroundColor: '#FFEBE8', borderRadius: 9, padding: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  warningIcon: { color: COLORS.error, fontSize: 18 },
  warningContent: { flex: 1 },
  warningTitle: { color: '#93000A', fontSize: 10, fontWeight: '800' },
  warningDescription: { color: '#7C2525', fontSize: 11, lineHeight: 16, marginTop: 4 },
  slaSummary: { backgroundColor: COLORS.surface, borderRadius: 10, padding: 10 },
  slaTime: { color: COLORS.primary, fontSize: 13, fontWeight: '800' },
  bottomSpace: { height: 80 },
  bottomBar: { minHeight: 70, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#E7ECF5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  statusContainer: { flex: 1 },
  statusLabel: { color: COLORS.muted, fontSize: 9, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#39B8FD' },
  statusText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  createButton: { minHeight: 44, flex: 1, backgroundColor: COLORS.primary, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  createButtonText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  imageButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },

  cameraButton: {
    flex: 1,
    backgroundColor: '#EFF4FF',
    borderWidth: 1,
    borderColor: '#D3E4FE',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraButtonText: {
    color: '#00193C',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteImageButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteImageButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  containerTypeButton: {
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E6F0',
    borderRadius: 8,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },



  required: {
    color: COLORS.error,
  },


  containerTypeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.text,
  },

  placeholderText: {
    color: '#9299A6',
    fontWeight: '400',
  },

  containerTypeArrow: {
    fontSize: 20,
    color: '#006591',
    marginLeft: 8,
  },
  containerTypeList: {
    position: 'absolute',
    top: 76,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,

    borderWidth: 1,
    borderColor: '#D3E4FE',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  containerTypeItem: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },

  containerTypeItemSelected: {
    backgroundColor: '#EFF4FF',
  },

  containerTypeItemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },

  containerTypeItemTextSelected: {
    color: '#006591',
    fontWeight: '700',
  },

  containerTypeCheck: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#006591',
  },
});