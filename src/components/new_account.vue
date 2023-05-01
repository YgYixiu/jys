<template>
  <div class="box">
    <indexHeader></indexHeader>
    <div class="account">
      <div class="topcontent ft20 fColor1">
        <div style="width:1200px; margin:0 auto;">
          <span>{{ $t('account.assets') }}</span>
        </div>
      </div>
      <div class="content">
        <div class="leftcontent contentBK">
          <left></left>
        </div>
        <div class="rightcontent contentBK">
          <router-view></router-view>
        </div>
      </div>
    </div>

    <indexFooter></indexFooter>
  </div>
</template>
<script>
import indexHeader from '@/view/indexHeader'
import indexFooter from "@/view/indexFooter";
import left from '@/view/accounts/left_account'

export default {
  name: 'account',
  data() {
    return {
      lang: '',
      currentIndex: 0,
    }
  },
  components: {
    indexHeader,
    left,
    indexFooter
  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
.box .account {
  width: 100%;
  margin: 0;
  padding-top:0;
  background-color:#181d25;
}

.topcontent {
  height: 60px;
  line-height: 60px;
  padding: 0 30px;
  margin: 0px 0;
  font-size: 18px;
  border-radius: 3px;
  background-color: #181d25;
}
.content{
  width:1200px; margin:0 auto;
  display: flex;
  justify-content: space-between;
}
.leftcontent {
  width: 220px;
  margin-right: 4px;
  min-height: 350px;
  border-radius: 10px;
  padding: 4px;
  align-self: start;
}

.rightcontent {
  border-radius:10px;
  flex: 1;
}

</style>

