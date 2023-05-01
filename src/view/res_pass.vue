<template>
  <div id="transfer-legal">
    <div class="title">{{ $t("pass3") }}</div>

    <div class="choose-wrap">
       <div class="tip" v-if="true" style="margin-bottom: 10px">
        {{ $t("pass5") }}
      </div>
      <div class="flex" style="align-items: center">
        <el-input  :placeholder="$t('pass5')" v-model="account">
        </el-input>
      </div>
      <div class="tip" v-if="true" style="margin-bottom: 10px">
        {{ $t("pass4") }}
      </div>
      <div class="flex" style="align-items: center">
       
        <el-input
          type="password"
          :placeholder="$t('pass4')"
          v-model="withdraw_password"
        >
        </el-input>
      </div>




      

      <div class="tip" v-if="true" style="margin-bottom: 10px">
        {{ $t("register.codenum") }}
      </div>
      <div class="code-box"    style="width: 650px" v-if="true">
        <input
          style="width: 400px"
          type="number"
          :placeholder="$t('register.codenum')"
          :readonly="readonly"
          @click="readonly = false"
          v-model="code"
          class="code"
        />
        <button type="button" class="code-btn curPer" @click="sendCode">
          {{ sendCodeText }}
        </button>
      </div>
      <button
        class="confirm-btn curPer"
        v-if="false"
        @click="checkCode"
        type="button"
      >
        {{ $t("confirm") }}
      </button>
    </div>
    <div style="height: 100px"></div>
    <button type="button" class="transfer curPer" @click="transfer">
      {{ $t("pass6") }}
    </button>
  </div>
</template>

