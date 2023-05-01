<template>
  <div class="hide_div fColor1">
    <p class="fColor2 ft12 mb15">{{ $t('account.choosecoin') }}</p>
    <el-select style="width: 100%" v-model="currency">
      <el-option v-for="opt in accounts" :value="opt.value" :label="opt.label.toUpperCase()"></el-option>
    </el-select>
    <el-tabs @tab-click="changeUSDT1" type="border-card" style="margin:10px 0;">
      <el-tab-pane v-if="currency===3" v-for="(item,index) in ['erc20','trc20','omni']"
                   :label="item.toUpperCase()">
      </el-tab-pane>
      <p class="fColor2 ft12 mb15">{{ $t('account.chaddress') }}</p>
      <input :placeholder="tibi_msg" class="address_inp fColor1 mb30" type="text" v-model="address">
      <p class="fColor2 ft12 mb15 flex between alcenter">
        <span>{{ $t('number') }}</span>
        <span>
                {{ $t('center.available') }}：
                <span class="use_num">{{ balance || '0.00' | toFixeds }}</span>
                {{ coinname }}
                <span>
                  <!-- 限额：
                  <span>1500.00</span>-->
                  <!-- <span class="advance">提升额度</span> -->
                </span>
              </span>
      </p>
      <label class="num_lab flex between mb30">
        <input style="color: white" class="fColor1" type="text" :placeholder="min_number" v-model="number">
        <span>{{ coinname }}</span>
      </label>
      <div class="flex mb50">
        <div class="left_inp_wrap flex1">
          <p class="fColor2 ft12 mb15">
            <span>{{ $t('rate') }}</span>
            <span></span>
          </p>
          <label class="range_lab flex alcenter between">
            <!-- <input class="fColor1" type="text" v-model="rate"> -->
            <span>{{ ratenum }}</span>
            <span>{{ coinname }}</span>
          </label>
        </div>
        <div class="right_inp_wrap flex1">
          <p class="mb15">
            <span class="fColor2 ft12">{{ $t('account.havenum') }}</span>
          </p>
          <label class="get_lab flex alcenter between">
            <span>{{ number - ratenum > 0 ? number - ratenum : 0 | toFixeds }}</span>
            <!-- <input class="fColor1" disabled v-model="reachnum" type="number"> -->
            <span>{{ coinname }}</span>
          </label>
        </div>

      </div>

      <p style="padding-bottom:10px;color: #637085">{{ $t('pass1') }}</p>
      <label class="num_lab flex between mb30">

        <input style="color: white" class="fColor1" type="password" :placeholder="$t('pass1')" v-model="pass">


      </label>


      <div class="flex">
        <div class="flex2" style="padding-right: 10px;">
          <p class="ft12 fColor2 mb15">{{ $t('account.notice') }}</p>
          <ul class="tips_ul ft12 fColor2" style="list-style:disc inside">
            <li class="tips_li" style="list-style:disc inside">
              {{ $t('account.minnum') }}：{{ min_number_txt }}{{ coinname }}。{{
                $t('account.oncemaxnum')
              }}：{{ max_number }}{{ coinname }}。{{ $t('account.daynum') }}{{ day_limit }}{{ coinname }}
            </li>
            <li class="tips_li" style="list-style:disc inside">{{ $t('account.call') }}</li>
          </ul>
        </div>

        <div class="flex1 tc">
          <button class="withdraw_btn" @click="mention">{{ $t('account.withdraw') }}</button>
        </div>
      </div>

    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'withdraw',
  data(){
    return {
      currency: 3,
      tibi_msg:'',
      address: '',
      balance: 0,
      coinname: '',
      pass: '',
      min_number_txt:'',
      max_number: 0,
      day_limit: 0,
      min_number: "",
      number: "",
      ratenum: "",
      reachnum: "",
      accounts: [
        {
          label: 'btc',
          value: 1
        },
        {
          label: 'eth',
          value: 2
        },
        {
          label: 'usdt',
          value: 3
        },
      ],
    }
  },
  created() {
    this.getNum(this.currency)
  },
  watch:{
    currency(val){
      this.getNum(val)
    }
  },
  methods:{
    getNum(currency) {
      var that = this;
      this.$http({
        method: "POST",
        url: "/api/" + "wallet/get_info",
        data: {
          currency: currency
        },
        headers: {
          "Authorization": localStorage.getItem('token')
        }
      }).then(res => {
        res = res.data;
        that.coinname = res.message.name;
        that.balance = res.message.change_balance;
        that.min_number =
            that.$t('account.minnum') + parseFloat(res.message.min_number).toFixed(2);
        // + "   " + that.$t('account.oncemaxnum') + parseFloat(res.message.max_number).toFixed(2)
        // + "   " + that.$t('account.daynum') + parseFloat(res.message.day_limit).toFixed(2);
        that.min_number_txt = parseFloat(res.message.min_number).toFixed(8);
        that.minnumber = res.message.min_number;
        that.max_number = res.message.max_number;
        that.day_limit = res.message.day_limit;
        that.ratenum = res.message.rate;
        that.reachnum = 0.0;
        that.rate = res.message.rate;
      });
    },
    changeUSDT1(tab, event) {
      this.tibiType = tab.index;
    },
    mention() {
      var that = this;
      var currency = this.currency;
      var address = this.address;
      var number = this.number;
      var rate = this.rate;
      var min_number = this.minnumber;

      if (!address) {
        layer.alert(that.$t('lay.caddress'), {
          title: this.$t('auth2.reminder'),
          btn: [that.$t('lay.sure')]
        });
        return;
      }
      if (!number) {
        layer.alert(that.$t("lay.cnumber"), {
          title: this.$t('auth2.reminder'),
          btn: [that.$t('lay.sure')]
        });
        return;
      }
      if (number - 0 < min_number) {
        return layer.alert(that.$t("lay.minnum"), {
          title: this.$t('auth2.reminder'),
          btn: [that.$t('lay.sure')]
        });
      }

      this.$http({
        method: "POST",
        url: "/api/" + "wallet/out",
        data: {
          currency: this.currency,
          number: this.number,
          address: this.address,
          rate: this.rate,
          type:this.tibiType,
          pass:this.pass
        },
        headers: {
          "Authorization": localStorage.getItem('token')
        }
      }).then(res => {
        res = res.data;

        if (res.type == "ok") {
          layer.alert(res.message, {
            title: that.$t('auth2.reminder'),
            btn: [that.$t('lay.sure')]
          });
          setTimeout(() => {
            // window.location.reload();
          }, 1500);
        } else {
          layer.alert(res.message, {
            title: that.$t('auth2.reminder'),
            btn: [that.$t('lay.sure')]
          });
        }

      });
    },
  },
  filters: {
    toFixeds: function (value) {
      value = Number(value);
      return value.toFixed(8);
    }
  },
}
</script>

