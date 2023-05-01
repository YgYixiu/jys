<template>
  <div class="box">
    <div class="boximg">
      <div class="boxtitle">
        <article>
          <span>{{ $t('lock.lockming') }}</span>
        </article>
        <h2>{{ $t('lock.return') }}</h2>
      </div>
    </div>
    <div class="account">
      <div v-if="!list.length && loaded" class="fs14 d-flex-between-center"> {{$t('cuy.nomore')}} </div>
      <div class="mineCardList">
        <div class="mineCard contentBK" v-for="item in list" :key="item.id">
          <div class="topName">
            <div class="topNamePay ft18">{{item.currency_name}} {{ $t('lockming.lockming') }}</div>
          </div>
          <el-input
              type="number"
              class="green-border"
              v-model="item.money"
              :placeholder="$t('lock.quantityPlaceholder',{quantity: item.pricemin})"
          >
            <template slot="append">{{item.currency_name}}</template>
          </el-input>
          <!--单笔最少-->
          <div class="acbuyBtmL">
            <em>{{ $t('lockming.minimumSingleTransaction') }}</em>
          </div>
          <div class="acbuyBtmL flex between">
            <em class="strong">{{ item.pricemin }}</em>
            <span>{{item.currency_name}}</span>
          </div>
          <!--总收益率-->
          <div class="bottomCard flex between alcenter">
            <div class="midType">
              <div class="price">
                {{ item.rates }}%
              </div>
              <div class="midTypetTitle mt5 gray9">
                {{ $t('lockming.dailyYield') }}
              </div>
            </div>
            <!--锁仓周期-->
            <div class="midDay">
              <div>
                {{ item.days }}
                <label>{{ $t('lock.day') }}</label>
              </div>
              <span class="gray9">{{ $t('lockming.lockUpPeriod') }}</span>
            </div>
          </div>
          <div class="minerBtn flex between alcenter">
            <div class="btn green-bg" @click="buy(item)">{{ $t('lock.buy') }}</div>
          </div>
        </div>
      </div>
    </div>
    <account-records ref="records"></account-records>
    <el-dialog
        :title="$t('lock.earn', {currency: 'USDT'})"
        :visible.sync="visible"
        width="700px"
        :center="true"
        :lock-scroll="false"
    >
      <div class="buyBox">
        <!--总收益率-->
        <div class="buyItem">
          <span>{{ $t('lockming.dailyYield') }}</span>
          <h1>{{ buyData.rates + '%' }}</h1>
        </div>
        <!--存币数量-->
        <div class="buyItem">
          <span>{{ $t('lockming.numberOfCoinsDeposited') }}</span>
          <h1>{{buyData.money}}{{ buyData.currency_name }}</h1>
        </div>
        <div class="buyItem">
          <span>{{ $t('lockming.estimatedIncome') }}</span>
          <h1>{{ (buyData.money * parseFloat(buyData.rates) / 100).toFixed(8) }}{{ buyData.currency_name }}</h1>
        </div>
        <div class="buyItem">
          <span>{{ $t('lockming.availableAssets') }}</span>
          <h1>{{ balance }}</h1>
        </div>
      </div>
      <div class="footer" slot="footer">
        <el-button @click="visible = false">{{ $t('lock.cancel') }}</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AccountRecords from '@/view/lock/AccountRecords.vue';

