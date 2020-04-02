<template>
  <div class="container">

    <!-- 操作区----start -->
    <el-row class="mgb15">
      <el-button size="mini" type="primary" @click="dialogAddVisible = true">新增</el-button>
    </el-row>
    <!-- 操作区----end -->
    <!-- 表格---start -->
    <el-table
      :data="tableData"
      v-loading="listLoading"
      :size="size"
      stripe
      style="width:100%"
      ref="singleTable"
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="id" width="150" align="center" sortable>
        <template slot-scope="scope">
          <span href style="color: #00D1B2">{{ scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="角色名" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center" min-width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.remark}}</span>
        </template>
      </el-table-column>
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
        :total="pageInfo.pageTotal"
        :page-size="pageInfo.pageSize"
        :page-sizes="pageInfo.pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <div style="clear:both"></div>

    <!-- 表格---end -->
    <!-- 编辑弹框---start -->
    <el-dialog :title="formEditTitle" :visible.sync="dialogEditVisible" width="700px">
      <el-form
        :label-position="labelPosition"
        :label-width="labelWidth"
        :rules="rulesAdd"
        :disabled="formEditDisabled"
        :inline="true"
        :size="size"
        ref="formEdit"
        :model="formEdit"
        class="demo-form-inline"
      >
        <el-form-item label="角色组id" prop="id">
          <el-input v-model="formEdit.id" placeholder="角色组id" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="formEdit.name" placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formEdit.remark" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible=false" :size="size">取 消</el-button>
        <el-button v-if="!formEditDisabled" type="primary" @click="update" :size="size">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹框---end -->
    <!-- 新增弹框---start -->
    <el-dialog
      title="新增权限组"
      :visible.sync="dialogAddVisible"
      width="700px"
      @close="closeDialog('formAdd')"
    >
      <el-form
        :label-position="labelPosition"
        :label-width="labelWidth"
        :rules="rulesAdd"
        :inline="true"
        :size="size"
        :model="formAdd"
        ref="formAdd"
        class="demo-form-inline"
      >
        <el-form-item label="角色名" prop="name">
          <el-input v-model="formAdd.name" placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formAdd.remark" placeholder="备注"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="menu-container" :v-if="true">
            <div class="menu-header-add">
              <h3>权限添加</h3>
            </div>
            <div style="height:150px;width:650px;overflow-y:scroll">
              <el-tree
                :data="menuDataAdd"
                size="mini"
                show-checkbox
                node-key="id"
                ref="menuTreeAdd"
                :props="defaultProps"
                default-expand-all
                style="width: 100%;"
                :render-content="renderContentAdd"
                @check-change="handleMenuCheckChangeAdd"
                v-loading="menuLoading"
                element-loading-text="拼命加载中"
              ></el-tree>
            </div>

            <div></div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible=false" :size="size">取 消</el-button>
        <el-button type="primary" @click="save" :size="size" :disabled="resStatus==false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增弹框---end -->
    <!-- 角色权限配置 --start -->
    <div class="menu-container" :v-if="true">
      <div class="menu-header">
        <span>
          <B>角色权限配置</B>
        </span>
      </div>
      <div style="padding-left:24px;padding-top:12px;padding-bottom:4px;">
        <el-checkbox
          v-model="checkAll"
          @change="handleCheckAll"
          :disabled="this.selectRole.id == null"
        >
          <b>全选</b>
        </el-checkbox>
      </div>
      <div>
        <el-tree
          :data="menuData"
          size="mini"
          show-checkbox
          node-key="id"
          ref="menuTree"
          :props="defaultProps"
          default-expand-all
          style="width: 100%;pading-top:20px;"
          :render-content="renderContent"
          @check-change="handleMenuCheckChange"
          v-loading="menuLoading"
          element-loading-text="拼命加载中"
        ></el-tree>
      </div>
      <div style="float:right;padding-right:15px;clear:both">
        <el-button
          size="mini"
          type="primary"
          :disabled="this.selectRole.id == null || this.resStatus==false"
          @click="submitAuthForm"
        >提交</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="this.selectRole.id == null"
          @click="resetSelection"
        >重置</el-button>
      </div>
      <div></div>
    </div>

    <!--  角色权限配置 --end -->
  </div>
</template>

<style lang="scss">
// 设置输入框的宽度
.el-form-item__content {
  width: 220px;
}
.menu-container {
  margin-top: 10px;
}
.menu-header {
  padding-left: 8px;
  padding-bottom: 5px;
  text-align: left;
  font-size: 16px;
  color: rgb(20, 89, 121);
}
.menu-header-add {
  padding-left: 20px;
}
.container {
  border-bottom: 0px;
}
</style>

<script>
import apis from "../../apis/apis";
import Axios from "axios";
import faceUserApi from '../../apis/modules/faceUserApi';

export default {
  name: "messageboard",
  components: {},
  data() {
    return {
      size: "small",
      listLoading: false, //
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
        name: "",
        remark: ""
      },
      rulesAdd: {
       name: [
          { required: true, message: "请输入角色组名", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入备注", trigger: "blur" },
        ],
      },
      formEdit: {
        //表单编辑
        id: "",
        name: "",
        remark: ""
      },
      rulesEdit: {},
      formEditTitle: "编辑", //编辑和查看标题
      formEditDisabled: false, //编辑弹窗是否可编辑
      tableData: [
        {
          id: this.id,
          name: this.name,
          resources: this.resources
        }
        //表单列表
      ],
      dialogEditVisible: false, //编辑弹框显示
      dialogAddVisible: false, //添加弹框显示
      labelPosition: "right", //lable对齐方式
      labelWidth: "80px", //lable宽度
      formLabelWidth: "120px",
      multipleSelection: [],
      //权限模块
      menuData: [],
      menuDataAdd: [],
      menuSelections: [],
      selectRole: {},
      menuLoading: false,
      authLoading: false,
      checkAll: false,
      resStatus:false,
      currentRoleMenus: [],
      defaultProps: {
        children: "children",
        label: "modelName"
      }
    };
  },
  computed: {
    submitType:function(){
      return this.rolesSubmit.id==null
    }
  },
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
    this.showList();
  },
  methods: {
    renderContentAdd(h, { node, data, store }) {
      return (
        <div class="column-container">
          <span style="text-algin:center;display:inline-block; width:80px">
            {data.modelName}
          </span>
          <span style="text-algin:left;margin-right:80px;">
            <el-tag
              type={data.type === 0 ? "" : data.type === 1 ? "success" : "info"}
              size="small"
            >
              {data.type === 0 ? "菜单" : data.type === 1 ? "按钮" : "按钮"}
            </el-tag>
          </span>
          <span style="text-algin:center;margin-right:100px;">
            {" "}
            <i class={data.icon} />
          </span>
          <span style="text-algin:center;margin-right:80px;">
            {data.parentId == 0 ? "顶级菜单" : "子集菜单"}
          </span>
        </div>
      );
    },

    renderContent(h, { node, data, store }) {
      return (
        <div class="column-container">
          <span style="text-algin:center;display:inline-block; width:70px">
            {data.modelName}
          </span>
          <span style="text-algin:center;margin-right:80px;">
            <el-tag
              type={data.type === 0 ? "" : data.type === 1 ? "success" : "info"}
              size="mini"
            >
              {data.type === 0 ? "菜单" : data.type === 1 ? "页面" : "按钮"}
            </el-tag>
          </span>
          <span style="text-align:center;margin-right:80px;">
            {" "}
            <i class={data.icon} />
          </span>
          <span style="text-align:center;margin-right:80px;">
            {data.parentId == 0 ? "顶级菜单" : "子集菜单"}
          </span>
          <span style="text-align:left;margin-right:100px;display:inline-block;width:250px">
            {data.url ? data.url : "\t"}
          </span>
            <span style="text-align:left;display:inline-block;width:150px">
            {data.remark ? data.remark : "\t"}
          </span>
        </div>
      );
    },
    //  树节点选择监听
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row, id);
    },
    // 角色组选中监听
    handleCurrentChange(val) {
      if (val == null) {
        return;
      }
      this.selectRole = val;
      let params = {
        id: val.id
      };
      axios.post("/api/role/" + val.id, params).then(res => {
        sessionStorage.setItem("id", this.selectRole.id);
        console.log("res is " + res.data.data[0].resources);
        this.currentRoleMenus = res.data.data[0].resources;
        this.$refs.menuTree.setCheckedNodes(res.data.data[0].resources);
      });
    },
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        let id = data.id;
        this.$refs.menuTree.setChecked(id, true, false);
        if ((this.$refs.menuTree.getCheckedNodes().length>0)) {
      this.resStatus=true
        }
      }
       else {
        console.log('node is'+this.$refs.menuTree.getCheckedNodes().length)
        if (this.$refs.menuTree.getCheckedNodes().length == 0) {
      this.resStatus=false
        }
      }
    },
    handleMenuCheckChangeAdd(data, check, subCheck) {
      if (check) {
        let id = data.id;
        this.$refs.menuTreeAdd.setChecked(id, true, false);
       if(this.$refs.menuTreeAdd.getCheckedNodes().length>0){
            this.resStatus=true
          }}
        else{
          if(this.$refs.menuTreeAdd.getCheckedNodes().length==0){
            this.resStatus=false
          }
        }  
    
  
      
    },
    submitAuthForm() {
      let token = sessionStorage.getItem("token");
      let roleId = sessionStorage.getItem("id");
      let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true);
      let roleMenus = [];
      for (let i = 0; i < checkedNodes.length; i++) {
        let roleMenu = checkedNodes[i].id;
        roleMenus.push(roleMenu);
      }
      let c = roleMenus.join(",");
      let param = {
        id: roleId,
        resList: c
      };
      this.$api.permissionApi.rolesSubmit(param).then(res => {
        if (res.data.status == 1) {
          this.$message({ message: "操作成功", type: "success" });
        } else {
          this.$message({ message: "操作失败" });
        }
      });
    },

    showTree() {
      this.menuLoading = true;
      this.$api.permissionApi.showTree().then(res => {
        var json = res.data.data;
        this.menuData = json;
        this.menuDataAdd = json;
        this.menuLoading = false;
      });
    },
    showList() {
      let param = {
        pageNo: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize
      };
      this.$api.permissionApi.showList(param).then(res => {
        let result = res.data;
        this.tableData = result.data.pageData;
        this.pageInfo.pageTotal = result.data.total;
      });
    },
    handleCheckAll() {
      if (this.checkAll) {
        let allMenus = [];
        this.checkAllMenus(this.menuData, allMenus);
        this.$refs.menuTree.setCheckedNodes(allMenus);
      } else {
        this.$refs.menuTree.setCheckedNodes([]);
      }
    },
    checkAllMenus(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu);
        if (menu.children) {
          this.checkAllMenus(menu.children, allMenus);
        }
      });
    },
    resetSelection() {
      this.checkAll = false;
      this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus);
    },
    /**
     * 保存
     */
    save() {
      this.$refs["formAdd"].validate(valid => {
        if (valid) {
          let roleId = sessionStorage.getItem("id");
          let checkedNodes = this.$refs.menuTreeAdd.getCheckedNodes(
            false,
            true
          );
          let token = sessionStorage.getItem("token");
          let roleMenus = [];
          for (let i = 0; i < checkedNodes.length; i++) {
            let roleMenu = checkedNodes[i].id;
            roleMenus.push(roleMenu);
            console.log('rolemenus length is:'+roleMenus.length)
          }
          let list = roleMenus.join(",");
          let param = {
            name: this.formAdd.name,
            remark: this.formAdd.remark,
            resList: list,
            id: roleId
          };
          this.$api.permissionApi
            .roleAdd(param)
            .then(data => {
              var json = data.data;
              if (json.status == "1") {
                this.$message({ message: "执行成功", type: "success" });
                this.dialogAddVisible = false;
                this.showList();
                return;
              }
            })
            .catch(err => {
              this.$message({ message: "执行失败，请重试", type: "error" });
            });
        }
      });
    },
    closeEditDialog(){

    
      dialogEditVisible=false
      this.showList();
      debugger
      return
    },
    /**
     * 更新
     */
    update() {
      this.$refs["formEdit"].validate(valid => {
        if (valid) {
          let param = Object.assign({}, this.formEdit);
          this.$api.permissionApi
            .roleUpdate(param)
            .then(data => {
              var json = data.data;
              if (json.status == "1") {
                this.$message({ message: "执行成功", type: "success" });
                this.dialogEditVisible = false;
                this.showList();
                return;
              }
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
          let param={
            id:id,
             pageNo: this.pageInfo.currentPage,
            pageSize: this.pageInfo.pageSize
          }
          this.$api.permissionApi.roleDelete(id)
          // axios
          //   .post("/api/role/delete/" + id)
            .then(data => {
              if (data.data.status == 1) {
                this.$message({ message: "删除成功", type: "success" });
                 this.showList();
                 return
               // location.reload();
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
      let ids = this.multipleSelection.map(item => item.id);
   
      if (ids.length == 0) {
        this.$message({ message: "请选择要删除的项", type: "warn" });
        return;
      }
    let deleteIds=ids.join(',')
      this.$confirm("此操作将批量永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            let param={
            ids:deleteIds,
             pageNo: this.pageInfo.currentPage,
            pageSize: this.pageInfo.pageSize
          }
          this.$api.permissionApi
            .deleteMany(param)
            .then(data => {
              this.$common.isSuccess(data, () => {
              
              });
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
    /**
     * 打开编辑弹窗
     */
    handleEdit(index, rowData) {
      this.formEditTitle = "编辑";
      this.formEditDisabled = false;
      this.formEdit =Object.assign({},rowData)
      this.formEdit.gender += ""; //必须转换成字符串才能回显
      this.dialogEditVisible = true;
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
      this.showList();
    },
    /**
     * 分页切换
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.showList();
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
