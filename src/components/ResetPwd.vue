<template>
<div class="reset-box">
    <indexHeader></indexHeader>
    <div class="contentBK">
        <div class="content-wrap">
            <div class="account">
                <div class="main">
                    <p class="main_title">{{$t('lgpwd.setpwd')}}</p>
                    <div class="register-input">
                        <span class="register-item">{{$t('lpwd.newpwd')}}</span>
                        <input type="password" class="input-main input-content" maxlength="20" v-model="pwd" id="pwd">
                    </div>
                     <div class="register-input">
                        <span class="register-item">{{$t('lpwd.repwd')}}</span>
                        <input type="password" class="input-main input-content" maxlength="16" v-model="repwd" id="repwd">
                    </div>
                    <div style="margin-top: 10px;">
                        <span class="register-item"></span>
                        <button class="register-button curPer" @click="reset">{{$t('confirm')}}</button>
                        
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
    export default {
       
        components:{indexHeader,indexFooter},
        data (){
            return{
                pwd:'',
                repwd:'',
                user_string:''
            }
        },
		created (){
			this.account_number = this.$route.params.user_string || ''
		},
        methods:{
            reset(){
                if(this.pwd == ''){
                    layer_tips(this.$t('lpwd.pwd'))
                    return;
                } else if(this.repwd == ''){
                    layer.msg(this.$t('lgpwd.renewpwd'));
                    return;
                } else if(this.pwd !== this.repwd){
        	    layer.msg(this.$t('lay.twopwd'));
                    return;
                } else {
                    this.$http({
                        url:'/api/' + url,
                        method:'post',
                        data:{}
                    })
                }
            }
        }

    }
</script>

<style scoped>
	.content-wrap{background: url(../../static/imgs/bg_login.png) center bottom 316px repeat-x,-webkit-linear-gradient(top,#21263f,#262a42);}
	.account{width: 1200px;margin: 0 auto;padding-top: 93px;overflow: hidden;min-height: 880px;}
	.main{position: relative;padding: 0 0 60px 30px;}
	.main_title{font-size: 36px;color: #c7cce6;}
    .register-item{display: block;height:22px;color: #61688a;font-size: 12px}
	.register-input{position: relative;margin-top: 20px}
	.input-box{position: relative;margin-top: 40px;}
	.input-main{width: 520px;min-height: 46px;border: 1px solid #4e5b85;padding: 0 20px;color: #c7cce6;font-size: 14px;border-radius: 3px;background-color: #1e2235; }
	.icon{width: 48px;height: 48px;line-height: 48px;border-right: 1px solid #52688c;position: absolute;top: 0;}
	.login-btn{width: 420px;margin-top: 40px;background: #5697f4;font-size: 16px;border-radius: 4px;color: #fff;line-height: 48px;cursor: pointer;}
	.noaccount{color: #fff;}
    .register-button{width:200px;display: inline-block;line-height: 46px;background-color: #7a98f7;border-radius: 4px;color: #fff;border: none}
    .have-account{font-size: 14px;display:inline-block;margin-left: 30px}
    .right-tip{position: absolute;left: 620px;top: 70px;line-height: 24px;padding-right: 50px;margin-top: 10px;font-size: 14px;color: #61688a;}
</style>



// WEBPACK FOOTER //
// src/components/ResetPwd.vue