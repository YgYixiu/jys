<template>
  <div class="login">
    <indexHeader></indexHeader>
    <div class="contentBK" style="height: calc(100% - 20px)">
      <div class="content-wrap" style="height: 100%">
        <div class="account">
          <div class="main">
            <p class="main_title">{{ $t('login.welcome') }}</p>
            <div class="register-input">
              <span class="register-item">{{ $t('accounts') }}</span>
              <input type="text" class="input-main input-content" maxlength="120" v-model="account_number" id="account">
            </div>
            <div class="register-input">
              <span class="register-item">{{ $t('pwd') }}</span>
              <input type="password" class="input-main input-content" maxlength="16" v-model="password" id="pwd">
            </div>

            <div id="codess"> 
              <codes ref="codess" :title="$t('login_codes1')" :title1="$t('login_codes2')"></codes>
            </div>
            <div style="margin-top: 10px;">
              <span class="register-item"></span>
              <button class="register-button curPer" @click="login">{{ $t('header.in') }}</button>
              <div class="have-account">
                <router-link tag="span" class="baseColor" to="/forgetPwd" style="cursor:pointer">
                  {{ $t('login.forget') }}
                </router-link>
              </div>
            </div>
            
            <div class="right-tip ">
              <p>{{ $t('login.dont') }}</p>
              <p>{{ $t('login.invite') }}</p>
              <router-link :to="{ name: 'register'}">
                <p class="baseColor mt20">{{ $t('registers') }}</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <indexFooter></indexFooter>
  </div>

</template>

<script>
import indexHeader from '@/view/indexHeader'
import indexFooter from '@/view/indexFooter'
import codes from '@/components/codes'

export default {
  name: "login",
  components: {indexHeader, indexFooter,codes},
  data() {
    return {
      account_number: '',
      password: '',
    }
  },
  created() {
    this.account_number = this.$route.query.account_number || ''
  },
  methods: {
    userInfo() {
      this.$http({
        url: '/api/' + 'user/info',
        method: 'get',
        data: {},
        headers: {'Authorization': localStorage.getItem('token')},
      }).then(res => {
        if (res.data.type == 'ok') {
          localStorage.setItem('user_id', res.data.message.id);
          // localStorage.setItem('email',res.data.message.email);
          localStorage.setItem('extension_code', res.data.message.extension_code);
          localStorage.setItem('is_seller', res.data.message.is_seller);
          eventBus.$emit("seller", res.data.message.is_seller);
        }
      }).catch(error => {

      })

    },
    login() {
      if(!this.$refs.codess.get_code_status()){
        return layer.msg(this.$t('login_codes3'));
      }
      let account_number = this.$utils.trim(this.account_number);
      let password = this.$utils.trim(this.password);
      if (this.account_number.length == '') {
        layer.tips('please enter account', '#account');
        return;
      }
      if (this.password.length < 6) {
        layer.tips('Password cannot be less than six digits', '#pwd');
        return;
      }
      var i = layer.load();
      this.$http({
        url: '/api/' + 'user/login',
        method: 'post',
        data: {
          user_string: account_number,
          password: password,
          type: 1
        }
      }).then(res => {
        layer.close(i);
        res = res.data;
        if (res.type === 'ok') {
          localStorage.setItem('token', res.message);
          localStorage.setItem('accountNum', account_number);
          this.$store.commit('setAccountNum');
          this.userInfo();
          this.$router.push('/');
        } else {
          layer.msg(res.message);
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    // if(from.name == 'dealCenter'){
    // window.location.reload()
    // }
    next()
  }

}
</script>

<style lang="scss">
#codess{
  width: 520px;
  padding: 20px 0 0 0;
}
html,body{
  min-height: 100%;
}
.content-wrap {
  background: url(../../static/imgs/bg_login.png) center bottom 316px repeat-x, -webkit-linear-gradient(top, #181d25, #181d25);
  background-position: top center;
}
.day .content-wrap {
  background: url(../../static/imgs/bg_login.png) center bottom 316px repeat-x, -webkit-linear-gradient(top, #fff, #fff);
}

.account {
  width: 1200px;
  margin: 0 auto;
  padding-top: 43px;
  min-height: 880px;
}

.main {
  position: relative;
}

.main_title {
  font-size: 36px;
  color: #c7cce6;
}
.day .main_title{
  color:#484f73;
}

.register-item {
  display: block;
  height: 22px;
  color: #61688a;
  font-size: 12px
}

.register-input {
  position: relative;
  margin-top: 20px
}

.input-box {
  position: relative;
  margin-top: 40px;
}

.input-main {
  width: 520px;
  min-height: 46px;
  border: 1px solid #4e5b85;
  padding: 0 20px;
  color: #c7cce6;
  font-size: 14px;
  border-radius: 3px;
  background-color: #181d25;
}
.day .input-main{
  border: 1px solid #d4d4d4;
  background-color: #ffffff;
  color:#999;
}

.icon {
  width: 48px;
  height: 48px;
  line-height: 48px;
  border-right: 1px solid #52688c;
  position: absolute;
  top: 0;
}

.login-btn {
  width: 420px;
  margin-top: 40px;
  background: #5697f4;
  font-size: 16px;
  border-radius: 4px;
  color: #fff;
  line-height: 48px;
  cursor: pointer;
}

.noaccount {
  color: #fff;
}

.register-button {
  width: 200px;
  display: inline-block;
  line-height: 46px;
  background-color: #00a4d8;
/**#7a98f7;*/
  border-radius: 4px;
  color: #fff;
  border: none
}

.have-account {
  font-size: 14px;
  display: inline-block;
  margin-left: 30px
}

.right-tip {
  position: absolute;
  left: 620px;
  top: 70px;
  line-height: 24px;
  padding-right: 50px;
  margin-top: 10px;
  font-size: 14px;
  color: #61688a;
}
</style>


// WEBPACK FOOTER //
// src/components/login.vue