<style lang="scss" scoped>
.hide_div {
  //border: 1px solid #1e2c42;
  padding: 20px;
}

::v-deep .el-tabs__item {
  color: #c7cce6 !important;
}

.operation,
.copy,
.ewm {
  color: #00a4d8;
}

.copy {
  margin: 0 30px;
}

.copy:hover {
  cursor: pointer;
}
.address_inp{
  width: 100%;
  border: 1px solid #6b80ae;
  border-radius: 3px;
  padding: 15px;
}
input{
  background: none;
}
.num_lab {
  display: flex;
  width: 100%;
  border: 1px solid #6b80ae;
  border-radius: 3px;
  padding: 15px;
}

.num_lab input {
  width: 100%;
}

.range_lab,
.get_lab {
  border: 1px solid #6b80ae;
  border-radius: 3px;
  padding: 15px;
}

.get_lab {
  background: #1e2c42;
}

.right_inp_wrap {
  margin-left: 20px;
}

.use_num,
.advance {
  color: #5697f4;
}

.use_num {
  margin-right: 5px;
}

.advance {
  margin-left: 5px;
}

.withdraw_btn {
  background-color: #7a98f7;
  color: #fff;
  padding: 15px 15px;
  min-width: 120px;
  width: 100%;
  border: none;
  border-radius: 5px;
}

.withdraw_btn:hover {
  cursor: pointer;
}
.flex{
  align-items: flex-end;
}
.fColor1 {
  color: #c7cce6;
}
</style>
