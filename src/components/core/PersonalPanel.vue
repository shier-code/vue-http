<template>
  <div class="personal-panel">
    <div class="personal-desc" style="background:#07c4a8;opacity:0.9">
      <!-- <div class="avatar-container">
          <img class="avatar" :src="require('')" />
      </div>-->
      <div class="name-role">
        <span class="sender">{{user.organizationPath}}-{{ user.name }}</span>
      </div>
    </div>
    <div class="other-operation">
      <div class="other-operation-item">
        <li class="el-icon-bell"></li>
        用户名：{{user.username}}
      </div>
      <div class="other-operation-item">
        <li class="el-icon-bell"></li>
        岗位：{{ user.position }}
      </div>
      <div class="other-operation-item">
        <li class="el-icon-bell"></li>
        岗位信息：{{user.positionTitle}}
      </div>
      <div class="other-operation-item">
        <li class="el-icon-bell"></li>
        联系方式：{{user.tel}}
      </div>
    </div>
    <div class="main-operation">
      <span class="main-operation-item">
        <el-button size="small" icon="fa fa-key" @click="showPassword">修改密码</el-button>
      </span>
      <span class="main-operation-item">
        <el-button size="small" icon="fa fa-male" @click="handleCommand">退出登录</el-button>
      </span>
    </div>

    <!--备份还原界面-->
    <personal-info ref="passwordDialog"></personal-info>
  </div>
</template>

<script>
import PersonalInfo from "@/components/core/ChangePassword";
export default {
  name: "PersonalPanel",
  components: {
    PersonalInfo
  },
  props: {
  
  },
  data() {
    return {
      currentUser: "",
        user: {
        name: "",
        username: "",
        position: "",
        positionTitle: "",
        tel: "",
        organizationPath: ""
    
    }
    };
  },
  methods: {
    // 退出登录
    logout: function() {
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          sessionStorage.removeItem("user");
          this.$router.push("/login");
          this.$api.login
            .logout()
            .then(res => {})
            .catch(function(res) {});
        })
        .catch(() => {});
    },
    handleCommand(command) {
      axios.post("api/account/logout").then(res => {
        if (res.data.status == 3) {
          this.$router.push("/login");
        }
      });
    },
    // 打开备份还原界面
    showPassword: function() {
      this.$refs.passwordDialog.setPasswordVisible(true);
    },

    // 成功还原之后，重新登录
    afterRestore: function() {
      this.$refs.backupDialog.setBackupVisible(false);
      sessionStorage.removeItem("user");
      this.$router.push("/login");
      this.$api.login
        .logout()
        .then(res => {})
        .catch(function(res) {});
    },
    getCurrent() {
      let token = sessionStorage.getItem("token");
      let config = {
        headers: { Authorization: token }
      };
  
      axios({
        method: "post",
        url: "/api/account/current",

        headers: { Authorization: token }
      }).then(res => {
        var result = res.data;
        this.user.name = result.data.name;
        this.user.position = result.data.position;
        this.user.username = result.data.username;
        this.user.organizationPath = result.data.organizationPath;
        this.user.tel = result.data.tel;
        this.user.positionTitle = result.data.positionTitle;
        this.currentUser = result.data.name;

      });
    },
    setUser() {
      this.$emit("transferUser", this.currentUser);
    }
  },
  mounted() {
    this.getCurrent();
    this.setUser();
  }
};
</script>

<style scoped>
.personal-panel {
  font-size: 14px;
  width: 280px;
  text-align: center;
  border-color: rgba(180, 190, 190, 0.2);
  border-width: 1px;
  border-style: solid;
  background: rgba(182, 172, 172, 0.1);
  margin: -14px;
}
.personal-desc {
  padding: 15px;
  color: #fff;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 90px;
}
.name-role {
  font-size: 16px;
  padding: 5px;
}
.personal-relation {
  font-size: 16px;
  padding: 12px;
  margin-right: 1px;
  background: rgba(200, 209, 204, 0.3);
}
.relation-item {
  padding: 12px;
}
.relation-item:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
}
.main-operation {
  padding: 8px;
  margin-right: 1px;
  /* background: rgba(175, 182, 179, 0.3); */
  border-color: rgba(201, 206, 206, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.main-operation-item {
  margin: 15px;
}
.other-operation {
  padding: 15px;
  margin-right: 1px;
  text-align: left;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.other-operation-item {
  padding: 12px;
}
.other-operation-item:hover {
  cursor: pointer;
  background: #9e94941e;
  color: rgb(19, 138, 156);
}
.personal-footer {
  margin-right: 1px;
  font-size: 14px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-color: rgba(180, 190, 190, 0.2);
  border-top-width: 1px;
  border-top-style: solid;
}
.personal-footer:hover {
  cursor: pointer;
  color: rgb(19, 138, 156);
  background: #b1a6a61e;
}
</style>