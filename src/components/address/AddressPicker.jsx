


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';

export default function AddressPicker(props) {
  const [isExpanded, setIsExpanded] = useState(false); // mở khi bấm vào tỉnh 
  const [province, setProvince] = useState([]); // chứa danh sách tỉnh
  const [seledtedpropvince, setSeledtedpropvince] = useState(null); // chứa tỉnh 
  const [step, setStep] = useState("province"); // các bước để chọn tỉnh và xã
  const [ward, setWard] = useState([]);// chứa danh sách phường , xã
  const [selectedward, setSelectedward] = useState(null);
  const [detailAddress, setDetailAddress] = useState('');
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

  const sendAddress = (address) => {
    if (props.getsenderaddRess) {
      props.getsenderaddRess(address);
    }

    if (props.recipientAddress) {
      props.recipientAddress(address);
    }
  };

  useEffect(() => {
    if (!props.initialAddress || province.length === 0) return;
    const matchedProvince = province.find(
      item => item.name === props.initialAddress.province.trim()
    );
    const matchedWard = ward.find(
      item => item.name === props.initialAddress.ward.trim()
    );
    setDetailAddress(props.initialAddress.addressDetail || '');
    if (matchedProvince) {
      setSeledtedpropvince(matchedProvince);
    }

    if(matchedWard){
      setSelectedward(matchedWard)
    }

  }, [props.initialAddress, province,ward]); // lắng nghe biến có thayd dổi không có thì chạy 
  
  return (
    <View style={styles.container}>



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




      <View style={styles.detailAddressContainer}>
        <Text style={styles.detailAddressLabel}>
          Địa chỉ chi tiết
        </Text>

        <TextInput
          style={styles.detailAddressInput}
          value={detailAddress}
          placeholder="Nhập số nhà, tên đường, khu công nghiệp..."
          placeholderTextColor="#9299A6"
          multiline
          textAlignVertical="top"
          onChangeText={(text) => {
            setDetailAddress(text);
            sendAddress({
              province: seledtedpropvince?.name || '',
              ward: selectedward?.name || '',
              addressDetail: text,
            });
          }}

        />
      </View>


      {
        isExpanded && (
          <View style={styles.dropdown}>
            <ScrollView nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled">
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
                      sendAddress({ province: province.name, ward: null })
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
                      sendAddress({ province: seledtedpropvince.name, ward: ward.name })
                    }}
                  >
                    <Text>
                      {ward.name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>


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
    fontWeight: '700',
    marginBottom: 10,
    color: '#334155',
  },

  selectBox: {
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 10, // Khoảng cách giữa ô tỉnh và ô xã
    borderWidth: 1,
    borderColor: '#D9E4F2',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
  },

  dropdown: {
    position: 'absolute',
    top: 124,
    left: 0,
    right: 0,
    maxHeight: 240,

    borderWidth: 1,
    borderColor: '#D9E4F2',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',

    zIndex: 999,
    elevation: 12,
    overflow: 'hidden',
  },

  item: {
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
    backgroundColor: '#FFFFFF',
  },

  itemText: {
    fontSize: 14,
    color: '#334155',
  },

  detailAddressContainer: {
    marginTop: 4,
    marginBottom: 12,
  },

  detailAddressLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    color: '#334155',
  },

  detailAddressInput: {
    minHeight: 90,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D9E4F2',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#334155',
  },
});
