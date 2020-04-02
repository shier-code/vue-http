<template>
  <div class="container">
  
    <!-- 表格---start -->
  
    <el-table
      :data="tableData"
      v-loading="listLoading"
      stripe
      size="small"
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <table-tree-column prop="modelName" label="资源名称" width="150" align="left">
      </table-tree-column>
      <el-table-column prop="sortWeight" label="权重" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.sortWeight}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" :formatter="formStatus" min-width="100">
      </el-table-column>
      <el-table-column prop="type" label="类型" align="center"  :formatter="formType" width="50">
      </el-table-column>
      <el-table-column prop="url" label="url" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="verification" label="验证" align="center" :formatter="formVerification" width="200">
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" align="center" width="200"> 
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
  </div>
</template>

<style lang="scss">
// 设置输入框的宽度
.el-form-item__content {
  width: 220px;
}
.clearfloat::after{
    display: block;
    clear:both;
    content:'';
    visibility:hidden;
    height:0
}
.clearfloat{
    zoom:1
}
</style>

<script>
import apis from "../../apis/apis";
import TableTreeColumn from "@/components/core/TableTreeColumn"
export default {
  name: "messageboard",
  components:{
   TableTreeColumn
  },
  data() {
    return {
      size:'small',
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
      },
      dateValue: "",
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
          { min: 2, max: 4, message: "长度在 2 到 4 个字符", trigger: "blur" }
        ],
        secretKey: [{ required: true, message: "请输入密钥", trigger: "blur" }],
        equipmentPort: [
          { required: true, message: "请选择端口", trigger: "change" }
        ]
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
      let token = sessionStorage.getItem('token');
            let config={
                 headers:{'Authorization':token}
            }
            axios({
              method:'post',
              url:'/api/system/resources/list',
              headers:{'Authorization':token}
            }).then((res)=>{
              var json=res.data.data;
              this.tableData=json;
              this.menuLoading=false;
            })
    },
    // 设备状态格式化
    formStatus(row, column) {
      return row.status == "NORMAL"
        ? "启用": "锁定";
    },
        formType(row, column) {
      return row.type == "0"
        ? "菜单": "按钮";
    },
    formVerification(row,column){
        return row.verification ==true?"正常":"错误";
    },
    /**
     * 查询列表
     */
    onSearch() {
      this.listLoading = true;
      if (this.formSearch.createtime) {
        this.formSearch.startdate = this.formSearch.createtime[0];
        this.formSearch.enddate = this.formSearch.createtime[1];
      }
      let param = Object.assign({}, this.formSearch, this.pageInfo);
      apis.msgApi
        .getList(param)
        .then(data => {
          this.listLoading = false;
          if (data && data.data) {
            var json = data.data;
            if (json.status == "SUCCESS") {
              this.pageInfo.pageTotal = json.total;
              this.tableData = json.data;
            } else if (json.message) {
              this.$message({ message: json.message, type: "error" });
            }
          }
        })
        .catch(err => {
          this.listLoading = false;
          this.$message({ message: "查询异常，请重试", type: "error" });
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
      this.formEdit = rowData;
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
