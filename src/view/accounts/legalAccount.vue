<template>
    <div class="main">
        <p class="legal_name plr10">{{legal_name}}</p>
        <div class="legalAccount_msg flex between plr10">
          <div>
              <p class="ft12 msg_title">{{$t('center.available')}}</p>
              <p>{{legal_balance | toFixeds}}</p>
          </div>
          <div>
              <p class="ft12 msg_title">{{$t('account.freezes')}}</p>
              <p>{{lock_legal_balance | toFixeds}}</p>
          </div>
          <div>
              <p class="ft12 msg_title">{{$t('account.conversion')}}（CNY）</p>
              <p>{{cny_price | toFixeds}}</p>
          </div>
        </div>
        <div class="rec_wrap">
           <p class="rec_title flex between">
               <span>{{$t('account.mrecord')}}</span>
               <span class="all">{{$t('center.all')}}</span>
           </p>
           <p class="list_title flex">
               <span class="ft14">{{$t('number')}}</span>
               <span class="ft14 tc">{{$t('account.record')}}</span>
               <span class="ft14 tr">{{$t('time')}}</span>
           </p>
           <ul class="log_list">
              <li class="flex arround ft12 flex around" v-for="(item,index) in list">
                  <span>{{item.value | toFixeds}}</span>
                  <span class="tc">{{item.info}}</span>
                  <span class="tr">{{item.created_time}}</span>
              </li>
           </ul>
           <p class="tc ft12 curPer mt20" @click="getMore()" v-if="more">{{$t('more')}}</p>
           <p class="tc ft12 curPer mt20" v-else>{{$t('nodata')}}</p>
        </div>
        <!-- <router-link tag="p" class="huazhuan" to='/transferLegal'>划转</router-link> -->
    </div>
</template>
<script>
export default {
    data(){
        return{
           currency:'',
           legal_name:'',
           legal_balance:'',
           lock_legal_balance:'',
           cny_price:'',
           page:1,
           list:[],
           more:true
        }
    },
    filters: {
        toFixeds: function(value) {
            value = Number(value);
            return value.toFixed(2);
        }
    },
    created(){
       this.token = localStorage.getItem('token') || '';
       this.currency=this.$route.query.currency_id;

    },
    mounted(){
        this.init();
        this.legal_log();
    },
    methods:{
        init(){
            var that = this
            this.$http({
            url: '/api/' + 'wallet/detail',
            method:'post',
            data:{
                currency:that.currency,
                type:'legal'
            },
            headers: {'Authorization':  that.token}
            }).then(res=>{  
                if(res.data.type  =='ok'){
                    var msg = res.data.message;
                    that.legal_name = msg.currency_name;
                    that.legal_balance = msg.legal_balance;
                    that.lock_legal_balance = msg.lock_legal_balance;
                    that.cny_price = (msg.legal_balance-0)*(msg.cny_price);
                }else{
                    // layer.msg(res.message);
                }
            }).catch(error=>{
                console.log(error)
            })            
        },
        legal_log(){
            var that = this
            this.$http({
            url: '/api/' + 'wallet/legal_log',
            method:'post',
            data:{
                currency:that.currency,
                type:1,
                page:that.page
            },
            headers: {'Authorization':  that.token}
            }).then(res=>{  
                if(res.data.type  =='ok'){
                    var list = res.data.message.list;
                    if(list.length>0){
                        that.list=that.list.concat(list); 
                    }else{
                        that.more=false;
                    }
                   
                }else{
                    // layer.msg(res.message);
                }
            }).catch(error=>{
                console.log(error)
            })            
        },
        getMore(){
            this.page=this.page+1;
            this.legal_log();
        }
    }
}
</script>
<style scoped>
   .legal_name{
       background: #1b1e2e;
       padding: 5px 10px;
   }
    .msg_title{
        color: #61688a;
    }
   .main{
       color:#fff;
       padding: 30px;
   }
   .legalAccount_msg{
       background: #1b1e2e;
       padding: 6px 10px;
   }
   .legalAccount_msg div p:first-child{
       margin-bottom: 10px;
   }
   .rec_wrap{
       margin-top: 30px;
       margin-bottom: 30px;
   }
   .rec_title{
       margin-bottom: 10px;
       
   }
   .all{
        color: #61688a;
   }
   .list_title{
       padding: 10px;
       background: #1b1e2e;
   }
   .list_title span{flex: 1}
   .huazhuan{
       text-align: center;
       margin-top: 60px;
       background: #7a98f7;
       padding: 8px;
   }
   .huazhuan:hover{
       cursor: pointer;
   }
   .log_list li{padding: 10px;}
   .log_list li span{flex: 1;}
</style>