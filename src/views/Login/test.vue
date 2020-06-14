<template>
    <div id="login">
        <div class="login-wrap">
            <ui class="menu-tab">
                <!-- <li :class="{ 'current':isActive }" v-for="item in menuTab" :key="item.id">{{ item.text }}</li> -->
                <!-- <li :class="{ 'current':isActive == index }" v-for="(item, index) in menuTab" :key="item.id">{{ item.text }}</li> -->
                <li v-for="item in menuTab" :key="item.id" v-bind:class="{ 'current':isActive == item.current }" @click="toggleMenu(item)">{{ item.text }}</li>
            </ui>
        </div>
    </div>
</template>

<script>
export default {
    name: 'test',
    components: {},
    data(){
        return {
            menuTab: [
                {text: '登录', current: true},
                {text: '注册', current: false}
            ],
            isActive: true,
            sort:true,
        }
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
</style>