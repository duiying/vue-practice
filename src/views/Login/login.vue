<template>
    <div id="login">
        <div class="login-wrap">
            <ul class="menu-tab">
                <li v-for="item in menuTab" :key="item.id" :class="{ 'current': item.current }" @click="toggleMenu(item)">{{ item.text }}</li>
            </ul>

            <!-- 表单 start -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" label-width="100px" class="login-form" size="mini">
                <el-form-item prop="username" class="item-from">
                    <label>邮箱</label>
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item prop="password" class="item-from">
                    <label>密码</label>
                    <!-- minlength、maxlength用来控制输入长度 -->
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <!-- 重复密码 v-show v-if 使用 -->
                <!-- <el-form-item prop="passwords" class="item-from" v-show="model === 'register'"> -->
                <el-form-item prop="passwords" class="item-from" v-if="model === 'register'">
                    <label>确认密码</label>
                    <!-- minlength、maxlength用来控制输入长度 -->
                    <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item prop="code" class="item-from">
                    <label>验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
                        </el-col>
                        <el-col :span="12">
                            <el-button type="success" class="block" size="mini" @click="getSms()" :disabled="codeButtonStatus.status">{{ codeButtonStatus.text }}</el-button>
                        </el-col>
                    </el-row>
                
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block" :disabled="loginButtonStatus">{{ model === 'login' ? '登录' : '注册' }}</el-button>
                </el-form-item>
            </el-form>
            <!-- 表单 end -->
        </div>
    </div>
</template>

<script>
import { sendSms, Register, Login } from '@/api/login'
import { reactive, ref, isRef, toRefs, onMounted } from '@vue/composition-api'
// 引入外部方法，引入同一个文件中的多个方法之间用逗号隔开
import { stripscript, checkEmail, checkPassword, checkCode } from '@/utils/validate'
  
