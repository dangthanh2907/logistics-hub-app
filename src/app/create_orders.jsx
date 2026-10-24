import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddressPicker from '../components/AddressPicker';

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

function Field({ label, value, placeholder, multiline = false, suffix }) {
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
          editable={false}
          textAlignVertical={multiline ? 'top' : 'center'}
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

  const scrollViewRef = useRef(null); //useRef chứ giá trị nhưng không render khi giá trị thay đổi dùng để chứa current tham chiếu đến ScrollView  để gọi hàm cuộn
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

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
        ref={scrollViewRef}
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
            value="Công ty TNHH Linh Kiện Điện Tử DaNang"
          />

          <Field
            label="Số điện thoại liên hệ *"
            value="0905 123 456"
            suffix="☎"
          />

          {/* form lấy địa chỉ */}
          <AddressPicker
            onProvinceSelected={() => {
              scrollViewRef.current?.scrollTo({
                y: 0,
                animated: true,
              });
            }}
          />

          <View style={styles.suggestionBox}>
            <Text style={styles.helperText}>
              Gợi ý điểm lấy cont rỗng / bốc hàng:
            </Text>

            <View style={styles.chipRow}>
              <StaticChip>⚓ Bãi Rỗng Tiên Sa</StaticChip>
              <StaticChip>🏭 Kho KCN Hòa Cầm</StaticChip>
              <StaticChip>▤ Depot Tân Cảng</StaticChip>
            </View>
          </View>
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
            value="Trần Bảo Long"
          />

          <Field
            label="Số điện thoại liên hệ *"
            value="0905 889 922"
            suffix="☎"
          />

          <Field
            label="Địa chỉ giao hàng / Tên Cảng - Kho hạ cont *"
            value="KCN Hòa Khánh, Cổng 2, Đường số 5, Q. Liên Chiểu, TP. Đà Nẵng"
            multiline
          />
        </View>

        {/* Section 3: Thông số hàng hóa */}
        <View style={styles.card}>
          <SectionTitle
            icon="▣"
            title="3. Thông số hàng hóa & Container"
          />

          <Field
            label="Mô tả hàng hóa *"
            value="Linh kiện điện tử cao cấp & Bo mạch viễn thông"
            multiline
          />

          <View style={styles.chipRow}>
            <StaticChip>+ Hàng giá trị cao</StaticChip>
            <StaticChip>+ Hàng nguy hiểm (DG)</StaticChip>
            <StaticChip>+ Bảo quản lạnh</StaticChip>
          </View>

          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Field
                label="Tổng tải trọng *"
                value="24.5"
                suffix="Tấn"
              />
            </View>

            <View style={styles.column}>
              <Field
                label="Quy cách cont *"
                value="Cont 40' HC"
                suffix="⌄"
              />
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Số chì niêm phong (Seal Number)
              </Text>

              <Text style={styles.optionalText}>Tùy chọn</Text>
            </View>

            <TextInput
              style={styles.input}
              value="ML-VN98421"
              editable={false}
            />
          </View>

          <Field
            label="Tiền cước vận tải đề xuất (VNĐ)"
            value="18.500.000 ₫"
            suffix="₫"
          />
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

          <View style={styles.slaSummary}>
            <Text style={styles.slaTime}>
              ◷ Trước 16:30 • 25/10/2026
            </Text>
          </View>
        </View>

        {/* Section 5: Ghi chú */}
        <View style={styles.card}>
          <SectionTitle
            icon="▤"
            title="5. Ghi chú cho tài xế & Điều độ"
          />

          <Field
            label="Yêu cầu vận hành"
            value="Yêu cầu tài xế kiểm tra vỏ cont, chụp ảnh 4 mặt trước khi rời bãi."
            multiline
          />
        </View>

        <View style={styles.bottomSpace} />
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
          <Text style={styles.createButtonText}>✓ Tạo vận đơn</Text>
        </View>
      </View>
    </SafeAreaView>
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
});