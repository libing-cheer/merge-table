# 前端分页

> 前端分页 在数据量小的情况下，前端分页更好一点。这是一个前端分页的小例子。

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 详细步骤请前往

[24K 博客](https://libing.art/2019/09/16/qian-duan-fen-ye/)

### 1、适合情形

前端分页一般用于数据量较小的情况，一次请求把数据全部从后端请求回来。

### 2、实现关键

使用计算属性对获取的数据进行处理，即`computed`中`frontEndPageChange`方法。`el-table`中的`:data`绑定`frontEndPageChange`。

```javascript
<el-table
  :data="frontEndPageChange"
  stripe
  style="width: 1000px;margin:30px auto;"
  height="550"
>
</el-table>

computed: {
// 计算属性对数据进行处理
frontEndPageChange() {
  const start = (this.paginationOptions.currentPage - 1) * this.paginationOptions.pageSize;
  const end = this.paginationOptions.currentPage * this.paginationOptions.pageSize;
  return this.tableData.slice(start, end);
}
```

### 3、`vue` 文件完整代码

```javascript
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
// 数据来源
import { tableData } from './js/options';
export default {
  name: 'frontEndPage',
  data() {
    return {
      msg: '前端分页',
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
```

### 4、`options.js` 数据来源文件

```javascript
/**
 * 表头配置
 */

const tableData = [
  {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1510 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-04',
    name: '李小虎',
    address: '上海市普陀区金沙江路 1511 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-01',
    name: '孙小虎',
    address: '上海市普陀区金沙江路 1512 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-02',
    name: '朱小虎',
    address: '上海市普陀区金沙江路 1513 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-04',
    name: '钱小虎',
    address: '上海市普陀区金沙江路 1514 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-01',
    name: '杜小虎',
    address: '上海市普陀区金沙江路 1515 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-03',
    name: '赵小虎',
    address: '上海市普陀区金沙江路 1516 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-02',
    name: '陈小虎',
    address: '上海市普陀区金沙江路 1510 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-04',
    name: '吴小虎',
    address: '上海市普陀区金沙江路 1511 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-01',
    name: '徐小虎',
    address: '上海市普陀区金沙江路 1512 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-02',
    name: '黄小虎',
    address: '上海市普陀区金沙江路 1513 弄',
    age: 18,
    height: '180cm'
  },
  {
    date: '2016-05-04',
    name: '秦小虎',
    address: '上海市普陀区金沙江路 1514 弄',
    age: 18,
    height: '180cm'
  }
];
export { tableData };
```

如有疑问可在博客下方评论，会及时给予回复的呦。

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
