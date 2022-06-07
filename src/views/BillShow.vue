<template>
	
	<div class="shortcut">
		<div class="routerlink">
			<div style="float: left;">
				<router-link to="/" @click="returnMain()">主页</router-link>  |
				<router-link to="/register">注册</router-link>  |
			</div>
			<div v-if="loginInphone==''" style="float: left;">
				<router-link to="/signin">欢迎，请登录解锁更多功能</router-link>  |
			</div>
			<div v-if="loginInphone!=''" style="float: left;">
				<router-link to="/comusershow" @click="gotoComuser()">欢迎 {{comuser.comuserName}}</router-link>  |
				<router-link to="/shoppingcar" @click="gotoCar()">购物车</router-link>  |
				<router-link to="/billshow" @click="gotoBill()">钱包</router-link>  |
				<router-link to="/ordersshow" @click="gotoOrders()">订单中心</router-link>  |
				<router-link to="/" @click="loginInphone=''">退出登录</router-link>
			</div>
		</div>
	</div>
	
	<div>
		<img src="../static/艺术字.png" @click="returnMain()">
	</div>
	
	<div class="filter-container">
		<span style="margin-right: 10px;">
			<i>当前账户余额:{{comuser.comuserMoney}}</i>
		</span>
		<el-select v-model="value" class="m-2" placeholder="Select" size="large">
			<el-option
			  v-for="item in options"
			  :key="item.value"
			  :label="item.label"
			  :value="item.value"
			/>
		</el-select>
		<el-button style="margin-left: 20px;" type="primary" @click="query()">查询</el-button>
		<el-button @click="jisuan();allShow=true" type="info">查看总记录</el-button>
		<el-button type="success" @click="dialogRecharge=true;">充值</el-button>
		<div v-show="allShow">
			<p style="float: left;margin-left: 10px;">总充值：{{allRecharge}}</p>
			<p style="float: left;margin-left: 10px;">总消费：{{allBuy}}</p>
		</div>
	</div>
	
	<div class="main">
		<el-table :data="bills">
			<el-table-column prop="time" label="时间"/>
			
			<el-table-column prop="bian" label="变更类型">
				<template #default="scope">
					<div v-if="scope.row.bian==0">
						<el-tag type="success">充值</el-tag>
					</div>
					<div v-if="scope.row.bian==1">
						<el-tag type="danger">购物</el-tag>
					</div>
					<div v-if="scope.row.bian==2">
						<el-tag type="warning">退款</el-tag>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="money" label="金额"/>
		</el-table>
	</div>
	
	<!-- 充值 -->
	  <el-dialog v-model="dialogRecharge">
		  <span style="margin-right: 10px;">
			  <i>输入充值金额</i>
		  </span>
		  <el-input-number v-model="num" :min="1" :max="999999999" style="margin-right: 20px;"/>
		  <el-button @click="dialogRecharge=false;recharge()">确定</el-button>
		  <el-button @click="dialogRecharge=false">取消</el-button>
	  </el-dialog>
</template>

<script>
	export default{
		name: 'BillShow',
		data(){
			return{
				msg:"Into BillShow",
				loginInphone: '',
				comuser:{},
				bills:[
					{
						id: 0,
						userphone: '',
						money: 0.0,
						orders: 0,
						bian: 0,
						time: '2022-02-01'
					}
				],
				value: "2",
				options:
				[
					{
					value: '0',
					label: '充值',
					},
					{
					value: '1',
					label: '购物',
					},
					{
					value: '2',
					label: '全部',
					}
				],
				allRecharge: 0,
				allBuy: 0,
				allShow: false,
				dialogRecharge: false,
				num: 0,
				bill:{
					userphone: '',
					money: 0.0,
					orders: 0,
				}
			}
		},
		created() {
			this.loginInphone = this.$route.query.loginInphone;
			this.$axios.get("http://localhost:8085/bill/getone/" + this.loginInphone).then((res)=>{
			console.log(res);
			this.bills = res.data.data;
			});
			this.$axios.get("http://localhost:8085/comuser/" + this.loginInphone).then((res)=>{
			console.log(res);
			this.comuser = res.data.data;
			});
		},
		methods: {
			jisuan(){
				if(!this.allShow){
					for(let i = 0; i < this.bills.length; i++){
						if(this.bills[i].bian==0){
							this.allRecharge += this.bills[i].money;
						} else {
							this.allBuy += this.bills[i].money;
						}
					}
				}
			},
			//去购物车
			gotoCar(){
				this.$router.push({  name:'shoppingcar', query:{loginInphone:this.loginInphone} });
			},
			gotoBill(){
				this.$router.push({  name:'billshow', query:{loginInphone:this.loginInphone} });
			},
			gotoOrders(){
				this.$router.push({  name:'ordersshow', query:{loginInphone:this.loginInphone} });
			},
			gotoComuser(){
				this.$router.push({  name:'comusershow', query:{loginInphone:this.loginInphone} });
			},
			returnMain(){
				if(this.loginInphone.length!=0){
					this.$router.push({name:'main', query:{phone:this.loginInphone}});
				} else {
					this.$router.push({name:'main'});
				}
			},
			query(){
				console.log(this.value);
				if(this.value == 0){
					this.$axios.get("http://localhost:8085/bill/getone/" + this.loginInphone + "/" + 0).then((res)=>{
					console.log(res);
					this.bills = res.data.data;
					});
				}
				if(this.value == 1){
					this.$axios.get("http://localhost:8085/bill/getone/" + this.loginInphone + "/" + 1).then((res)=>{
					console.log(res);
					this.bills = res.data.data;
					});
				}
				if(this.value == 2){
					this.$axios.get("http://localhost:8085/bill/getone/" + this.loginInphone).then((res)=>{
					console.log(res);
					this.bills = res.data.data;
					});
				}
			},
			//充值
			recharge(){
				this.bill.userphone = this.loginInphone;
				this.bill.money = this.num;
				this.$axios.post("http://localhost:8085/bill/recharge/" + this.loginInphone + "/" + this.bill.money).then((res)=>{
				console.log(res);
				});
				this.comuser.comuserMoney = this.comuser.comuserMoney + this.bill.money;
				location.reload();
			}
		}
	}
</script>

<style>
	.shortcut{
		background-color: aliceblue;
		height: 30px;
	}
	.routerlink{
		margin-left: 60%;
		font-size: 20px;
	}
	.main{
		margin-left: 10%;
		margin-right: 10%;
	}
	.filter-container{
		float: left;
		margin-left: 10%;
	}
	.information{
		float: right;
		margin-right: 20%;
	}
</style>