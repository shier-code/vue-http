<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#ffffff"
            text-color="#000000" active-text-color="#07c4a8" unique-opened router>
           <template v-for="item in menuList">

            <!--    <template v-if="true">-->
                    <el-submenu :index="item.index+''" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                      <template v-if="item.subs&&item.subs.length">
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                        </template>
                    </el-submenu>

            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from './bus';
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
                collapse: false,

            }
        },
        computed:mapState({
            menuList:state=>state.menu.menuList,
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }),
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        },
        mounted(){

        this.showMenus();
        },
        methods:{
          showMenus(){

            let token = sessionStorage.getItem('token');
            let config={
                 headers:{'Authorization':token}
            }
            axios({
              method:'post',
              url:'/api/system/resources/list',
              headers:{'Authorization':token}
            }).then((res)=>{
                var json=res.data;
                //存入菜单,渲染菜单
                this.$store.dispatch("add_Menus",json.data);
                //动态设置路由
                this.$store.dispatch("add_Routes", json.data);
            })
          }
    }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 60px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
