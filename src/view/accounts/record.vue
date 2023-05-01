<template>
  <!--<div class="records fColor1">
    <el-table v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="records" size="small">
      <el-table-column prop="value" :label="$t('number')" align="center"></el-table-column>
      <el-table-column prop="info" :label="$t('account.record')" align="center">
        <template v-slot="scope">
          {{ lang === 'zh' ? scope.row.info : scope.row[`info_${lang}`] }}
        </template>
      </el-table-column>
      <el-table-column prop="created_time" :label="$t('time')" align="center"></el-table-column>
    </el-table>
    <el-pagination
        layout="prev, pager, next"
        hide-on-single-page
        :current-page.sync="page"
        :total="total"
        @current-change="getRecords"
    ></el-pagination>
  </div>-->
  <div class="account-main wrap">
    <ul class="white log_ul">
      <li class="flex ft14">
        <span class="flex1 tc">{{ $t('number') }}</span>
        <span class="flex1 tc">{{ $t('account.record') }}</span>
        <span class="flex1 tc">{{ $t('time') }}</span>
      </li>
      <div class="li_wrap scroll">
        <li class="flex ft12 around" v-for="(item,index) in log_list" :key="index">
          <span class="flex1 tc">{{ item.value }}</span>
          <span class="flex1 tc">{{ lang === 'zh' ? item.info : item[`info_${lang}`] }}</span>
          <span class="flex1 tc">{{ item.created_time }}</span>
        </li>
        <p class="tc more" @click="getMore">{{ more }}</p>
      </div>
    </ul>

  </div>
</template>

<script>
export default {
  name: 'record',
  data() {
    return {
      more: this.$t('more'),
      page: 1,
      limit: 20,
      log_list: [],
      lang: ''
    }
  },
  created() {
    this.init();
    this.lang = localStorage.getItem('lang')
  },
  methods: {
    getRecords() {
      this.loading = true
      this.$http({
        url: '/api/charge_mention/log',
        method: 'get',
        params: {
          limit: this.limit,
          page: this.page
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        this.loading = false
        if (res.data.type === 'ok') {
          const {data, total} = res.data.message
          this.records = data
          this.total = total
        }
      });
    },
    init() {
      this.$http({
        url: '/api/charge_mention/log',
        method: 'get',
        params: {limit: this.limit, page: this.page},
        headers: {'Authorization': localStorage.getItem('token')},
      }).then(res => {

        if (res.data.type == 'ok') {
          this.log_list = this.log_list.concat(res.data.message.data);
          if (res.data.message.data.length == 0) {
            this.more = this.$t('nodata')
          }
          if (res.data.message.data.length < this.limit) {
            this.more = this.$t('nomore')
          } else if (res.data.message.data.length == this.limit) {
            this.more = this.$t('more')
          }
        } else {
          layer.msg(res.data.message)
        }
      }).catch(error => {
        // console.log(error)
      })
    },
    getMore() {
      this.more = this.$t('loading')
      this.page += 1;
      this.init();
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  overflow: auto;
}

.li_wrap {
  max-height: 600px;
  overflow-y: auto;
}

.log_ul li {
  padding: 15px 0;
}

.log_ul > li:first-child {
  border-bottom: 1px solid #303b4b;
}

.log_ul > li:first-child:hover {
  background: #181b2a;
}

.log_ul li:hover {
  background: #61688a;
}

.more {
  color: #999;
  font-size: 12px;
  margin-top: 10px;
  cursor: pointer;
}

::-webkit-scrollbar {
  background-color: #181b2a;
}

.records {
  padding: 10px;
}

::v-deep .el-table {
  background-color: transparent;

  th, td, tr {
    background-color: transparent;
    border-bottom-color: #1e2c42;
  }

  thead {
    color: white;
  }

  &::before {
    background-color: #1e2c42;
  }
}
</style>
