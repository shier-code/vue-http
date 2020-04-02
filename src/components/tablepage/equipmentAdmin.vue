<template>
  <div class="container">
    <!-- 查询区----start -->
    <el-form
      :label-position="labelPosition"
      :label-width="labelWidth"
      :size="size"
      :inline="true"
      ref="formSearch"
      :model="formSearch"
      class="demo-form-inline"
    >
      <el-form-item prop="name">
        <el-input v-model="formSearch.modelName" style="width:400px" placeholder="请输入设备编号、型号、相机类型"></el-input>
      </el-form-item>

      <el-form-item label=" " style="margin-left:50px">
        <el-button type="primary" @click="searchModelName">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询区----end -->
    <!-- 操作区----start -->
    <el-row class="mgb15">
      <el-button size="mini" type="primary" @click="dialogAddVisible = true">新增</el-button>
      <el-button size="mini" plain type="danger" @click="deleteMany">批量删除</el-button>
    </el-row>
    <!-- 操作区----end -->
    <!-- 表格---start -->
    <el-table
      :data="tableData"
      v-loading="listLoading"
      :size="size"
      stripe
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="equipmentNumber" label="设备编号" min-width="150" align="center" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.equipmentNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modelNumber" label="型号" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.modelNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="softwareVersion" label="软件版本" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.softwareVersion}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipmentPort" label="设备端口" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.equipmentPort}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cameraType" label="相机类型" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.cameraType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="账户" align="center" width="150"></el-table-column>
      <el-table-column prop="status" label="状态 " align="center" :formatter="formStatus" width="150"></el-table-column>
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
    <!-- 表格---end -->
    <!-- 编辑弹框---start -->
    <el-dialog :title="formEditTitle" :visible.sync="dialogEidtVisible" width="700px">
      <el-form
        :label-position="labelPosition"
        :label-width="labelWidth"
        :size="size"
       :rules="rulesAdd"
        :disabled="formEditDisabled"
        :inline="true"
        ref="formEdit"
        :model="formEdit"
        class="demo-form-inline"
      >
        <el-form-item label="设备编号" prop="equipmentNumber">
          <el-input v-model="formEdit.equipmentNumber" placeholder="设备编号"></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="modelNumber">
          <el-input v-model="formEdit.modelNumber" placeholder="型号"></el-input>
        </el-form-item>
        <el-form-item label="软件版本" prop="softwareVersion">
          <el-input v-model="formEdit.softwareVersion" placeholder="软件版本"></el-input>
        </el-form-item>
        <el-form-item label="设备端口" prop="equipmentPort">
          <el-input v-model="formEdit.equipmentPort" placeholder="设备端口"></el-input>
        </el-form-item>
        <el-form-item label="相机型号" prop="cameraType">
          <el-input v-model="formEdit.cameraType" placeholder="相机型号"></el-input>
        </el-form-item>
        <el-form-item label="账户" prop="account">
          <el-input v-model="formEdit.account" placeholder="账户"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formEdit.status" placeholder="状态">
            <el-option label="正常" value="NORMAL"></el-option>
            <el-option label="损坏" value="BREAKDOWN"></el-option>
            <el-option label="游离" value="DETACHED"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEidtVisible = false" size="mini">取 消</el-button>
        <el-button v-if="!formEditDisabled" type="primary" size="mini" @click="update">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹框---end -->
    <!-- 新增弹框---start -->
    <el-dialog
      title="新增设备"
      :visible.sync="dialogAddVisible"
      width="700px"
      @close="closeDialog('formAdd')"
    >
      <el-form
        :label-position="labelPosition"
        :label-width="labelWidth"
        :rules="rulesAdd"
        :size="size"
        :inline="true"
        :model="formAdd"
        ref="formAdd"
        class="demo-form-inline"
      >
        <el-form-item label="设备编号" prop="equipmentNumber">
          <el-input v-model="formAdd.equipmentNumber" placeholder="设备编号"></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="modelNumber">
          <el-input v-model="formAdd.modelNumber" placeholder="型号"></el-input>
        </el-form-item>
        <el-form-item label="软件版本" prop="softwareVersion">
          <el-input v-model="formAdd.softwareVersion" placeholder="软件版本"></el-input>
        </el-form-item>
        <el-form-item label="设备端口" prop="equipmentPort">
          <el-input v-model="formAdd.equipmentPort" placeholder="设备端口"></el-input>
        </el-form-item>
        <el-form-item label="账户" prop="account">
          <el-input v-model="formAdd.account" placeholder="账户"></el-input>
        </el-form-item>
        <el-form-item label="相机型号" prop="cameraType">
          <el-input v-model="formAdd.cameraType" placeholder="相机型号"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formAdd.status" placeholder="状态">
            <el-option label="正常" value="NORMAL"></el-option>
            <el-option label="损坏" value="BREAKDOWN"></el-option>
            <el-option label="游离" value="DETACHED"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="save">确 定</el-button>
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
import equipmentApi from "../../apis/modules/equipmentApi";
export default {
  name: "messageboard",
  data() {
    return {
      size: "small",
      listLoading: false, //
      tableData: [
        //表单列表
      ],
      pageInfo: {
        //分页
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        pageSizes: [5, 10, 15]
      },
      formSearch: {
        //表单查询

        modelName: "",
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
        equipmentNumber: "",
        modelNumber: "",
        softwareVersion: "",
        equipmentPort: "",
        account: "",
        cameraType: "",
        status: ""
      },
      rulesAdd: {
        equipmentNumber: [
          { required: true, message: "请输入设备编号", trigger: "blur" },
        ],
        modelNumber: [
          { required: true, message: "请输入型号", trigger: "blur" }
        ],
        softwareVersion: [
          { required: true, message: "请输入软件版本", trigger: "blur" }
        ],
         equipmentPort: [
          { required: true, message: "请输入设备端口", trigger: "blur" }
        ],
        account: [
          { required: true, message: "请输入帐户名", trigger: "blur" }
        ],
        cameraType: [
          { required: true, message: "请输入相机型号", trigger: "blur" }
        ],
          status: [
          { required: true, message: "请选择设备状态", trigger: "change" }
        ],
      },
      formEdit: {
        //表单编辑
        equipmentNumber: "",
        modelNumber: "",
        softwareVersion: "",
        equipmentPort: "",
        account: "",
        cameraType: "",
        status: ""
      },
      rulesEdit: {},
      formEditTitle: "编辑", //编辑和查看标题
      formEditDisabled: false, //编辑弹窗是否可编辑
      dialogEidtVisible: false, //编辑弹框显示
      dialogAddVisible: false, //添加弹框显示
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
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$api.equipmentApi
        .getList(this.pageInfo.currentPage, this.pageInfo.pageSize)
        .then(res => {
          var result = res.data;
          this.tableData = result.data.pageData;
          this.pageInfo.pageTotal = result.data.total;
        });
    },

    searchModelName() {
      let param = {
        pageNo: this.pageInfo.currentPage,
        pageSize: this.pageInfo.pageSize,
        modelNumber: this.formSearch.modelName
      };
      this.$api.equipmentApi.search(param).then(res => {
        let result = res.data;
        this.tableData = result.data.pageData;
      });
    },
    /**
     * 保存
     */
    save() {
      this.$refs["formAdd"].validate(valid => {
        if (valid) {
          let param = {
            equipmentNumber: this.formAdd.equipmentNumber,
            modelNumber: this.formAdd.modelNumber,
            softwareVersion: this.formAdd.softwareVersion,
            equipmentPort: this.formAdd.equipmentPort,
            account: this.formAdd.account,
            cameraType: this.formAdd.cameraType,
            status: this.formAdd.status
          };
          this.$api.equipmentApi
            .equipmentAdd(param)
            .then(res => {
              var result = res.data;
              if (result.status == "1") {
                this.$message({ message: "执行成功", type: "success" });
                this.dialogAddVisible = false;
                this.getList();
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
     * 更新
     */
    update() {
      this.$refs["formEdit"].validate(valid => {
        if (valid) {
          let param = {
            id: this.formEdit.id,
            equipmentNumber: this.formEdit.equipmentNumber,
            modelNumber: this.formEdit.modelNumber,
            softwareVersion: this.formEdit.softwareVersion,
            equipmentPort: this.formEdit.equipmentPort,
            account: this.formEdit.account,
            cameraType: this.formEdit.cameraType,
            status: this.formEdit.status
          };

          this.$api.equipmentApi
            .update(param)
            .then(res => {
              var result = res;
              console.log("res is" + res.data.status);
              if (res.data.status == "1") {
                this.$message({ message: "执行成功", type: "success" });
                this.dialogEidtVisible = false;
                this.getList();
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
          let param = {
            id: id,
            pageNo: this.pageInfo.currentPage,
            pageSize: this.pageInfo.pageSize
          };
          this.$api.equipmentApi
            .delete(param)
            .then(data => {
              this.$message({ message: "删除成功", type: "success" });
              this.getList();
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
     * 批量删除
     */
    deleteMany() {
      var ids = this.multipleSelection.map(item => item.id);
      let deleteIds = ids.join(",");
      let token = sessionStorage.getItem("token");
      if (ids.length == 0) {
        this.$message({ message: "请选择要删除的项", type: "warn" });
        return;
      }
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
        this.$api.equipmentApi.deleteMany(param)
            .then(res => {
              let result = res.data;
              if (result.status == 1) {
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
    // z设备状态格式化
    formStatus(row, column) {
      return row.status == "NORMAL"
        ? "正常"
        : row.status === "BREAKDOWN"
        ? "损坏"
        : "游离";
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
      this.formEdit.gender += ""; //必须转换成字符串才能回显
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
    }
  }
};
</script>
