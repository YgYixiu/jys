<template>
  <div class="account-main">
    <div class="clear mb50">
      <div class="fl">
        <img src="@/assets/images/account_security.png"/>
      </div>
      <div class="fl ml30">
        <p class="ft16 white">{{ $t('security.lever') }}
          <span class="ml10">{{ lever }}</span>
        </p>
        <div class="bar-bottom">
          <div class="bar-top" :style="widthBar"></div>
        </div>
        <p class="fColor2 ft14">
          {{ $t('security.lever') }} {{ lever }}，{{ $t('security.wan') }}</p>
      </div>
    </div>
    <ul>
      <li><img src="@/assets/images/success.png">
        <span class="ml20">{{ $t('security.invite') }}</span>
        <p class="fl">
          <span class="fColor1">{{ extension_code }}</span>
        </p>
        <span class="fr base ml25 mouseDefault"></span>
        <span class="fr base mouseDefault" id="copy" @click="copy">{{ $t('security.copy') }}</span>
      </li>
      <li><img :src="psrc">
        <span class="ml20">{{ $t('security.email') }}</span>
        <p class="fl">
          <span class="fColor1">{{ account }}</span>
        </p>
        <span class="fr base ml25 mouseDefault"></span>
        <span class="fr base mouseDefault"></span>
      </li>
      <li><img src="@/assets/images/success.png">
        <span class="ml20">{{ $t('security.logpwd') }}</span>
        <p class="fl">{{ $t('security.suggest') }}</p>
        <span class="fr base ml25 mouseDefault"></span>
        <span class="fr base mouseDefault" @click="goPwd()">{{ $t('security.set') }}</span>
      </li>
      <li class="hide"><img src="@/assets/images/icon_error.png">
        <span class="ml20">{{ $t('security.tvpw') }}</span>
        <p class="fl">{{ $t('security.tip1') }}</p>
        <span class="fr base ml25 mouseDefault"></span>
        <span class="fr base mouseDefault" @click="goTo(2)">{{ $t('security.setting') }}</span>
      </li>
      <li class="hide"><img src="@/assets/images/icon_error.png">
        <span class="ml20">{{ $t('security.google') }}</span>
        <p class="fl">{{ $t('security.tip2') }}</p>
        <span class="fr base ml25 mouseDefault"></span>
        <span class="fr base mouseDefault" @click="goNone()">{{ $t('security.gobind') }}</span>
      </li>
      <li class="hide"><img src="@/assets/images/icon_error.png">
        <span class="ml20">{{ $t('hop.truename') }}</span>
        <p class="fl">{{ $t('security.beforename') }}</p>
        <span class="fr base ml25 mouseDefault"></span>
        <span class="fr base mouseDefault" @click="goNone()">{{ $t('security.authentication') }}</span>
      </li>
      <li class="hide"><img src="@/assets/images/icon_error.png">
        <span class="ml20">{{ $t('security.myaddress') }}</span>
        <p class="fl"></p>
        <span class="fr base ml25 mouseDefault"></span>
        <span class="fr base mouseDefault" @click="goNone()">{{ $t('set.add') }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import "@/lib/clipboard.min.js"

export default {
  name: 'accountSet',
  data() {
    return {
      routerList: ["setCash", "setCash", "setCash", "setCash", "setCash", "setCash"],
      account: this.$t('security.notbaind'),
      email: this.$t('security.notbaind'),
      extension_code: '',
      lever: this.$t('security.low'),
      widthBar: 'width: 25%',
      bar: 25,
      authen: 0,
      psrc: require('@/assets/images/icon_error.png'),
      esrc: require('@/assets/images/icon_error.png')

    }
  },
  created() {
    this.userInfo();
  },
  methods: {
    goTo(index) {
      // this.$router.push({name: this.routerList[index]})
      layer.msg(this.$t('lay.notopen'))
    },
    goNone() {
      layer.msg(this.$t('lay.notopen'))
    },
    goPwd() {
      this.$router.push('/forgetPwd');
    },
    userInfo() {
      this.$http({
        url: '/api/' + 'user/info',
        method: 'get',
        data: {},
        headers: {'Authorization': localStorage.getItem('token')},
      }).then(res => {
        if (res.data.type == 'ok') {
          if (res.data.message.phone != null) {
            this.account = res.data.message.phone;
            this.psrc = require('@/assets/images/success.png');
            this.bar = this.bar + 25;
          }
          if (res.data.message.email != null) {
            this.email = res.data.message.email;
            this.esrc = require('@/assets/images/success.png');
            this.bar = this.bar + 25;
          }
          this.extension_code = res.data.message.extension_code;
          this.authen = res.data.message.review_status;
          if (this.authen == 2) {
            this.bar = this.bar + 25;
          }
          if (this.bar == 50) {
            this.lever = this.$t('lay.intermediate');
          } else if (this.bar == 75) {
            this.lever = this.$t('lay.high');
          } else if (this.bar == 100) {
            this.lever = this.$t('lay.strong');
          }
          this.widthBar = 'width:' + this.bar + '%';
        }
      }).catch(error => {

      })
    },
    copy() {
      var that = this;
      var clipboard = new Clipboard('#copy', {
        text: function () {
          layer.msg('copy success');
          return`${that.$utils.host}/app/#/components/register?extension_code=${that.extension_code}`; //that.$utils.host + '#/components/register?extension_code=' + that.extension_code
        }
      });
      clipboard.on("success", function (e) {
        that.flags = true;
        layer.msg(this.$t('lay.copys'));
      });
      clipboard.on("error", function (e) {
        that.flags = false;
        layer.msg(this.$t('lay.recopy'))
      });
    },
  }
}
</script>
<style lang="scss" scoped>
$navBack: #181b2a;
$base: #00a4d8;
$line: #303b4b;
$fColor2: #637085;
.account-main {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;

  .bar-bottom {
    width: 320px;
    height: 8px;
    border-radius: 4px;
    background-color: $navBack;
    margin: 22px 0 12px 0;
    overflow: hidden;

    .bar-top {
      background-color: $base;
      height: 100%;
    }
  }

  ul {
    border-top: 1px solid $line;
    color: $fColor2;
    font-size: 14px;

    img {
      width: 16px;
      vertical-align: middle;
    }

    li {
      border-bottom: 1px solid $line;
      line-height: 72px;
      position: relative;

      p {
        position: absolute;
        left: 300px;
        top: 0;
      }
    }
  }
}
</style>


// WEBPACK FOOTER //
// src/view/accountSet.vue
