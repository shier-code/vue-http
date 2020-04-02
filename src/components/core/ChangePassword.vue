
<template>
  <div>
    <el-dialog
      :title="title"
      width="500px"
      :visible.sync="passwordVisible"
      :close-on-click-modal="false"
      :modal="false"
    >
      <el-form
        :label-position="labelPosition"
        :label-width="labelWidth"
        :rules="FormEditRules"
        :size="size"
        :inline="true"
        ref="formEdit"
        :model="formEdit"
        class="demo-form-inline"
      >
        <el-form-item label="初始密码" prop="oldPassword">
          <el-input v-model="formEdit.oldPassword" type="password" placeholder="初始密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="formEdit.newPassword" type="password" placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="newPassword2">
          <el-input v-model="formEdit.newPassword2" type="password" placeholder="再次输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="setPasswordVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="handlePassword">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "personal-info",
  data() {
    return {
      size: "small",
      title: "密码修改",
      userid: "",
      tableData: [], // 备份记录
      showHeader: false,
      passwordVisible: false,
      tableLoading: false,
      labelPosition: "right", //lable对齐方式
      labelWidth: "80px",
      formEdit: {},
      FormEditRules: {
        oldPassword: [
          { required: true, message: "请输入当前密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码不允许小于6位",
            trigger: "blur"
          }
        ],
        newPassword2: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码不允许小于6位",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getCurrent();
  },
  methods: {
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
        this.userid = result.data.id;
      });
    },
    setPasswordVisible: function(data) {
      this.passwordVisible = data;
    },
    handlePassword() {
      let token = sessionStorage.getItem("token");
      let roleId = sessionStorage.getItem("id");
      axios({
        method: "post",
        url: "/api/system/user/changepassword",
        data: {
          uid: this.userid,
          password: this.formEdit.newPassword2
        },
        headers: { Authorization: token }
      }).then(res => {});
    }
  }
};
</script>

<style>
</style>
>