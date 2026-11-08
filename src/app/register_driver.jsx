import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Pressable,
    TouchableOpacity,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import axiosClient from '../api/axiosClient';
const C = {
    primary: '#00193C',
    primaryContainer: '#0F2E5A',
    secondary: '#006591',
    secondaryLight: '#39B8FD',
    background: '#F8F9FF',
    surface: '#FFFFFF',
    surfaceLow: '#EFF4FF',
    surfaceHigh: '#DCE9FF',
    surfaceContainer: '#E5EEFF',
    text: '#0B1C30',
    textSecondary: '#44474F',
    outline: '#747780',
    border: '#C4C6D0',
    error: '#BA1A1A',
};

const LICENSES = [
    { label: 'Hạng C', description: 'Tải > 3.5T' },
    { label: 'Hạng D', description: 'Chở người' },
    { label: 'Hạng E', description: 'Xe khách lớn' },
    { label: 'Hạng FC', description: 'Xe container' },
];

const DOCUMENTS = [
    {
        id: 'licenseFront',
        title: '1. Mặt trước Bằng lái xe',
        icon: '▣',
        description: 'Ảnh mặt trước giấy phép lái xe',
    },
    {
        id: 'licenseBack',
        title: '2. Mặt sau Bằng lái xe',
        icon: '▧',
        description: 'Ảnh mặt sau giấy phép lái xe',
    },
    {
        id: 'vehicleFront',
        title: '3. Mặt trước Đăng ký xe / Cà vẹt',
        icon: '▤',
        description: 'Giấy đăng ký xe nguyên bản',
    },
    {
        id: 'vehicleBack',
        title: '4. Mặt sau Đăng ký xe / Cà vẹt',
        icon: '▤',
        description: 'Mặt sau có dấu xác nhận cơ quan',
    },
];