<script>
let [loadedCoin, loadCurrency] = [false, false];
export default {
  data() {
    return {
      code: "",
      sendCodeTime: 60,
      sendCodeText: this.$t("register.sendcode"),
      readonly: true,
      token: "",
      account: "",

      withdraw_password: "",
    };
  },
  created() {
    this.getCoins();
    this.initCurrencyList();
  },
  watch: {
    value1: {
      handler(newVal) {
        if (loadedCoin) this.computeBalance();
      },
      deep: true,
      immediate: false,
    },
    value2: {
      handler(newVal) {
        // this.computeBalance();
      },
      deep: true,
      immediate: false,
    },
    coinIndex: {
      handler(newVal) {
        if (loadCurrency) this.computeBalance();
      },
      deep: true,
      immediate: false,
    },
  },
  methods: {
    sendCode(e) {
      let that = this;
      let isMb = this.isMb;
      let url = "sms_send";
      if (this.account == "") {
        this.$message.error(that.$t("lay.paccount"));
        return;
      } else if (e.target.disabled) {
        return;
      } else if (isMb) {
        // var reg = /^1[3456789]\d{9}$/;
        // if (!reg.test(this.account)) {
        //   // layer.msg("您输入的手机号不符合规则");
        //   // return;
        // }
      } else if (!isMb) {
        var emreg =
          /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!emreg.test(this.account)) {
          this.$message.error(this.$t("register.emailnum"));
          return;
        } else {
          url = "sms_mail";
        }
      } else {
      }

      let data = { user_string: this.account };
      if (url == "sms_send") {
        data.country_code = country[this.areaCode].area_code;
      }

       data.type='update'

      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      this.$http({
        url: "/api/" + url,
        method: "post",
        data: data,
      }).then((res) => {
        loading.close();
        if (res.data.type != "error") {
          // var time = 60;
          this.$message({
            message: res.data.message,
            type: "success",
          });
          that.sendCodeTime = 60;
          this.timer = setInterval(function () {
            that.sendCodeTime--;
            that.sendCodeText = that.sendCodeTime + "s";
            // e.target.innerHTML = time + "s";
            // e.target.disabled = true;
            if (that.sendCodeTime == 0) {
              window.clearInterval(that.timer);
              that.sendCodeText = that.$t("register.sendcode");
              // e.target.innerHTML = that.$t('code');
              // e.target.disabled = false;
              return;
            }
          }, 1000);
        } else {
          that.$message.error(res.data.message);
        }
      });
    },
    checkCode() {
      let code = this.code;
      if (this.account == "") {
        layer.msg(this.$t("lay.paccount"));
        return;
      } else if (this.code == "") {
        layer.msg(this.$t("lay.notcode"));
        return;
      } else {
        if (!this.isMb) {
          if (
            !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
              this.account
            )
          ) {
            layer.msg(this.$t("register.emailnum"));
            return;
          }
        } else {
          if (!/^1[0-9]{10}$/.test(this.account)) {
            layer.msg("please enter a valid phone number");
            return;
          }
        }
        let data = {};
        let url = "user/check_email";
        if (this.isMb) {
          data = { mobile_code: this.code };
          url = "user/check_mobile";
        } else {
          data = { email_code: this.code };
        }
       

        this.$http({
          url: "/api/" + url,
          method: "post",
          data: data,
        }).then((res) => {
          layer.msg(res.data.message);

          if (res.data.type == "ok") {
            this.codeTrue = true;
            this.getRegion("", "provinces");
          } else {
          }
        });
      }
    },
    getCoins() {
      let that = this;
      this.token = window.localStorage.getItem("token") || "";
      this.$http({
        url: "/api/wallet/list",
        method: "post",
        headers: { Authorization: this.token },
      }).then((res) => {
        if (res.data.type == "ok") {
          let [
            lever_balance,
            micro_balance,
            change_balance,
            lever_wallet,
            micro_wallet,
            legal_wallet,
            change_wallet,
          ] = [
            {},
            {},
            {},
            res.data.message.lever_wallet,
            res.data.message.micro_wallet,
            res.data.message.legal_wallet,
            res.data.message.change_wallet,
          ];

          lever_wallet.balance.forEach((x) => {
            lever_balance[x.currency_name] = x.lever_balance;
          });

          micro_wallet.balance.forEach((x) => {
            micro_balance[x.currency_name] = x.micro_balance;
          });

          change_wallet.balance.forEach((x) => {
            change_balance[x.currency_name] = x.change_balance;
          });

          let coins = legal_wallet.balance;
          for (let i = coins.length - 1; i >= 0; i--) {
            let item = coins[i];
            coins[i].lever_balance = lever_balance[item.currency_name];
            coins[i].micro_balance = micro_balance[item.currency_name];
            coins[i].change_balance = change_balance[item.currency_name];
          }
          that.coins = coins;
          that.coinIndex = 0;
          setTimeout(() => {
            that.value1 = "change";
            that.value2 = "lever";
          }, 100);

          loadedCoin = true;
        }
      });
    },
    transfer() {
      let that = this;

      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      this.$http({
        url: "/api/set_withdraw_password",
        method: "post",
        data: {
          code: that.code,
             account: that.account,
          withdraw_password: that.withdraw_password,
        },
        headers: { Authorization: this.token },
      }).then((res) => {
        loading.close();
        if (res.data.type == "ok") {
          this.$message({
            message: res.data.message,
            type: "success",
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    initCurrencyList() {
      let token = localStorage.getItem("token");
      let that = this;
      this.$http({
        url: "/api/" + "currency/user_currency_list",
        method: "get",
        data: {},
        headers: { Authorization: token },
      })
        .then((res) => {
          if (res.data.type == "ok") {
            var datas = res.data.message;
            if (datas.length > 0) {
              var arr = [];
              for (var i = 0; i < datas.length; i++) {
                var nums =
                  datas[i].is_legal -
                  0 +
                  (datas[i].is_lever - 0) +
                  (datas[i].is_match - 0) +
                  (datas[i].is_micro - 0);
                if (nums > 1) {
                  arr.push(datas[i]);
                }
              }

              console.log(arr);

              var arr2 = [];
              // if (arr[0].is_legal == 1) {
              //   var obj = {
              //     type: "legal",
              //     texts: that.$t("account.laccount")
              //   };
              //   arr2.push(obj);
              // }

              if (arr[0].is_micro == 1) {
                var obj = {
                  type: "micro",
                  texts: that.$t("account.letransaction"),
                };
                arr2.push(obj);
              }
              if (arr[0].is_lever == 1) {
                var obj = {
                  type: "lever",
                  texts: that.$t("account.taccount"),
                };
                arr2.push(obj);
              }

              if (arr[0].is_match == 1) {
                var obj = {
                  type: "change",
                  texts: that.$t("usercenter.change"),
                };
                arr2.push(obj);
              }

              that.accountList = arr2;
              that.currencyList = arr;

              console.log("账户列表", arr2, arr);

              that.value1 = arr2[0].texts;
              that.value2 = arr2[1].texts;
              if (arr2[0].type == "lever") {
                that.transferBalance = arr[0].wallet.lever_balance;
              } else if (arr2[0].type == "micro") {
                that.transferBalance = arr[0].wallet.micro_balance;
              } else if (arr2[0].type == "change") {
                that.transferBalance = arr[0].wallet.change_balance;
              } else if (arr2[0].type == "legal") {
                that.transferBalance = arr[0].wallet.legal_balance;
              }

              loadCurrency = true;
            }
          } else {
            return;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    selectOne(command) {},
    selectTwo(command) {},
    computeBalance() {
      if (loadedCoin && loadCurrency) {
        let baseCoin = this.coins[this.coinIndex];
        if (!baseCoin) {
          return;
        }
        this.number = "";
        switch (this.value1) {
          case "legal":
            //法币
            this.transferBalance = baseCoin.legal_balance;
            break;
          case "micro":
            //秒合约
            this.transferBalance = baseCoin.micro_balance;
            break;
          case "lever":
            //合约
            this.transferBalance = baseCoin.lever_balance;
            break;
          case "change":
            this.transferBalance = baseCoin.change_balance;
            break;
        }
      }
    },
    changeCoin(e) {
      this.coinIndex = e;
    },
  },
};
</script>

<style lang="scss">
.el-select-dropdown__item.selected {
  color: #00a4d8 !important;
  font-weight: normal !important;
}

.el-loading-spinner .el-loading-text {
  color: #00a4d8 !important;
}

.el-loading-spinner i {
  color: #00a4d8 !important;
}
</style>
<style lang='scss' scoped>
.choose-wrap {
  padding-top: 50px;
  width: 70%;
  margin: 0 auto;

  /deep/ {
    .el-input__inner {
      background: #000 !important;
    }

    .el-input-group__append {
      background: #000;
      border-color: #4d5373;
    }
  }

  > div {
    margin-bottom: 40px;

    *:first-child {
      width: 30%;
    }

    *:last-child {
      flex: 1;
    }
  }
}

.el-dropdown {
  cursor: pointer;
}

#transfer-legal {
  padding: 0 30px;
  color: #c7cce6;

  > .title {
    padding: 20px 0;
    font-size: 24px;
    color: #61688a;
  }

  > .coins {
    display: flex;
    justify-content: center;

    li {
      margin-right: 20px;
      padding: 5px 20px;
      color: #fff;
      background: #234165;
    }

    .active {
      background: #00a4d8;
    }
  }

  > .types {
    margin: 30px 0;
    //   width: 400px;
    height: 80px;
    display: flex;
    justify-content: space-between;
    line-height: 40px;

    .types-r {
      display: flex;
    }

    img {
      margin: 25px;
      width: 30px;
      height: 30px;
    }
  }

  .number {
    margin: 30px 0 0;
    //   width: 430px;
    line-height: 40px;

    input {
      border: none;
      color: #f2f5ff;
      background: none;
      line-height: 40px;
      width: 800px;
      border-bottom: 2px solid #ccc;
    }

    .all {
      margin-left: 10px;
      padding-left: 10px;
      border-left: 1px solid #ccc;
    }
  }

  .transfer {
    display: block;
    margin: 0 auto;
    line-height: 40px;
    width: 50%;
    background: #00a4d8;
    color: #fff;
    border: none;
    border-radius: 5px;
  }
}
input {
  width: 520px;
  min-height: 46px;
  border: 1px solid #4e5b85;
  padding: 0 20px;
  color: #c7cce6;
  font-size: 14px;
  border-radius: 3px;
  background-color: #181d25;
}

> .title {
  font-size: 36px;
}

> .tab {
  margin: 10px 0 20px;

  span {
    margin: 0 20px;
  }
}
.code {
  width: 600px;
}
.code-box {
  width: 520px;
  height: 46px;
  background-color: #181d25;
  border: 1px solid #4e5b85;

  input {
    border: none;
    height: 44px;
    min-height: 44px;
    width: 319px;
  }

  button {
    border: none;
    line-height: 43px;
    width: 193px;
    color: #c7cce6;
    border-left: 1px solid #2c3846;
    background: #181d25;
  }
}
</style>
