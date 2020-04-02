<template>
  <div class="container">
    <!-- 查询区----start -->
    <el-form
      :label-position="labelPosition"
      :label-width="labelWidth"
      :inline="true"
      :size="size"
      ref="formSearch"
      :model="formSearch"
      class="demo-form-inline"
    >
      <el-form-item>
        <el-button type="primary" @click="dialogAddVisible = true" size="mini">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询区----end -->
    <!-- 表格---start -->
    <div class="clearfloat">
      <div
        style="width: 19%;height:100%;display: inline-block;float:left;background-color:#00ff00;"
      >
        <el-tree
          :data="treeData"
          default-expand-all
          :props="defaultProps"
          @node-click="handleNodeClick"
          node-key="id"
        ></el-tree>
      </div>
      <div style="width: 80%;height:100%;display: inline-block;float: left">
        <el-table
          :data="tableData"
          v-loading="listLoading"
          :size="size"
          stripe
          style="width:100%"
          empty-text="暂无数据"
        
                element-loading-text="请选择组织"
        >
          <el-table-column label="详情" width="50" align="center" type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="组织邮编">
                  <span>{{ props.row.zipCode }}</span>
                </el-form-item>

                <el-form-item label="管理员姓名">
                  <span>{{ props.row.adminName }}</span>
                </el-form-item>
                <el-form-item label="管理员电话">
                  <span>{{ props.row.adminTel }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ props.row.gmtCreate | formatDate }}</span>
                </el-form-item>
                <el-form-item label="更新时间">
                  <span>{{ props.row.gmtModified | formatDate}}</span>
                </el-form-item>
                <el-form-item label="组织描述">
                  <span>{{ props.row.description }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column prop="organizationNumber" label="组织编号" width="150" align="center">
            <template slot-scope="scope">{{ scope.row.organizationNumber}}</template>
          </el-table-column>
          <el-table-column prop="name" label="组织名称" min-width="150" align="center">
            <template slot-scope="scope">{{ scope.row.name}}</template>
          </el-table-column>

          <el-table-column prop="location" label="地址" min-width="150" align="center">
            <template slot-scope="scope">{{ scope.row.location}}</template>
          </el-table-column>
          <el-table-column
            prop="type"
            label="组织类型"
            :formatter="formType"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            :formatter="formStatus"
            width="150"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="160">
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
      </div>
      <div style="clear:both"></div>
    </div>
    <!-- 表格---end -->
    <!-- 编辑弹框---start -->
    <el-dialog :title="formEditTitle" :visible.sync="dialogEidtVisible" width="750px">
      <el-form
        :label-position="labelPosition"
        :label-width="labelWidth"
        :size="size"
        :disabled="formEditDisabled"
        :inline="true"
        ref="formEdit"
        :rules="rulesAdd"
        :model="formEdit"
        class="demo-form-inline"
      >
        <el-form-item label="组织id" prop="id" label-width="100px">
          <el-input v-model="formEdit.id" placeholder="id" disabled></el-input>
        </el-form-item>
          <el-form-item label="组织类型" prop="type" label-width="100px">
          <el-select v-model="formEdit.type" placeholder="组织类型" disabled>
            <el-option label="单位" value="COMPANY"></el-option>
            <el-option label="部门" value="DEPARTMENT"></el-option>
            <el-option label="班组" value="GROUP"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织编号" prop="organizationNumber" label-width="100px">
          <el-input v-model="formEdit.organizationNumber" placeholder="组织编号"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="name" label-width="100px">
          <el-input v-model="formEdit.name" placeholder="组织名称"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="location" label-width="100px">
          <el-input v-model="formEdit.location" placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode" label-width="100px">
          <el-input v-model="formEdit.zipCode" placeholder="邮编"></el-input>
        </el-form-item>
        <el-form-item
          label="管理员姓名"
          prop="administratorName"
          class="el-form-label"
          label-width="100px"
          style
        >
          <el-input v-model="formEdit.adminName" placeholder="管理员姓名"></el-input>
        </el-form-item>
        <el-form-item label="管理员电话" prop="administratorTel" label-width="100px">
          <el-input v-model="formEdit.adminTel" placeholder="管理员电话"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" label-width="100px">
          <el-select v-model="formEdit.status" placeholder="状态" disabled>
            <el-option label="正常" value="NORMAL"></el-option>
            <el-option label="锁定" value="DELETE"></el-option>
          </el-select>
        </el-form-item>
      

        <el-form-item label="组织描述" prop="description" label-width="100px">
          <el-input v-model="formEdit.description" type="textarea" placeholder="组织描述"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEidtVisible = false" :size="size">取 消</el-button>
        <el-button v-if="!formEditDisabled" type="primary" @click="update" :size="size">确定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹框---end -->
    <!-- 新增弹框---start -->
    <el-dialog
      title="新增组织"
      :visible.sync="dialogAddVisible"
      width="750px"
      @close="closeDialog('formAdd')"
    >
      <el-form
        :label-position="labelPosition"
        :label-width="labelWidth"
        :inline="true"
        :size="size"
        :model="formAdd"
        :rules="rulesAdd"
        ref="formAdd"
        class="demo-form-inline"
      >
        <el-form-item label="上级组织" prop="parentId" label-width="100px">
          <!-- <el-input v-model="formAdd.parentId" placeholder="父级id" ></el-input> -->
          <popup-tree-input
            :data="treeData"
            :props="defaultProps"
            :prop="formAdd.parentName"
            :nodeKey="'顶级菜单'+formAdd.parentId"
            :currentChangeHandle="handleTreeSelectChange"
          ></popup-tree-input>
        </el-form-item>
         <el-form-item label="类型" prop="type" label-width="100px">
          <el-select v-model="formAdd.type" placeholder="类型">
            <el-option label="单位" value="0"></el-option>
            <el-option label="部门" value="1"></el-option>
            <el-option label="班组" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织名称" prop="name" label-width="100px">
          <el-input v-model="formAdd.name" placeholder="组织名称"></el-input>
        </el-form-item>

        <el-form-item label="组织编号" prop="organizationNumber" label-width="100px">
          <el-input type="tel" v-model="formAdd.organizationNumber" placeholder="组织编号"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode" label-width="100px">
          <el-input v-model="formAdd.zipCode" placeholder="邮编"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="location" label-width="100px">
          <el-input v-model="formAdd.location" placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item label="权重" prop="sortWeight" label-width="100px">
          <el-input v-model="formAdd.sortWeight" placeholder="权重"></el-input>
        </el-form-item>
        <el-form-item label="管理员姓名" prop="administratorName" label-width="100px">
          <el-input v-model="formAdd.adminName" placeholder="管理员姓名"></el-input>
        </el-form-item>
        <el-form-item label="管理员电话" prop="administratorTel" label-width="100px">
          <el-input v-model="formAdd.adminTel" placeholder="管理员电话"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" label-width="100px">
          <el-select v-model="formAdd.status" placeholder="状态">
            <el-option label="启用" value="NORMAL"></el-option>
            <el-option label="锁定" value="DELETE"></el-option>
          </el-select>
        </el-form-item>
       
        <el-form-item label="单位描述" prop="description" label-width="100px">
          <el-input v-model="formAdd.description" type="textarea" placeholder="单位描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false" :size="size">取 消</el-button>
        <el-button type="primary" @click="save" :size="size">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增弹框---end -->
  </div>
</template>

<style lang="scss">
// 设置输入框的宽度
.el-form-item__content {
  width: 220px;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.el-form-label {
}
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
}
.clearfloat {
  zoom: 1;
}
</style>

<script>
import apis from "../../apis/apis";
import Axios from "axios";
import PopupTreeInput from "@/components/PopupTreeInput";
import { formatDate } from "@/js/date.js";
import {validator} from "@/js/validator.js";
export default {
  name: "messageboard",
  components: {
    PopupTreeInput
  },
  data() {
    return {
      size: "small",
      listLoading: true, //
      treeData: [],
      defaultProps: {
        children: "child",
        label: "name"
      },
      pageInfo: {
        //分页
        currentPage: 0,
        pageSize: 10,
        pageTotal: "",
        pageSizes: [5, 10, 15]
      },
      formSearch: {
        //表单查询
        name: "",
        city: "",
        type: null,
        age: "",
        gender: null,
        qq: "",
        startdate: null,
        enddate: null
      },
      formAdd: {
        //表单添加
        parentId: "",
        name: "",
        organizationNumber: "",
        zipCode: "",
        sortWeight: "",
        location: "",
        description: "",
        adminName: "",
        adminTel: "",
        status: "",
        type: ""
      },
      rulesAdd: {
       
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        organizationNumber: [{ required: true, message: "请输入组织编号", trigger: "blur" }],
        sortWeight: [{ required: true, message: "请选择组织权重", trigger: "blur" }],
           type: [{ required: true, message: "请选择类别", trigger: "change" }],
           status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      formEdit: {
        
      },
      rulesEdit: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 4, message: "长度在 2 到 4 个字符", trigger: "blur" }
        ],
        city: [{ required: true, message: "请输入城市", trigger: "blur" }],
        type: [{ required: true, message: "请选择类别", trigger: "change" }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }]
      },
      formEditTitle: "编辑", //编辑和查看标题
      picUploadTitle: "图片压缩包上传",
      formEditDisabled: false, //编辑弹窗是否可编辑
      tableData: [
        {
          id: this.id,
          organizationNumber: this.organizationNumber,
          name: this.name,
          zipCode: this.zipCode,
          location: this.location,
          sortWeight: this.sortWeight,
          description: this.description,
          adminName: this.adminName,
          adminTel: this.adminTel,
          status: this.status,
          level: this.level,
          path: this.path,
          type: this.type,
          gmtCreate: this.gmtCreate,
          gmtModified: this.gmtModified
        } //表单列表
      ],
      dialogEidtVisible: false, //编辑弹框显示
      dialogAddVisible: false, //添加弹框显示
      dialogUploadVisible: false,
      labelPosition: "right", //lable对齐方式
      labelWidth: "80px", //lable宽度
      formLabelWidth: "120px",
      multipleSelection: []
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
    },
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  mounted() {
    this.showTree();
    // this.getList()
  },
  methods: {
    handleNodeClick(data) {
      let _this = this;
      let table = [];
      let params = {
        id: data.id
      };
      axios.post("api/system/organizations/queryNode", params).then(res => {
        let result = res.data.data;
        if (this.tableData.length > 0) {
          this.tableData.length = 0;
        }
        this.tableData.push(result);
        this.listLoading=false;
      });
    },
    // 组织结构树获取后台数据
    showTree() {
      axios.post("api/system/organizations/init").then(res => {
        let treeValue = res.data.data;
        this.treeData = treeValue.child;
      });
    },
    getList() {
      var that = this;
      axios.post("api/system/organizations/init").then(response => {
        var obj = response.data;
        this.tableData = obj.data.child;
        this.pageValue = obj.data.pageable;
        that.pageInfo.pageTotal = obj.data.totalElements;
      });
    },
    handleTreeSelectChange(data, node) {
      this.formAdd.parentId = data.id;
      this.formAdd.parentName = data.name;
    },

    // 显示格式化
    formStatus(row, column) {
      return row.status == "NORMAL" ? "正常" : "锁定";
    },
    formType(row, column) {
      return row.type == "COMPANY"
        ? "单位"
        : row.type == "DEPARTMENT"
        ? "部门"
        : "班组";
    },
    /**
     * 保存
     */
    save() {
      this.$refs["formAdd"].validate(valid => {
        if (valid) {
          let param = Object.assign({}, this.formAdd);
        this.$api.orgApi
            .orgAdd(param)
            .then(data => {
              if (data && data.data) {
                var json = data.data;
                console.log("json is" + json);
                if (json && json.status == "1") {
                  this.$message({ message: "执行成功", type: "success" });
                  this.dialogAddVisible = false;
                  this.showTree();
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
     * 更新
     */
    update() {
      this.$refs["tableData[0]"].validate(valid => {
        if (valid) {
          let param = Object.assign({}, this.tableData[0]);
        this.$api.orgApi
            .orgUpdate(param)
            .then(data => {
              if (data && data.data) {
                var json = data.data;
                if (json && json.status == "1") {
                  this.$message({ message: "执行成功", type: "success" });
                  this.dialogEidtVisible = false;
                  this.showTree();
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
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
      this.$api.orgApi.orgDelete(id)
            .then(data => {
              this.$message({ message: "执行成功", type: "success" });
              this.showTree();
              return;
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
     * 打开编辑弹窗
     */
    handleEdit(index, rowData) {
      this.formEditTitle = "编辑";
      this.formEditDisabled = false;
      this.formEdit =Object.assign({},rowData) ;
      this.formEdit.gender += ""; //必须转换成字符串才能回显
      this.dialogEidtVisible = true;
    },
    /**
     * 关闭弹框，数据重置
     */
    closeDialog(formName) {
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
      this.pageInfo.currentPage = val - 1;
      this.getList();
    },
    /**
     * 点击选择
     */
    handleSelectionChange(val) {
      /* this.multipleSelection = val;*/
      this.getList();
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
