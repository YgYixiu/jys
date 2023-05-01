<template>
  <div class>
    <div class="header fColor1">
      <p class="fl">
        {{ $t('account.totalassets') }}：
        <span class="asset_num">{{ totle | toFixeds }}</span>
        <span class="asset_name"> USDT</span>
      </p>
      <p class="fr right_text">
        <!-- <span class="record" @click="record">财务记录</span> -->
        <span class="address hide" @click="withdraw_address">{{ $t('account.upaddress') }}</span>
      </p>
    </div>
    <div class="content fColor1 ft12">
      <div class="content_top flex alcenter fColor2">
        <p class="flex1 tc">
          {{ $t('market.currency') }}
          <i></i>
        </p>
        <p class="flex1 tc">{{ $t('center.available') }}</p>
        <p class="flex1 tc">{{ $t('account.freezes') }}</p>
        <!-- <p class="flex1 tc">BTC估值<i></i></p> -->
        <!-- <p class="flex1 tc">锁仓</p> -->
        <p class="flex1 tc">{{ $t('account.conversion') }}(USDT)</p>
        <p class="flex1 tc">{{ $t('do') }}</p>
      </div>
      <ul class="content_ul">
        <li
            v-for="(item,index) in asset_list"
            v-if="item.is_match == 1"
            :key="index"
        >
          <div class="content_li flex alcenter between">
            <p class="flex1 tc">{{ item.currency_name }}</p>
            <p class="flex1 tc">{{ item.change_balance || '0.00' | toFixeds }}</p>
            <p class="flex1 tc">{{ item.lock_change_balance || '0.00' | toFixeds }}</p>
            <p class="flex1 tc">{{ item.usdt_price * item.change_balance || '0.00' | toFixeds }}</p>
            <!-- <p class="flex1 tc">{{item.valuation}}</p> -->
            <!-- <p class="flex1 tc">{{item.lock_position}}</p> -->
            <p class="flex1 tc operation">
              <span v-if="item.currency_name==='BTC'||item.currency_name==='USDT'||item.currency_name==='ETH'"
                    @click="excharge(index,item.currency)">{{ $t('account.charging') }}</span>
              <span v-if="item.currency_name==='BTC'||item.currency_name==='USDT'||item.currency_name==='ETH'"
                    @click="withdraw(index,item.currency)">{{ $t('account.withdraw') }}</span>
              <span @click="rec(index,item.currency)">{{ $t('account.record') }}</span>
            </p>
          </div>
          <!--充币区-->
          <div class="hide_div" v-if="index == active">
            <div style="width:600px; text-align: center; margin:0 auto;">
              <p class="fColor2 ft14">{{ $t('account.cgaddress') }}</p>

              <el-tabs @tab-click="changeUSDT" type="border-card" style="margin:10px 0;">
                <el-tab-pane v-if="currency==3" v-for="(item,index) in Object.keys(usdt_wallet)"
                             :label="item.toUpperCase()">
                </el-tab-pane>
                <!-- <img class="mt10 mb15" style="width:200px;"
                     :src="'https://coin.ifti.top/api/qrcode?text='+excharge_address"> -->
                <p class=" mb50">
                  <span class="ft18 fColor1 excharge_address" :class="{'bg':flags}">{{ excharge_address }}</span>
                  <span id="copy" @click="copy" class="copy ft14">{{ $t('account.copy') }}</span>
                  <!-- <span class="ewm_wrap">
                    <span class="ewm ft14" @click="show_ewm">{{ $t('account.code') }}</span>
                    <div class="ewm_img" id="code" :class="{'hide':isHide}"></div>
                  </span> -->
                </p>
              </el-tabs>
            </div>
            <el-form ref="form" :model="form" label-width="160px" label-style="color:#fff;">
              <el-form-item :label="$t('account.amount')">
                <el-input v-model="form.num" :placeholder="$t('account.amount')"></el-input>
              </el-form-item>
              <el-form-item class="" :label="$t('account.cgaddress')">
                <el-input v-model="form.from" :placeholder="$t('account.cgaddress')"></el-input>
              </el-form-item>
              <el-form-item class="hide" :label="$t('withdrawList.hash')">
                <el-input v-model="form.hash" :placeholder="$t('withdrawList.hash')"></el-input>
              </el-form-item>
              <el-form-item class="" :label="$t('account.picture')">
                <el-upload
                    ref="uploader"
                    class="upload-demo"
                    :action="uploadUrl"
                    :headers="uploadHeaders"
                    :http-request="uploadFile"
                    :multiple="false"
                    :limit="1"
                    list-type="picture"
                    :file-list="form.pic">
                  <el-button size="mini" type="success">{{ $t('account.choose') }}</el-button>
                  <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="medium" @click="submitChargeInfo(item.currency)">
                  {{ $t('account.submitRecharge') }}
                </el-button>
              </el-form-item>
            </el-form>

            <p class="ft12 fColor2 mb15">{{ $t('account.notice') }}</p>
            <ul class="tips_ul ft12 fColor2" style="list-style:disc inside">
              <li class="tips_li" style="list-style:disc inside">
                {{ $t('account.a1') }}{{ item.currency_name }}{{ $t('account.a2') }}
              </li>
              <li v-if="item.currency_type=='eth'" class="tips_li" style="list-style:disc inside">
                {{ $t('account.a4') }}
              </li>
              <li v-else-if="item.currency_type=='btc'" class="tips_li" style="list-style:disc inside">
                {{ $t('account.a9') }}
              </li>
              <li v-else-if="item.currency_type=='usdt'" class="tips_li" style="list-style:disc inside">
                {{ $t('account.a4') }}
              </li>
              <li v-else-if="item.currency_type=='omni'" class="tips_li" style="list-style:disc inside">
                USDT{{ $t('account.a3') }}
              </li>
            </ul>
          </div>
          <!--提币区-->
          <div class="hide_div" v-if="index == active01">
            <el-tabs @tab-click="changeUSDT1" type="border-card" style="margin:10px 0;">
            <el-tab-pane v-if="currency==3" v-for="(item,index) in ['erc20','trc20','omni']"
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

            <p style="padding-bottom:10px;color: #637085">{{$t('pass1')}}</p>
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
          <!--记录区-->
          <div class="hide_div rec-box" v-if="index == active02">
            <div class="rec-con">
              <div class="rec-title">
                <span>{{ $t('number') }}</span>
                <span>{{ $t('account.record') }}</span>
                <span>{{ $t('time') }}</span>
              </div>
              <ul class="rec-list">
                <li v-for="(reItem,reIndex) in recData" :key="reIndex">
                  <span>{{ reItem.value || '0.00' | toFixeds }}</span>
                  <span>{{ reItem.info }}</span>
                  <span>{{ reItem.created_time }}</span>
                </li>
              </ul>
              <p class="more" @click="moreData()">{{ more }}</p>
            </div>
          </div>
        </li>
      </ul>
      <!-- <div class="tc ft16 fColor1 mt50" v-show="asset_list.length<=0"></div> -->
    </div>
  </div>
