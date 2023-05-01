<template>
  <div class="hide_div">
    <el-form ref="form" :model="form" label-width="160px" label-style="color:#fff;">
      <el-form-item :label="$t('account.choosecoin')">
        <el-select v-model="currency">
          <el-option v-for="opt in accounts" :value="opt.value" :label="opt.label.toUpperCase()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('account.cgaddress')">
        <el-tabs @tab-click="changeUSDT" type="border-card" style="margin:10px 0;">
          <el-tab-pane v-if="currency===3" v-for="(item,index) in Object.keys(usdt_wallet)"
                       :label="item.toUpperCase() || '' ">
          </el-tab-pane>
          <!-- <img class="mt10 mb15" style="width:200px;"
               :src="'https://coin.ifti.top/api/qrcode?text='+excharge_address"> -->
          <p class=" mb50">
            <span class="ft18 fColor1 excharge_address" :class="{'bg':flags}">{{ excharge_address }}</span>
            <span id="copy" @click="copy" class="copy ft14" v-show="excharge_address">{{ $t('account.copy') }}</span>
            <!-- <span class="ewm_wrap">
              <span class="ewm ft14" @click="show_ewm">{{ $t('account.code') }}</span>
              <div class="ewm_img" id="code" :class="{'hide':isHide}"></div>
            </span> -->
          </p>
        </el-tabs>
      </el-form-item>
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
        <el-button type="primary" size="medium" @click="submitChargeInfo(item.value)">
          {{ $t('account.submitRecharge') }}
        </el-button>
      </el-form-item>
    </el-form>

    <p class="ft12 fColor2 mb15">{{ $t('account.notice') }}</p>
    <ul class="tips_ul ft12 fColor2" style="list-style:disc inside">
      <li class="tips_li" style="list-style:disc inside">
        {{ $t('account.a1') }}{{ item.label || '' }}{{ $t('account.a2') }}
      </li>
      <li v-if="item.label==='eth'" class="tips_li" style="list-style:disc inside">
        {{ $t('account.a4') }}
      </li>
      <li v-else-if="item.label==='btc'" class="tips_li" style="list-style:disc inside">
        {{ $t('account.a9') }}
      </li>
      <li v-else-if="item.label==='usdt'" class="tips_li" style="list-style:disc inside">
        {{ $t('account.a4') }}
      </li>
      <li v-else-if="item.label==='omni'" class="tips_li" style="list-style:disc inside">
        USDT{{ $t('account.a3') }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'accountRecharge',
  data() {
    return {
      currency: 3,
      usdt_wallet: {},
      token: '',
      flags: false,
      excharge_address: '',
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
      form: {
        from: '',
        num: '',
        pic: [],
        hash: '',

      },
      uploadUrl: '',
      uploadHeaders: {},
    }
  },
  computed: {
    item() {
      return this.accounts.find(account => account.value === this.currency)
    }
  },
  created() {
    this.token = localStorage.getItem('token') || '';
    this.sendData(this.currency)
  },
  watch:{
    currency(val){
      this.excharge_address = ''
      this.sendData(val)
    }
  },
  methods: {
    submitChargeInfo(currency) {
      let data = {};
      data.currency = currency;
      data.acc = this.form.from;
      data.hash = this.form.hash;
      data.amount = this.form.num;
      data.type = this.excharge_address;

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
      const loading = this.$loading();
      this.$http({
        url: '/api/wallet/charge_req',
        method: 'post',
        data: data,
        headers: {Authorization: this.token}
      }).then(res => {
        loading.close();
        if (res.data.type == 'ok') {
          layer.msg(res.data.message);
          that.form.num = '';
          that.form.from = '';
          that.form.hash = '';
          that.form.pic = [];
        } else {
          layer.msg(res.data.message)
        }
      });
    },
    uploadFile(f) {

      let that = this;
      let formData = new FormData();
      formData.append('file', f.file);

      this.$http.post('/api/upload', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      }).then(res => {
        let msg = res.data;
        if (msg.type == 'ok') {
          that.form.pic = [{name: '已上传', url: msg.message}];
        } else {
          layer.msg(msg.message)
        }
      });
    },
    changeUSDT(tab, event) {
      let key = Object.keys(this.usdt_wallet)[tab.index];
      this.excharge_address = this.usdt_wallet[key];
    },
    //复制
    copy() {
      const clipboard = new Clipboard('.copy', {
        text: () => {
          return this.excharge_address;
        }
      });
      clipboard.on('success', (e) => {
        this.flags = true;
        layer.msg(this.$t('lay.copys'));
      });
      clipboard.on('error', (e) => {
        this.flags = false;
        layer.msg(this.$t('lay.fcopy'));
      });
    },
    sendData(currency) {
      this.$http({
        url: '/api/' + 'wallet/get_in_address',
        method: 'post',
        data: {currency: currency},
        headers: {Authorization: this.token}
      }).then(res => {
        if (res.data.type == 'ok') {

          if (currency == 1 || currency == 3 || currency == 2) {
            this.excharge_address = currency == 1 ? res.data.message.btc : res.data.message.usdt;

            this.excharge_address = res.data.message.address;
            if (this.currency == 3) {
              let usdt = res.data.message.address;
              console.log(usdt);
              let wallets = [];
              if (usdt) {
                let arr = usdt.split(',');
                if (arr.length == 1) {
                  let arr0 = arr[0].split(':');
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
                this.usdt_wallet = wallets;
                if (Object.keys(this.usdt_wallet).length > 1) {
                  this.excharge_address = this.usdt_wallet[Object.keys(this.usdt_wallet)[0]];
                }
              }
            }
            // 生成二维码

          } else {
            this.excharge_address = 'Not support yet!'
            $('#code').qrcode({
              width: 130, //宽度
              height: 130, //高度
              text: this.excharge_address
            });
          }
        } else {

        }
      }).catch(error => {
        console.log(error);
      });
    },
  }
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
</style>
