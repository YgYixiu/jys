<template>
  <footer data-v-3ffbf6be="" data-locale="zh-cn" class="fedui-root fedui-footer" data-hostnmae="DEKS.vip">
    <div class="fedui-footer-inner">
      <!-- <div class="fedui-footer-left">
        <div class="fedui-footer-logo">
          <img width="80" height="auto" src="@/assets/images/logo.png" alt=""></div>
        <div class="fedui-footer-copyright"></div>
        <div class="fedui-footer-link">
          <a rel="noopener noreferrer nofollow" target="_blank" href="https://www.facebook.com/huobiglobalofficial">
            <i class="fedui-icon-facebook"></i>
          </a>
          <a rel="noopener noreferrer nofollow" target="_blank" href="https://twitter.com/HuobiGlobal">
            <i class="fedui-icon-twitter"></i>
          </a>
          <a rel="noopener noreferrer nofollow" target="_blank" href="https://www.youtube.com/HuobiGlobal">
            <i class="fedui-icon-youtube"></i>
          </a>
          <a rel="noopener noreferrer nofollow" target="_blank" href="https://www.huobichat.com/globalGroup">
            <i class="fedui-icon-chat"></i>
          </a>
          <a rel="noopener noreferrer nofollow" target="_blank" href="https://medium.com/@huobiglobal">
            <i class="fedui-icon-medium"></i>
          </a>
          <a rel="noopener noreferrer nofollow" target="_blank" href="https://www.instagram.com/huobiglobalofficial/">
            <i class="fedui-icon-instagram"></i>
          </a>
          <a rel="noopener noreferrer nofollow" target="_blank" href="https://weibo.com/huobicom">
            <i class="fedui-icon-weibo"></i>
          </a>
          <a rel="noopener noreferrer nofollow" target="_blank"
             href="https://coinmarketcap.com/zh/exchanges/huobi-global/">
            <i class="fedui-icon-coinmarketcap"></i>
          </a>
          <a rel="noopener noreferrer nofollow" target="_blank" href="https://www.coingecko.com/zh/exchanges/huobi/">
            <i class="fedui-icon-clingecko"></i>
          </a>
        </div>
      </div> -->
      <div class="fedui-footer-right-number" style="margin:0 auto">
        <div class="box-num-box">
          <div v-for="(item, key) in footSecond2" :key="'ids' + key" class="box-tiem-s" @click="goDetail(item.id)">
            {{ item.title }}
          </div>
        </div>
        <div class="box-num-box">
          <div v-for="(item, key) in footFrist2" :key="'sid' + key" class="box-tiem-s" @click="goDetail(item.id)">
            {{ item.title }}
          </div>
        </div>
        <div class="box-num-box">
          <div v-for="(item, key) in footContract" :key="'kid' + key" class="box-tiem-s" @click="goDetail(item.id)">
            {{ item.title }}
          </div>
        </div>
        <!--    <div class="box-num-box" style="margin-left: 20px;">
          <div class="btn-footer-show" @mouseenter="entershoweBtn" @mouseleave="leaveshowBtn">
            {{$t('appxz')}}
            <div v-show="issee" class="jianjiao"></div>
            <div v-show="issee" class="showone">
               <img src="@/assets/images/anzhuo.png" style="114px; 114px;" />
            </div>
          </div>
          <div class="btn-footer-show" @mouseenter="entershoweBtn1" @mouseleave="leaveshowBtn1">
            {{$t('enterWehat')}}
            <div v-show="issee1" class="jianjiao"></div>
            <div v-show="issee1" class="showone">
               <img src="@/assets/images/anzhuo.png" style="114px; 114px;" />
            </div>
          </div>
          <div class="btn-footer-show" @mouseenter="entershoweBtn2" @mouseleave="leaveshowBtn2">
            {{$t('fwmeiti')}}
            <div v-show="issee2" class="jianjiao"></div>
            <div v-show="issee2" class="showone">
               <img src="@/assets/images/anzhuo.png" style="114px; 114px;" />
            </div>
          </div>
        </div> -->
        <!-- <dl>
          <dt class="ft16">{{ $t('footer.about') }}</dt>
          <dd>
            <a href="javascript:;" @click="goDetail(item.id)" v-for="(item,key) in footSecond2">{{ item.title }}</a>
          </dd>
        </dl> -->
        <!-- <dl>
          <dt>{{ $t('footer.explain') }}</dt>
          <dd>
            <a href="javascript:;" @click="goDetail(item.id)" v-for="(item,key) in footFrist2">{{ item.title }}</a>
          </dd>
        </dl> -->

        <!--  <dl>
          <dt>{{ $t('footer.explain') }}</dt>
          <dd>
            <a href="javascript:;" @click="goDetail(item.id)" v-for="(item,key) in footFrist3">{{ item.title }}</a>
          </dd>
        </dl> -->
        <!-- <dl >
          <dt>{{ $t('footer.support') }}</dt>
          <dd>
            <a href="javascript:;" @click="goDetail(item.id)" v-for="(item,key) in footContract">{{ item.title }} </a>
          </dd>
        </dl> -->
      </div>
    </div>
    <div style="text-align: center; border-top:1px solid #303035; margin-top: 20px;">
      <!-- <div class="fedui-footer-copyright"></div> -->
      <!-- <div style="line-height: 25px; color:#00a4d8; padding-top: 30px;" class="white ft20">{{$t('siteName')}}</div> -->
      <div class="fedui-footer-logo" style="padding-top: 0px;">
        <img width="80" height="auto" src="@/assets/images/logo.png" alt="" />
      </div>

      <div style="line-height: 20px; padding-bottom: 20px;" class="fColor2 ft12">
        ©Copyright 2021 Exmocoim. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      issee2: false,
      issee1: false,
      issee: false,
      token: '',
      img_link: [],
      link: [],
      footFrist2: [],
      footFrist3: [],
      footContract: [],
      wxImg: false,
      footSecond2: []
    };
  },
  created() {
    this.token = window.localStorage.getItem('token') || '';
    this.getData();
  },
  mounted() {
    this.aboutUs();
    this.help();
    this.contract();
  },
  methods: {
    entershoweBtn() {
      this.issee = true;
    },
    leaveshowBtn() {
      this.issee = false;
    },
    entershoweBtn1() {
      this.issee1 = true;
    },
    leaveshowBtn1() {
      this.issee1 = false;
    },
    entershoweBtn2() {
      this.issee2 = true;
    },
    leaveshowBtn2() {
      this.issee2 = false;
    },
    goDetail(id) {
      this.$router.push({
        path: 'components/noticeDetail',
        query: {
          id: id
        }
      });
    },
    noopen() {},
    getData() {},
    aboutUs() {
      var that = this;
      this.$http.post('/api/news/list', { c_id: 19, lang: localStorage.getItem('lang') }).then((res) => {
        if (res.data.type == 'ok') {
          var list = res.data.message.list;
          if (list.length > 2) {
            that.footFrist2 = list;
          } else {
            that.footFrist2 = list;
          }
        } else {
          // layer.msg(res.message);
        }
      });
    },
    help() {
      var that = this;
      this.$http.post('/api/news/list', { c_id: 21, lang: localStorage.getItem('lang') }).then((res) => {
        if (res.data.type == 'ok') {
          var list = res.data.message.list;
          if (list.length > 2) {
            that.footSecond2 = list;
          } else {
            that.footSecond2 = list;
          }
        } else {
          // layer.msg(res.message);
        }
      });
    },
    contract() {
      var that = this;
      this.$http.post('/api/news/list', { c_id: 25 }).then((res) => {
        if (res.data.type == 'ok') {
          var list = res.data.message.list;
          if (list.length > 2) {
            that.footContract = list;
          } else {
            that.footContract = list;
          }
        } else {
          // layer.msg(res.message);
        }
      });
    },
    wxImg_over(i) {
      this.img_link[i].wxImg = true;
    },
    wxImg_out(i) {
      this.img_link[i].wxImg = false;
    }
  }
};
</script>

