import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    PanResponder,
    Animated,
} from 'react-native';


import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import axiosClient from '../api/axiosClient';


const Order_detail = (props) => {



    const openMap = () => {
        const address = props.order.senderAddress;
        const url = `https://www.google.com/maps/dir/?api=1` +
            `&destination=${encodeURIComponent(address)}` +
            `&travelmode=driving`;;
        Linking.openURL(url);
    }
    //dành cho thanh trượt
    const step_change = [
        {
            currentStatus: 'ASSIGNED',
            stepIndexText: 'Bước 2/6: Xác nhận nhận đã đến',
            title: 'Trượt để xác nhận đã đã đến',
            endpoint: 'arrived_pickingup',
            nextStatus: 'ARRIVED_PICKUP',
        },
        {
            currentStatus: 'ARRIVED_PICKUP',
            stepIndexText: 'Bước 3/6: Xác nhận nhận kiện hàng',
            title: 'Trượt để xác nhận đã lấy hàng',
            endpoint: 'picked_up',
            nextStatus: 'PICKED_UP',
        },
        {
            currentStatus: 'PICKED_UP',
            stepIndexText: 'Bước 4/6: Di chuyển đến điểm giao',
            title: 'Trượt để xác nhận đã đến nơi giao',
            endpoint: 'arrived_delivery',
            nextStatus: 'ARRIVED_DELIVERY',
        },
        {
            currentStatus: 'ARRIVED_DELIVERY',
            stepIndexText: 'Bước 5/6: Bàn giao cho người nhận',
            title: 'Trượt để xác nhận đã giao hàng thành công',
            endpoint: 'delivered',
            nextStatus: 'DELIVERED',
        },
    ];
    // dành cho tiến  trình 
    const steps = [
        {
            status: 'PENDING',
            title: 'Đang chờ nhận',
            icon: 'checkmark',
            timeKey: 'createdAt',                     // Khớp với order.createdAt
            desc: 'Hệ thống phân phối tự động',
        },
        {
            status: 'ASSIGNED',
            title: 'Đã nhận đơn',
            icon: 'ellipse',
            timeKey: 'assignedAt',                    // Khớp với order.assignedAt
            desc: 'Tài xế tiếp nhận chuyến xe',
        },
        {
            status: 'ARRIVED_PICKUP',
            title: 'Đã đến nơi lấy',
            icon: 'location-outline',
            timeKey: 'arrivedPickupAt',
            desc: 'Đã có mặt tại điểm gửi',
        },
        {
            status: 'PICKED_UP',
            title: 'Đã lấy hàng',
            icon: 'cube-outline',
            timeKey: 'pickedUpAt',
            desc: 'Bắt đầu di chuyển giao hàng',
        },
        {
            status: 'ARRIVED_DELIVERY',
            title: 'Đã đến nơi giao',
            icon: 'home-outline',
            timeKey: 'arrivedDeliveryAt',
            desc: 'Liên hệ người nhận để giao',
        },
        {
            status: 'DELIVERED',
            title: 'Đã giao thành công',
            icon: 'checkmark-done-outline',
            timeKey: 'deliveredAt',
            desc: 'Hoàn tất chuyến hàng',
        },
    ];

    const [currentOrder, setCurrentOrder] = useState(props.order); // truyền vào order hiện tại để khi có thay đổi status thì render lại component 

    const currentAction = step_change.find(step => step.currentStatus === currentOrder.status) // hàm dành dành cho cái chỗ thanh trượt

    const getstep_exist = steps.findIndex(step => step.status === currentOrder.status)    // hàm lấy bước hiện tại trả về vị trí , dành cho cái các quy trình

    useEffect(() => {
        setCurrentOrder(prev => {
            // Cùng một đơn hàng thì không ghi đè state vừa cập nhật
            if (prev?.orderId === props.order?.orderId) {
                return prev;
            }

            // Chỉ khởi tạo lại khi chuyển sang đơn hàng khác
            return props.order;
        });
    }, [props.order]);

    // hàm này sẽ được gọi để gọi api khi tìa xế kéo thanh đến 70 %
    const handleconfirmStatus = async () => {
        if (!currentAction) return; // nếu currentAction  mà khôgn có trả về gì thì dừng hàm
        try {
            // console.log("hiện tại :",currentAction.status);
            // console.log("hiện tại  :",currentAction.endpoint);
            const respone = await axiosClient.put(`/orders/${currentOrder.orderId}/${currentAction.endpoint}`) // gọi api đổi status
            console.log("đã đổi trạng thái thành công: ", currentAction.nextStatus);

            if (currentAction.nextStatus === "DELIVERED") {
                Alert.alert("Thành công", "Đơn hàng đã được giao thành công!");
                props.changefinish();
                await props.getorderfinish();
                await props.getorderworking();
            }

            if (respone?.data) //?.nếu respone có tồn tại thì lấy data còn khôgn thì trả về undefined thêm if để kiểm tra nó là đúng 1 đối tượng hoặc chuỗi không phải undifined thì thực hiện code trong if
            {
                setCurrentOrder(respone.data); // truyền order mới vào state để render lại
            }
            else { // trường hợp gửi thành công rồi đã đổi được và trả lại respone == null thì vẫn biết trạng thái tiếp theo là gì
                setCurrentOrder(prev => ({ //prev đây chính là currentOrder
                    ...prev, // toán tử 3 chấm coppy dữ liệu ở prev qua object mới sau đó truyền vào lại set để
                    status: currentAction.nextStatus, // gán trạng thái của order là cái tiếp theo để biết 
                }))
            }
        } catch (error) {
            console.log('HTTP status:', error.response?.status);
            console.log('Backend message:', error.response?.data);
            console.log('Order ID:', currentOrder.orderId);
            console.log('Current status:', currentOrder.status);
            console.log('Endpoint:', currentAction?.endpoint);
        }
    }
    //hàm đổi lại giờ
    // Hàm đổi lại ngày giờ
    const formatTime = (dateString) => {
        if (!dateString) return null;

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return null;

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes} - ${day}/${month}/${year} `;
    };


    // hàm đổi trạng thái thành đã đến lấy hàng
    // const chanstatus_arrived_pickup = async () => {
    //     try {
    //         await axiosClient.put(`orders/${props.order.orderId}/arrived_pickingup`);
    //         console.log("Đã đổi trạng thái thành ARRIVED_PICKUP");
    //     } catch (error) {
    //         console.log("Lỗi đổi trạng thái:", error);
    //     }
    // }


    const [isSliding, setIsSliding] = useState(false);
    const [sliderWidth, setSliderWidth] = useState(0);

    const THUMB_SIZE = 48;
    const MAX_DRAG = Math.max(0, sliderWidth - THUMB_SIZE - 8);

    const pan = useRef(new Animated.Value(0)).current;

    // Lưu giá trị mới nhất để PanResponder luôn đọc đúng
    const maxDragRef = useRef(0);
    const isSlidingRef = useRef(false);

    useEffect(() => {
        maxDragRef.current = MAX_DRAG;
    }, [MAX_DRAG]);

    useEffect(() => {
        isSlidingRef.current = isSliding;
    }, [isSliding]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                console.log('Bắt đầu chạm nút trượt');
            },

            onPanResponderMove: (_, gestureState) => {
                const max = maxDragRef.current;

                const newX = Math.max(
                    0,
                    Math.min(gestureState.dx, max)
                );

                console.log('dx:', gestureState.dx, 'max:', max);

                pan.setValue(newX);
            },

            onPanResponderRelease: (_, gestureState) => {
                const max = maxDragRef.current;

                if (
                    max > 0 &&
                    gestureState.dx >= max * 0.7 &&
                    !isSlidingRef.current
                ) {
                    isSlidingRef.current = true;
                    setIsSliding(true);

                    Animated.timing(pan, {
                        toValue: max,
                        duration: 120,
                        useNativeDriver: true,
                    }).start(async () => {
                        try {
                            await handleconfirmStatus();
                        } finally {
                            Animated.spring(pan, {
                                toValue: 0,
                                useNativeDriver: true,
                            }).start(() => {
                                isSlidingRef.current = false;
                                setIsSliding(false);
                            });
                        }
                    });
                } else {
                    Animated.spring(pan, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* ================= HEADER ================= */}
                <View style={styles.header}>

                    <TouchableOpacity style={styles.backButton} onPress={props.detail_order}>
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#0B1C30"
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Chi tiết đơn hàng
                    </Text>

                    <TouchableOpacity style={styles.supportButton}>
                        <Ionicons
                            name="headset-outline"
                            size={22}
                            color="#0B1C30"

                        />
                    </TouchableOpacity>

                </View>


                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >

                    {/* ================= ORDER SUMMARY ================= */}
                    <View style={styles.card}>

                        <View style={styles.orderHeader}>

                            <View>
                                <View style={styles.orderTitleRow}>

                                    <Text style={styles.orderTitle}>
                                        Đơn hàng #{props.order.orderId}
                                    </Text>

                                    <View style={styles.urgentBadge}>
                                        <Text style={styles.urgentText}>
                                            HỎA TỐC
                                        </Text>
                                    </View>

                                </View>

                                <View style={styles.trackingRow}>

                                    <Text style={styles.label}>
                                        Mã vận đơn:{props.order.trackingNumber}
                                    </Text>

                                    <Text style={styles.trackingNumber}>

                                    </Text>

                                    <TouchableOpacity>
                                        <Ionicons
                                            name="copy-outline"
                                            size={15}
                                            color="#00193C"
                                        />
                                    </TouchableOpacity>

                                </View>
                            </View>


                            {/* STATUS */}
                            <View style={styles.statusBadge}>

                                <View style={styles.statusDot} />

                                <Text style={styles.statusText}>
                                    {props.getStatusText(currentOrder.status)}
                                </Text>

                            </View>

                        </View>


                        {/* TIME + DISTANCE */}
                        <View style={styles.infoRow}>

                            <View style={styles.infoItem}>
                                <Ionicons
                                    name="time-outline"
                                    size={16}
                                    color="#44474F"
                                />

                                <Text style={styles.smallText} >
                                    {props.order.createdAt}
                                </Text>
                            </View>

                            <View style={styles.distanceBadge}>

                                <Ionicons
                                    name="navigate-outline"
                                    size={15}
                                    color="#006591"
                                />

                                <Text style={styles.distanceText}>
                                    8.4 km • 18 phút
                                </Text>
                            </View>
                        </View>
                    </View>


                    {/* ================= SENDER ================= */}
                    <View style={styles.card}>

                        <View style={styles.sectionHeader}>

                            <View style={styles.sectionTitleContainer}>

                                <View style={styles.iconBox}>
                                    <Ionicons
                                        name="business-outline"
                                        size={18}
                                        color="#00193C"
                                    />
                                </View>

                                <View>
                                    <Text style={styles.sectionTitle}>
                                        Thông tin người gửi
                                    </Text>

                                    <Text style={styles.sectionSubtitle}>
                                        Điểm lấy hàng
                                    </Text>
                                </View>

                            </View>


                            <TouchableOpacity style={styles.callButton}>
                                <Ionicons
                                    name="call"
                                    size={19}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>

                        </View>


                        <View style={styles.sectionContent}>

                            <Text style={styles.personName}>
                                {props.order.senderName}
                            </Text>

                            <Text style={styles.secondaryText}>
                                Đại diện:{' '}
                                <Text style={styles.boldText}>
                                    {props.order.senderName}
                                </Text>
                                {' '} ({props.order.senderPhone})
                            </Text>

                            <View style={styles.addressRow}>

                                <Ionicons
                                    name="location"
                                    size={18}
                                    color="#00193C"
                                />

                                <Text style={styles.addressText}>
                                    {props.order.senderAddress}
                                </Text>

                            </View>


                            <TouchableOpacity style={styles.directionButton} onPress={openMap}>

                                <Ionicons
                                    name="navigate-outline"
                                    size={16}
                                    color="#00193C"
                                />

                                <Text style={styles.directionText}>
                                    Chỉ đường đến kho
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </View>


                    {/* ================= RECIPIENT ================= */}
                    <View style={styles.card}>

                        <View style={styles.sectionHeader}>

                            <View style={styles.sectionTitleContainer}>

                                <View style={styles.recipientIconBox}>
                                    <Ionicons
                                        name="person-outline"
                                        size={18}
                                        color="#006591"
                                    />
                                </View>

                                <View>
                                    <Text style={styles.sectionTitle}>
                                        Thông tin người nhận
                                    </Text>

                                    <Text style={styles.sectionSubtitle}>
                                        Điểm giao hàng
                                    </Text>
                                </View>

                            </View>


                            <View style={styles.contactButtons}>

                                <TouchableOpacity style={styles.messageButton}>
                                    <Ionicons
                                        name="chatbubble-outline"
                                        size={19}
                                        color="#00193C"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.callButton}>
                                    <Ionicons
                                        name="call"
                                        size={19}
                                        color="#FFFFFF"
                                    />
                                </TouchableOpacity>

                            </View>

                        </View>


                        <View style={styles.sectionContent}>

                            <Text style={styles.personName}>
                                {props.order.recipientName}
                            </Text>

                            <Text style={styles.secondaryText}>
                                Số điện thoại:{' '}
                                <Text style={styles.boldText}>
                                    {props.order.recipientPhone}
                                </Text>
                            </Text>


                            <View style={styles.addressRow}>

                                <Ionicons
                                    name="home"
                                    size={18}
                                    color="#006591"
                                />

                                <Text style={styles.addressText}>
                                    {props.order.recipientAddress}
                                </Text>

                            </View>


                            {/* NOTE */}
                            <View style={styles.noteBox}>

                                <Ionicons
                                    name="information-circle-outline"
                                    size={18}
                                    color="#006591"
                                />

                                <Text style={styles.noteText}>
                                    <Text style={styles.noteTitle}>
                                        Ghi chú giao:{' '}
                                    </Text>
                                    {props.order.note}
                                </Text>

                            </View>


                            <TouchableOpacity style={styles.directionButton}>

                                <Ionicons
                                    name="navigate-outline"
                                    size={16}
                                    color="#00193C"
                                />

                                <Text style={styles.directionText} onPress={openMap}>
                                    Chỉ đường điểm giao
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </View>


                    {/* ================= PACKAGE ================= */}
                    <View style={styles.card}>

                        <View style={styles.sectionTitleContainer}>

                            <View style={styles.iconBox}>
                                <Ionicons
                                    name="cube-outline"
                                    size={18}
                                    color="#00193C"
                                />
                            </View>

                            <Text style={styles.sectionTitle}>
                                Thông tin kiện hàng
                            </Text>

                        </View>


                        {/* COD */}
                        <View style={styles.codBox}>

                            <View>

                                <Text style={styles.codLabel}>
                                    TIỀN THU HỘ (COD)
                                </Text>

                                <Text style={styles.codAmount}>
                                    {props.order.codAmount}
                                </Text>

                            </View>

                            <View style={styles.cashBadge}>

                                <Ionicons
                                    name="cash-outline"
                                    size={16}
                                    color="#D7E3FF"
                                />

                                <Text style={styles.cashText}>
                                    Thu tiền mặt
                                </Text>

                            </View>

                        </View>


                        {/* PACKAGE DETAILS */}
                        <View style={styles.packageGrid}>

                            <View style={styles.packageItem}>

                                <Text style={styles.packageLabel}>
                                    Tên hàng
                                </Text>

                                <Text style={styles.packageValue}>
                                    {props.order.itemDescription}
                                </Text>

                            </View>


                            <View style={styles.packageItem}>

                                <Text style={styles.packageLabel}>
                                    Khối lượng
                                </Text>

                                <Text style={styles.packageValue}>
                                    {props.order.weight}kg
                                </Text>

                            </View>

                        </View>

                    </View>


                    {/* ================= TIMELINE ================= */}
                    <View style={styles.card}>

                        <View style={styles.timelineHeader}>

                            <View style={styles.sectionTitleContainer}>

                                <View style={styles.iconBox}>
                                    <Ionicons
                                        name="git-branch-outline"
                                        size={18}
                                        color="#00193C"
                                    />
                                </View>

                                <Text style={styles.sectionTitle}>
                                    Tiến trình giao hàng
                                </Text>

                            </View>


                            <View style={styles.stepBadge}>
                                <Text style={styles.stepBadgeText}>
                                    {Math.max(1, getstep_exist + 1)} / {steps.length}
                                </Text>
                            </View>

                        </View>
                        {

                            steps.map((step, index) => { // key là pahan tử, value là vị trí
                                const complete = index <= getstep_exist // 0 <2 =>true, 1<2 => true 
                                const active = index === getstep_exist // lấy trạng thái hiện tại  trả về true false
                                // 1. Lấy dữ liệu thời gian tương ứng từ props.order theo timeKey trong JSON
                                const rawTime = props.order?.[step.timeKey]; // Ví dụ: props.order.createdAt, props.order.assignedAt
                                //console.log(rawTime);

                                const timeText = formatTime(rawTime); // Chuyển chuỗi ISO sang giờ:phút (14:30)
                                // 2. Xác định mô tả hiển thị
                                let subtitle = 'Chưa thực hiện';
                                if (complete || active) {
                                    subtitle = timeText ? `${timeText} • ${step.desc}` : step.desc; // Ghép giờ và mô tả[cite: 8]
                                }
                                return (
                                    <View key={index} style={styles.stepContainer}>
                                        {/* Đường nối */}
                                        {index !== steps.length - 1 && (
                                            <View
                                                style={[
                                                    styles.line,
                                                    complete && styles.lineComplete, // Đổi màu khi hoàn thành[cite: 8]
                                                ]}
                                            />
                                        )}

                                        {/* Vòng tròn trạng thái */}
                                        <View
                                            style={[
                                                styles.circle,
                                                complete && styles.circleComplete,
                                                active && !complete && styles.circleActive, // Nổi bật bước hiện tại[cite: 8]
                                            ]}
                                        >
                                            {complete ? (
                                                <Text style={styles.check}>✓</Text>
                                            ) : (
                                                <Text style={styles.number}>{index + 1}</Text>
                                            )}
                                        </View>

                                        {/* Nội dung: Tiêu đề & Giờ/Mô tả từ JSON */}
                                        <View style={styles.stepContent}>
                                            <Text
                                                style={[
                                                    styles.stepTitle,
                                                    active && styles.stepTitleActive,
                                                ]}
                                            >
                                                {step.title}
                                            </Text>

                                            <Text style={styles.statusText}>
                                                {subtitle}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
                {/* ================= SLIDER ================= */}
                <View style={styles.bottomAction}>

                    <View style={styles.sliderHeader}>


                        {currentAction && (
                            <Text style={styles.sliderStep}>
                                {currentAction.stepIndexText}
                            </Text>
                        )}


                        <View style={styles.swipeHint}>
                            <Ionicons
                                name="swap-horizontal-outline"
                                size={14}
                                color="#44474F"
                            />

                            <Text style={styles.swipeText}>
                                Gạt hết sang phải
                            </Text>
                            {/* <TouchableOpacity
                                style={{
                                    marginTop: 10,
                                    padding: 12,
                                    backgroundColor: '#00193C',
                                    borderRadius: 10,
                                }}
                                onPress={handleconfirmStatus}
                            >
                                <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>
                                    TEST ĐỔI TRẠNG THÁI
                                </Text>
                            </TouchableOpacity> */}
                        </View>

                    </View>


                    <View
                        style={styles.slider}
                        onLayout={(event) => {
                            const width = event.nativeEvent.layout.width;

                            console.log('Chiều rộng thanh trượt:', width);
                            setSliderWidth(width);
                        }}
                    >
                        <Animated.View
                            {...panResponder.panHandlers}
                            style={[
                                styles.sliderThumb,
                                {
                                    transform: [{ translateX: pan }],
                                },
                            ]}
                        >
                            <Ionicons
                                name="arrow-forward"
                                size={23}
                                color="#FFFFFF"
                            />
                        </Animated.View>

                        {currentAction && (
                            <Text style={styles.sliderText}>
                                {isSliding
                                    ? 'Đang cập nhật trạng thái...'
                                    : currentAction.title}
                            </Text>
                        )}
                    </View>

                </View>

            </View>
        </SafeAreaView>
    );

}
export default Order_detail






/* ================================================= */
/* STYLES */
/* ================================================= */

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FF',
    },

    container: {
        flex: 1,
        backgroundColor: '#F8F9FF',
    },

    /* HEADER */

    header: {
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#F8F9FF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFF4FF',
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: '#0B1C30',
        marginLeft: 4,
    },

    supportButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* SCROLL */

    scrollContent: {
        padding: 16,
        paddingBottom: 150,
    },

    /* CARD */

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,

        shadowColor: '#0F2E5A',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 3,
    },

    /* ORDER */

    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    orderTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    orderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0B1C30',
    },

    urgentBadge: {
        backgroundColor: '#E5EEFF',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 5,
        marginLeft: 7,
    },

    urgentText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#00193C',
    },

    trackingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 7,
        gap: 5,
    },

    label: {
        fontSize: 12,
        color: '#44474F',
    },

    trackingNumber: {
        fontSize: 13,
        fontWeight: '700',
        color: '#00193C',
        letterSpacing: 0.5,
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5EEFF',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 20,
    },

    statusDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#39B8FD',
        marginRight: 5,
    },

    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#004666',
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
    },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    smallText: {
        fontSize: 12,
        color: '#44474F',
    },

    distanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#EFF4FF',
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 15,
    },

    distanceText: {
        fontSize: 11,
        color: '#006591',
    },

    routeBox: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#EFF4FF',
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    routeLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    routeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0B1C30',
        marginLeft: 6,
    },

    startDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00193C',
    },

    endDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#39B8FD',
    },

    /* SECTION */

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#DCE9FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 9,
    },

    recipientIconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5F7FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 9,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0B1C30',
    },

    sectionSubtitle: {
        fontSize: 12,
        color: '#747780',
        marginTop: 2,
    },

    sectionContent: {
        paddingLeft: 41,
        marginTop: 12,
    },

    personName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0B1C30',
    },

    secondaryText: {
        fontSize: 12,
        color: '#44474F',
        marginTop: 4,
    },

    boldText: {
        fontWeight: '600',
        color: '#0B1C30',
    },

    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 9,
    },

    addressText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 19,
        color: '#44474F',
        marginLeft: 7,
    },

    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#00193C',
        alignItems: 'center',
        justifyContent: 'center',
    },

    contactButtons: {
        flexDirection: 'row',
        gap: 8,
    },

    messageButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DCE9FF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    directionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#E5EEFF',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 8,
        marginTop: 10,
    },

    directionText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#00193C',
        marginLeft: 5,
    },

    /* NOTE */

    noteBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EFF4FF',
        borderRadius: 9,
        padding: 10,
        marginTop: 12,
    },

    noteText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 17,
        color: '#0B1C30',
        marginLeft: 6,
    },

    noteTitle: {
        fontWeight: '700',
        color: '#006591',
    },

    /* COD */

    codBox: {
        marginTop: 14,
        backgroundColor: '#0F2E5A',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    codLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#7D97C9',
        letterSpacing: 1,
    },

    codAmount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#D7E3FF',
        marginTop: 3,
    },

    cashBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF20',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 5,
    },

    cashText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 4,
    },

    packageGrid: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10,
    },

    packageItem: {
        flex: 1,
        backgroundColor: '#EFF4FF',
        borderRadius: 8,
        padding: 10,
    },

    packageLabel: {
        fontSize: 10,
        color: '#44474F',
    },

    packageValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0B1C30',
        marginTop: 3,
    },

    /* TIMELINE */

    timelineHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },

    stepBadge: {
        backgroundColor: '#D3E4FE',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 12,
    },

    stepBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#006591',
    },

    timelineItem: {
        flexDirection: 'row',
        minHeight: 62,
        position: 'relative',
    },

    timelineLine: {
        position: 'absolute',
        left: 13,
        top: 27,
        bottom: 0,
        width: 2,
        backgroundColor: '#D3E4FE',
    },

    timelineLineCompleted: {
        backgroundColor: '#00193C',
    },

    timelineNode: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D3E4FE',
        zIndex: 2,
    },

    completedNode: {
        backgroundColor: '#00193C',
    },

    activeNode: {
        backgroundColor: '#39B8FD',
        borderWidth: 4,
        borderColor: '#C9E6FF',
    },

    inactiveNode: {
        backgroundColor: '#D3E4FE',
    },

    currentDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#004666',
    },

    timelineContent: {
        flex: 1,
        marginLeft: 12,
        paddingTop: 1,
    },

    timelineTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    timelineTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0B1C30',
    },

    activeTimelineTitle: {
        color: '#00193C',
        fontWeight: '700',
    },

    inactiveTimelineTitle: {
        color: '#747780',
    },

    timelineSubtitle: {
        fontSize: 11,
        color: '#44474F',
        marginTop: 3,
        marginBottom: 15,
    },

    inactiveTimelineSubtitle: {
        color: '#747780',
    },

    currentBadge: {
        backgroundColor: '#DCE9FF',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 6,
    },

    currentBadgeText: {
        fontSize: 9,
        fontWeight: '600',
        color: '#00193C',
    },

    /* BOTTOM SLIDER */

    bottomAction: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F8F9FFF5',
        paddingHorizontal: 16,
        paddingTop: 9,
        paddingBottom: 12,

        shadowColor: '#0F2E5A',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,

        elevation: 10,
    },

    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 7,
    },

    sliderStep: {
        flex: 1,
        fontSize: 10,
        fontWeight: '700',
        color: '#006591',
    },

    swipeHint: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    swipeText: {
        fontSize: 10,
        color: '#44474F',
        marginLeft: 2,
    },

    slider: {
        height: 56,
        borderRadius: 28,
        backgroundColor: '#DCE9FF',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },

    sliderText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#00193C',
    },

    sliderThumb: {
        position: 'absolute',
        left: 4,
        top: 4,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#00193C',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        elevation: 4,
    },
    /* ================= STEP TIMELINE CSS ================= */
    stepContainer: {
        flexDirection: 'row',
        position: 'relative',
        minHeight: 64,
    },

    line: {
        position: 'absolute',
        top: 26,
        left: 13,
        width: 2,
        bottom: -2,
        backgroundColor: '#DCE9FF',
        zIndex: 1,
    },

    lineComplete: {
        backgroundColor: '#006591',
    },

    circle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EFF4FF',
        borderWidth: 2,
        borderColor: '#B4C8E5',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },

    circleComplete: {
        backgroundColor: '#006591',
        borderColor: '#006591',
    },

    circleActive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#006591',
        borderWidth: 2.5,
    },

    check: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    number: {
        fontSize: 12,
        fontWeight: '600',
        color: '#747780',
    },

    stepContent: {
        flex: 1,
        marginLeft: 12,
        paddingTop: 3,
        paddingBottom: 20,
    },

    stepTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#44474F',
    },

    stepTitleActive: {
        color: '#006591',
        fontWeight: '700',
    },

    statusText: {
        fontSize: 11,
        color: '#747780',
        marginTop: 3,
    },
});