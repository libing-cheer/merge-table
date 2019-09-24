<template>
  <div class="hello">
    {{msg}}
    <div>
      <el-table
        :data="frontEndPageChange"
        stripe
        style="width: 1000px;margin:30px auto;"
        height="550"
      >
        <el-table-column
          prop="date"
          label="日期"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="190"
        >
        </el-table-column>

        <el-table-column
          label="个人信息"
          width="180"
          align="center"
        >
          <el-table-column
            prop="age"
            label="年龄"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="height"
            label="身高"
            align="center"
          >
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            class="z-pagination"
            :current-page="paginationOptions.currentPage"
            :page-size="paginationOptions.pageSize"
            :page-sizes="paginationOptions.pageSizes"
            layout="sizes, prev, pager, next, jumper,total"
            :total="tableData.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { tableData } from './js/options';
export default {
  name: 'mergeTable',
  data() {
    return {
      msg: '表格合并',
      paginationOptions: {
        currentPage: 1, // 当前页
        pageSize: 10, // 展示页数
        pageSizes: [10, 20, 30, 40] // 可选择展示页数 数组
      },
      tableData,
    }
  },
  computed: {
    // 计算属性对数据进行处理
    frontEndPageChange() {
      const start = (this.paginationOptions.currentPage - 1) * this.paginationOptions.pageSize;
      const end = this.paginationOptions.currentPage * this.paginationOptions.pageSize;
      return this.tableData.slice(start, end);
    }
  },
  methods: {
    // 改变分页数量
    handleSizeChange(val) {
      this.paginationOptions.pageSize = val;
    },
    // 改变当前页
    handlePageChange(val) {
      this.paginationOptions.currentPage = val;
    }
  }
}
</script>