export default {
  name: 'Lock',
  components: {
    AccountRecords
  },
  data() {
    return {
      quantity: 0,
      visible: false,
      income: {},
      list: [],
      loaded: false,
      id: '',
      money: '',
      buyData: {},
      wallets: [] //钱包
    }
  },
  async created() {
    const loading = this.$loading()
    try {
      await this.getIncome()
      await this.getList()
      await this.getWallets()
    } catch (e) {

    }
    loading.close()
    this.loaded = true
  },
  computed:{
    balance(){
      const name = this.buyData.currency_name
      if (!name){
        return 0
      }
      const wallet = this.wallets.find(item => item.currency_name === name)
      return wallet.micro_balance || 0
    },
    i18n() {
      return this.$t("lockming")
    },
  },
  methods: {
    /**
     * 金额,只允许2位小数
     */
    amount(value) {
      //金额，只允许保留十位小数
      return /^[1-9]\d*(,\d{3})*(\.\d{1,10})?$|^0\.\d{1,20}$/.test(value);
    },
    getIncome(){
      return this.$http({
        url: '/api/get_mining_incomes',
        type:'GET',
        headers: {'Authorization': localStorage.getItem('token')},
      }).then(res=>{
        const {data} = res
        this.income = data.message || {}
      })
    },
    getList(){
      return this.$http({
        url: '/api/get_mining_machine_list',
        type:'GET',
        headers: {'Authorization': localStorage.getItem('token')},
      }).then(res=>{
        const {data} = res
        const list = data.message || []
        list.map(item=> {
          item.money = ''
          return item
        })
        this.list = list
      })
    },
    buy(obj){
      const { i18n, pid, uid } = this
      const {money, pricemin} = obj
      this.buyData = obj
      console.log('buy', money)
      if (!money || !this.amount(money)) {
        return this.$message.info(i18n.p_number)
      }
      if (money < Number(pricemin)) {
        return this.$message.info(i18n.leastSingle + Number(pricemin))
      }
      if (money > Number(this.balance)) {
        return this.$message.info(i18n.insufficientBalance)
      }
      this.visible = true
    },
    getWallets() {
      return this.$http({
        url: "/api/wallet/list",
        method: "post",
        headers: { Authorization: localStorage.getItem("token") },
      }).then((res) => {
        const wallets = res.data.message || {}
        const micro = wallets.micro_wallet || null
        if (micro) {
          this.wallets = micro.balance || []
        }
      })
    },
    all() {
      this.money = this.balance
    },
    submit() {
      const { i18n, pid, uid } = this
      const {money, pricemin, id} = this.buyData
      if (!money || !this.amount(money)) {
        return this.$message.info(i18n.p_number)
      }
      if (money < Number(pricemin)) {
        return this.$message.info(i18n.leastSingle + Number(pricemin))
      }
      if (money > Number(this.balance)) {
        return this.$message.info(i18n.insufficientBalance)
      }
      const loading = this.$loading()
      this.$http({
        url: '/api/buy_mining_machine',
        method: 'post',
        headers: { Authorization: localStorage.getItem("token") },
        data: {
          id,
          money
        }
      }).then(res => {
        const data = res.data
        if (data.type === 'ok'){
          this.$message.success(this.$t('success'))
          setTimeout(() => {
            this.visible = false
            this.$refs.records.reload()
          }, 1000)
        } else {
          this.$message.error(data.message)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      }).finally(()=>{
        loading.close()
      })
    },
  },
}
</script>
<style scoped lang="scss">
.footer{
  display: flex;
  ::v-deep .el-button{
    flex: 1;
  }
}
::v-deep .el-dialog__header{
  border-bottom: 1px solid #ddd;
}
.buyItem{
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  span{
    color: #999;
    font-size: 14px;
  }
  h1{
    font-weight: 700;
    font-size: 14px;
    color: #c7cce6;
  }
}
.box {
  background-color: #191919;
  font-size: 14px;
  color: #c7cce6;
  padding-bottom: 40px;
}

.boximg {
  height: 230px;
  width: 100%;
  background: #000 url(../../assets/images/lockbg.png) no-repeat top/contain;
}

.boxtitle {
  article {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top: 50px;
    position: relative;

    span {
      position: relative;
      background: #ffd12d;
      color: #000;
      font-weight: 700;
      padding: 5px 15px;
      border-radius: 15px;
      font-size: 14px;

      &::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 18px;
        border-width: 0 10px 10px;
        border-style: solid;
        border-color: transparent transparent transparent #ffd12d;
      }
    }
  }

  h2 {
    font-weight: 700;
    text-align: center;
    font-size: 30px;
    color: #fff;
    margin-top: 20px;
  }
}

.account {
  width: 1200px;
  margin: 0 auto;
  padding-top: 43px;
  min-height: 420px;

  .mineCardList {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .mineCard {
    color: #c7cce6;
    position: relative;
    width: 45%;
    margin-top: 20px;
    border-radius: 15px;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .topName {
    font-size: 28px;
    display: flex;
    flex-direction: column;
    padding-left: 15px;
  }

  .topNamePay {
    color: #c7cce6;
    margin-top: 10px;
    font-weight: 700;
  }

  .el-input {
    padding: 10px 15px;
    margin: 10px 0px 0px;
    border-radius: 8px;
    //width: calc(100% - 30px);
  }

  ::v-deep .el-input__inner {
    border-left: 1px solid #1da2b4 !important;
    border-top: 1px solid #1da2b4 !important;
    border-bottom: 1px solid #1da2b4 !important;
    border-right: none;
    color: #fff !important;
  }

  ::v-deep .el-input-group__append {
    border-right: 1px solid #1da2b4 !important;
    border-top: 1px solid #1da2b4 !important;
    border-bottom: 1px solid #1da2b4 !important;
    border-left: none;
    background-color: #181d25;
  }

  .acbuyBtmL {
    margin: 10px 15px 0px;
  }

  .bottomCard {
    padding: 0 20px;
  }

  .midType {
    margin-top: 20px;
  }

  .midTypetTitle {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .price {
    letter-spacing: 3px;
    font-size: 25px;
    font-weight: 700;
    color: #00b796;
  }

  .midDay {
    display: flex;
    flex-direction: column;

    div {
      margin-bottom: 5px;
      font-size: 25px;
      font-weight: 700;
      color: #c7cce6;
    }

    label {
      font-size: 20px;
    }
  }

  .minerBtn {
    margin: 0 20px;
  }
}

.btn {
  width: 100%;
  padding: 12px 40px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background-color: #2c63e4;
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
  text-transform: uppercase;
}

.ft18 {
  font-size: 18px;
}

.between {
  justify-content: space-between;
}

.alcenter {
  align-items: center;
}

.flex {
  display: flex;
}

.gray9 {
  color: #999;
}

.mt5 {
  margin-top: 5px;
}

.green-bg {
  background: #1da2b4 !important;
  color: #fff !important;
}
</style>
