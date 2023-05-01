<template>
  <div id="tv-top">
    <div style="display: flex;flex-direction: row; height: 50px;">
      <span class="spinner-title" style="line-height: 50px; padding-left: 20px;">{{ rightName }}/{{ leftName }}</span>

    </div>
    <div class="market-box" v-if="showMarket">
      <market></market>
    </div>
  </div>
</template>

<script>
import market from './market';

export default {
  components: {
    market
  },
  filters: {
    toFixedN(val, n) {
      return (val - 0).toFixed(n);
    }
  },
  data() {
    return {
      leftName: "",
      rightName: "",
      legalId: "",
      curencyId: "",
      coin: {},
      lastPrice: "0.0000",
      downUp: "",
      showMarket: true,
      usprice: '0.00',
      change: '0.00',
      highPrice: '0.0000',
      lowPrice: '0.0000',
      volumn: '0.00',
      rateNum: 1,

    };
  },
  created() {
    this.leftName = window.localStorage.getItem("legal_name") || "";
    this.rightName = window.localStorage.getItem("currency_name") || "";
    this.currencyId = window.localStorage.getItem("legal_id");
    this.legalId = window.localStorage.getItem("currency_id");
    // this.init(this.legalId, this.currencyId);
    this.downUp = window.localStorage.getItem("downUp");
  },
  mounted() {
    let that = this;
    eventBus.$on("toNew", function (msg) {
      // console.log('laaaaaaaaa',msg);
      var thattoken = that.rightName + '/' + that.leftName;
      if (msg.istoken == thattoken) {
        that.lastPrice = (msg.newprice - 0).toFixed(4);
        that.downUp = (msg.newup - 0).toFixed(2);
        // that.coin.total = msg.hour24;
      }

    });
    eventBus.$on('receiveRate', function (msg) {
      // console.log('laaaaaaaaa',msg);
      that.rateNum = msg;

    });

    let [legal_id, currency_id] = [localStorage.getItem("legal_id"), localStorage.getItem("currency_id")];

    this.$http({
      url: "/api/" + "lever/deal",
      method: "post",
      data: {
        legal_id: legal_id,
        currency_id: currency_id
      },
      headers: {Authorization: localStorage.getItem("token")}
    }).then(res => {
      if (res.data.type == "ok") {

        that.rateNum = res.data.message.ExRAte;
        eventBus.$on('updateKLine', res => {
          if (res.period === '1day') {
            that.lastPrice = (res.close - 0).toFixed(4);
            that.highPrice = (res.high - 0).toFixed(4);
            that.lowPrice = (res.low - 0).toFixed(4);
            that.volumn = (res.volume - 0).toFixed(4);
          }
          if (res.change) {
            that.change = res.change;
          }
        })
      }
    });

    that.sockets.subscribe('transaction', msg => {
      if (msg.type == 'transaction') {
        // console.log(msg);

        if ((that.rightName + '/' + that.leftName) == msg.token) {
          if (msg['24h']) {
            that.coin = JSON.parse(msg['24h']);
          }
        }

      }
    })
  },
  methods: {
    init(legalId, currencyId) {
      this.$http({
        url: "/api/transaction/deal",
        method: "post",
        data: {
          legal_id: legalId,
          currency_id: currencyId
        },
        headers: {'Authorization': localStorage.getItem('token')},
      }).then(res => {
        if (res.data.type == "ok") {
          this.lastPrice = res.data.message.last_price;
        }
      });
    }
  }
};
</script>

<style lang='scss'>

$baseYellowColor:#00a4d8;
.red {
  color: #cc4951;
}

.green {
  color: #55a067;
}

.spinner-title {
  display: block;
  width: 290px;
  box-sizing: border-box;
  font-size: 16px;
  color:$baseYellowColor;
}

#tv-top {
  font-size: 12px;
  position: relative;
  background: transparent;
  color: #c7cce6;
  cursor: pointer;

  > span:first-child {
    // font-size: 20px;
    font-weight: 600;
    padding: 0 15px;
    /*background: url('../assets/images/arrow0.png') right center/ 10px no-repeat;*/
  }

  > .lastprice {
    color: #7a98f7;
    // font-size: 18px;
    font-weight: 600;
  }

  > span {
    line-height: 40px;
    margin: 0 2px;
  }

  > .market-box {
    height: auto;
    z-index: 999;
    float: left;
    left: 5px;
    width: 100%;
    background: transparent;
  }
}
</style>


