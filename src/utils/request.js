import axios from 'axios'

// 创建axios，赋值给变量service
const service = axios.create();

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 测试axios
axios.request({
    method: 'get',
    url: '/user/12345',
    data: {
        firstName: 'Fred',
        lastName: 'Flintstone'
    }
})
.then(function (response) {
    console.log(response);
})
.catch(function (error) {
    console.log(error);
});  

// export default，其它文件引入的时候不带花括号：import service from '@/utils/request'，而且 export default 在一个文件中只能存在一个 
// 如果没有 default，其它文件引入的时候带花括号：import { stripscript, checkEmail, checkPassword, checkCode } from '@/utils/validate'
export default service;