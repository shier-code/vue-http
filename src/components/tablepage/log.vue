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
        <el-date-picker
          value-format="timestamp"
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label=" " style="margin-left:30px">
        <el-button type="primary" @click="searchDate">查询</el-button>
               <el-button type="primary" @click="logDownload">日志下载</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询区----end -->
    <!-- 表格---start -->
    <el-table
      :data="tableData"
      v-loading="listLoading"
      size="small"
      stripe
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="logType" label="日志类型" width="150" align="center" sortable>
        <template slot-scope="scope">
         <span>{{ scope.row.logType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="logTitle" label="标题" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.logTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="valueCode" label="操作结果" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.valueCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="requestURL" label="请求地址" align="center" min-width="450">
        <template slot-scope="scope">
          <span>{{ scope.row.requestURL}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operatorIp" label="操作ip" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.operatorIp}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gmtModified" label="操作时间" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtModified}}</span>
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
  visibility: hidden;
  height: 0;
}
.clearfloat {
  zoom: 1;
}
</style>

<script>
import apis from "../../apis/apis";
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
       let param={
          pageNo: this.pageInfo.currentPage,
          pageSize: this.pageInfo.pageSize
       }
     this.$api.logApi.getList(param).then(res => {
        var result = res.data;
        this.tableData = result.data.pageData;
        this.pageInfo.pageTotal = result.data.total;
      });
    },

     logDownload(){
        var fromTime = this.dateValue[0];
      var toTime = this.dateValue[1] + 86399999;
       let data={
         fromTime: fromTime,
         toTime: toTime
       }
       axios({
         method:'post',
         url:'/api/logs/export',
         data:data,
           responseType: "blob"
      
       }).then(res=>{
         this.download(res)
       })
     },
       download (data) {
        if (!data) {
            return
        }
              let blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=utf-8'})

	let url = window.URL.createObjectURL(blob);

        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'log.xlsx')

        document.body.appendChild(link)
        link.click()
    },
    searchDate() {
      let token = sessionStorage.getItem("token")

      var fromTime = this.dateValue[0];
      var toTime = this.dateValue[1] + 86399999;
     let param={
        fromTime: fromTime,
          toTime: toTime,
          pageNo: this.pageInfo.currentPage,
          pageSize: this.pageInfo.pageSize
     }
   this.$api.logApi.getList(param).then(res => {
        let result = res.data;
        if (result.status == 1) {
          this.tableData = result.data.pageData;
          this.pageInfo.pageTotal = result.data.total;
        }
      });
    },
    // z设备状态格式化
    formStatus(row, column) {
      return row.status === "NORMAl"
        ? "启用"
        : row.status === "BREAKDOWN"
        ? "损坏"
        : "游离";
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
