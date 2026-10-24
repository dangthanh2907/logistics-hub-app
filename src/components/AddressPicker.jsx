


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function AddressPicker(props) {
  const [isExpanded, setIsExpanded] = useState(false); // mở khi bấm vào tỉnh 
  const [province, setProvince] = useState([]); // chứa danh sách tỉnh
  const [seledtedpropvince, setSeledtedpropvince] = useState(null); // chứa tỉnh 
  const [step, setStep] = useState("province"); // các bước để chọn tỉnh và xã
  const [ward, setWard] = useState([]);// chứa danh sách phường , xã
  const [selectedward, setSelectedward] = useState(null);

  //lấy tất cả cá tỉnh
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/v2/p/') // gọi api đến công thông tin hành chính công việt nam
      .then((res) => res.json()) // then() thực hiện 2 công việc khi mà fetch hoàn thành thành công  , .json chuyển thành dạng json
      .then((data) => setProvince(data)) // để vào state
      .catch((error) => {
        console.log('Lỗi tải tỉnh/thành phố:', error);
      });

  }, []);// có [] chỉ gọi lần đầu khi component render


  //lấy phường xã
  useEffect(() => {
    if (!seledtedpropvince) {
      return;
    }

    fetch(`https://provinces.open-api.vn/api/v2/w/?province=${seledtedpropvince.code}`)// gọi api lấy các xã theo mã code 
      .then((res) => res.json())
      .then((data) => setWard(data))
      .catch((error) => {
        console.log('Lỗi tải phường xã:', error);
      });
  }, [seledtedpropvince]) // lắng gnhe seledtedpropvince thay đổi thì chạy useEffect
  //console.log('Danh sách xâ:', ward);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Địa chỉ bốc hàng *
      </Text>


      {/* trường chọn tỉnh */}
      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => {
          setIsExpanded(!isExpanded) // nếu người dùng chọn thì mở dropdown
          setStep("province") // hiện province
        }}
      >
        <Text style={styles.selectText}>
          {/* nếu chưa chọn thì hiện Chọn tỉnh/thành phố... còn nếu chọn thì hiện nên đã chọn */}
          {seledtedpropvince ? seledtedpropvince.name : "Chọn tỉnh/thành phố..."}
        </Text>

        <Text>⌄</Text>
      </TouchableOpacity>

      {/* phường xã */}
      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => {
          if (!seledtedpropvince) {
            console.log('Vui lòng chọn tỉnh trước');
            return;
          }
          setIsExpanded(!isExpanded)
          setStep("ward")

        }}
      >
        <Text style={styles.selectText}>
          {/* nếu chưa chọn thì hiện Chọn tỉnh/thành phố... còn nếu chọn thì hiện nên đã chọn */}
          {selectedward ? selectedward.name : "Chọn phường/xã..."}
        </Text>

        <Text>⌄</Text>
      </TouchableOpacity>


      {
        isExpanded && (
          <View style={styles.dropdown}>
            {step === "province" ? (
              province.map((province, index) => (
                <TouchableOpacity
                  style={styles.item}
                  key={province.code} // gán mã code tỉnh cho từng nút 
                  onPress={() => {
                    //console.log(province.name);
                    //console.log(province.code);
                    setSeledtedpropvince(province) // gán province vào state
                    //setIsExpanded(!isExpanded) // đóng danh sách lại
                    setStep('ward');// chuyển qua xã phường đẻ hiện list của xã phường
                    setIsExpanded(true); // vẫn mở dropdown của xã phường
                    props.onProvinceSelected?.(); //đưa về đúng vị trí 
                    setSelectedward(null); // xã đc chọn trống
                    setWard([]) // danh sách xã trống 
                  }}
                >
                  <Text style={styles.itemText} >
                    {/* gán tên các tỉnh cho nút  */}
                    {province.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              ward.map((ward, index) => (
                <TouchableOpacity
                  style={styles.item}
                  key={ward.code}
                  onPress={() => {
                    setSelectedward(ward) // gán xã được chọn vào state 
                    setIsExpanded(false); // đóng dropdown
                    props.onProvinceSelected?.();
                  }}
                >
                  <Text>
                    {ward.name}
                  </Text>
                </TouchableOpacity>
              ))
            )
            }
          </View>
        )
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: '#44474F',
  },

  selectBox: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E6F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectText: {
    color: '#9299A6',
    fontSize: 14,
  },

  dropdown: {
    marginTop: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E6F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },

  placeholder: {
    fontSize: 13,
    color: '#747780',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  itemText: {
    fontSize: 14,
    color: '#333333',
  },
});
