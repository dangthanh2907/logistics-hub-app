//rnfe
import { View, Text } from 'react-native'
import React from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // cái này dùng để lưu trữ token và role

// tạo 1 axious client riêng cho app 
const axiosClient = axios.create({
  baseURL: "http://10.0.2.2:8080/api",
  headers: {
    'Content-Type': 'application/json', // báo cho springboot rằng dữ liệu gửi lên là json
  },
});

axiosClient.interceptors.request.use(async (config) => {  // .interceptors.request dùng để can thiệp vào request trưcos khi gửi đi , 
  // use() dùng để đăng ký 1 hàm sẽ chạy trước request
  // config là 1 cấu hình của request hiện tại và interceptors nhận cònig này để rồi sửa trước khi nó gửi đi
  const token = await AsyncStorage.getItem("userToken"); // lấy token đã cất ra
  if (token) { //nếu có thì thêm vào còn nếu không thì không cần , ví dụ như api/auth thì khôg cần nên không có cũng đc
    config.headers.Authorization = `Bearer ${token}`;
  }
  //console.log('REQUEST HEADERS:', config.headers);
  // console.log("REQUEST URL:", config.url);
  // console.log("AUTH HEADER:", config.headers?.Authorization);
  return config;
})


export default axiosClient