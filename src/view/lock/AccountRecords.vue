<template>
  <div class="acbox contentBK">
    <div class="acrecordTitle">
      {{ $t('lock.record') }}
    </div>
    <div class="acrecordList pd20">
      <el-table :data="list" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="$t('lock.more')">
        <el-table-column width="120" align="center" type="index" :label="$t('lock.number')"></el-table-column>
        <el-table-column prop="currency_name" :label="$t('lock.currency')"></el-table-column>
        <el-table-column prop="money" :label="$t('lock.quantity')"></el-table-column>
        <el-table-column prop="interest" :label="$t('lock.interest')"></el-table-column>
        <el-table-column prop="time" :label="$t('lock.time')"></el-table-column>
        <el-table-column prop="totime" :label="$t('lock.etime')"></el-table-column>
        <el-table-column :label="$t('lock.status')">
          <template slot-scope="scope">
            <span class="tag tag-success" v-if="scope.row.state == 1">{{ i18n.inProgress }}</span>
            <span class="tag tag-error" v-else-if="scope.row.state == 2">{{ i18n.redeemed }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          small
          background
          layout="prev, pager, next"
          hide-on-single-page
          :page-size="limit"
          :total="total"
          :current-page.sync="page"
          @current-change="getList"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountRecords',
  data() {
    return {
      list: [],
      loading: false,
      total: 0,
      page: 1,
      limit: 10
    }
  },
  computed: {
    i18n() {
      return this.$t('lockming')
    }
  },
  created() {
    this.getList()
  },
  methods: {
    reload(){
      this.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      this.$http({
        url: '/api/my_mining_machine',
        method: 'get',
        params: {
          page: this.page,
          limit: this.limit
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then((res) => {
        const {message, type} = res.data
        if (type === 'ok') {
          const {data = [], total} = message
          this.list = data
          this.total = total
        }
      }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.pd20 {
  padding: 20px 0;
}

.acbox {
  margin-top: 40px;
  border-radius: 15px;
}

.contentBK {
  background-color: #000;
}

.acrecordTitle {
  padding: 15px 20px;
  color: #c7cce6;
  font-size: 16px;
}

::v-deep .el-table {
  &::before {
    background-color: transparent;
  }

  background-color: transparent;

  th {
    background-color: transparent;
    border-color: transparent;
  }

  tr {
    background-color: transparent;
    border-color: transparent;
  }

  td {
    background-color: transparent;
    border-color: transparent;
  }
}
::v-deep .el-pagination{
  text-align: center;
  margin-top: 12px;
}
</style>
