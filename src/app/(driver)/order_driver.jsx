import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OrderCard from '../../components/Order_card';
import { List } from '@expo/ui';
import axiosClient from '../../api/axiosClient';
const OrderDriver = () => {

  const [mainTab, setMainTab] = useState('available'); // us set 2 tab trong đơn hàng

  const [orders, setOrders] = useState([]) // chưa order có sẵn

  const [myOrderTab, setMyOrderTab] = useState('working');   // Tab trạng thái bên trong "Đơn của tôi"

  const [orderworking, setOrderworking] = useState([]); // us chứa order theo driver

  // hamf lấy các đơn hàng có sẵn cho tài xế
  const getorderavailable = async () => {
    try {
      const response = await axiosClient.get('/orders/available'); //gọi hàm get để lấy dữ liệu
      setOrders(response.data);
    }
    catch (error) {
      const errorMsg = error.response?.data?.message || 'Vui lòng kiểm tra lại!';
      Alert.alert('Lỗi tải dữ liệu', errorMsg);
    }
  }
  //hàm gọi api đơn hàng theo tài xế 
  const getorderworking = async () => {
    try {
      const respone = await axiosClient.get('/orders/driver')
      setOrderworking(respone.data);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Vui lòng kiểm tra lại!';
      Alert.alert('Lỗi tải dữ liệu', errorMsg);
    }
  }



  // hàm này sẽ lấy dữ liệu khi trang này render
  useEffect(() => {

    getorderavailable();
    getorderworking();
  }, [])


  // hàm này sẽ lấy orderid và rồi gửi về backend
  const handleReceiveOrder = async (order) => {
    try {
      await axiosClient.put(`/orders/${order.orderId}/assign`);
      Alert.alert('Thành công', `Bạn đã nhận đơn hàng #${order.orderId}!`);

      getorderavailable(); // gọi lại hàm lấy order để đồng bộ danh sách mới nhất

      getorderworking();// gọi lại hàm ddeer l;ấy order đồng bộ danh sách

      setMainTab("mine"); // chuyển qua đơn hàng của tôi

      setMyOrderTab("working") // mục đang làm việc 

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Vui lòng kiểm tra lại!';
      Alert.alert('Đã có lỗi xảy ra', errorMsg);
    }
  }
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Đơn hàng</Text>

          <Text style={styles.subtitle}>
            Quản lý và nhận các đơn hàng mới
          </Text>
        </View>

        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons
            name="refresh-outline"
            size={22}
            color="#075985"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#64748B"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm đơn hàng..."
            placeholderTextColor="#94A3B8"
          />
        </View>


        {/* ========================= */}
        {/* TAB CHÍNH                  */}
        {/* ========================= */}

        <View style={styles.mainTabContainer}>
          {/* Tất cả đơn có sẵn */}
          <TouchableOpacity
            style={[
              styles.mainTab,
              mainTab === 'available' && styles.mainTabActive,
            ]}
            onPress={() => setMainTab('available')}
          >
            <Ionicons
              name="cube-outline"
              size={18}
              color={
                mainTab === 'available'
                  ? '#FFFFFF'
                  : '#64748B'
              }
            />
            <Text
              style={[
                styles.mainTabText,
                mainTab === 'available' &&
                styles.mainTabTextActive,
              ]}
            >
              Tất cả đơn
            </Text>
          </TouchableOpacity>


          {/* Đơn của tôi */}
          <TouchableOpacity
            style={[
              styles.mainTab,
              mainTab === 'mine' && styles.mainTabActive,
            ]}
            onPress={() => setMainTab('mine')}
          >
            <Ionicons
              name="person-outline"
              size={18}
              color={
                mainTab === 'mine'
                  ? '#FFFFFF'
                  : '#64748B'
              }
            />

            <Text
              style={[
                styles.mainTabText,
                mainTab === 'mine' &&
                styles.mainTabTextActive,
              ]}
            >
              Đơn của tôi
            </Text>
          </TouchableOpacity>

        </View>


        {mainTab === 'mine' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}

          >

            {/* Tất cả */}
            <TouchableOpacity
              style={[
                styles.filter,
                myOrderTab === 'working' &&
                styles.filterActive,
              ]}
              onPress={() => setMyOrderTab('working')}
            >
              <Text
                style={
                  myOrderTab === 'working'
                    ? styles.filterActiveText
                    : styles.filterText
                }
              >
                Đang làm việc 
              </Text>
            </TouchableOpacity>


            {/* Đã huỷ */}
            <TouchableOpacity
              style={[
                styles.filter,
                myOrderTab === 'cancle' &&
                styles.filterActive,
              ]}
              onPress={() => setMyOrderTab('cancle')}
            >
              <Text
                style={
                  myOrderTab === 'cancle'
                    ? styles.filterActiveText
                    : styles.filterText
                }
              >
                Đã huỷ
              </Text>
            </TouchableOpacity>

            {/* Đã hoàn thành */}
            <TouchableOpacity
              style={[
                styles.filter,
                myOrderTab === 'finish' &&
                styles.filterActive,
              ]}
              onPress={() => setMyOrderTab('finish')}
            >
              <Text
                style={
                  myOrderTab === 'finish'
                    ? styles.filterActiveText
                    : styles.filterText
                }
              >
                Đã hoàn thành
              </Text>
            </TouchableOpacity>


          </ScrollView>
        )}

        {
          mainTab === 'available' && (
            <View >
              {
                orders.length === 0 ? (
                  <Text style={styles.emptyText}>Không có đơn hàng nào có sẵn</Text>
                ) : (
                  orders.map((order) => (
                    <OrderCard
                      key={order.orderId}
                      order={order}
                      submit={handleReceiveOrder}
                    />
                  ))
                )
              }
            </View>
          )
        }

        {
          myOrderTab === 'working' && (
            <View>
              {
                orderworking.length === 0 ? (
                  <Text style={styles.emptyText}>Bạn không có đơn hàng nào </Text>
                ) : (
                  orderworking.map((order) => (
                    <OrderCard
                      key={order.orderId}
                      order={order}
                    />
                  ))
                )

              }
            </View>
          )
        }




      </ScrollView>

    </View>
  );
};


export default OrderDriver;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingTop: 20,

  },


  /* ========================= */
  /* HEADER                     */
  /* ========================= */

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
  },

  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },


  /* ========================= */
  /* CONTENT                    */
  /* ========================= */

  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },


  /* ========================= */
  /* SEARCH                     */
  /* ========================= */

  searchBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#0F172A',
  },


  /* ========================= */
  /* MAIN TAB                   */
  /* ========================= */

  mainTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginTop: 14,
    marginBottom: 4,
  },

  mainTab: {
    flex: 1,
    height: 44,
    borderRadius: 11,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },

  mainTabActive: {
    backgroundColor: '#075985',
  },

  mainTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },

  mainTabTextActive: {
    color: '#FFFFFF',
  },


  /* ========================= */
  /* SUB FILTER                 */
  /* ========================= */

  filterScroll: {
    marginTop: 14,
    marginBottom: 15,
  },

  filter: {
    height: 36,
    paddingHorizontal: 15,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  filterActive: {
    backgroundColor: '#075985',
    borderColor: '#075985',
  },

  filterText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  filterActiveText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },


  /* ========================= */
  /* ORDER CARD                 */
  /* ========================= */
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 40,
  },

});