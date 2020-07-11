<template>
    <div id="login">
        <div class="login-wrap">
            <ul class="menu-tab">
                <li v-for="item in menuTab" :key="item.id" :class="{ 'current': item.current }" @click="toggleMenu(item)">{{ item.text }}</li>
            </ul>

            <!-- 表单 start -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="login-form" size="mini">
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
                            <el-input v-model.number="ruleForm.code" minlength="6" maxlength="6"></el-input>
                        </el-col>
                        <el-col :span="12">
                            <el-button type="success" class="block" size="mini">获取验证码</el-button>
                        </el-col>
                    </el-row>
                
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
                </el-form-item>
            </el-form>
            <!-- 表单 end -->
        </div>
    </div>
</template>

<script>
// 引入外部方法，引入 同一个文件中的多个方法之间用逗号隔开
import { stripscript, checkEmail, checkPassword, checkCode } from '@/utils/validate';
  
export default {
    name: 'login',
    components: {},
    data(){
        // 校验邮箱
        var validateEmail = (rule, value, callback) => {
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
        var validatePassword = (rule, value, callback) => {
            // 过滤后的数据
            this.ruleForm.password = stripscript(value);
            value = this.ruleForm.password;

            if (value === '') {
                callback(new Error('请输入密码！'));
            } else if (!checkPassword(value)) {
                callback(new Error('密码为6到20位数字和字母组合！'));
            } else {
                callback();
            }
        };

        // 校验重复
        var validatePasswords = (rule, value, callback) => {
            // 过滤后的数据
            this.ruleForm.passwords = stripscript(value);
            value = this.ruleForm.passwords;

            if (value === '') {
                callback(new Error('请输入重复密码！'));
            } else if (value != this.ruleForm.password) {
                callback(new Error('重复密码不正确！'));
            } else {
                callback();
            }
        };

        // 校验验证码
        var validateCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入验证码！'));
            } else if (!checkCode(value)) {
                callback(new Error('验证码为6位！'));
            } else {
                callback();
            }    
        };

        return {
            menuTab: [
                {text: '登录', current: true, type: 'login'},
                {text: '注册', current: false, type: 'register'}
            ],
            model: 'login',
            ruleForm: {
                username: '',
                password: '',
                passwords: '',
                code: ''
            },
            rules: {
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
            },
        };
    },
    created(){},
    mounted(){},
    methods: {
        toggleMenu(item){
            // ES6写法
            this.menuTab.forEach(elem => {
                elem.current = false;
            });
            item.current = true;

            // 改变model
            this.model = item.type;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        }
    },
    props: {},
    watch: {},
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