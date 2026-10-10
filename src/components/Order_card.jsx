import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
//import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';
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
  }

  if (showDetail) {
    return <Order_detail
      detail_order={detail_order}
      order={props.order}
      getStatusText={getStatusText}
      changefinish={props.changefinish}
      getorderfinish={props.getorderfinish}
      getorderworking={props.getorderworking}
       />
  }
  return (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>#{props.order.orderId}
          </Text>
          <Text style={styles.tracking}>
            {props.order.trackingNumber}</Text>
        </View>
        <View style={styles.status}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{getStatusText(props.order.status)}</Text>
        </View>
      </View>
      <View style={styles.productSection}>
        <View style={styles.productIcon}>
          <Ionicons
            name="cube-outline"
            size={25}
            color="#075985"
          />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{props.order.itemDescription}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons
            name="person-outline"
            size={19}
            color="#64748B"
          />
        </View>
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>{props.order.recipientName}</Text>
          <Text style={styles.infoLabel}>Người nhận</Text>
        </View>
        <Ionicons
          name="call-outline"
          size={20}
          color="#075985"
        />
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons
            name="location-outline"
            size={19}
            color="#64748B"
          />
        </View>
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>{props.order.recipientAddress}
          </Text>
          <Text style={styles.infoLabel}>Địa chỉ giao hàng</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons
            name="call-outline"
            size={19}
            color="#64748B"
          />
        </View>
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>
            {props.order.recipientPhone}
          </Text>
          <Text style={styles.infoLabel}>
            Số điện thoại
          </Text>
        </View>
      </View>
      <View style={styles.codBox}>
        <Text style={styles.codLabel}>
          Tiền thu hộ (COD)
        </Text>
        <Text style={styles.codValue}>
          {Number(props.order.codAmount || 0).toLocaleString('vi-VN')} ₫
        </Text>
      </View>

      <TouchableOpacity
        style={styles.acceptButton}
        //onPress={() => submit(order)} // ?. có nghĩa là nếu nút onpress có tồn tại thì gọi không thì thôi
        onPress={() => {
          if (props.order.status === 'PENDING') {
            props.submit(props.order);
          }
          else {
            detail_order();

          }
        }}
      >
        <Text style={styles.acceptText}>
          {props.order.status === 'PENDING'
            ? 'Nhận đơn'
            : 'Xem chi tiết'}
        </Text>
        <Ionicons
          name="arrow-forward"
          size={19}
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
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.06,
    shadowRadius: 5,

    elevation: 2,
  },


  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },


  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },


  tracking: {
    marginTop: 3,
    fontSize: 12,
    color: '#94A3B8',
  },


  status: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },


  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    marginRight: 5,
  },


  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#C2410C',
  },


  productSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },


  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },


  productInfo: {
    flex: 1,
    marginLeft: 12,
  },


  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },


  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 15,
  },


  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },


  infoIcon: {
    width: 30,
    alignItems: 'center',
  },


  infoText: {
    flex: 1,
    marginLeft: 7,
  },


  infoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },


  infoLabel: {
    marginTop: 2,
    fontSize: 11,
    color: '#94A3B8',
  },


  codBox: {
    marginTop: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },


  codLabel: {
    fontSize: 13,
    color: '#64748B',
  },


  codValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15803D',
  },


  acceptButton: {
    height: 46,
    marginTop: 13,
    borderRadius: 12,
    backgroundColor: '#075985',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },


  acceptText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },

});