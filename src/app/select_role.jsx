
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Pressable,
    TouchableOpacity,
} from 'react-native';

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
};

export default function SelectRole() {
    // Chưa chọn vai trò nào khi mới mở màn hình
    const [selectedRole, setSelectedRole] = useState(null);
    const router = useRouter();
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={COLORS.background}
            />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Brand & Intro */}
                <View style={styles.intro}>
                    <View style={styles.emblem}>
                        <Text style={styles.emblemIcon}>⌘</Text>
                        <View style={styles.liveDot} />
                    </View>

                    <View style={styles.telemetry}>
                        <View style={styles.telemetryDot} />
                        <Text style={styles.telemetryText}>
                            HỆ THỐNG VẬN HÀNH TOÀN QUỐC
                        </Text>
                    </View>

                    <Text style={styles.title}>
                        Gia nhập Nền tảng Logistics Hub
                    </Text>

                    <Text style={styles.subtitle}>
                        Giải pháp điều phối container & giao nhận vận tải
                        thông minh toàn quốc. Vui lòng chọn vai trò để tiếp tục.
                    </Text>
                </View>

                {/* Role cards */}
                <View style={styles.roleContainer}>

                    {/* Shipper */}
                    <Pressable
                        onPress={() => setSelectedRole('SENDER')}
                        style={[
                            styles.roleCard,
                            selectedRole === 'SENDER' && styles.selectedCard,
                        ]}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.roleInfo}>
                                <View style={styles.iconBox}>
                                    <Text style={styles.roleIcon}>📦</Text>
                                </View>

                                <View style={styles.roleTitleContainer}>
                                    <Text style={styles.roleTitle}>
                                        Người gửi hàng / Doanh nghiệp
                                    </Text>

                                    <Text style={styles.roleSubtitle}>
                                        Chủ hàng & Logistics Manager
                                    </Text>
                                </View>
                            </View>

                            {/* Radio + dấu tích */}
                            <View
                                style={[
                                    styles.radio,
                                    selectedRole === 'SENDER' &&
                                    styles.selectedRadio,
                                ]}
                            >
                                {selectedRole === 'SENDER' && (
                                    <Text style={styles.checkMark}>✓</Text>
                                )}
                            </View>
                        </View>

                        <Text style={styles.description}>
                            Tạo vận đơn, điều phối xe container, giám sát lộ
                            trình & tối ưu chi phí vận tải thời gian thực.
                        </Text>

                        <View style={styles.badges}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeIcon}>✓</Text>
                                <Text style={styles.badgeText}>
                                    Miễn phí khởi tạo
                                </Text>
                            </View>

                            <View style={styles.badge}>
                                <Text style={styles.badgeIcon}>↗</Text>
                                <Text style={styles.badgeText}>
                                    Quản lý SLA thông minh
                                </Text>
                            </View>
                        </View>
                    </Pressable>

                    {/* Driver */}
                    <Pressable
                        onPress={() => setSelectedRole('DRIVER')}
                        style={[
                            styles.roleCard,
                            selectedRole === 'DRIVER' && styles.selectedCard,
                        ]}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.roleInfo}>
                                <View style={styles.iconBox}>
                                    <Text style={styles.roleIcon}>🚚</Text>
                                </View>

                                <View style={styles.roleTitleContainer}>
                                    <Text style={styles.roleTitle}>
                                        Đối tác Tài xế / Đội xe
                                    </Text>

                                    <Text style={styles.roleSubtitle}>
                                        Tài xế Cont & Nhà xe tư nhân
                                    </Text>
                                </View>
                            </View>

                            {/* Radio + dấu tích */}
                            <View
                                style={[
                                    styles.radio,
                                    selectedRole === 'DRIVER' &&
                                    styles.selectedRadio,
                                ]}
                            >
                                {selectedRole === 'DRIVER' && (
                                    <Text style={styles.checkMark}>✓</Text>
                                )}
                            </View>
                        </View>

                        <Text style={styles.description}>
                            Nhận đơn bốc cont & giao hàng linh hoạt, thu nhập
                            hấp dẫn, hỗ trợ chỉ đường tránh cấm tải 24/7.
                        </Text>

                        <View style={styles.badges}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeIcon}>ϟ</Text>
                                <Text style={styles.badgeText}>
                                    Nhận chuyến ngay
                                </Text>
                            </View>

                            <View style={styles.badge}>
                                <Text style={styles.badgeIcon}>₫</Text>
                                <Text style={styles.badgeText}>
                                    Thu nhập minh bạch
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                </View>

                {/* Bottom actions */}
                <View style={styles.bottomSection}>
                    <Pressable
                        disabled={!selectedRole}
                        onPress={() => {
                            if (selectedRole === 'SENDER') {
                                router.push('/register_sender');
                            } else if (selectedRole === 'DRIVER') {
                                router.push('/register_driver');
                            }
                        }}
                        style={[
                            styles.continueButton,
                            selectedRole && styles.continueButtonActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.continueText,
                                selectedRole && styles.continueTextActive,
                            ]}
                        >
                            Tiếp tục thiết lập tài khoản
                        </Text>

                        <Text
                            style={[
                                styles.arrow,
                                selectedRole && styles.arrowActive,
                            ]}
                        >
                            →
                        </Text>
                    </Pressable>

                    <View style={styles.loginRow}>
                        <Text style={styles.loginText}>
                            Đã có tài khoản?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => { router.push('login') }}>
                            <Text style={styles.loginLink}>
                                Đăng nhập ngay
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.trustBanner}>
                        <Text style={styles.shield}>♢</Text>

                        <Text style={styles.trustText}>
                            Hơn 15.000+ chuyến xe container & 5.000+ đối tác tin dùng
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop:30
    },

    container: {
        flex: 1,
    },

    content: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 32,
    },

    intro: {
        alignItems: 'center',
        marginBottom: 24,
    },

    emblem: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: COLORS.surfaceHigh,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        position: 'relative',
    },

    emblemIcon: {
        fontSize: 36,
        fontWeight: '700',
        color: COLORS.primary,
    },

    liveDot: {
        position: 'absolute',
        width: 13,
        height: 13,
        borderRadius: 7,
        backgroundColor: COLORS.secondary,
        borderWidth: 2,
        borderColor: COLORS.background,
        top: -3,
        right: -3,
    },

    telemetry: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceContainer,
        marginBottom: 12,
    },

    telemetryDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.secondary,
    },

    telemetryText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.8,
        color: COLORS.secondary,
    },

    title: {
        fontSize: 23,
        lineHeight: 30,
        fontWeight: '700',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 14,
        lineHeight: 21,
        color: COLORS.textSecondary,
        textAlign: 'center',
        maxWidth: 320,
    },

    roleContainer: {
        gap: 16,
        marginBottom: 24,
    },

    roleCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 18,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EDF1FA',
        elevation: 3,
        shadowColor: '#00193C',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
    },

    // Style khi thẻ được chọn
    selectedCard: {
        borderWidth: 2,
        borderColor: COLORS.secondary,
        backgroundColor: '#F0F7FF',
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 14,
    },

    roleInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    iconBox: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: COLORS.surfaceHigh,
        alignItems: 'center',
        justifyContent: 'center',
    },

    roleIcon: {
        fontSize: 25,
    },

    roleTitleContainer: {
        flex: 1,
    },

    roleTitle: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '700',
        color: COLORS.text,
    },

    roleSubtitle: {
        fontSize: 11,
        lineHeight: 17,
        color: COLORS.textSecondary,
        marginTop: 3,
    },

    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.surfaceContainer,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },

    selectedRadio: {
        backgroundColor: COLORS.primary,
    },

    checkMark: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: '700',
    },

    description: {
        fontSize: 12,
        lineHeight: 19,
        color: COLORS.textSecondary,
        marginBottom: 14,
    },

    badges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: COLORS.surfaceContainer,
        paddingHorizontal: 9,
        paddingVertical: 7,
        borderRadius: 6,
    },

    badgeIcon: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.secondary,
    },

    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.text,
    },

    bottomSection: {
        alignItems: 'center',
        gap: 16,
    },

    continueButton: {
        width: '100%',
        height: 48,
        borderRadius: 8,
        backgroundColor: COLORS.surfaceHigh,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        opacity: 0.65,
    },

    continueText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },

    arrow: {
        fontSize: 18,
        color: COLORS.textSecondary,
    },

    loginRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },

    loginText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },

    loginLink: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.secondary,
        textDecorationLine: 'underline',
    },

    trustBanner: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: COLORS.surfaceLow,
    },

    shield: {
        fontSize: 19,
        color: COLORS.secondary,
    },

    trustText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    continueButtonActive: {
        backgroundColor: COLORS.primary,
        opacity: 1,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },

    continueTextActive: {
        color: COLORS.surface,
        fontWeight: '700',
    },

    arrowActive: {
        color: COLORS.surface,
    },
});
