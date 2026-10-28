
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
//import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import Order_detail from './Order_detail';


const OrderCard = (props) => { // order là cái nhận từ cha xuống, còn submit là cái khi bấm nút thì ở cha nhận
  //const router = useRouter(); 

  const [showDetail, setShowDetail] = useState(false);// us heienj thị deital

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Đang chờ nhận';

      case 'ASSIGNED':
        return 'Đã nhận đơn';

      case 'PICKING_UP':
        return 'Đang lấy hàng';

      case 'DELIVERING':
        return 'Đang giao';

      case 'DELIVERED':
        return 'Đã giao';

      default:
        return status;
    }
  };

  // hàm để gọi và truyền order xuống cho detail
  const detail_order = () => {
    setShowDetail(!showDetail); // hiện detail
  };

  if (showDetail) {
    return (
      <Order_detail
        detail_order={detail_order}
        order={props.order}
        getStatusText={getStatusText}
        changefinish={props.changefinish}
        getorderfinish={props.getorderfinish}
        getorderworking={props.getorderworking}
      />
    );
  }

  const statusColors = {
    PENDING: {
      background: '#FFF7ED',
      text: '#C2410C',
      dot: '#F59E0B',
    },
    ASSIGNED: {
      background: '#EFF6FF',
      text: '#1D4ED8',
      dot: '#3B82F6',
    },
    PICKING_UP: {
      background: '#F5F3FF',
      text: '#6D28D9',
      dot: '#8B5CF6',
    },
    DELIVERING: {
      background: '#ECFEFF',
      text: '#0E7490',
      dot: '#06B6D4',
    },
    DELIVERED: {
      background: '#F0FDF4',
      text: '#15803D',
      dot: '#22C55E',
    },
  };

  const currentStatus = statusColors[props.order.status] || {
    background: '#F1F5F9',
    text: '#475569',
    dot: '#94A3B8',
  };

  const isPending = props.order.status === 'PENDING';

  const payment =
    props.order.payment != null
      ? Number(props.order.payment).toLocaleString('vi-VN') + ' ₫'
      : 'Chưa xác định';

  return (
    <View style={styles.orderCard}>

      {/* Header: Mã vận đơn và trạng thái */}
      <View style={styles.cardHeader}>
        <View style={styles.orderHeaderInfo}>
          <Text style={styles.orderId}>
            #{props.order.orderId}
          </Text>

          <View style={styles.trackingContainer}>
            <Ionicons
              name="barcode-outline"
              size={14}
              color="#64748B"
            />
            <Text style={styles.tracking} numberOfLines={1}>
              {props.order.trackingNumber}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.status,
            { backgroundColor: currentStatus.background },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: currentStatus.dot },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: currentStatus.text },
            ]}
          >
            {getStatusText(props.order.status)}
          </Text>
        </View>
      </View>

      {/* Thông tin hàng hóa */}
      <View style={styles.productSection}>
        {props.order.imageUrl ? (
          <Image
            source={{ uri: props.order.imageUrl }}
            style={styles.orderImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons
              name="cube-outline"
              size={30}
              color="#94A3B8"
            />
          </View>
        )}

        <View style={styles.productInfo}>
          <Text style={styles.sectionLabel}>
            HÀNG HÓA
          </Text>

          <Text style={styles.productName} numberOfLines={2}>
            {props.order.itemDescription || 'Chưa có mô tả hàng hóa'}
          </Text>

          <View style={styles.productTag}>
            <Ionicons
              name="cube-outline"
              size={13}
              color="#0369A1"
            />
            <Text style={styles.productTagText}>
              Chi tiết kiện hàng
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* địa chỉ người gửi */}
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons
            name="business-outline"
            size={18}
            color="#0369A1"
          />
        </View>

        <View style={styles.infoText}>
          <Text style={styles.infoLabel}>
            ĐỊA CHỈ LẤY HÀNG
          </Text>
          <Text style={styles.infoTitle}>
            {props.order.senderAddress || 'Chưa có địa chỉ người gửi'}
          </Text>
        </View>
      </View>

      {/* địa chỉ người nhận */}
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons
            name="location-outline"
            size={18}
            color="#0369A1"
          />
        </View>

        <View style={styles.infoText}>
          <Text style={styles.infoLabel}>
            ĐỊA CHỈ GIAO HÀNG
          </Text>
          <Text style={styles.infoTitle}>
            {props.order.recipientAddress || 'Chưa có địa chỉ người nhận'}
          </Text>
        </View>
      </View>

      {/* Số điện thoại người nhận */}
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons
            name="call-outline"
            size={18}
            color="#0369A1"
          />
        </View>

        <View style={styles.infoText}>
          <Text style={styles.infoLabel}>
            SỐ ĐIỆN THOẠI NGƯỜI NHẬN
          </Text>
          <Text style={styles.infoTitle}>
            {props.order.recipientPhone || 'Chưa có số điện thoại'}
          </Text>
        </View>
      </View>

      {/* Chi phí vận chuyển */}
      <View style={styles.codBox}>
        <View style={styles.costInfo}>
          <View style={styles.costIcon}>
            <Ionicons
              name="wallet-outline"
              size={19}
              color="#15803D"
            />
          </View>

          <View style={styles.costTextContainer}>
            <Text style={styles.codLabel}>
              Chi phí vận chuyển
            </Text>
            <Text style={styles.costDescription}>
              Phí giao hàng của đơn
            </Text>
          </View>
        </View>

        <Text style={styles.codValue}>
          {payment}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.acceptButton,
          !isPending && styles.detailButton,
        ]}
        //onPress={() => submit(order)} // ?. có nghĩa là nếu nút onpress có tồn tại thì gọi không thì thôi
        onPress={() => {
          if (props.order.status === 'PENDING') {
            props.submit(props.order);
          }
          else {
            detail_order();

          }
        }}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isPending ? 'checkmark-circle-outline' : 'eye-outline'}
          size={19}
          color="#FFFFFF"
        />

        <Text style={styles.acceptText}>
          {props.order.status === 'PENDING'
            ? 'Nhận đơn'
            : 'Xem chi tiết'}
        </Text>

        <Ionicons
          name="arrow-forward"
          size={18}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
};


export default OrderCard;


const styles = StyleSheet.create({

  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 2,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E8EEF5',

    shadowColor: '#0F2942',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  orderHeaderInfo: {
    flex: 1,
  },

  orderId: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F2942',
  },

  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },

  tracking: {
    fontSize: 11,
    color: '#64748B',
    flexShrink: 1,
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    flexShrink: 0,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  productSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 3,
  },

  orderImage: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },

  imagePlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.7,
    marginBottom: 5,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F2942',
    lineHeight: 21,
  },

  productTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 7,
    gap: 4,
  },

  productTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0369A1',
  },

  divider: {
    height: 1,
    backgroundColor: '#E8EEF5',
    marginVertical: 13,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 13,
  },

  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoText: {
    flex: 1,
    marginLeft: 10,
    paddingTop: 2,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
    color: '#334155',
  },

  infoLabel: {
    marginBottom: 4,
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },

  codBox: {
    marginTop: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  costInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  costIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  costTextContainer: {
    flex: 1,
  },

  codLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },

  costDescription: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 3,
  },

  codValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#15803D',
    flexShrink: 0,
  },

  acceptButton: {
    minHeight: 46,
    marginTop: 12,
    paddingHorizontal: 14,
    borderRadius: 11,
    backgroundColor: '#075985',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  detailButton: {
    backgroundColor: '#0F2942',
  },

  acceptText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 2,
  },

  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },

  noImageText: {
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
});