export default function register_driver() {
    const router = useRouter();

    // const [fullName, setFullName] = useState('');
    // const [phone, setPhone] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState({
        fullname: '',
        phonenumber: '',
        email: '',
        password: '',
        selectedLicense: 'Hạng FC',
        vehicle_type: '',
        vehicle_number: ''
    });
    const [documents, setDocuments] = useState({
        licenseFront: null,
        licenseBack: null,
        vehicleFront: null,
        vehicleBack: null,
    });


    const uploadedCount = Object.values(documents).filter(Boolean).length;

    const passwordStrength = [
        form.password.length >= 8,
        /[A-Z]/.test(form.password),
        /[0-9]/.test(form.password),
        /[^A-Za-z0-9]/.test(form.password),
    ].filter(Boolean).length;

    const handleChooseImage = async (documentId) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync(); // yêu cầu truy cập
        if (!permissionResult.granted) { //grated là thuộc tích của expo xem người dùng đã cấp quyền hay chưua
            alert("Bạn cần cấp quyền truy cập thư viện để chọn ảnh!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        })

        if (!result.canceled) {
            const image = result.assets[0];
            setDocuments(prev => ({
                ...prev,
                [documentId]: {
                    uri: image.uri,
                    name: image.fileName || `${documentId}.jpg`,
                    type: image.mimeType || 'image/jpeg',
                },
            }));
        }
    };
    const buildFormData = () => {
        const formData = new FormData();
        const formRegister = {
            fullname: form.fullname,
            phonenumber: form.phonenumber,
            email: form.email,
            password: form.password,
            role: 'DRIVER',
            vehicle_type: form.vehicle_type,
            vehicle_number: form.vehicle_number
        };

        formData.append('form_register', JSON.stringify(formRegister));
        formData.append('licenseFront', {
            uri: documents.licenseFront.uri,
            name: documents.licenseFront.name,
            type: documents.licenseFront.type,
        });

        formData.append('licenseBack', {
            uri: documents.licenseBack.uri,
            name: documents.licenseBack.name,
            type: documents.licenseBack.type,
        });

        formData.append('vehicle_registrationFront', {
            uri: documents.vehicleFront.uri,
            name: documents.vehicleFront.name,
            type: documents.vehicleFront.type,
        });

        formData.append('vehicle_registrationBack', {
            uri: documents.vehicleBack.uri,
            name: documents.vehicleBack.name,
            type: documents.vehicleBack.type,
        });
        return formData;
    };

    //hàm gửi khi bấm nộp
    const handleSubmit = async () => {
        const requiredDocuments = [
            'licenseFront',
            'licenseBack',
            'vehicleFront',
            'vehicleBack'
        ];
        if (!form.fullname.trim() || !form.phonenumber.trim() || !form.password) {
            Alert.alert(
                'Thiếu thông tin',
                'Vui lòng nhập họ tên, số điện thoại và mật khẩu.'
            );
            return;
        }

        if (!form.selectedLicense) {
            Alert.alert('Thiếu thông tin', 'Vui lòng chọn hạng giấy phép lái xe.');
            return;
        }

        if (!acceptedTerms) {
            Alert.alert(
                'Chưa xác nhận',
                'Vui lòng đồng ý với cam kết thông tin pháp lý.'
            );
            return;
        }

        if (passwordStrength < 4) {
            Alert.alert(
                'Mật khẩu chưa đủ mạnh',
                'Mật khẩu cần tối thiểu 8 ký tự, chữ hoa, chữ số và ký tự đặc biệt.'
            );
            return;
        }


        const missingDocument = requiredDocuments.some(
            key => !documents[key]
        );

        if (missingDocument) {
            Alert.alert(
                'Thiếu giấy tờ',
                'Vui lòng tải lên đầy đủ 4 ảnh giấy tờ.'
            );
            return;
        }
        try {
            setSubmitting(true);
            const formData = buildFormData();
            const response = await axiosClient.post('/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSubmitted(true);
            Alert.alert(
                'Đăng ký thành công!',
                'Hồ sơ bác tài của bạn đã được gửi. Vui lòng chờ Admin kiểm duyệt trong 48 giờ trước khi đăng nhập.',
                [{ text: 'Về trang đăng nhập', onPress: () => router.replace('/login') }]
            );
        } catch (error) {
            console.error("Lỗi đăng ký tài xế:", error);
            const errorMsg = error.response?.data || error.message || 'Đã có lỗi xảy ra khi kết nối máy chủ.';
            Alert.alert('Đăng ký thất bại', typeof errorMsg === 'string' ? errorMsg : 'Vui lòng kiểm tra lại dữ liệu.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={C.background}
            />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backIcon}>‹</Text>
                    </Pressable>

                    <View style={styles.brandLogo}>
                        <Text style={styles.brandLogoText}>LH</Text>
                    </View>

                    <Text style={styles.headerTitle}>Driver Register</Text>

                    <View style={styles.profileCircle}>
                        <Text style={styles.profileIcon}>♟</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.flex}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Role header */}
                    <View style={styles.roleRow}>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleIcon}>🚚</Text>
                            <Text style={styles.roleText}>
                                Vai trò: Bác tài / Đối tác vận tải
                            </Text>
                        </View>

                        <View style={styles.stepBadge}>
                            <View style={styles.liveDot} />
                            <Text style={styles.stepText}>Hồ sơ 2/2 bước</Text>
                        </View>
                    </View>

                    {/* Verification banner */}
                    <View style={styles.noticeBanner}>
                        <View style={styles.noticeIconBox}>
                            <Text style={styles.noticeIcon}>✓</Text>
                        </View>

                        <View style={styles.noticeContent}>
                            <Text style={styles.noticeTitle}>
                                Quy trình thẩm định nhanh
                            </Text>
                            <Text style={styles.noticeDescription}>
                                Hồ sơ của bạn sẽ được đội ngũ điều phối duyệt
                                trong vòng 2–4 giờ làm việc sau khi gửi thông
                                tin xác thực.
                            </Text>
                        </View>
                    </View>

                    {/* Section 1 */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeading}>
                            <View style={styles.numberCircle}>
                                <Text style={styles.numberText}>1</Text>
                            </View>
                            <Text style={styles.sectionTitle}>
                                Thông tin cá nhân cơ bản
                            </Text>
                        </View>

                        <View style={styles.formCard}>
                            {/* Full name */}
                            <View style={styles.field}>
                                <Text style={styles.label}>
                                    Họ và tên bác tài <Text style={styles.required}>*</Text>
                                </Text>

                                <View style={styles.inputBox}>
                                    <Text style={styles.inputIcon}>▣</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.fullname}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            fullname: text
                                        }))}
                                        placeholder="VD: Trần Nhật Tuyên"
                                        placeholderTextColor={C.outline}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            {/* Phone */}
                            <View style={styles.field}>
                                <Text style={styles.label}>
                                    Số điện thoại liên hệ <Text style={styles.required}>*</Text>
                                </Text>

                                <View style={styles.inputBox}>
                                    <View style={styles.verticalDivider} />
                                    <Text style={styles.inputIcon}>☎</Text>

                                    <TextInput
                                        style={styles.input}
                                        value={form.phonenumber}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            phonenumber: text
                                        }))}
                                        placeholder="0912 345 678"
                                        placeholderTextColor={C.outline}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            {/* Email */}
                            <View style={styles.field}>
                                <Text style={styles.label}>
                                    Email cá nhân
                                </Text>

                                <View style={styles.inputBox}>
                                    <Text style={styles.inputIcon}>✉</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.email}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            email: text
                                        }))}
                                        placeholder="VD: email@domain.com"
                                        placeholderTextColor={C.outline}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                            {/* Loại xe vận chueyern*/}
                            <View style={styles.field}>
                                <Text style={styles.label}>
                                    Loại xe
                                </Text>

                                <View style={styles.inputBox}>

                                    <TextInput
                                        style={styles.input}
                                        value={form.vehicle_type}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            vehicle_type: text
                                        }))}
                                        placeholder="VD: Honda"
                                        placeholderTextColor={C.outline}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {/*Biển số xe*/}
                            <View style={styles.field}>
                                <Text style={styles.label}>
                                    Biển số xe
                                </Text>

                                <View style={styles.inputBox}>

                                    <TextInput
                                        style={styles.input}
                                        value={form.vehicle_number}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            vehicle_number: text
                                        }))}
                                        placeholder="VD:29-A1 123456"
                                        placeholderTextColor={C.outline}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                            {/* Password */}
                            <View style={styles.field}>
                                <Text style={styles.label}>
                                    Mật khẩu tạo tài khoản <Text style={styles.required}>*</Text>
                                </Text>

                                <View style={styles.inputBox}>
                                    <Text style={styles.inputIcon}>▣</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.password}
                                        onChangeText={(text) => setForm(prev => ({
                                            ...prev,
                                            password: text
                                        }))}
                                        placeholder="Nhập mật khẩu"
                                        placeholderTextColor={C.outline}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                    />

                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Text style={styles.eyeIcon}>
                                            {showPassword ? '◉' : '◎'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.strengthRow}>
                                    {[1, 2, 3].map((item) => (
                                        <View
                                            key={item}
                                            style={[
                                                styles.strengthBar,
                                                item <= Math.ceil(passwordStrength * 3 / 4) &&
                                                styles.strengthBarActive,
                                            ]}
                                        />
                                    ))}
                                    <Text style={styles.strengthText}>
                                        {passwordStrength === 4
                                            ? 'Bảo mật mạnh'
                                            : form.password.length === 0
                                                ? 'Đánh giá mật khẩu'
                                                : 'Cần tăng độ mạnh'}
                                    </Text>
                                </View>
                            </View>

                            {/* License selection */}
                            <View style={styles.field}>
                                <Text style={styles.label}>
                                    Hạng giấy phép lái xe (GPLX) <Text style={styles.required}>*</Text>
                                </Text>

                                <View style={styles.licenseGrid}>
                                    {LICENSES.map((license) => {
                                        const selected = form.selectedLicense === license.label;

                                        return (
                                            <Pressable
                                                key={license.label}
                                                onPress={() =>
                                                    setForm(prev => ({
                                                        ...prev,
                                                        selectedLicense: license.label,
                                                    }))
                                                }
                                                style={[
                                                    styles.licenseButton,
                                                    selected && styles.licenseButtonSelected,
                                                ]}
                                            >
                                                {selected && (
                                                    <Text style={styles.licenseCheck}>✓</Text>
                                                )}

                                                <View>
                                                    <Text
                                                        style={[
                                                            styles.licenseText,
                                                            selected && styles.licenseTextSelected,
                                                        ]}
                                                    >
                                                        {license.label}
                                                    </Text>

                                                    <Text
                                                        style={[
                                                            styles.licenseDescription,
                                                            selected && styles.licenseTextSelected,
                                                        ]}
                                                    >
                                                        {license.description}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                    </View>



                    {/* Section 2 */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeading}>
                            <View style={styles.numberCircle}>
                                <Text style={styles.numberText}>2</Text>
                            </View>

                            <Text style={styles.sectionTitle}>
                                Tải lên giấy tờ & GPLX
                            </Text>
                        </View>

                        <View style={styles.progressDocumentsRow}>
                            <Text style={styles.progressDocumentsText}>
                                Đã tải {uploadedCount}/4 giấy tờ
                            </Text>

                            <View style={styles.progressTrack}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${uploadedCount * 25}%` },
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.guidelineBanner}>
                            <Text style={styles.guidelineIcon}>ⓘ</Text>
                            <Text style={styles.guidelineText}>
                                <Text style={styles.boldText}>Lưu ý khi chụp: </Text>
                                Ảnh rõ nét, không bị lóa sáng, không mất góc
                                và còn thời hạn hiệu lực.
                            </Text>
                        </View>

                        {DOCUMENTS.map((document) => {
                            const uploaded = Boolean(documents[document.id]);

                            return (
                                <View
                                    key={document.id}
                                    style={styles.documentCard}
                                >
                                    <View style={styles.documentHeader}>
                                        <View style={styles.documentTitleRow}>
                                            <View
                                                style={[
                                                    styles.documentIconBox,
                                                    uploaded && styles.documentIconUploaded,
                                                ]}
                                            >
                                                <Text style={styles.documentIcon}>
                                                    {document.icon}
                                                </Text>
                                            </View>

                                            <Text style={styles.documentTitle}>
                                                {document.title}
                                            </Text>
                                        </View>

                                        <Text
                                            style={[
                                                styles.documentStatus,
                                                uploaded && styles.documentStatusUploaded,
                                            ]}
                                        >
                                            {uploaded ? '✓ Đã tải' : 'Chưa tải'}
                                        </Text>
                                    </View>

                                    {uploaded ? (
                                        <View style={styles.uploadedFileRow}>
                                            <View style={styles.filePreview}>
                                                <Text style={styles.filePreviewIcon}>▧</Text>
                                            </View>

                                            <View style={styles.fileInfo}>
                                                <Text
                                                    style={styles.fileName}
                                                    numberOfLines={1}
                                                >
                                                    {documents[document.id].name}
                                                </Text>
                                                <Text style={styles.fileSize}>
                                                    Đã chọn ảnh
                                                </Text>
                                            </View>

                                            <Pressable
                                                style={styles.changeImageButton}
                                                onPress={() =>
                                                    handleChooseImage(document.id)
                                                }
                                            >
                                                <Text style={styles.changeImageText}>
                                                    Đổi ảnh
                                                </Text>
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <Pressable
                                            style={styles.uploadArea}
                                            onPress={() =>
                                                handleChooseImage(document.id)
                                            }
                                        >
                                            <View style={styles.uploadCircle}>
                                                <Text style={styles.uploadIcon}>＋</Text>
                                            </View>

                                            <Text style={styles.uploadTitle}>
                                                Chạm để chụp hoặc chọn ảnh
                                            </Text>
                                            <Text style={styles.uploadDescription}>
                                                JPG, PNG, HEIC • Tối đa 15MB
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            );
                        })}
                    </View>

                    {/* Fleet banner */}
                    <View style={styles.fleetBanner}>
                        <View style={styles.truckImagePlaceholder}>
                            <Text style={styles.truckIcon}>🚛</Text>
                        </View>

                        <View style={styles.fleetContent}>
                            <Text style={styles.fleetTitle}>
                                Mạng lưới vận tải toàn quốc
                            </Text>
                            <Text style={styles.fleetDescription}>
                                Hơn 12,000 bác tài đang hoạt động liên tỉnh
                                với chính sách tạm ứng cước ngay khi giao hàng.
                            </Text>
                        </View>
                    </View>

                    {/* Legal agreement */}
                    <Pressable
                        style={styles.termsRow}
                        onPress={() => setAcceptedTerms(!acceptedTerms)}
                    >
                        <View
                            style={[
                                styles.checkbox,
                                acceptedTerms && styles.checkboxChecked,
                            ]}
                        >
                            {acceptedTerms && (
                                <Text style={styles.checkboxTick}>✓</Text>
                            )}
                        </View>

                        <Text style={styles.termsText}>
                            Tôi cam kết các thông tin và giấy tờ cung cấp là
                            hoàn toàn chính xác theo quy định pháp luật và đồng
                            ý với <Text style={styles.termsLink}>Điều khoản đối tác tài xế</Text>.
                        </Text>
                    </Pressable>

                    {/* Submit */}
                    <Pressable
                        style={[
                            styles.submitButton,
                            submitted && styles.submitButtonSuccess,
                        ]}
                        onPress={handleSubmit}
                        disabled={submitting || submitted}
                    >
                        {submitting ? (
                            <Text style={styles.submitText}>
                                Đang xử lý hồ sơ...
                            </Text>
                        ) : (
                            <>
                                <View style={styles.submitTitleRow}>
                                    <Text style={styles.submitIcon}>
                                        {submitted ? '✓' : '➤'}
                                    </Text>
                                    <Text style={styles.submitText}>
                                        {submitted
                                            ? 'Đã gửi thành công'
                                            : 'Gửi hồ sơ đăng ký & Chờ xét duyệt'}
                                    </Text>
                                </View>

                                {!submitted && (
                                    <View style={styles.securityBadge}>
                                        <Text style={styles.securityBadgeIcon}>♢</Text>
                                        <Text style={styles.securityBadgeText}>
                                            Bảo mật 100%
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </Pressable>

                    {/* Hotline */}
                    <View style={styles.hotlineRow}>
                        <Text style={styles.hotlineLabel}>
                            Cần trợ giúp đăng ký?
                        </Text>

                        <Pressable
                            onPress={() =>
                                Alert.alert(
                                    'Hotline hỗ trợ',
                                    'Hotline mẫu: 1900 6868'
                                )
                            }
                        >
                            <Text style={styles.hotlineLink}>
                                ☎ Gọi hotline: 1900 6868
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },

    safeArea: {
        flex: 1,
        backgroundColor: C.background,
    },

    header: {
        minHeight: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        gap: 10,
        backgroundColor: C.background,
        borderBottomWidth: 1,
        borderBottomColor: '#EDF1FA',
    },

    backButton: {
        width: 32,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },

    backIcon: {
        fontSize: 36,
        color: C.text,
        lineHeight: 40,
    },

    brandLogo: {
        width: 32,
        height: 32,
        borderRadius: 7,
        backgroundColor: C.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },

    brandLogoText: {
        fontSize: 11,
        fontWeight: '800',
        color: C.surface,
    },

    headerTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: C.text,
    },

    profileCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: C.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    profileIcon: {
        fontSize: 16,
        color: C.surface,
    },

    content: {
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 35,
    },

    roleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },

    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: C.surfaceHigh,
        flexShrink: 1,
    },

    roleIcon: {
        fontSize: 15,
    },

    roleText: {
        color: C.text,
        fontSize: 10,
        fontWeight: '600',
        flexShrink: 1,
    },

    stepBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 8,
        paddingVertical: 7,
        backgroundColor: '#DFF3FF',
        borderRadius: 20,
    },

    liveDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: C.secondary,
    },

    stepText: {
        fontSize: 9,
        color: C.secondary,
        fontWeight: '600',
    },

    noticeBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 14,
        borderRadius: 12,
        backgroundColor: C.surfaceLow,
        marginBottom: 24,
    },

    noticeIconBox: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: C.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },

    noticeIcon: {
        fontSize: 21,
        fontWeight: '700',
        color: C.secondary,
    },

    noticeContent: {
        flex: 1,
        gap: 5,
    },

    noticeTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: C.text,
    },

    noticeDescription: {
        fontSize: 11,
        lineHeight: 17,
        color: C.textSecondary,
    },

    section: {
        marginBottom: 24,
        gap: 14,
    },

    sectionHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    numberCircle: {
        width: 25,
        height: 25,
        borderRadius: 13,
        backgroundColor: C.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    numberText: {
        fontSize: 12,
        fontWeight: '700',
        color: C.surface,
    },

    sectionTitle: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700',
        color: C.text,
    },

    formCard: {
        padding: 14,
        borderRadius: 12,
        backgroundColor: C.surface,
        gap: 17,
        elevation: 1,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
    },

    field: {
        gap: 7,
    },

    label: {
        fontSize: 12,
        fontWeight: '600',
        color: C.textSecondary,
    },

    required: {
        color: C.error,
    },

    inputBox: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        borderRadius: 9,
        backgroundColor: C.surfaceLow,
    },

    inputIcon: {
        fontSize: 18,
        color: C.outline,
        width: 22,
        textAlign: 'center',
    },

    input: {
        flex: 1,
        minHeight: 46,
        fontSize: 13,
        color: C.text,
        paddingVertical: 7,
    },

    flag: {
        fontSize: 16,
    },

    countryCode: {
        fontSize: 12,
        fontWeight: '700',
        color: C.text,
    },

    verticalDivider: {
        width: 1,
        height: 22,
        backgroundColor: C.surfaceHigh,
    },

    eyeButton: {
        width: 32,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    eyeIcon: {
        fontSize: 20,
        color: C.outline,
    },

    strengthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 3,
    },

    strengthBar: {
        height: 5,
        flex: 1,
        borderRadius: 5,
        backgroundColor: C.surfaceHigh,
    },

    strengthBarActive: {
        backgroundColor: C.secondary,
    },

    strengthText: {
        fontSize: 10,
        fontWeight: '600',
        color: C.secondary,
    },

    licenseGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    licenseButton: {
        width: '48%',
        minHeight: 46,
        flexGrow: 1,
        flexBasis: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingHorizontal: 6,
        borderRadius: 9,
        backgroundColor: C.surfaceLow,
        borderWidth: 1,
        borderColor: 'transparent',
    },

    licenseButtonSelected: {
        backgroundColor: C.primary,
        borderColor: C.primary,
        elevation: 2,
    },

    licenseCheck: {
        color: C.surface,
        fontSize: 15,
        fontWeight: '700',
    },

    licenseText: {
        fontSize: 12,
        textAlign: 'center',
        color: C.textSecondary,
        fontWeight: '700',
    },

    licenseDescription: {
        fontSize: 9,
        textAlign: 'center',
        marginTop: 2,
        color: C.textSecondary,
    },

    licenseTextSelected: {
        color: C.surface,
    },

    progressDocumentsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    progressDocumentsText: {
        fontSize: 11,
        fontWeight: '600',
        color: C.secondary,
    },

    progressTrack: {
        height: 5,
        flex: 1,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: C.surfaceHigh,
    },

    progressFill: {
        height: '100%',
        backgroundColor: C.secondary,
        borderRadius: 5,
    },

    guidelineBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        padding: 13,
        borderRadius: 10,
        backgroundColor: C.surfaceLow,
    },

    guidelineIcon: {
        fontSize: 21,
        color: C.secondary,
    },

    guidelineText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 17,
        color: C.text,
    },

    boldText: {
        fontWeight: '700',
    },

    documentCard: {
        padding: 13,
        borderRadius: 12,
        backgroundColor: C.surface,
        gap: 13,
        elevation: 1,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
    },

    documentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },

    documentTitleRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    documentIconBox: {
        width: 29,
        height: 29,
        borderRadius: 7,
        backgroundColor: C.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },

    documentIconUploaded: {
        backgroundColor: '#C9E6FF',
    },

    documentIcon: {
        color: C.secondary,
        fontSize: 16,
    },

    documentTitle: {
        flex: 1,
        fontSize: 12,
        fontWeight: '700',
        color: C.text,
    },

    documentStatus: {
        fontSize: 10,
        color: C.outline,
        fontWeight: '500',
    },

    documentStatusUploaded: {
        color: C.secondary,
        fontWeight: '700',
    },

    uploadArea: {
        minHeight: 116,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        padding: 12,
        borderRadius: 9,
        backgroundColor: '#F3F6FD',
        borderWidth: 1,
        borderColor: '#E2EAF8',
        borderStyle: 'dashed',
    },

    uploadCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D8EDFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    uploadIcon: {
        fontSize: 25,
        color: C.secondary,
        lineHeight: 29,
    },

    uploadTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: C.text,
        textAlign: 'center',
    },

    uploadDescription: {
        fontSize: 10,
        color: C.outline,
        textAlign: 'center',
    },

    uploadedFileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        padding: 9,
        borderRadius: 9,
        backgroundColor: C.surfaceLow,
    },

    filePreview: {
        width: 55,
        height: 44,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: C.surfaceHigh,
    },

    filePreviewIcon: {
        fontSize: 24,
        color: C.secondary,
    },

    fileInfo: {
        flex: 1,
        gap: 4,
    },

    fileName: {
        fontSize: 10,
        fontWeight: '600',
        color: C.text,
    },

    fileSize: {
        fontSize: 10,
        color: C.outline,
    },

    changeImageButton: {
        paddingHorizontal: 10,
        paddingVertical: 9,
        borderRadius: 7,
        backgroundColor: C.surfaceContainer,
    },

    changeImageText: {
        fontSize: 10,
        fontWeight: '600',
        color: C.text,
    },

    fleetBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        padding: 13,
        borderRadius: 12,
        backgroundColor: C.surfaceLow,
        marginBottom: 20,
    },

    truckImagePlaceholder: {
        width: 58,
        height: 58,
        borderRadius: 9,
        backgroundColor: C.surfaceHigh,
        alignItems: 'center',
        justifyContent: 'center',
    },

    truckIcon: {
        fontSize: 29,
    },

    fleetContent: {
        flex: 1,
        gap: 5,
    },

    fleetTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: C.text,
    },

    fleetDescription: {
        fontSize: 11,
        lineHeight: 17,
        color: C.textSecondary,
    },

    termsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 18,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },

    checkboxChecked: {
        backgroundColor: C.secondary,
        borderColor: C.secondary,
    },

    checkboxTick: {
        color: C.surface,
        fontSize: 14,
        fontWeight: '700',
    },

    termsText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 18,
        color: C.textSecondary,
    },

    termsLink: {
        color: C.secondary,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },

    submitButton: {
        minHeight: 58,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: C.primary,
        elevation: 3,
        shadowColor: C.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 5,
    },

    submitButtonSuccess: {
        backgroundColor: C.secondary,
        justifyContent: 'center',
    },

    submitTitleRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    submitIcon: {
        fontSize: 20,
        color: '#C9E6FF',
    },

    submitText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '700',
        color: C.surface,
    },

    securityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#FFDDDA',
    },

    securityBadgeIcon: {
        fontSize: 12,
        color: '#93000A',
    },

    securityBadgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#93000A',
    },

    hotlineRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 14,
    },

    hotlineLabel: {
        fontSize: 11,
        color: C.textSecondary,
    },

    hotlineLink: {
        fontSize: 11,
        fontWeight: '700',
        color: C.secondary,
    },
});
