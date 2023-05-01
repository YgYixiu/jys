<template>
  <div class="entrust">
    <!-- <div class="title fColor1"> -->
      <!-- <div class="tab_title">
          <span>{{$t('center.cdel')}}</span>
      </div> -->
      <!-- <div class="tab_title fl ft12">
        <span v-for="(way,index) in wayList" :class="{'active': index == isChoosed}" @click="wayChoose(index,way.url)">{{
            way.title
          }}</span>
      </div> -->
    <!-- </div> -->
    <div class="content" style="min-height: 310px">
      <ul class="list-title fColor2 ft12 flex">
        <li class="w30">{{ $t('time') }}</li>
        <li class="w11">{{ $t('center.pairs') }}</li>
        <li class="w8">{{ $t('center.direction') }}</li>
        <li class="w11">{{ $t('number') }}</li>
        <li class="w11">{{ $t('price') }}</li>
        <li class="w8 tr">{{ $t('do') }}</li>
      </ul>
      <div class="containers scroll" v-if="inList.length>0">
        <ul class="list-item fColor1 ft12">
          <li v-for="(item,index) in inList" class="clear">
            <span class="fl w30">{{ item.create_time }}</span>
            <span class="fl w11">{{ item.currency_name }}/{{ item.legal_name }}</span>
            <span
                :class="['fl','w8',{'green':item.type == 'in'}]">{{
                item.type == 'in' ? $t('center.inbuy') : $t('center.outsell')
              }}</span>
            <span class="fl w11">{{ item.number }}</span>
            <span class="fl w11">{{ item.price }}</span>
            <span class="fl w8 tr curPer ceilColor" @click="revoke(index,item.id, item.type)">{{ $t('revoke') }}</span>
          </li>
        </ul>
        <div class="getmore tc fColor1 ft14 mt10 curPer pdb20" @click="getData('more')"
             v-if="!loading && inList.length>8">{{ more }}
        </div>
        <div class="tc pdb20" v-if="loading">
          <img src="@/assets/images/loading.gif" alt="" class="lodw20">
          <p class="ft12 baseColor">{{ $t('loading') }}</p>
        </div>
      </div>
      <div class="no_data tc" v-if="inList.length<=0 && !loading">
        <img src="@/assets/images/nodata.png" alt="">
        <p class="fColor2 ft18">{{ $t('nodata') }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "entrust",
  data() {
    return {
      isshow: false,
      address: "",
      isChoosed: 0,
      isUrl: 0,
      page: 1,
      page1: 1,
      url: "transaction_in",
      type: "all",
      more: this.$t('more'),
      more1: this.$t('more'),
      loading: false,
      urlList: [{title: this.$t('center.current')}],
      wayList: [
        {title: this.$t('center.inbuy'), url: "transaction_in"},
        {title: this.$t('center.outsell'), url: "transaction_out"}
      ],
      inList: [],
      inList1: [],
      inList2: []
    };
  },
  created() {
    this.token = localStorage.getItem("token") || "";
  },

  methods: {
    // 类型切换
    wayChoose(index, url) {
      var that = this;

      that.inList = "";
      that.page = 1;
      that.url = url;
      // console.log(that.url)
      if (url == "transaction_in") {
        that.type = "in";
      } else if (url == "transaction_out") {
        that.type = "out";
      } else {
        that.type = "all";
      }
      that.getData();
      that.more = that.$t('more');
      that.isChoosed = index;
    },

    // 撤销
    revoke(indexs, id, typeid) {

      var that = this;
      var id = id;
      var indexs = indexs;
      var type = typeid;
      layer.open({
        content: that.$t('lay.revoke'),
        btn: [that.$t('lay.sure'), that.$t('lay.ceil')],
        yes: function (index) {
          var i = layer.load();
          that.$http({
            url: "/api/" + "transaction_del",
            method: "post",
            data: {
              id: id,
              type: type
            },
            headers: {Authorization: that.token}
          })
              .then(res => {
                // console.log(res)
                layer.close(i);
                if (res.data.type == "ok") {
                  console.log(indexs);
                  that.inList.splice(indexs, 1);
                  eventBus.$emit("tocel", "celbuy");
                  eventBus.$emit("updateBalance", "1");
                  layer.msg(res.data.message);
                } else {
                  layer.msg(res.message);
                }
              })
              .catch(error => {
                console.log(error);
              });
        }
      });
    },
    getData(more) {
      this.more1 = more
      let token = window.localStorage.getItem('token');
      if (!token || token == '') {
        return;
      }
      var that = this;
      var cur_id = window.localStorage.getItem("legal_id_cur");
      var url = 'transaction_in';
      if (!more) {
        that.page = 1
      }
      var page = that.page;
      that.loading = true;
      this.$http({
        url: "/api/" + url,
        method: "post",
        data: {page: page, currency_id: cur_id},
        headers: {Authorization: token}
      })
          .then(res => {
            // console.log(res)
            that.loading = false;
            // console.log(url)
            if (res.data.type == "ok") {
              // console.log(res.data.message.list)
              var list = res.data.message.list;
              if (more) {
                if (list.length == 0) {
                  that.more = that.$t('nomore');
                } else {
                  that.inList1 = that.inList1.concat(list);
                }
                that.page += 1;
              } else {
                that.inList1 = list;
              }
              
              that.inList = that.inList1.map((item) => {
                return {...item, type: 'in'}
              })
              that.getData1()

            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    getData1(more) {
      let token = window.localStorage.getItem('token');
      if (!token || token == '') {
        return;
      }
      var that = this;
      var cur_id = window.localStorage.getItem("legal_id_cur");
      var url = 'transaction_out';
      if (!that.more1) {
        that.page1 = 1
      }
      var page1 = that.page1;
      that.loading = true;
      this.$http({
        url: "/api/" + url,
        method: "post",
        data: {page: page1, currency_id: cur_id},
        headers: {Authorization: token}
      })
          .then(res => {
            // console.log(res)
            that.loading = false;
            // console.log(url)
            if (res.data.type == "ok") {
              // console.log(res.data.message.list)
              var list = res.data.message.list;
              if (that.more1) {
                if (list.length == 0) {
                  that.more1 = that.$t('nomore');
                } else {
                  that.inList2 = that.inList2.concat(list);
                }
                that.page1 += 1;
              } else {
                that.inList2 = list;
              }
              const nreslid = that.inList2.map((item) => {
                return {...item, type: 'out'}
              })
              that.inList = that.inList.concat(nreslid);
            }
          })
          .catch(error => {
            console.log(error);
          });
    }
  },
  mounted() {
    var that = this;
    eventBus.$on("tocel", function (data) {
      console.log(data);
      if (data) {
        that.getData();
        // that.getData1()
      }
    });
    eventBus.$on("buyTrade", function (data) {
      if (data) {
        that.getData();
        // that.getData1()
      }
    });
    that.getData();
    // that.getData1()
    // setInterval(function () {
    //   that.getData()
    // }, 5000)
  },
};
</script>
<style lang="scss" scoped>

.title {
  height: 36px;
  line-height: 36px;
}

.tab_title {
  display: inline-block;
  line-height: 46px;
  height: 46px;
  span.active{
    border-bottom: 1px solid #00a4d8;
  }
  span:hover{
    color:#00a4d8;
    border-bottom: 1px solid #00a4d8;
  }
}

.tab_title span {
  cursor: pointer;
}

.tab_title span:not(:last-child) {
  margin-right: 20px;
}

/* .content{height: 300px;} */
.list-title {
  line-height: 40px;
  border-bottom: 1px solid #303b4b;
  height: 40px;
  width: 100%;
}

.no_data {
  padding: 50px 0;
}

.containers {
  height: 270px;
  overflow: auto;
}

.list-item li {
  line-height: 30px;
}

.list-item li span {
  display: inline-block;
}

.list-item li span:nth-child(3) {
  color: #cc4951;
}

.list-item li:hover {
  background-color: #2b3648;
}

.list-item li span.green {
  color: #55a067;
}

.pdb20 {
  padding-bottom: 20px;
}

.containers span {
  margin-left: 0;
}
</style>
