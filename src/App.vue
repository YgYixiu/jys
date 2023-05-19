<template>
  <div id="app" :class="(night_mode==null||parseInt(night_mode)==0)?'night':'day'">
    <router-view/>
  </div>
</template>

<style lang="scss">
.flex {
  display: flex;
  flex-direction: row;
}

.column {
  flex-direction: column;
}

.flex-all {
  flex: 1;
}
</style>

<script>

export default {
  name: "App",
  data() {
    return {
      'night_mode': '1',
    }
  },
  async created() {
    const tabs = await this.getTabs()
    document.title=this.$t('siteName');
    this.night_mode = localStorage.getItem('night_mode');
    this.$http({
      url: "/api/" + "currency/quotation_new",
      method: "get",
      data: {},
      headers: {Authorization: localStorage.getItem("token")}
    })
        .then(res => {
          if (res.data.type == "ok") {
            this.tabList = res.data.message;
            var msg = res.data.message;
            var arr_quota = [];
            for (var i = 0; i < msg.length; i++) {
              arr_quota[i] = msg[i].quotation;
            }
            const tabIndex = localStorage.getItem('tabIndex') || tabs[0].value
            const index = arr_quota[0].findIndex(item => item.currency_type === Number(tabIndex))
            console.log('app', index)
            if (!window.localStorage.getItem("downUp")) {
              window.localStorage.setItem("downUp", arr_quota[0][index].change);
            }
            if (!window.localStorage.getItem("legal_id_cur")) {
              window.localStorage.setItem(
                  "legal_id_cur",
                  arr_quota[0][index].currency_id
              );
            }
            if (
                !localStorage.getItem("legal_id") &&
                !localStorage.getItem("currency_id") &&
                !localStorage.getItem("legal_name") &&
                !localStorage.getItem("currency_name")
            ) {
              window.localStorage.setItem(
                  "legal_id",
                  msg[0].quotation[index].legal_id
              );
              window.localStorage.setItem(
                  "currency_id",
                  msg[0].quotation[index].currency_id
              );
              window.localStorage.setItem(
                  "legal_name",
                  msg[0].quotation[index].legal_name
              );
              window.localStorage.setItem(
                  "currency_name",
                  msg[0].quotation[index].currency_name
              );
              var symbol =
                  msg[0].quotation[index].currency_name +
                  "/" +
                  msg[0].quotation[index].legal_name;
              window.localStorage.setItem(
                  "shareNum",
                  msg[0].quotation[index].lever_share_num
              );
              // var priceScale=Math.pow(10,5);
              var priceScale = 100000;
              window.localStorage.setItem("priceScale", priceScale);
              window.localStorage.setItem("symbol", symbol);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
  },
  methods:{
    getTabs(){
      return this.$http.get("/api/currency/type").then((res)=>{
        const {type,message} = res.data
        if(type === 'ok'){
          const intlKeys = ['forex', 'commodity', 'index', 'cryptocurrency']
          return message.sort((a,b)=>a.sort-b.sort).map(item=>{
            item.name = intlKeys[item.value]
            return item
          })
        }
      })
    },
  }
};
</script>

<style lang='scss'>
#app {
  .el-slider__runway {
    background-color: #2e3244;
  }
}
</style>

