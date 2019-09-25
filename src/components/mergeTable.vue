<template>
  <div class="hello">
    {{msg}}
    <div>
      <el-table :data="tableData" :span-method="arraySpanMethod" border style="width: 1000px;margin:30px auto;"
        height="575">
        <el-table-column v-for="(item, index) in tableTitleData" :key="index" :prop="item.prop" :label="item.label"
          :min-width="item.minWidth">
          <template slot-scope="scope">
            <span>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { tableTitleData, tableData } from './js/options';
export default {
  name: 'mergeTable',
  data() {
    return {
      msg: '表格合并',
      tableData,
      tableTitleData
    };
  },
  methods: {
    // ====================================== 合并多列单元格逻辑
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // 合并单元格
      /**
       * desc 该方法会触发n次，n是表格data的length*表头data的length;
       * @param  {String} row         [ 当前遍历到的行数据 (后台接口返回的) ]
       * @param  {Object} column      [ 当前遍历到的列数据 (elemen表格对象内置的) ]
       * @param  {Number} rowIndex    [ 当前遍历到的行下标 ]
       * @param  {Number} columnIndex [ 当前遍历到的列下标 ]
       * @return {Object} 包含合并的行和列信息
       */
      //  ================================================================ 分割线
      if (!(this.realTitleData || []).length) {
        this.realTitleData = []; // 这个数组是带children的表头data展开children后的数组
        this.tableTitleData.forEach(val => {
          // 展开存在children的titleData
          if (val.children && (val.children || []).length) {
            val.children.forEach(child => {
              this.realTitleData.push(child);
            });
          } else {
            this.realTitleData.push(val);
          }
        });
      }
      if (!(this.mergeTabelArr || []).length) {
        // 只运行一次，获得要合并的信息数组
        const keywords = ['areaName']; // (这个数组要根据不同表格来配置!!!) 一些prop名的集合，这些porp名代表的字段 在每个做过合并的行数据集合里 它的的值 都是唯一的（比如区域、片区、中心名称之类的）。这个集合用于确保合并信息的唯一性，确保表格不会错乱
        this.mergeTabelArr = this.getMergeTabelArr(
          this.tableData,
          this.realTitleData,
          keywords,
          [0, 1]
        );
        // console.log('完整的合并表格的信息集合', this.mergeTabelArr);
      }
      // if (columnIndex > 0) { // 除掉序号那一列(这里用于自定义过滤某列)，都要合并
      const _rowArr = (
        this.mergeTabelArr.find(n => n.key === column.property) || {}
      ).connect; // connect数组
      if (_rowArr) {
        const _row = _rowArr[rowIndex];
        return {
          rowspan: _row, // 0代表删除这列，1代表展示这列，>1代表合并列
          colspan: _row > 0 ? 1 : 0 // 0代表删除这列，1代表展示这列，>1代表合并列
        };
      }
      // }
    },
    getMergeTabelArr(data = [], titleData = [], keywords = [], colIndexs = []) {
      // 获取合并表格的信息集合
      /**
       * desc 该方法为最终组合‘合并表格的信息集合’的方法
       * @param  {Array}  data                   [ 表格的data ]
       * @param  {Array}  titleData              [ 表格的表头的data ]
       * @param  {Array}  keywords  ['1','a'...] [ 一些prop名的集合，这些porp名代表的字段 在每个做过合并的行数据集合里 它的的值 都是唯一的（比如区域、片区、中心名称之类的）。这个集合用于确保合并信息的唯一性，确保表格不会错乱 ]
       * @param  {Array}  colIndexs [0,1,-2,...] [ 合并规则数组，这个数组里所有的负数值代表不合并的列的下标，正数代表合并的列的下标 ]
       * @return {Array} arr  示例:
       * [
       *   {
       *     key: 'nextSite', // 对应列的prop名
       *     connect: [2, 0, 2, 0, 1]  // connect数组
       *   },
       *   ...
       * ];
       */
      //  ================================================================ 分割线

      const columnArr = colIndexs.length
        ? titleData.filter((n, i) => {
            const index = colIndexs.findIndex(realV => {
              if (realV < 0) return false;
              const v = Math.abs(realV);
              return i === v;
            });
            return index !== -1;
          })
        : []; // 按传递进来的规则过滤

      this.oldMergeTabel = []; // 给this添加oldMergeTabel属性，防止后面报错
      const arr = columnArr.map(v1 => {
        const obj = this.getConnectArr(
          data,
          v1.prop,
          keywords,
          this.oldMergeTabel
        );
        this.oldMergeTabel = obj.connect; // 保存前一条的connect数组信息
        return obj;
      });
      return arr;
    },
    getConnectArr(data, key, keywords, oldMergeTabel) {
      // 获取connect数组
      /**
       * desc 该方法会触发n次，n是过滤后的，要合并的表头data的length;
       * @param  {Array}  data          [ 表格的data数据 ]
       * @param  {String} key           [ 要合并的表头的prop名 ]
       * @param  {Array}  keywords      [ 一些prop名的集合，这些porp名代表的字段 在每个做过合并的行数据集合里 它的的值 都是唯一的（比如区域、片区、中心名称之类的）。这个集合用于确保合并信息的唯一性，确保表格不会错乱 ]
       * @param  {Object} oldMergeTabel [ 前一条组合好的connect数组信息,用于确保表格不会错乱 ]
       * @return {Object} 包含合并的行和列信息（其实就是 ‘合并表格的信息数组’ 的一个成员，看上面getMergeTabelArr方法的示例）
       */
      //  ================================================================ 分割线

      const oldArr = []; // 保存上一个数组
      let oldObj = {}; // 控制只跟上一个元素做对比,不跟整个数组对比

      // 正确的代码
      data.forEach((v, i) => {
        let newObj;
        let newKey = ''; // 保证唯一性的key
        keywords.forEach(k => {
          newKey += `${v[k]}-`;
        });
        newKey += v[key];

        const oldIndex = oldArr.findIndex(n => n.key === newKey); // 保存的数组里是否存在与当前表头数据一样的元素（注意，findIndex找到的是第一个匹配的元素的下标）
        if (oldIndex !== -1 && oldObj.key === newKey) {
          newObj = {
            key: newKey,
            value: 0
          };
          oldArr[oldIndex].value++; // 找到重复项的第一项，值加1
        } else {
          newObj = {
            key: newKey,
            value: 1
          };
        }
        oldArr.push(newObj);
        oldObj = newObj; // 保存当前数据，用作与下一条数据的对比，看是否相同，相同把下一条数据的占用列置成0，这样表格不会错乱
      });
      const connect = oldArr.map(n => n.value);

      if (oldMergeTabel.length) {
        // 控制数组合并。如果有重复项也不能跨越过上一条的合并行
        oldMergeTabel.forEach((oldVal, i) => {
          const newVal = connect[i]; // 新值
          let count = 0; // connect数组各项值的和,
          const rule1 = newVal > oldVal && oldVal > 0;
          const rule2 = newVal < oldVal && newVal === 0;
          if (rule1 || rule2) {
            connect[i] = oldVal;
            connect.forEach(v => {
              count += v;
            }); // 赋值后计算connect数组各项值的和
            if (count > data.length) {
              // connect数组各项值加起来不能超过表格数据data的length,（可能有bug，以后再解决吧，哈哈哈）
              connect[i] = count - data.length;
            }
          }
        });
      }
      return {
        key: key,
        connect: connect
      };
    },
    // 查询数据
    queryData() {
      // 在工作中，一般是要调接口去查询数据，在查询之前，需要将mergeTabelArr置为空数组，然后在执行之后的操作。
      this.mergeTabelArr = [];
      // ...
    }
  }
};
</script>
<style>
.tableHeader {
  background: red !important;
}
</style>