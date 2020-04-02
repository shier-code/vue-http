<template>
  <div class="container">
    <!-- 查询区----start -->
    <el-form
      :label-position="labelPosition"
      :label-width="labelWidth"
      :inline="true"
      size="small"
      ref="formSearch"
      :model="formSearch"
    >
      <el-form-item size="mini">
        <treeselect
      
          style="width:300px;"
          :multiple="false"
          :normalizer="normalizer"
          @select="searchOrg"
          :props="defaultProps"
          :options="options"
          placeholder="组织查找"
        />
      </el-form-item>
      <el-form-item style="margin-left:100px;" size="small">
        <el-input v-model="formSearch.name" placeholder="姓名查找"></el-input>
      </el-form-item>
      <el-form-item label=" " style="margin-left:-100px">
        <el-button type="primary" @click="searchName">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询区----end -->
    <!-- 操作区----start -->
    <el-row class="mgb15">
      <el-button size="mini" type="primary" @click="dialogAddVisible = true">新增</el-button>
      <el-button size="mini" plain type="danger" @click="deleteMany">批量删除</el-button>
      <el-button size="mini" plain type="danger" @click="dialogUploadVisible=true">批量上传</el-button>
    </el-row>
    <!-- 操作区----end -->
    <!-- 表格---start -->
    <el-table
      :data="tableData"
      v-loading="listLoading"
      stripe
      size="mini"
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="organizationPath"  min-width="150" align="center" label="所属组织" >


        <template slot-scope="scope">
          <span>{{ scope.row.organizationPath}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="facePath" label="人脸图片" align="center" width="100">
        <template slot-scope="scope">
          <img width="80px" height="80px" :src="getImgUrl(scope.row)">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="150" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="150" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.username}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="tel" label="联系方式" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.tel}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="职位" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.position}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="positionTitle" label="岗位信息" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.positionTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="status" :formatter="formStatus" label="状态" align="center" width="100"></el-table-column>
      <el-table-column
        prop="faceStatus"
        :formatter="formFaceStatus"
        label="人脸状态"
        align="center"
        width="100"
      ></el-table-column>

      <el-table-column label="操作" fixed="right" width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="clearfloat">
      <el-pagination
        style="float:right;padding-top:10px"
        layout="total,sizes,prev, pager, next,jumper"
        :current-page="pageInfo.currentPage"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.pageTotal"
        :page-sizes="pageInfo.pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- <div style="clear:both"></div> -->
    <!-- 表格---end -->
    <!-- 编辑弹框---start -->
    <el-dialog :title="formEditTitle" :visible.sync="dialogEidtVisible" width="700px">
      <el-form
        :label-position="labelPosition"
        :label-width="labelWidth"
        :disabled="formEditDisabled"
        :inline="true"
        :size="size"
        ref="formEdit"
        :model="formEdit"
        :rules="rulesEdit"
        class="demo-form-inline"

      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name" class="item">
              <el-input v-model="formEdit.name" placeholder="姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username" class="item">
              <el-input v-model="formEdit.username" placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="formEdit.password" type="password" placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码" prop="tel">
              <el-input v-model="formEdit.tel" placeholder="电话号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属单位" prop="organizationId">
              <popup-tree-input
                :data="treeData"
                :props="defaultProps"
                :prop="formEdit.organizationPath"
                :nodeKey="''+formEdit.organizationId"
                :currentChangeHandle="handleTreeSelectChange"
              ></popup-tree-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="formEdit.position" placeholder="职位"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位信息" prop="position">
              <el-input v-model="formEdit.positionTitle" placeholder="职位信息"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权重" prop="weightSort">
              <el-input v-model="formEdit.weightSort" placeholder="权重"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formEdit.status" placeholder="状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="锁定" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="角色组" prop="roleAndUser">
              <el-select
                class="item-choose"
                v-model="formEdit.roles"
                size="small"
                @click="showRoleGroup()"
              >
                <el-option
                  v-for="(item) in roleGroups"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="人脸状态" prop="faceStatus">
            <el-select v-model="formEdit.faceStatus" placeholder="状态" disabled>
              <el-option label="已绑定" value="NORMAL"></el-option>
              <el-option label="解除绑定" value="DELETE"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEidtVisible = false" :size="size">取 消</el-button>
        <el-button v-if="!formEditDisabled" type="primary" @click="update" :size="size">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹框---end -->
    <!-- 新增弹框---start -->
    <el-dialog
      title="新增记录"
      :visible.sync="dialogAddVisible"
      width="700px"
      @close="closeDialog('formAdd')"
    >
      <el-form
        :label-position="labelPosition"
        :label-width="labelWidth"
        :inline="false"
        :rules="rulesAdd"
        :model="formAdd"
        :size="size"
        ref="formAdd"
        class="demo-form-block"
      >
        <el-form-item label="人员图片" ref="image" prop="pic">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action="/api/system/user/uploadImage"
            :show-file-list="true"
            :on-preview="handlePictureCardPreview"
            :http-request="uploadPic"
            :on-success="handleSuccess"
            :on-change="onchange"
            accept="image/jpeg, image/jpg, image/png"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name" class="item">
              <el-input v-model="formAdd.name" placeholder="姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username" class="item">
              <el-input v-model="formAdd.username" placeholder="用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="formAdd.password" placeholder="密码" type="password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码" prop="tel">
              <el-input v-model="formAdd.tel" placeholder="电话号码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属单位" prop="organizationId">
              <popup-tree-input
                :data="treeData"
                :props="defaultProps"
                :prop="formAdd.organizationName"
                :nodeKey="''+formAdd.organizationId"
                :currentChangeHandle="handleTreeSelectChange"
              ></popup-tree-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="formAdd.position" placeholder="职位"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位信息" prop="positionTitle">
              <el-input v-model="formAdd.positionTitle" placeholder="职位信息"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色组" prop="roleAndUser">
              <el-select
                class="item-choose"
                v-model="formAdd.roleAndUser"
                size="small"
                @click="showRoleGroup()"
              >
                <el-option
                  v-for="(item) in roleGroups"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formAdd.status" placeholder="状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="锁定" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权重" prop="weightSort">
              <el-input v-model="formAdd.weightSort" placeholder="权重"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false" :size="size">取 消</el-button>
        <el-button type="primary" @click="save" :size="size" :disabled="picUploadStatus==false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增弹框---end -->
    <!-- 批量上传excel弹框---start -->
    <el-dialog :title="excelUploadTitle" :visible.sync="dialogUploadVisible" width="600px">
      <el-row>
        <el-col :span="5" style="height: 450px;display:inline-block">
          <el-steps direction="vertical">
            <el-step title="步骤 1" description="下载人员信息表模板"></el-step>
            <el-step title="步骤 2" description="上传人员信息表"></el-step>
            <el-step title="步骤 3" description="上传人脸图片"></el-step>
            <el-step title="步骤 4" description="上传完毕"></el-step>
          </el-steps>
        </el-col>
        <el-col :span="19" style="display:inline-block">
          <el-row>
            <el-button
              type="primary"
              size="small"
              plain
              style="margin:10px 50px"
              @click="downloadModel"
            >模板下载</el-button>
          </el-row>
          <el-upload
            class="upload-demo"
            ref="upload"
            style="margin-left:50px"
            :http-request="myUpload"
            action="/api/Excel/import"
          >
            <i class="el-icon-upload"></i>
            <div class="l-icon-document">
              将Excel文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>

          <el-upload
            class="upload-demo"
            style="margin-left:50px"
            drag
            :on-success="handleAvatarSuccess"
            :http-request="myUpload"
            action="/api/Faces/import"
            multiple
          >
            <i class="el-icon-picture-outline" style="font-size:80px;margin-top:30px"></i>
            <div class="el_upload_text">
              将图片压缩文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload_tip" slot="tip"></div>
          </el-upload>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadSubmit">完成</el-button>
      </div>
    </el-dialog>
    <!-- 批量上传excel弹框---end -->
  </div>
