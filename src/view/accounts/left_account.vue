<template>
	<div class="leftNav ft14">
		<ul class="fColor1">
			<li v-for="(item,index) in array" :key="index" :class="index == curActive ? 'active' :''" @click="goto(index,item.page)">
        <i class="iconfont mr10" :class="item.icon"></i>
				<span>{{item.text}}</span>
			</li>
		</ul>
	</div>
</template>
<script>
	export default {
		name: "left_account",
		data() {
			return {
				curActive:0,
				array:[

          // {
          //   src1: require("@/assets/images/icon_delegate.png"),
          //   src2: require("@/assets/images/icon_delegate_s.png"),
          //   text: this.$t('account.laccount'),
          //   page:'legal',
          //   icon:'icon-fabijiaoyi',
          //   children:['legal']
          // },
          {
            // 期权账户
            src1: require("@/assets/images/icon_delegate.png"),
            src2: require("@/assets/images/icon_delegate_s.png"),
            text: this.$t('account.letransaction'),
            icon:'icon-qukuailian',
            page:'letransactions',
            children:['letransactions']
          },
					{
            // 合约账户
						src1: require("@/assets/images/icon_delegate.png"),
						src2: require("@/assets/images/icon_delegate_s.png"),
						text: this.$t('account.taccount'),
            icon:'icon-qukuailian',
						page:'finance',
						children:['finance']
					},
          {
            // 币币账户
            src1: require("@/assets/images/icon_delegate.png"),
            src2: require("@/assets/images/icon_delegate_s.png"),
            text: this.$t('usercenter.change'),
            icon:'icon-bibijiaoyi',
            page: 'change',
            children: ['change']
          },

//					 {
//					 	src1: require("@/assets/images/icon_delegate.png"),
//					 	src2: require("@/assets/images/icon_delegate_s.png"),
//					 	text: 'c2c账户',
//					 	page:'legal',
//					 	children:['legal']
//					 },
					 {
             // 充值
						src1: require("@/assets/images/icon_transfer.png"),
						src2: require("@/assets/images/icon_transfer_s.png"),
					 	text: this.$t('account.charging'),
            icon:'icon-chongzhi',
					 	page:'accountRecharge',
					 	children:['accountRecharge']
					 },
					 {
             // 提币
					 	text: this.$t('account.withdraw'),
            icon:'icon-ziyuan',
					 	page:'withdraw',
					 	children:['withdraw']
					 },
					 {
             // 充提币记录
					 	text: this.$t('miscro.recordWithdrawal'),
            icon:'icon-meiyuanqianbao',
					 	page:'record',
					 	children:['record']
					 },
					 {
             // 划转
//					 	src1: require("@/assets/images/transfer.png"),
						src1: require("@/assets/images/icon_transfer.png"),
//					 	src2: require("@/assets/images/transferSelected.png"),
						src2: require("@/assets/images/icon_transfer_s.png"),
					 	text: this.$t('account.transfer'),
            icon:'icon-huazhuan',
					 	page:'transferLegal',
					 	children:['transferLegal']
					 },

				],
			}
		},
		created(){
			let name = this.$route.name;
			this.curActive = this.array.findIndex( val => val.page === name || (val.children && val.children.includes(name))) ;

		},
		mounted(){
			this.bus.$on("nav_name", name =>{
				this.curActive = this.array.findIndex( val => val.page === name || (val.children && val.children.includes(name))) ;
			})
		},
		methods: {
			goto(index,name) {
				this.curActive=index;
				this.$router.push({name: name, params: {lang: this.lang}})
			},

		}
	};
</script>
<style lang="scss" scoped>
	.leftNav{
    .mr10 {
      margin-right: 10px;
    }

    .flex {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
		ul{
			li{
				height:54px;
				line-height:54px;
				padding-left:38px;
				margin-bottom:4px;
				cursor:pointer;
				img{
					margin-right:12px;
					margin-top:-4px;
					width:20px;
					vertical-align: middle;
				}
			}
			.active{
				color:#00a4d8;
				background-color: #181d25;
				border-bottom: none;
				display: block;
			}
		}
	}
</style>