export default {
    name: 'login',
    setup(props, {refs, root}){
        // 这里面放置data数据、生命周期、自定义的函数

        // 校验邮箱
        let validateEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名！'));
            } else if (!checkEmail(value)) {
                callback(new Error('用户名格式错误！'));
            } else {
                // 验证通过
                callback(); 
            }
        };

        // 校验密码
        let validatePassword = (rule, value, callback) => {
            // 过滤后的数据
            ruleForm.password = stripscript(value);
            value = ruleForm.password;

            if (value === '') {
                callback(new Error('请输入密码！'));
            } else if (!checkPassword(value)) {
                callback(new Error('密码为6到20位数字和字母组合！'));
            } else {
                callback();
            }
        };

        // 校验重复
        let validatePasswords = (rule, value, callback) => {
            if (model.value === 'login') {callback(); }

            // 过滤后的数据
            ruleForm.passwords = stripscript(value);
            value = ruleForm.passwords;

            if (value === '') {
                callback(new Error('请输入重复密码！'));
            } else if (value != ruleForm.password) {
                callback(new Error('重复密码不正确！'));
            } else {
                callback();
            }
        };

        // 校验验证码
        let validateCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入验证码！'));
            } else if (!checkCode(value)) {
                callback(new Error('验证码为6位！'));
            } else {
                callback();
            }    
        };

        /**
         * 声明数据
         */
        // 引用数据类型用reactive、基础数据类型用ref
        const menuTab = reactive([
            {text: '登录', current: true, type: 'login'},
            {text: '注册', current: false, type: 'register'}
        ])
        console.log(menuTab)

        const timer = ref(null)

        // 模块值
        const model = ref('login')
        console.log(model.value)
        console.log(isRef(model) ? true : false)

        // 按钮禁用状态
        const loginButtonStatus = ref(true)

        const codeButtonStatus = reactive({
            status : false,
            text : '发送验证码'
        })

        // toRefs之后，需要用.value来取值
        const obj = reactive({
            x: 0,
            y: 1
        })
        const objToRefs = toRefs(obj)
        console.log(objToRefs.x.value)

        // 表单绑定数据
        const ruleForm = reactive({
            username: '',
            password: '',
            passwords: '',
            code: ''
        })
        // 表单验证规则
        const rules = reactive({
            username: [
                { validator: validateEmail, trigger: 'blur' }
            ],
            password: [
                { validator: validatePassword, trigger: 'blur' }
            ],
            passwords: [
                { validator: validatePasswords, trigger: 'blur' }
            ],
            code: [
                { validator: validateCode, trigger: 'blur' }
            ],
        })

        /**
         * 声明函数
         */
        const toggleMenu = (item => {
            // ES6写法
            menuTab.forEach(elem => {
                elem.current = false;
            });
            item.current = true;

            // 改变model
            model.value = item.type;

            // 重置表单
            // this.$refs[formName].resetFields(); // 2.0
            refs.loginForm.resetFields(); // 3.0
        })

        const getSms = (() => {
            if (!ruleForm.username) {
                // root 在 3.0 中相当于 this
                root.$message.error('邮箱不能为空！')
                return false
            }
            if (!checkEmail(ruleForm.username)) {
                root.$message.error('邮箱格式错误！')
                return false
            }

            codeButtonStatus.status = true
            codeButtonStatus.text = '发送中'

            loginButtonStatus.value = false
            // 倒计时
            countDown(60)

            setTimeout(() => {
                sendSms({username : ruleForm.username, module : model.value}).then(response => {
                let data = response.data
                root.$message({
                    message : data.message,
                    type : 'success'
                })
            }).catch(error => {
                console.log(error)
            })
            }, 3000)
        })

        /**
         * 提交表单
         */
        const submitForm = (formName => {
            refs[formName].validate((valid) => {
                if (valid) {
                    if (model.value === 'login') {
                        login()
                    } else {
                        register()
                    }
                    
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        })

        const login = (() => {
            let data = {
                username : ruleForm.username,
                password : ruleForm.password,
                code : ruleForm.code,
            }
            Login(data).then(response => {
                let data = response.data
                root.$message({
                    message : data.message,
                    type : 'success'
                })
                console.log(response)
            }).catch(error => {

            })
        })

        const register = (() => {
            let data = {
                username : ruleForm.username,
                password : ruleForm.password,
                code : ruleForm.code,
                module : 'register'
            }
            Register(data).then(response => {
                let data = response.data
                root.$message({
                    message : data.message,
                    type : 'success'
                })
                toggleMenu(menuTab[0])
                clearCountDown()
            }).catch(error => {

            })
        })

        const countDown = ((number) => {
            if (timer.value) {clearInterval(timer.value)}
            
            let time = number

            timer.value = setInterval(() => {
                time--
                if (time === 0) {
                    clearInterval(timer.value)
                    codeButtonStatus.status = false
                    codeButtonStatus.text = '再次获取 '
                } else {
                    codeButtonStatus.text = `倒计时${time}秒`  
                }
            }, 1000)
        })

        const clearCountDown = (() => {
            codeButtonStatus.status = false
            codeButtonStatus.text = '获取验证码'
             clearInterval(timer.value)
        })

        /**
         * 生命周期
         */
        // 挂载完成后
        onMounted(() => {
            console.log(process.env.VUE_APP_ABC)
        })

        return {
            menuTab,
            model,
            loginButtonStatus,
            codeButtonStatus,
            ruleForm,
            rules,
            toggleMenu,
            getSms,
            submitForm
        }
    },
}
</script>

<style lang="scss" scoped>
    #login {
        height: 100vh;
        background-color: #344a5f;
    }
    .login-wrap {
        width: 330px;
        margin: auto;
    }
    .menu-tab {
        margin-left: 100px;
        text-align: center;
        li {
            display: inline-block;
            width: 88px;
            line-height: 36px;
            font-size: 14px;
            color: #fff;
            border-radius: 2px;
            cursor: pointer;
        }
        .current {
            background-color: rgba(0, 0, 0, .1);
        }
    }
    .login-form {
        margin-top: 29px;
        label {
            display: block;
            margin-bottom: 3px;
            font-size: 14px;
            color: #fff;
        }
    }
    .item-from {
        margin-bottom: 13px;
    }
    .block {
        display: block;
        width: 100%;
    }
    .login-btn {
        margin-top: 19px;
    }
</style>