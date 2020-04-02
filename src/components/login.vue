<template>
  <div class="login_wrapper">
    <div class="login">
      <el-form :model="formLogin">
        <el-form-item>
          <h2 class="title">后台管理系统</h2>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formLogin.loginName" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="formLogin.password" placeholder="密码"></el-input>
        </el-form-item>

        <!-- <el-form-item>
          <el-input
            style="width: 50%;display: inline-block"
            v-model="formLogin.verification_code"
            class="form-control"
            id="focusedInput"
            type="text"
            placeholder="请输入验证码"
          ></el-input>
          <img
            style="display: inline;width: 130px;float: right"
            v-bind:src="imgUrl"
            class="img-code"
            id="kaptchaImage"
            @click="change()"
            title="点击换一张"
          />
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <span v-show="this.errorInfo.isShowError" class="error">{{this.errorInfo.text}}</span>
        </el-form-item>
      </el-form>
    </div>
    <p class="recover" @click="rollBackTables">点击恢复数据</p>
  </div>
</template>

<style lang="scss">
$input_width: 300px;

.login_wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .login {
    width: 460px;
    height: 480px;
    margin-top: -150px;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      text-align: center;
      color: #505458;
    }
    .el-form-item__content {
      width: $input_width;
    }
    .el-button {
      width: $input_width;
    }
    .el-form {
      margin: 30px 80px auto 80px;
      .error {
        display: block;
        text-align: center;
        color: red;
      }
    }
  }
}
.recover {
  position: absolute;
  bottom: 0px;
  cursor: pointer;
  color: #e6a23c;
  display: none;
}
.bei {
  position: absolute;
  bottom: 20px;
  cursor: pointer;
  color: #505458;
}
</style>

<script>
import apis from "../apis/apis";
import mock from "@/mock/index.js";
export default {
  name: "login",
  data() {
    return {
      formLogin: {
        //表单对象
        loginName: "",
        password: "",
        verification_code: ""
      },
      errorInfo: {
        text: "登陆失败,请重试",
        isShowError: false //显示错误提示
      },
      checked: "",
      imgUrl: "/api/account/defaultKaptcha?d=" + new Date() * 1
    };
  },
  mounted() {
    document.onkeydown = event => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode == 130) {
        // enter 键
        this.login();
      }
    };
  },
  methods: {
    change() {
      this.imgUrl = "/api/account/defaultKaptcha?d=" + new Date() * 1;
    },
    login() {
      this.$router.push({ path: "/index" });
      return;
      //调用后端登陆接口
      apis.shiroApi
        .loginIn(this.formLogin)
        .then(data => {
          console.log("success:", data);
          if (data && data.data) {
            var json = data.data;
            if (json.status == "2") {
              console.log("登录成功");
              sessionStorage.setItem("token", json.data);
              this.$router.push({ path: "/index" });
              return;
            } else if (json.message) {
              this.errorInfo.text = json.message;
            } else if ((json.status = "-7")) {
              this.errorInfo.isShowError = true;
              this.errorInfo.text = json.msg;
            } else if ((json.status = "-4")) {
              this.errorInfo.isShowError = true;
              this.errorInfo.text = "账号或密码错误";
            }
          }
          this.errorInfo.isShowError = true;
          this.$store.dispatch("loginLog", loginLog);
        })
        .catch(err => {
          let result = err.response.data.errors[0];
          console.log(result.defaultMessage);
          this.errorInfo.isShowError = true;

          this.errorInfo.text = result.defaultMessage;
        });
    },
    rollBackTables() {
      var text = "数据还原";
      apis.shiroApi
        .rollBackTables()
        .then(data => {
          var alertText = "";
          if (data.data.status == "SUCCESS") {
            text += "成功";
            alertText = text + ",请重新登陆";
          } else {
            text += "失败";
            alertText = text + ",请重试";
          }
          this.$alert(alertText, "提示", {
            confirmButtonText: "确定"
          });
          log(text);
        })
        .catch(e => {
          this.$alert("数据还原异常,请重试", "提示", {
            confirmButtonText: "确定"
          });
          text += "失败";
          log(text);
        });
      console.log(text);

      function log(text) {
        var loginLog = {
          ip: returnCitySN["cip"],
          city: returnCitySN["cname"] + "-" + text
        };

        apis.shiroApi.loginLog(loginLog);
      }
    }
  }
};
</script>