</template>

<style lang="scss">
// 设置输入框的宽度
.el-form-item__content {
  width: 220px;
}
.demo-form-block {
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 160px;
  height: 160px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
  padding-top: 40%;
}
.avatar {
  width: 160px;
  height: 160px;
  display: block;
}
.clearfloat::after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearfloat {
  zoom: 1;
}
</style>

<script>
import apis from "../../apis/apis";
import PopupTreeInput from "@/components/PopupTreeInput";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "messageboard",
  size: "small",
  components: {
    PopupTreeInput,
    Treeselect
  },
  data() {
    return {
      size: "small",
      roleGroups: [],
      treeData: [],
      options: [],
      defaultProps: {
        children: "child",
        label: "name"
      },
      listLoading: false,
      pageInfo: {
        //分页
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        pageSizes: [5, 10, 15]
      },
      formSearch: {
        //表单查询
        name: "",
        value: ""
      },
      formAdd: {
        //表单添加
        name: "",
        tel: "",
        password: "",
        organizationId: "",
        organizationPath: "",
        position: "",
        positionTitle: "",
        status: "",
        weightSort: "",
        roleAndUser: "",
        PathStr: ""
      },
      picRequired: true,

      picUploadStatus: false,

      rulesAdd: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        tel: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        organizationId: [
          { required: true, message: "请选择所属单位", trigger: "change" }
        ],
        position: [
          { required: true, message: "请输入职位", trigger: "change" }
        ],
        positionTitle: [
          { required: true, message: "请输入职位信息", trigger: "change" }
        ],
        position: [
          { required: true, message: "请输入职位", trigger: "change" }
        ],
        roleAndUser: [
          { required: true, message: "请选择权限组", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择权限组", trigger: "change" }
        ],
        weightSort: [
          { required: true, message: "请输入权重", trigger: "change" }
        ]
      },
      formEdit: {
        name: "",
        username: "",
        tel: "",
        password: "",
        organizationPath: "",
        position: "",
        positionTitle: "",
        status: "",
        weightSort: "",
        roles: ""
      },
      rulesEdit: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        tel: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],

        //  organizationId: [{ required: true, message: "请选择所属单位", trigger: "blur" }],
        position: [
          { required: true, message: "请输入职位", trigger: "change" }
        ],
        positionTitle: [
          { required: true, message: "请输入职位信息", trigger: "blur" }
        ],
        position: [{ required: true, message: "请输入职位", trigger: "blur" }],
        // roleAndUser: [
        //   { required: true, message: "请选择权限组", trigger: "blur" }
        // ],
        status: [{ required: true, message: "请选择权限组", trigger: "blur" }],
        weightSort: [{ required: true, message: "请输入权重", trigger: "blur" }]
      },
      formEditTitle: "编辑", //编辑和查看标题
      formEditDisabled: false, //编辑弹窗是否可编辑
      tableData: [
        //表单列表
      ],
      dialogEidtVisible: false, //编辑弹框显示
      dialogAddVisible: false, //添加弹框显示
      dialogUploadVisible: false, //文件上传弹框显示
      excelUploadTitle: "人员信息上传",
      uploadSuccess: false,
      labelPosition: "right", //lable对齐方式
      labelWidth: "80px", //lable宽度
      formLabelWidth: "120px",
      multipleSelection: [],

      imageUrl: "",
      imageUpload: "",
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  computed: {},
  filters: {
    convertType: function(type) {
      if (type == 1) {
        return "留言";
      } else if (type == 2) {
        return "建议";
      } else if (type == 3) {
        return "BUG";
      }
    }
  },
  mounted() {
    this.showTree();
    this.getList();
    this.showRoleGroup();
  },

    // <treeselect
      
    //       style="width:300px;"
    //       :multiple="false"
    //       :normalizer="normalizer"
    //       @select="searchOrg"
    //       :props="defaultProps"
    //       :options="options"
    //       placeholder="组织查找"
    //     />
  methods: {
    renderHeader(h, { column, $index }){
      return(
      h("treeselect",{
        style:{
          width:'100px',
          height:'20px'
        },
        placeholder:'组织查找',
        multiple:'false',
         props:'defaultProps',
        on:{
          select:"searchOrg"
        }
        
      })
      )
      
      
    },
    getImgUrl(row) {
      return  "api/image/" + row.facePath;
    },
    // 下拉选择树内容格式化
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.child
      };
    },

    getList() {
      let param = {
        pageNo: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize
      };

      this.$api.staffApi.showList(param).then(res => {
        var obj = res.data;
        this.tableData = obj.data.pageData;
        this.pageValue = obj.data.pageable;
        this.pageInfo.pageTotal = obj.data.total;
      });
    },
    formStatus(row, column) {
      return row.status === 1 ? "正常" : "锁定";
    },
    formFaceStatus(row, column) {
      return row.faceStatus === "NORMAL" ? "已绑定" : "未绑定";
    },
    showRoleGroup() {
      let token = sessionStorage.getItem("token");
      let roleGroupArray = [];
      let param = {
        pageNo: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize
      };
      this.$api.staffApi.showRoleGroup(param).then(res => {
        let result = res.data.data.pageData;
        result.forEach(function(value, index, array) {
          let roleGroup = {
            value: "",
            label: ""
          };
          roleGroup.value = array[index].id;
          roleGroup.label = array[index].name;
          roleGroupArray.push(roleGroup);
        });
        // 数组深拷贝
        let objDeepCopy = function(source) {
          let sourceCopy = {};
          for (let item in source)
            sourceCopy[item] =
              typeof source[item] === "object"
                ? objDeepCopy(source[item])
                : source[item];
          return sourceCopy;
        };
        this.roleGroups = objDeepCopy(roleGroupArray);
        console.log("rolegroups is" + this.roleGroups instanceof Array);
      });
    },
    Success() {
      uploadSuccess = true;
    },
    /**
     * 保存
     */
    save() {
      this.$refs["formAdd"].validate(valid => {
        let path = sessionStorage.getItem("picUrl");
        let token = sessionStorage.getItem("token");
        console.log("path is:" + path);
        if (valid) {
          let param = {
            name: this.formAdd.name,
            username: this.formAdd.username,
            tel: this.formAdd.tel,
            password: this.formAdd.password,
            organizationId: this.formAdd.organizationId,
            position: this.formAdd.position,
            positionTitle: this.formAdd.positionTitle,
            status: this.formAdd.status,
            weightSort: this.formAdd.weightSort,
            roleAndUser: this.formAdd.roleAndUser,
            pathStr: path
          };
          this.$api.staffApi
            .userAdd(param)
            .then(data => {
              if (data && data.data) {
                var json = data.data;
                if (json && json.status == "1") {
                  this.$message({ message: "执行成功", type: "success" });
                  this.dialogAddVisible = false;
                  this.getList();
                  return;
                }
              }
              this.$message({ message: "执行失败，请重试", type: "error" });
            })
            .catch(err => {
              this.$message({ message: "执行失败，请重试", type: "error" });
            });
        }
      });
    },

    // 图片上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.imageUpload = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 100;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    uploadPic(content) {
      let params = new FormData();
      let config = {
        headers: { "content-Type": "multipart/form" }
      };
      params.append("file", content.file);
      axios.post(content.action, params, config).then(res => {
        sessionStorage.setItem("picUrl", res.data.data);
        let path = sessionStorage.getItem("picUrl");
        let result = res.data;
        this.picUploadStatus = true;
        if (result.status == "-1") {
          this.$message.error("操作失败");

          this.imageUrl = false;
        }
      });
    },
    handleSuccess(file) {
      if (file.size > 0) {
      }
    },
    myUpload(content) {
      var form = new FormData();
      let config = {
        headers: { "content-Type": "multipart/form" }
      };
      form.append("file", content.file);
      axios.post(content.action, form, config).then(res => {});
    },

    downloadModel() {
      axios({
        method: "get",
        url: "api/excelDownload/download",
        responseType: "blob"
      }).then(res => {
        this.download(res);
      });
    },
    download(data) {
      if (!data) {
        return;
      }
      let blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=utf-8'})

	let url = window.URL.createObjectURL(blob);
   
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "model.xlsx");

      document.body.appendChild(link);
      link.click();
    },
    onchange(file, fileList) {
      var _this = this;
      var event = event || window.event;
      var file = event.target.files[0];
      var reader = new FileReader();
      //转base64
      reader.onload = function(e) {
        _this.imageUrl = e.target.result; //将图片路径赋值给src
      };
      reader.readAsDataURL(file);
    },
    uploadSubmit() {
      this.dialogUploadVisible = false;
      this.getList();
    },
    showTree() {
      this.$api.staffApi.showTree().then(res => {
        let treeValue = res.data.data;
        this.treeData = treeValue.child;
        this.options = treeValue.child;
        console.log("options is" + this.options);
      });
    },
    handleTreeSelectChange(data, node) {
      this.formAdd.organizationId = data.id;
      this.formAdd.organizationName = data.name;
      this.formEdit.organizationId = data.id;
      this.formEdit.organizationPath = data.name;
    },
    /**
     * 更新
     *
     */
    update() {
      this.$refs["formEdit"].validate(valid => {
        if (valid) {
          let path = sessionStorage.getItem("picUrl");
          let param = {
            id: this.formEdit.id,
            name: this.formEdit.name,
            username: this.formEdit.username,
            tel: this.formEdit.tel,
            password: this.formEdit.password,
            organizationId: this.formEdit.organizationId,
            position: this.formEdit.position,
            positionTitle: this.formEdit.positionTitle,
            status: this.formEdit.status,
            weightSort: this.formEdit.weightSort,
            roleAndUser: this.formEdit.roles
          };
          this.$api.staffApi
            .userUpdate(param)
            .then(data => {
              if (data && data.data) {
                var json = data.data;
                if (json.status == 1) {
                  this.$message({ message: "执行成功", type: "success" });
                  this.dialogEidtVisible = false;
                  this.getList();
                  return;
                }
              }
              this.$message({ message: "执行失败，请重试", type: "error" });
            })
            .catch(err => {
              this.$message({ message: "执行失败，请重试", type: "error" });
            });
        }
      });
    },
    /**
     * 删除
     */
    handleDelete(index, rowData) {
      var id = rowData.id;
      let token = sessionStorage.getItem("token");
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api.staffApi
            .userDelete(id)
            .then(data => {
              if (data.data.status == 1) {
                this.$message({ message: "删除成功", type: "success" });
                this.getList();
                return;
              }
            })
            .catch(err => {
              this.$message({ message: "执行失败，请重试", type: "error" });
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    /**
     * 批量删除
     */
    deleteMany() {
      var ids = this.multipleSelection.map(item => item.id);
      let token = sessionStorage.getItem("token");
      let deleteIds = ids.join(",");
      if (ids.length == 0) {
        this.$message({ message: "请选择要删除的项", type: "warn" });
        return;
      }
      console.log(ids);
      this.$confirm("此操作将批量永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let param = {
            ids: deleteIds
          };
          this.$api.staffApi
            .deleteBatch(param)
            .then(data => {
              if (data.data.status == 1) {
                this.$message({ message: "删除成功", type: "success" });
                this.getList();
                return;
              }
            })
            .catch(err => {
              this.$message({ message: "执行失败，请重试", type: "error" });
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    onReset() {
      this.$refs["formSearch"].resetFields();
    },
    // 单位查找
    searchOrg(node, instanceId) {
      let param = {
        organizationId: node.id,
        pageNo: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize
      };
      this.$api.staffApi.search(param).then(res => {
        let result = res.data.data.pageData;
        this.tableData = result;
        console.log("res is" + result);
      });
    },
    //姓名查找
    searchName() {
      let param = {
        name: this.formSearch.name,
        pageNo: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize
      };
      this.$api.staffApi.search(param).then(res => {
        let result = res.data.data.pageData;
        this.tableData = result;
      });
    },
    /**
     * 打开编辑弹窗
     */
    handleEdit(index, rowData) {
      //var msg = "索引是:" + index + ",行内容是:" + JSON.stringify(rowData);
      //this.$message({message: msg,type: "success"});
      this.formEditTitle = "编辑";
      this.formEditDisabled = false;
      this.formEdit =Object.assign({},rowData) ;
      this.dialogEidtVisible = true;
    },
    /**
     * 打开详情页
     */
    handleDetail(index, rowData) {
      this.formEditTitle = "详情";
      this.formEditDisabled = true;
      this.formEdit = rowData;
      this.formEdit.gender += "";
      this.dialogEidtVisible = true;
    },
    /**
     * 关闭弹框，数据重置
     */
    closeDialog(formName) {
      // 点击取消 数据重置
      this.$refs[formName].resetFields();
    },
    /**
     * 分页大小切换
     */
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
      this.getList();
    },
    /**
     * 分页切换
     */
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getList();
    },
    /**
     * 点击选择
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 打开详情页
     */
    openDetail(row) {
      this.$common.OpenNewPage(this, "detail", row);
    }
  }
};
</script>