<style lang="scss">
.fedui-footer {
  width: 100%;
  background-color: #101032; //#181d25; //#101032
  color: #697080;
  padding-top: 0px;
  padding-bottom: 0px;
  min-width: 1280px;
}

.fedui-root,
.fedui-root *,
.fedui-root :after,
.fedui-root :before {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.fedui-footer-inner {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding-top: 0px;
  //border-top: 1px solid #00a4d8;
}

.fedui-footer-logo {
  height: 23px;
}

.fedui-footer-copyright {
  font-size: 12px;
  color: #6a707f;
  line-height: 12px;
  padding-top: 16px;
}

.fedui-footer-link {
  padding-top: 40px;
}

.fedui-footer-link a:first-child {
  margin-left: 0;
}

.fedui-footer-link a {
  margin-left: 8px;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  color: #a8b7c8;
  display: inline-block;
  border-radius: 50%;
  vertical-align: top;
}

.fedui-footer-right {
  width: 100% !important;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: center;
  text-align: center;
  flex-direction: row;
  align-items: center;
  // background: #ff0000;
  height: 50px;
}

.fedui-footer-right-number {
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: row;
  align-items: center;
  //  background: #ff0000;
  height: 50px;
  width: 100% !important;
}

.box-num-box {
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: row;
  align-items: center;
  // margin-right: 15px;
}

.box-tiem-s {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 5px;
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 6px;
  font-size: 16px;
  color: #9999d4;
  cursor: pointer;
  margin-right: 15px;
}

.box-tiem-s:hover {
  color: #cecef0;
}

.btn-footer-show {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 0 10px;
  height: 36px;
  border-radius: 2px;
  border: 1px solid rgba(153, 153, 212, 0.47);
  line-height: 36px;
  text-align: center;
  margin-right: 15px;
  color: #9999d4;
  width: 120px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
}

.btn-footer-show:hover {
  border: 1px solid #cecef0;
  color: #cecef0;
}

.showone {
  display: flex;
  position: absolute;
  top: -135px;
  left: 50%;
  margin-left: -56px;
  height: 114px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 15%);
}

.jianjiao {
  position: absolute;
  border-top: solid 10px #fff;
  border-left: solid 10px transparent;
  border-right: solid 10px transparent;
  top: -21px;
  left: 55px;
  width: 0;
  height: 0;
}

.fedui-footer-right {
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: row;
  align-items: center;
  a:hover {
    color: #fff;
  }
}

.fedui-footer-right dl {
  width: 30% !important;
  margin-left: 20px !important;
}

.fedui-root dd,
.fedui-root dl,
.fedui-root dt,
.fedui-root li,
.fedui-root ul {
  padding: 0;
  margin: 0;
}

.fedui-footer-right dt {
  line-height: 20px;
  font-size: 16px;
  padding-bottom: 8px;
}

.fedui-footer[data-locale='ko-kr'] .fedui-footer-right a,
.fedui-footer[data-locale='zh-cn'] .fedui-footer-right a,
.fedui-footer[data-locale='zh-hk'] .fedui-footer-right a,
.fedui-footer[data-locale='zh-tw'] .fedui-footer-right a {
  line-height: 18px;
}

.fedui-footer-right a {
  padding-top: 8px;
  display: block;
  font-size: 12px;
  line-height: 16px;
  color: #d5def2;
  word-wrap: break-word;
}
</style>
