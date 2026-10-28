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
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

const COLORS = {
    primary: '#00193C',
    primaryContainer: '#0F2E5A',
    secondary: '#006591',
    secondaryContainer: '#39B8FD',
    background: '#F8F9FF',
    surface: '#FFFFFF',
    surfaceLow: '#EFF4FF',
    surfaceHigh: '#DCE9FF',
    surfaceContainer: '#E5EEFF',
    text: '#0B1C30',
    textSecondary: '#44474F',
    border: '#C4C6D0',
    error: '#BA1A1A',
};

export default function register_sender() {
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyTax, setCompanyTax] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(true);

    const passwordStrength = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;

    const strengthLabel = [
        'Chưa đủ mạnh',
        'Yếu / Weak',
        'Trung bình / Medium',
        'Khá mạnh / Good',
        'Mạnh / Strong',
    ][passwordStrength];

    const handleRegister = () => {
        if (!fullName.trim() || !phone.trim() ||
            !email.trim() || !password) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc.');
            return;
        }

        if (!acceptedTerms) {
            Alert.alert('Thông báo', 'Vui lòng đồng ý với điều khoản dịch vụ.');
            return;
        }

        if (passwordStrength < 4) {
            Alert.alert(
                'Mật khẩu chưa đủ mạnh',
                'Mật khẩu cần tối thiểu 8 ký tự, chữ hoa, chữ số và ký tự đặc biệt.'
            );
            return;
        }

        // TODO: Gọi API Spring Boot đăng ký người gửi tại đây.
        Alert.alert('Thông báo', 'Giao diện đã sẵn sàng. Bạn có thể kết nối API đăng ký.');
    };

    const renderInput = ({
        label,
        icon,
        value,
        onChangeText,
        placeholder,
        keyboardType = 'default',
        secureTextEntry = false,
        rightElement = null,
        helper = null,
        autoCapitalize = 'none',
    }) => (
        <View style={styles.field}>
            <Text style={styles.label}>
                {label} <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>{icon}</Text>

                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#747780"
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                />

                {rightElement}
            </View>

            {helper ? (
                <Text style={styles.helperText}>{helper}</Text>
            ) : null}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={COLORS.background}
            />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backIcon}>‹</Text>
                    </Pressable>

                    <View style={styles.brandIcon}>
                        <Text style={styles.brandIconText}>LH</Text>
                    </View>

                    <Text style={styles.headerTitle}>Sender Register</Text>

                    <View style={styles.profileIcon}>
                        <Text style={styles.profileText}>♟</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.flex}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Progress & Role */}
                    <View style={styles.intro}>
                        <View style={styles.progressRow}>
                            <View style={styles.roleBadge}>
                                <Text style={styles.roleBadgeIcon}>▣</Text>
                                <Text style={styles.roleBadgeText}>
                                    VAI TRÒ: CHỦ HÀNG / DOANH NGHIỆP
                                </Text>
                            </View>

                            <Text style={styles.stepText}>Bước 1 / 2</Text>
                        </View>

                        <Text style={styles.title}>
                            Thiết lập tài khoản
                        </Text>

                        <Text style={styles.subtitle}>
                            Điền thông tin để bắt đầu tạo đơn và kết nối mạng
                            lưới xe container chuẩn hóa toàn quốc.
                        </Text>
                    </View>

                    {/* Security banner */}
                    <View style={styles.securityBanner}>
                        <View style={styles.securityIconBox}>
                            <Text style={styles.securityIcon}>✓</Text>
                        </View>

                        <View style={styles.securityContent}>
                            <Text style={styles.securityTitle}>
                                Xác minh tức thì & Bảo mật kép
                            </Text>
                            <Text style={styles.securityDescription}>
                                Thông tin vận đơn và định danh doanh nghiệp
                                được bảo vệ an toàn.
                            </Text>
                        </View>
                    </View>

                    {/* Registration form */}
                    <View style={styles.form}>
                        {renderInput({
                            label: 'Họ và tên người đại diện',
                            icon: '♙',
                            value: fullName,
                            onChangeText: setFullName,
                            placeholder: 'VD: Nguyễn Văn Hưng',
                            autoCapitalize: 'words',
                        })}

                        {/* Phone */}
                        <View style={styles.field}>
                            <Text style={styles.label}>
                                Số điện thoại di động{' '}
                                <Text style={styles.required}>*</Text>
                            </Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>▯</Text>
                                <Text style={styles.countryCode}>+84</Text>
                                <View style={styles.verticalDivider} />

                                <TextInput
                                    style={styles.phoneInput}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="0905 123 456"
                                    placeholderTextColor="#747780"
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <Text style={styles.helperText}>
                                ⓘ Dùng để nhận mã OTP kích hoạt và thông báo lộ trình xe
                            </Text>
                        </View>

                        {renderInput({
                            label: 'Email liên hệ / Doanh nghiệp',
                            icon: '@',
                            value: email,
                            onChangeText: setEmail,
                            placeholder: 'hung.nguyen@logistics.vn',
                            keyboardType: 'email-address',
                        })}

                        {/* Password */}
                        <View style={styles.field}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>
                                    Mật khẩu bảo mật{' '}
                                    <Text style={styles.required}>*</Text>
                                </Text>

                                <Text style={styles.strengthLabel}>
                                    ● {strengthLabel}
                                </Text>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>♙</Text>

                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Tối thiểu 8 ký tự"
                                    placeholderTextColor="#747780"
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

                            <View style={styles.strengthBarRow}>
                                {[1, 2, 3, 4].map((item) => (
                                    <View
                                        key={item}
                                        style={[
                                            styles.strengthBar,
                                            item <= passwordStrength &&
                                                styles.strengthBarActive,
                                        ]}
                                    />
                                ))}
                            </View>

                            <Text style={styles.helperText}>
                                Tối thiểu 8 ký tự bao gồm chữ hoa, chữ số
                                và ký tự đặc biệt (@, #, $).
                            </Text>
                        </View>

                        {/* Company / Tax ID */}
                        <View style={styles.field}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>
                                    Tên công ty / Mã số thuế
                                </Text>

                                <View style={styles.optionalBadge}>
                                    <Text style={styles.optionalText}>
                                        Tùy chọn
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputIcon}>▤</Text>

                                <TextInput
                                    style={styles.input}
                                    value={companyTax}
                                    onChangeText={setCompanyTax}
                                    placeholder="Tên công ty - MST"
                                    placeholderTextColor="#747780"
                                />
                            </View>

                            <Text style={styles.helperText}>
                                Có thể bổ sung sau khi xác thực hợp đồng
                                vận chuyển điện tử.
                            </Text>
                        </View>

                        {/* Terms */}
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
                                Tôi đồng ý với{' '}
                                <Text style={styles.linkText}>
                                    Điều khoản dịch vụ
                                </Text>
                                {' '}và{' '}
                                <Text style={styles.linkText}>
                                    Chính sách bảo mật
                                </Text>
                                {' '}dữ liệu vận tải của Logistics Hub.
                            </Text>
                        </Pressable>

                        {/* Register button */}
                        <Pressable
                            style={styles.registerButton}
                            onPress={handleRegister}
                        >
                            <Text style={styles.registerButtonText}>
                                Đăng ký tài khoản Chủ hàng
                            </Text>
                            <Text style={styles.registerArrow}>→</Text>
                        </Pressable>

                        {/* Login */}
                        <View style={styles.loginRow}>
                            <Text style={styles.loginText}>
                                Đã có tài khoản?
                            </Text>

                            <TouchableOpacity
                                onPress={() => router.push('/login')}
                            >
                                <Text style={styles.loginLink}>
                                    Đăng nhập ngay
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Network snapshot */}
                    <View style={styles.networkBanner}>
                        <View style={styles.networkDot} />

                        <View style={styles.networkContent}>
                            <Text style={styles.networkTitle}>
                                2,840+ Container sẵn sàng nhận chuyến
                            </Text>
                            <Text style={styles.networkDescription}>
                                Cập nhật tại các cụm cảng
                            </Text>
                        </View>

                        <Text style={styles.networkIcon}>⌘</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },

    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop:40
    },

    header: {
        minHeight: 60,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#EDF1FA',
        gap: 10,
    },

    backButton: {
        width: 34,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    backIcon: {
        color: COLORS.text,
        fontSize: 36,
        lineHeight: 40,
    },

    brandIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: COLORS.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
    },

    brandIconText: {
        color: COLORS.surface,
        fontSize: 12,
        fontWeight: '800',
    },

    headerTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
    },

    profileIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    profileText: {
        color: COLORS.surface,
        fontSize: 15,
    },

    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30,
    },

    intro: {
        marginBottom: 20,
        gap: 8,
    },

    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 6,
    },

    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#C9E6FF',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 20,
        flexShrink: 1,
    },

    roleBadgeIcon: {
        color: COLORS.secondary,
        fontSize: 14,
    },

    roleBadgeText: {
        color: '#001E2F',
        fontSize: 9,
        fontWeight: '700',
    },

    stepText: {
        fontSize: 11,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },

    title: {
        color: COLORS.primary,
        fontSize: 24,
        lineHeight: 31,
        fontWeight: '700',
    },

    subtitle: {
        color: COLORS.textSecondary,
        fontSize: 13,
        lineHeight: 20,
    },

    securityBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        padding: 14,
        borderRadius: 12,
        backgroundColor: COLORS.surfaceLow,
        marginBottom: 22,
    },

    securityIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: COLORS.surfaceHigh,
        alignItems: 'center',
        justifyContent: 'center',
    },

    securityIcon: {
        fontSize: 23,
        fontWeight: '700',
        color: COLORS.secondary,
    },

    securityContent: {
        flex: 1,
        gap: 4,
    },

    securityTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.text,
    },

    securityDescription: {
        fontSize: 11,
        lineHeight: 17,
        color: COLORS.textSecondary,
    },

    form: {
        gap: 18,
    },

    field: {
        gap: 7,
    },

    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },

    label: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text,
    },

    required: {
        color: COLORS.error,
    },

    inputContainer: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EDF1FA',
        paddingHorizontal: 12,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },

    inputIcon: {
        width: 25,
        fontSize: 20,
        color: COLORS.textSecondary,
        marginRight: 5,
        textAlign: 'center',
    },

    input: {
        flex: 1,
        minHeight: 48,
        paddingVertical: 8,
        paddingHorizontal: 4,
        color: COLORS.text,
        fontSize: 13,
    },

    countryCode: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: '700',
        paddingHorizontal: 4,
    },

    verticalDivider: {
        width: 1,
        height: 24,
        backgroundColor: COLORS.surfaceHigh,
        marginHorizontal: 8,
    },

    phoneInput: {
        flex: 1,
        minHeight: 48,
        fontSize: 13,
        color: COLORS.text,
    },

    helperText: {
        fontSize: 10,
        lineHeight: 16,
        color: COLORS.textSecondary,
        paddingHorizontal: 3,
    },

    strengthLabel: {
        fontSize: 10,
        color: COLORS.secondary,
        fontWeight: '700',
    },

    eyeButton: {
        width: 32,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    eyeIcon: {
        fontSize: 20,
        color: COLORS.textSecondary,
    },

    strengthBarRow: {
        flexDirection: 'row',
        gap: 5,
        paddingHorizontal: 2,
    },

    strengthBar: {
        flex: 1,
        height: 5,
        borderRadius: 5,
        backgroundColor: COLORS.surfaceHigh,
    },

    strengthBarActive: {
        backgroundColor: COLORS.secondary,
    },

    optionalBadge: {
        paddingHorizontal: 9,
        paddingVertical: 4,
        backgroundColor: COLORS.surfaceHigh,
        borderRadius: 20,
    },

    optionalText: {
        color: COLORS.textSecondary,
        fontSize: 10,
        fontWeight: '600',
    },

    termsRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        paddingTop: 2,
    },

    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },

    checkboxChecked: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
    },

    checkboxTick: {
        color: COLORS.surface,
        fontSize: 14,
        fontWeight: '700',
    },

    termsText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 18,
        color: COLORS.textSecondary,
    },

    linkText: {
        color: COLORS.secondary,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },

    registerButton: {
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: COLORS.primaryContainer,
        borderRadius: 12,
        paddingHorizontal: 14,
        marginTop: 2,
        elevation: 3,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },

    registerButtonText: {
        color: COLORS.surface,
        fontSize: 13,
        fontWeight: '700',
    },

    registerArrow: {
        color: COLORS.surface,
        fontSize: 21,
    },

    loginRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        paddingVertical: 4,
    },

    loginText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },

    loginLink: {
        fontSize: 12,
        color: COLORS.secondary,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },

    networkBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 22,
        padding: 14,
        borderRadius: 12,
        backgroundColor: COLORS.surfaceContainer,
    },

    networkDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: COLORS.secondary,
    },

    networkContent: {
        flex: 1,
        gap: 4,
    },

    networkTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.text,
    },

    networkDescription: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },

    networkIcon: {
        fontSize: 22,
        color: COLORS.secondary,
    },
});
