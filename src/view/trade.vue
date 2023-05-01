<template>
  <div class="trade">
    <!-- <div style="padding: 12px 20px; display: flex;flex-direction: row;"> -->
    <!-- <div style="color: #00a4d8; flex: 1; display: inline-block;">
        <span style=" border-bottom: 1px solid #00a4d8;">{{ $t('usercenter.change') }}</span>
      </div> -->
    <!-- <div class="fColor1">
        <span @click="$router.push({name: 'transferLegal'})"
              class="fColor1 transbtn curPer">{{ $t('account.transfer') }}</span>
      </div> -->
    <!-- </div> -->
    <!-- <div style="width: 100%; text-align: center; line-height: 40px;">
      <div class="fColor1" style="color: #ff0000;"> {{ user_legal }} {{ currency_name }}</div>
      <div class="fColor1" style="color: #ff0000;"> {{ user_currency }} {{ legal_name }}</div>
    </div> -->
    <!-- <div class="btn-wrap">
      <el-button-group style="width: 100%;">
        <el-button @click="optype='buy'" :type="optype=='buy'?'activebuy':'normal'"> {{ $t('center.buyin') }}{{
            legal_name
          }}
        </el-button>
        <el-button @click="optype='sell'" :type="optype=='sell'?'activesell':'normal'"> {{
            $t('center.sellout')
          }}{{ legal_name }}
        </el-button>
      </el-button-group>
    </div> -->
    <div class="title_box">
      <div class="tabtitle fColor1 ft16curPer">
        <span :class="{ active: buyMode == 2 }" @click="changeType(2)">{{ $t('center.xian') }}</span>
        <span :class="{ active: buyMode == 1 }" @click="changeType(1)">{{ $t('center.shi') }}</span>
        <span @click="$router.push({ name: 'transferLegal' })" class="fColor1 curPer" style="border-bottom: 0px solid #00a4d8;">{{ $t('account.transfer') }}</span>
      </div>
      <div style="color: #00a4d8;">
        <span style=" border-bottom: 0px solid #00a4d8;">{{ $t('usercenter.change') }}</span>
      </div>
    </div>
    <!-- 限价交易 -->
    <div class="content clear" v-if="show">
      <!-- v-if="optype=='buy'" -->
      <div class="w50 fl first">
        <div class="ft14">
          <!-- <div class="available clear fColor1" v-if="address.length<=0"><span class="baseColor curPer"
                                                                              @click="goNext('login')">{{
              $t('logins')
            }}</span>
            {{ $t('center.or') }} <span class="baseColor curPer"
                                        @click="goNext('register')">{{ $t('registers') }}</span>
            {{ $t('center.start') }}
          </div> -->

          <div class=" input-item clear">
            <div class="numbres-box">
              <label>{{ $t('center.buyprice') }}</label>
              <!-- <div class="fColor1" style="color: #ff0000;"> {{ user_legal }} {{ currency_name }}</div> -->
              <div class="fColor1" style="color: #637085;font-size: 12px;">{{ $t('cfc.balance') }}: {{ user_legal }} {{ currency_name }}</div>
            </div>
            <input :type="buyMode == 1 ? 'text' : 'number'" :disabled="buyMode === 1" v-model="buyMode == 1 ? bestPrice : buyInfo.buyPrice" @keydown.69.prevent />
            <span>{{ currency_name }}</span>
            <!--            <div>≈ {{ buyInfo.buyPrice }} $</div>-->
          </div>
          <div class=" input-item clear">
            <label>{{ $t('center.buynumber') }}</label>
            <input type="number" v-model="buyInfo.buyNum" @keydown.69.prevent @keyup="numFilter($event)" />
            <span>{{ legal_name }}</span>
          </div>
          <div class="slider-in">
            <el-slider v-model="sliderIn" :disabled="address.length <= 0 || buyInfo.buyPrice == 0" :max="100" :step="25" show-stops :marks="marks" @change="sliderChange('buy')"></el-slider>
          </div>
          <!--          <div class="attion tr fColor1">{{ $t('account.range') }} (0.00001,100,{{ $t('jingdu') }}: 0.00001)</div>-->
          <div class="mt20 fColor1 ft16">{{ $t('center.tradetotal') }} {{ buyTotal | toFxied4 }} {{ currency_name }}</div>
          <div class="sell_btn curPer mt20 tc greenBack fColor1 ft16" @click="buyCoin">
            {{ $t('center.buyin') }}
            {{ legal_name }}
          </div>
        </div>
      </div>
      <!-- v-if="optype=='sell'" -->
      <div class="w50 fl second">
        <div class="ft14">
          <!-- <div class="available clear fColor1" v-if="address.length<=0"><span class="baseColor curPer"
                                                                              @click="goNext('login')">{{
              $t('logins')
            }}</span>
            {{ $t('center.or') }} <span class="baseColor curPer"
                                        @click="goNext('register')">{{ $t('registers') }}</span>
            {{ $t('center.start') }}
          </div> -->

          <div class=" input-item clear">
            <!-- <label>{{ $t('center.sellprice') }} </label> -->
            <div class="numbres-box">
              <label>{{ $t('center.sellprice') }} </label>
              <div class="fColor1" style="color: #637085;font-size: 12px;">{{ $t('cfc.balance') }}: {{ user_currency }} {{ legal_name }}</div>
            </div>
            <input :type="buyMode == 1 ? 'text' : 'number'" :disabled="buyMode == 1" @keydown.69.prevent v-model="buyMode == 1 ? bestPrice : sellInfo.sellPrice" />
            <span>{{ currency_name }}</span>
            <!--            <div>≈ {{ sellInfo.sellPrice }} $</div>-->
          </div>
          <div class=" input-item clear">
            <label>{{ $t('center.sellnumber') }}</label>
            <input type="number" @keydown.69.prevent @keyup="numFilter($event)" v-model="sellInfo.sellNum" />
            <span>{{ legal_name }}</span>
          </div>
          <div class="slider-out">
            <el-slider v-model="sliderOut" :disabled="address.length <= 0 || sellInfo.sellPrice == 0" :max="100" :step="25" show-stops :marks="marks" @change="sliderChange('sell')"></el-slider>
          </div>
          <!--          <div class="attion tr fColor1">{{ $t('account.range') }} (0.00001,100,{{ $t('jingdu') }}: 0.00001)</div>-->
          <div class="mt20 fColor1 ft16">{{ $t('center.tradetotal') }} {{ sellTotal | toFxied4 }} {{ currency_name }}</div>
          <div class="sell_btn curPer mt20 tc redBack fColor1 ft16" @click="sellCoin">{{ $t('center.sellout') }}{{ legal_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'trade',

  filters: {
    toFxied4: function(value) {
      value = Number(value);
      return value.toFixed(4);
    },
    numFilter(ev) {
      ev = Number(ev);
      return ev.toFixed(4);
    }
  },
  data() {
    return {
      bestPrice: this.$t('lever.bestprice'),
      currency_name: '',
      legal_name: '',
      user_currency: '',
      user_legal: '',
      show: true,
      cny_price: 0,
      showNone: false,
      allBalance: 0,
      buyInfo: { buyPrice: 0, buyNum: 0, url: 'transaction/in' },
      sellInfo: { sellPrice: 0, sellNum: 0, url: 'transaction/out' },
      sliderIn: 0,
      sliderOut: 0,
      sliderss: true,
      buyMode: 1,
      buyPrice: 0,
      optype: 'buy',
      marks: {
        0: '0%',
        25: '25%',
        50: '50%',
        75: '75%',
        100: '100%'
      }
    };
  },
  created() {
    this.address = localStorage.getItem('token') || '';
    // this.init();
  },
  mounted() {
    let that = this;
    that.address = localStorage.getItem('token') || '';
    this.legal_id = localStorage.getItem('currency_id');
    this.currency_id = localStorage.getItem('legal_id');
    this.legal_name = localStorage.getItem('currency_name');
    this.currency_name = localStorage.getItem('legal_name');
    that.buy_sell(that.legal_id, that.currency_id);

    eventBus.$on('updateKLine', (res) => {
      if (res.period === '1min') {
        if (that.buyPrice == 0) {
          that.buyPrice = (res.close - 0).toFixed(4);
          that.buyInfo.buyPrice = that.buyPrice;
          that.sellInfo.sellPrice = that.buyPrice;
        } else {
          that.buyPrice = (res.close - 0).toFixed(4);
        }
      }
    });

    eventBus.$on('updateBalance', (res) => {
      that.buy_sell(that.legal_id, that.currency_id, true);
    });

    that.sockets.subscribe('update_balance', function(msg) {
      if (msg.type == 'update_balance_' + window.localStorage.getItem('user_id')) {
        that.buy_sell(that.legal_id, that.currency_id, true);
      }
    });
  },
  methods: {
    numFilter: (val) => {
      return Number(val);
    },
    sliderChange(type) {
      if (type == 'buy') {
        if (this.user_legal != 0) {
          this.buyInfo.buyNum = ((this.user_legal * this.sliderIn) / this.buyInfo.buyPrice / 100).toFixed(4);
        }
      } else {
        if (this.user_currency != 0) {
          this.sellInfo.sellNum = ((this.user_currency * this.sliderOut) / 100).toFixed(4);
        }
      }
    },
    changeType(mode) {
      this.buyMode = mode;
      this.buyInfo.buyPrice = this.buyPrice;
      this.sellInfo.sellPrice = this.buyPrice;
    },
    goNext(url) {
      this.$router.push({ name: url });
    },
    init() {
      this.$http({
        url: '/api/' + 'transaction/deal',
        method: 'post',
        data: {
          address: this.address
        }
      }).then((res) => {
        // console.log(res)
        this.allBalance = res.data.message.user_cny;
        // console.log(this.allBalance)
      });
    },
    buyCoin() {
      let that = this;
      if (!this.buyInfo.buyPrice || this.buyInfo.buyPrice <= 0) {
        layer.msg(this.$t('lay.inprice'));
        return;
      }
      // if(this.buyInfo.buyPrice.length>7){
      //    layer.msg('请输入正常买入价');
      //    return;
      // }
      if (!this.buyInfo.buyNum || this.buyInfo.buyNum <= 0) {
        layer.msg(this.$t('lay.innumber'));
        return;
      }
      var i = layer.load();
      this.$http({
        url: '/api/' + this.buyInfo.url,
        method: 'post',
        data: {
          legal_id: this.currency_id,
          currency_id: this.legal_id,
          price: this.buyInfo.buyPrice,
          num: this.buyInfo.buyNum,
          mode: this.buyMode
        },
        headers: { Authorization: localStorage.getItem('token') }
      })
        .then((res) => {
          console.log(res, 222);
          layer.close(i);

          if (res.data.type == 'ok') {
            layer.msg(res.data.message);

            that.buyInfo.buyPrice = that.buyPrice;
            that.buyInfo.buyNum = 0;
            that.sliderIn = 0;
            that.buy_sell(that.legal_id, that.currency_id, true);
            eventBus.$emit('buyTrade', 'tradebuy');
            eventBus.$emit('tocel', 'updata');
            // that.flushUserAmount();
          } else {
            layer.msg(res.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    sellCoin() {
      let that = this;
      if (!this.sellInfo.sellPrice || this.sellInfo.sellPrice <= 0) {
        layer.msg(this.$t('lay.outprice'));
        return;
      }
      // if(this.buyInfo.sellPrice.length>7){
      //    layer.msg('请输入正常买入价');
      //    return;
      // }
      if (!this.sellInfo.sellNum || this.sellInfo.sellNum <= 0) {
        layer.msg(this.$t('lay.outnumber'));
        return;
      }
      let i = layer.load();
      this.$http({
        url: '/api/' + this.sellInfo.url,
        method: 'post',
        data: {
          legal_id: this.currency_id,
          currency_id: this.legal_id,
          price: this.sellInfo.sellPrice,
          num: this.sellInfo.sellNum,
          mode: this.buyMode
        },
        headers: { Authorization: localStorage.getItem('token') }
      })
        .then((res) => {
          layer.close(i);
          // layer.msg(res.data.message)
          if (res.data.type == 'ok') {
            that.buyPrice = 0;
            that.sellInfo.sellPrice = 0;
            that.sellInfo.sellNum = 0;
            that.sliderOut = 0;
            eventBus.$emit('buyTrade', 'tradebuy');
            eventBus.$emit('tocel', 'updata');
            that.buy_sell(that.legal_id, that.currency_id, true);
            layer.msg(res.data.message);
            // that.flushUserAmount();
          } else {
            layer.msg(res.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    flushUserAmount() {
      this.buy_sell(that.legal_id, that.currency_id, true);
    },
    //买入、卖出记录
    buy_sell(legals_id, currencys_id, update) {
      this.$http({
        url: '/api/' + 'transaction/deal',
        method: 'post',
        data: {
          legal_id: currencys_id,
          currency_id: legals_id
        },
        headers: { Authorization: localStorage.getItem('token') }
      })
        .then((res) => {
          // console.log(res ,222)
          // layer.close(i);
          if (res.data.type == 'ok') {
            this.user_currency = res.data.message.user_currency;
            this.user_legal = res.data.message.user_legal;
            this.cny_price = res.data.message.cny_price;
            if (update) {
            } else {
              this.buyInfo.buyPrice = 0;
              this.buyInfo.buyNum = 0;
            }
            // console.log(res.data)
          } else {
            layer.msg(res.data.message);
          }
        })
        .catch((error) => {
          // console.log(error)
        });
    }
  },
  computed: {
    buyTotal() {
      return this.buyInfo.buyPrice * this.buyInfo.buyNum || 0;
    },
    sellTotal() {
      return this.sellInfo.sellPrice * this.sellInfo.sellNum || 0;
    }
  }
};
</script>

<style scoped lang="scss">
.trade {
  width: 100%;
  padding-bottom: 15px;
}

.slider-in,
.slider-out {
  margin: 20px 10px;
}

.transbtn:hover {
  color: #00a4d8;
  border-bottom: 1px solid #00a4d8;
}

.title_box {
  width: 100%;
  padding: 0 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  line-height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.btn-wrap {
  padding: 20px;
}

/deep/ .el-button,
.el-button:hover,
.el-button:focus {
  background-color: #2e2e2e;
  color: #c4c4c4;
  border-color: #848383;
  width: 50%;
}

/deep/ .el-button--success {
  background-color: #35b65a;
  width: 50%;
}

/deep/ .el-button--activesell:focus,
.el-button--activesell:hover {
  color: #fff;
  background-color: #ff494a;
  border-color: #848383;
}

/deep/ .el-button--activebuy:focus,
.el-button--activebuy:hover {
  color: #fff;
  background-color: #35b65a;
  border-color: #848383;
}

/deep/ .el-button--activesell {
  background-color: #ff494a;
  color: #fff;
  width: 50%;
}

/deep/ .el-button--activebuy {
  background-color: #35b65a;
  color: #fff;
  width: 50%;
}

.tabtitle span {
  cursor: pointer;
}

/deep/ .el-slider__bar {
  background-color: #00a4d8;
}

/deep/ .el-slider__button {
  border-color: #00a4d8;
}

.numbres-box {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.tabtitle span:not(:last-child) {
  margin-right: 30px;
}

.content .first {
  padding: 0 20px;
}

.content .second {
  padding: 0 20px;
}

.available {
  height: 36px;
  border-bottom: 1px solid #303b4b;
  line-height: 36px;
}

.input-item {
  position: relative;
  line-height: 30px;
  margin-top: 10px;
}

.input-item div {
  color: #cdd6e4;
  text-align: center;
}

.input-item label {
  width: 20%;
  //float: left;
  font-size: 14px;
  color: #637085;
  display: block;
}

.input-item input {
  width: 100%;
  float: left;
  border: 1px solid #52688c;
  border-radius: 3px;
  height: 32px;
  text-indent: 15px;
  font-size: 16px;
  color: #cdd6e4;
  background-color: #181d25;
  line-height: 30px;
}

.input-item span {
  position: absolute;
  right: 15px;
  color: #637085;
  font-size: 14px;
}

.attion {
  height: 20px;
  line-height: 30px;
  font-size: 12px;
}

.sell_btn {
  width: 100%;
  height: 40px;
  border-radius: 3px;
  color: #f4f5f7;
  line-height: 40px;
}

.greenBack {
  background-color: #35b65a;
}

.redBack {
  background-color: #ff494a;
}

input:disabled {
  color: #627085;
  cursor: not-allowed;
}

.active {
  border-bottom: 1px solid #00a4d8;
}

.tabtitle {
  span:hover {
    border-bottom: 1px solid #00a4d8;
    color: #00a4d8;
  }
}
</style>