</template>
<script>
import indexHeader from "@/view/indexHeader";
import left from "@/view/left";
import "@/lib/clipboard.min.js";
import "@/lib/jquery.qrcode.min.js";
import axios from "axios";

export default {
  name: "finance",
  filters: {
    toFixeds: function (value) {
      value = Number(value);
      return value.toFixed(8);
    }
  },
  data() {
    return {
      pass:'',
      totle: "",
      recData: [],
      token: "",
      flags: false,
      flag: false,
      isHide: true,
      active: "a",
      active01: "a",
      tibi_msg: '',//this.$t("account.tibi"),
      active02: "a",
      addr: "",
      url: "",
      excharge_address: "",
      address: "",
      number: "",
      rate: "",
      coinname: "",
      balance: "",
      ratenum: "",
      reachnum: "",
      min_number: "",
      min_number_txt: "",
      currency: "",
      asset_list: [],
      tip_list: [
        this.$t('account.a1') + "USDT" + this.$t('account.a2'),
        "USDT" + this.$t('account.a3')
      ],
      tip_list01: [
        this.$t('account.a1') + "USDT" + this.$t('account.a2'),
        "USDT" + this.$t('account.a3')
      ],
      page: 1,
      more: this.$t("more"),
      balanceList: [this.$t('account.laccount'), this.$t('usercenter.lever')],
      transferData: {
        modalShow: false,
        transferName: "",
        transferBalance: "",
        start: "",
        end: ""
      },
      status: '',
      form: {
        from: '',
        num: '',
        pic: [],
        hash: '',

      },
      uploadUrl: '',
      uploadHeaders: {},
      usdt_wallet: {},
      tibiType:0,
    };
  },
  components: {
    indexHeader,
    left
  },
  methods: {
    goRecord() {
      this.$router.push({name: "coinRecord"});
    },
    changeUSDT(tab, event) {
      let key =Object.keys(this.usdt_wallet)[tab.index];
      this.excharge_address = this.usdt_wallet[key];
    },
    changeUSDT1(tab, event) {
      this.tibiType = tab.index;
    },
    init() {

      var that = this;
      that.uploadHeaders = {Authorization: localStorage.getItem('token')};
      that.uploadUrl = that.$utils.back_api + 'api/upload';
      // console.log('上传地址',that.uploadUrl)
      var clipboard = new Clipboard(".copy");
      clipboard.on("success", function (e) {
        layer.alert(that.$t("lay.copys"));
      });
      clipboard.on("error", function (e) {
        alert(that.$t("lay.fcopy"));
      });
    },
    //充币
    excharge(index, currency) {
      console.log(index, currency);
      if (this.status == 1) {
        this.currency = currency;
        if (this.flag) {
          this.flag = false;
          this.active = "a";
          this.active01 = "a";
          this.active02 = "a";
        } else {
          this.flag = true;
          this.active = index;
          this.active01 = "a";
          this.active02 = "a";
        }
        this.sendData(currency);
      } else {
        layer.alert(this.$t('notopen'))
      }

    },
    sendData(currency) {
      var that = this;
      this.$http({
        url: "/api/" + "wallet/get_in_address",
        method: "post",
        data: {currency: currency},
        headers: {Authorization: that.token}
      })
          .then(res => {
            if (res.data.type == "ok") {

              if (currency == 1 || currency == 3 || currency==2) {
                that.excharge_address = currency == 1 ? res.data.message.btc : res.data.message.usdt;

                that.excharge_address = res.data.message.address;
                if (this.currency == 3) {
                  let usdt = res.data.message.address;
                  console.log(usdt);
                  let wallets = [];
                  if (usdt) {
                    let arr = usdt.split(',');
                    if (arr.length == 1) {
                      let arr0 = arr[0].split(":");
                      if (arr0.length == 1) {
                        wallets['erc20'] = arr0[0];
                      } else {
                        wallets[arr0[0]] = arr0[1];
                      }
                    } else {
                      arr.forEach(x => {
                        let config = x.split(':');
                        if (config.length > 1)
                          wallets[config[0]] = config[1];
                      })
                    }
                    that.usdt_wallet = wallets;
                    if (Object.keys(that.usdt_wallet).length > 1) {
                      that.excharge_address = that.usdt_wallet[Object.keys(that.usdt_wallet)[0]];
                    }
                  }
                }
                // 生成二维码

              } else {
                that.excharge_address = 'Not support yet!'
                $("#code").qrcode({
                  width: 130, //宽度
                  height: 130, //高度
                  text: that.excharge_address
                });
              }
            } else {

            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    //提币
    withdraw(index, currency) {
      if (this.status == 1) {
        this.currency = currency;
        if (this.flag) {
          this.flag = false;
          this.active = "a";
          this.active01 = "a";
          this.active02 = "a";
        } else {
          this.flag = true;
          this.active01 = index;
          this.active = "a";
          this.active02 = "a";
        }
        this.getNum(currency);
      } else {
        layer.alert(this.$t('notopen'));
      }

    },
    //记录
    rec(index, currency) {
      this.currency = currency;
      this.recData = [];
      if (this.flag) {
        this.flag = false;
        this.active = "a";
        this.active01 = "a";
        this.active02 = "a";
      } else {
        this.flag = true;
        this.active02 = index;
        this.active = "a";
        this.active01 = "a";
        this.$http({
          url: "/api/wallet/legal_log",
          method: "post",
          data: {type: 2, currency: currency, page: 1},
          headers: {Authorization: this.token}
        }).then(res => {
          if (res.data.type == "ok") {
            this.recData = res.data.message.list;
          }
        });
      }
    },
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
    // 提币按钮
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
    exchange() {
    },
    //复制
    copy() {
      var that = this;
      var clipboard = new Clipboard(".copy", {
        text: function () {
          return that.excharge_address;
        }
      });
      clipboard.on("success", function (e) {
        that.flags = true;
        layer.msg(that.$t("lay.copys"));
      });
      clipboard.on("error", function (e) {
        that.flags = false;
        layer.msg(that.$t("lay.fcopy"));
      });
    },
    record() {
      this.$router.push({name: "finanrec"});
    },
    withdraw_address() {
      this.$router.push({name: "withdraw_address"});
    },
    show_ewm() {
      if (this.isHide) {
        this.isHide = false;
      } else {
        this.isHide = true;
      }
    },
    getdata() {
      var that = this;
      this.$http({
        url: "/api/" + "wallet/list",
        method: "post",
        data: {},
        headers: {Authorization: that.token}
      })
          .then(res => {
            if (res.data.type == "ok") {
              // console.log('法币余额', res.data.message);
              that.asset_list = res.data.message.change_wallet.balance;
              that.totle = res.data.message.change_wallet.usdt_totle;
              that.status = res.data.message.is_open_CTbi;
            } else {
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    // 加载更多
    moreData() {
      let that = this;
      that.page = that.page + 1;
      this.$http({
        url: "/api/wallet/legal_log",
        method: "post",
        data: {type: "2", currency: that.currency, page: that.page},
        headers: {Authorization: this.token}
      }).then(res => {
        if (res.data.type == "ok") {
          var datas = that.asset_list;
          for (let i in datas) {
            if (that.currency == datas[i].currency) {
              that.active02 = i;
              if (res.data.message.list.length > 0) {
                that.recData = that.recData.concat(res.data.message.list);
              } else {
                that.more = that.$t('nomore');
              }

            }
          }
        }
      });
    },
    // 划转
    transfer(index, currency) {
      let that = this;
      that.transferData.modalShow = true;
    },
    uploadFile(f) {

      let that = this;
      let formData = new FormData();
      formData.append("file", f.file);

      this.$http.post("/api/upload", formData, {
        headers: {"Content-Type": "multipart/form-data"}
      }).then(res => {
        let msg = res.data;
        if (msg.type == 'ok') {
          that.form.pic = [{name: '已上传', url: msg.message}];
        } else {
          layer.msg(msg.message)
        }
      });
    },
    submitChargeInfo(currency) {
      let data = {};
      data.currency = currency;
      data.acc = this.form.from;
      data.hash = this.form.hash;
      data.amount = this.form.num;
      data.type=this.excharge_address;

      // if (!data.acc || !data.hash || !data.amount || !data.currency || this.form.pic.length < 1) {
      //   layer.msg('参数错误');
      //   return;
      // }

      if (!data.amount) {
        layer.msg('please input number');
        return;
      }


      data.acc = data.acc ? data.acc : 'default';
      data.pic = this.form.pic.length > 0 ? this.form.pic[0].url : '111';

      let that = this;
      this.$http({
        url: "/api/wallet/charge_req",
        method: "post",
        data: data,
        headers: {Authorization: this.token}
      }).then(res => {
        if (res.data.type == "ok") {
          layer.msg('充值申请已提交');
          that.form.num = '';
          that.form.from = '';
          that.form.hash = '';
          that.form.pic = [];
        } else {
          layer.msg('充值申请提交失败')
        }
      });
    }
  },
  created() {
    this.token = localStorage.getItem("token") || "";
  },

  mounted() {
    var that = this;
    that.getdata();
    that.init();
  }
};
</script>
<style lang="scss">
.el-form-item__label {
  color: #637085 !important;
}

.el-tabs--border-card > .el-tabs__header {
  background: transparent !important;
}

.el-tabs--border-card {
  background: transparent !important;
}

.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background: transparent !important;
}

.el-tabs--border-card, .el-tabs--border-card > .el-tabs__header {
  border-color: #171e25 !important;
}

.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  border-left-color: #171e25 !important;
  border-right-color: #171e25 !important;
  color: #00a4d8 !important;
}

.el-input__inner {
  border-color: #4d5373 !important;
  background-color: #181d25 !important;
  color: #cecfd0 !important;
}
</style>
<style lang="scss" scoped>
.header {
  padding: 15px 30px;
  overflow: hidden;
}


.min_lab {
  margin: 0 10px;
}

.min_lab input {
  margin-right: 3px;
}

.inp_lab {
  border: 1px solid #6b80ae;
  border-radius: 2px;
  padding: 3px 5px;
}

.inp_lab input {
  background: none;
  border: none;
  width: 120px;
  color: #fff;
}

.right_text {
  color: #5697f4;
}

.right_text span {
  cursor: pointer;
}

.record {
  margin-right: 10px;
}

.content_ul {
  padding: 0 20px;
}

.content_top {
  padding: 10px 20px;
  // background: #161617c7;
}

.content_li {
  padding: 15px 0;
  border-bottom: 1px solid #1e2c42;
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

.ewm:hover {
  cursor: pointer;
}

.operation span {
  cursor: pointer;
  margin: 0 5px;
}

.hide_div {
  border: 1px solid #1e2c42;
  padding: 20px;
}

.excharge_record {
  color: #5697f4;
}

input {
  background: none;
  border: none;
}

.address_inp {
  width: 100%;
  border: 1px solid #6b80ae;
  border-radius: 3px;
  padding: 15px 15px;
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

.bg {
  background: #2b3c71;
}

.ewm_wrap {
  position: relative;
}

.ewm_img {
  width: 150px;
  height: 150px;
  position: absolute;
  top: 25px;
  left: -45px;
  border: 10px solid #fff;
  z-index: 1;
}

.hide {
  display: none;
}

.rec-box {
  .rec-con {
    margin: 10px;
    padding: 0 20px;
    background: #262a42;

    span {
      flex: 1;
      text-align: center;
      line-height: 3;
    }

    .rec-title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #fff;
      line-height: 1.5;
    }

    li {
      display: flex;

      justify-content: space-between;
      font-size: 12px;
      color: #728daf;
      border-top: 1px solid #2e394c;
    }
  }
}

.more {
  width: 100%;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}

.transfer-modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  justify-content: center;
  align-items: center;
}

.transfer-mask {
  width: 500px;
  background-color: #262a42;
  margin: 0 auto;
  border-radius: 5px;
}

.transfer-header {
  line-height: 40px;
  text-align: center;
  position: relative;
}

.transfer-header p {
  position: absolute;
  right: 10px;
  top: 0;
}

.num_lab input::-webkit-input-placeholder {
  color: #aaa;
  font-size: 12px;
}
</style>
