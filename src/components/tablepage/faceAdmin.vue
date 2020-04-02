<template>
  <div class="container">
    <el-form
      :label-position="labelPosition"
      :label-width="labelWidth"
      :inline="true"
      :size="size"
      ref="formSearch"
      :model="formSearch"
    >
      <el-form-item prop="name">
        <el-input v-model="queryId" style="width:400px" placeholder="请输入图片版本号"></el-input>
      </el-form-item>
      <el-form-item label=" " style="margin-left:50px">
        <el-button type="primary" @click="queryRowByVersion()">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格---start -->
    <el-table :data="tableData" v-loading="listLoading" size="small" stripe style="width:100%">
      <el-table-column type="selection" width="40"></el-table-column>

      <el-table-column prop="thumbnailPath" label="缩略图" align="center" width="180">
        <template slot-scope="scope">
          <img width='80px' height="80px" :src="getImgUrl(scope.row)">
        </template>
      </el-table-column>

      <el-table-column prop="realImagePath" label="图片" align="center" width="180">
         <template slot-scope="scope">
          <img width='80px' height="80px" :src="getImgUrl(scope.row)">
        </template>
      </el-table-column>

      <el-table-column prop="characteristicFilePath" label="特征文件路径" width="150" align="center"></el-table-column>

      <el-table-column prop="registerStatus" label="注册状态" :formatter="registerStatus" align="center" width="180"></el-table-column>

      <el-table-column prop="imageStatus" label="图片状态" :formatter="imageStatus" align="center" width="100"></el-table-column>

      <el-table-column prop="id" label="访客ID" align="center" width="150"></el-table-column>

      <el-table-column prop="userId" label="员工ID" align="center"></el-table-column>

      <el-table-column prop="mapDepotVersion" label="版本" align="center" width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="scope">
          <el-button size="mini" plain type="danger" @click="deleteItem(scope.$index, scope.row)">删除</el-button>
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
import faceUserApi from "../../apis/modules/faceUserApi";

export default {
  name: "messageboard",
  data() {
    return {
      size:'small',
      listLoading: false, //

      labelPosition: "right", //lable对齐方式
      labelWidth: "80px", //lable宽度
      formSearch:{},
      pageInfo: {
        //分页
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        pageSizes: [5, 10, 15]
      },
      tableData: [],
      queryId: "",
      queryResult: "sdds"
    };
  },
  computed: {},
  mounted() {
    this.initPage();
  },
  methods: {
    getImgUrl(row){
        return 'api/image/'+row.realImagePath
    },
        getImgUrl2(row){
        return 'api/image/'+row.realImagePath
    },
    removeCurrentRow(id) {
      faceUserApi
        .removeFaceUserItem(id)
        .then(function(response) {
          console.log(response);
          this.initPage();
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    initPage() {
      faceUserApi
        .getFaceUserInfoList(this.pageInfo.currentPage,this.pageInfo.pageSize)
        .then(res => {
          let result = res.data;
          this.tableData = result.data.pageData;
          this.pageInfo.pageTotal=result.data.total;
        });
    },

    deleteItem(index, row) {
      faceUserApi.removeFaceUserItem(row.id);
      this.initPage();
      // TODO: 删除成功
    },

    updateRegisterStatus(index, row) {
      let status = row.registerStatus;

      if (status === "YES") {
        status = "NO";
      } else {
        status = "YES";
      }

      faceUserApi
        .updateFaceUserRegisterStatus(row.id, status)
        .then(response => {
          row.registerStatus = status;
        });
    },
    queryRowByVersion() {
      let pageNumber = this.pageInfo.currentPage;
         let pageSize = this.pageInfo.pageSize;
      let version = this.queryId;
      console.log('pageinfo is:'+pageNumber)
      faceUserApi
        .getFaceUserInfoListByVersion(version, pageNumber,pageSize)
        .then(res => {
          let result = res.data;
          if (result.status == 1) {
            this.tableData = result.data.pageData;
          } else {
            this.$message({ message: "未查询到该数据，请重试", type: "error" });
          }
        })
        .catch(err => {
          this.$message({ message: "执行失败，请重试", type: "error" });
        });
    },
    queryRowById() {
      faceUserApi.findFaceUserInfoById(this.queryId).then(response => {
        let data = data;
        if (data.status === 1) {
          // TODO 成功处理
        } else {
          // TODO 失败处理
        }
      });
    },

    // TODO 根据版本信息查询  版本格式以及界面信息确定后再做

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
    registerStatus(row,column){
        return row.registerStatus=='YES'? '注册':'未注册'
    },
    imageStatus(row,column){
        return row.imageStatus=="NORMAL" ? '正常':'锁定'
    }

  }
};
</script>
