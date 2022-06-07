<template>
	<div class="shortcut">
		<div class="routerlink">
			<div style="float: left;">
				<router-link  to="/" @click="returnMain()">主页</router-link>  |
				<router-link to="/register">注册</router-link>  |
			</div>
			<div v-if="loginInphone==''" style="float: left;">
				<router-link  to="/signin">欢迎，请登录解锁更多功能</router-link>
			</div>
			<div v-if="loginInphone!=''" style="float: left;">
				<router-link to="/comusershow">你好，{{comuser.comuserName}}</router-link>  |
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
	<el-card class="card">
		<div class="commodity_image">
				<img :src="commodity.image"/>
		</div>
		<div class="commodity_name">
				<p>{{commodity.name}}</p>
				<div>
					<p style="font-style:normal;font-size: 20px;">店铺：{{commodity.busname}}</p>
					<p style="font-style:normal;font-size: 20px;">累计销量：{{commodity.sales}}</p>
					<p style="font-style:normal;font-size: 20px;">用户评价分数：{{commodity.score/commodity.sales}}</p>
					<p>限时优惠价格：￥{{commodity.price}}</p>
					<el-input-number v-model="num" :min="1" :max="10" @change="handleChange" :step="1" step-strictly style="margin-right: 20px;"/>
					<el-button type="danger" @click="addCart()">加入购物车</el-button>
					<el-button type="danger" @click="dialogSubmit=true;handleChange()">立即购买</el-button>
				</div>
		</div>
	</el-card>
	
	<el-card class="card">
		<template #header>
		      <div class="card-header">
		        <span>用户评价</span>
		      </div>
		</template>
		<el-table :data="evalcommodity">
			<el-table-column prop="userphone" label="用户" width="200px"></el-table-column>
			<el-table-column label="评分" width="200px">
				<template #default="scope">
					<el-rate v-model="scope.row.score" disabled/>
				</template>
			</el-table-column>
			<el-table-column prop="content" label="内容"></el-table-column>
		</el-table>
	</el-card>
	<!-- 立即购买弹出界面 -->
	  <div class="submintDialog">
		  <el-dialog title="确认支付界面" v-model="dialogSubmit">
				<div>
					<p style="float: left;">当前账户余额：{{comuser.comuserMoney}}</p>
					<el-button type="primary" size="mini" style="float: left;margin-left: 20px;margin-top: 10px;" @click="dialogRecharge=true;">充值</el-button>
				</div>
				<div style="clear: both">
					<p style="float: left;color: red">总价￥:{{allPrice}}</p>
				</div>
				<div style="clear: both">
					<p style="float: left;">配送地址:</p>
					<el-input v-model="comuser.comuserAddress" style="width: 80%;float: left;margin-left: 20px;" clearable></el-input>
				</div>
				<div style="clear: both">
					<el-button type="primary" @click="dialogSubmit=false;buynow()">确定</el-button>
					<el-button @click="dialogSubmit=false">取消</el-button>
				</div>
		  </el-dialog>
		<!-- 充值 -->
		  <el-dialog v-model="dialogRecharge">
			  <el-input-number v-model="number" :min="1" :max="999999999" style="margin-right: 20px;"/>
			  <el-button @click="dialogRecharge=false;dialogSubmit=false;recharge()">确定</el-button>
			  <el-button @click="dialogRecharge=false">取消</el-button>
		  </el-dialog>
	  </div>

</template>

<script>
	export default{
		name: "ShowBus",
		data(){
			return{
				msg: 'Into showBus',
				commodity:
				{
					id: 0,
					name: "",
					price: 0,
					category: "",
					information: "",
					stock: 0,
					sales: 0,
					score: 0,
					business: "",
					busname: "",
					image: ''
				},
				loginInphone: '',
				dialogSubmit: false,
				dialogRecharge: false,
				tran_id: 0,
				num: 1,
				number: 1,
				cart:
				{
					userphone: '',
					commodityid: 0,
					number: 1,
					commodityname: '',
					price: 0,
					image: ''
				},
				order:
				{
					userphone: '',
					commodityid: 0,
					number: 1,
					business: '',
					image: '',
					price: 0,
					flag: 0,
					commodityname: ''
				},
				bill:{
					userphone: '',
					money: 0.0,
					orders: 0,
				},
				comuser:{},
				allPrice: 0,
				evalcommodity:[{}]
			}
		},
		created() {
			this.tran_id = this.$route.query.id;
			this.loginInphone = this.$route.query.loginInphone;
			console.log(this.loginInphone);
			this.$axios.get("http://localhost:8085/commodity/" + this.tran_id).then((res)=>{
			console.log(res);
			this.commodity = res.data.data;
			});
			this.$axios.get("http://localhost:8085/comuser/" + this.loginInphone).then((res)=>{
			console.log(res);
			this.comuser = res.data.data;
			});
			this.$axios.get("http://localhost:8085/evalcommodity/getcommodity/" + this.tran_id).then((res)=>{
			console.log(res);
			this.evalcommodity = res.data.data;
			});
		},
		methods:{
			addCart(){
				console.log("addCart()...");
				console.log(this.loginInphone);
				if(this.loginInphone.length!=0){
					this.cart.userphone = this.loginInphone;
					this.cart.commodityid = this.commodity.id;
					this.cart.number = this.num;
					this.cart.commodityname = this.commodity.busname;
					this.cart.price = this.commodity.price;
					this.cart.image = this.commodity.image;
					this.$axios.post("http://localhost:8085/cart", this.cart).then((res)=>{
						if(res.data.flag){
							this.$message.success("添加成功！");
						} else {
							this.$message.error("添加失败！");
						}
					});
				} else {
					this.$message.error("请先登录！");
				}
			},
			returnMain(){
				if(this.loginInphone.length!=0){
					this.$router.push({name:'main', query:{phone:this.loginInphone}});
				} else {
					this.$router.push({name:'main'});
				}
			},
			//立即购买
			buynow(){
				if(this.allPrice <= this.comuser.comuserMoney ){
					this.$message.success("支付成功");
					//订单信息
					this.order.userphone = this.loginInphone;
					this.order.commodityid = this.commodity.id;
					this.order.number = this.num;
					this.order.image = this.commodity.image;
					this.order.price = this.commodity.price*this.num;
					this.order.commodityname = this.commodity.name;
					console.log(JSON.stringify(this.order));
					this.$axios.post("http://localhost:8085/order/buynow", this.order).then((res)=>{
					});
					//给账户扣费
					this.$axios.put("http://localhost:8085/comuser/reduceMoney/" + this.loginInphone + '/' + this.allPrice).then((res)=>{});
					//加入到账单中
					this.bill.userphone = this.loginInphone;
					this.bill.money = this.allPrice;
					this.bill.orders = this.commodity.id;
					this.bill.bian = 1;
					console.log(JSON.stringify(this.bill));
					this.$axios.post("http://localhost:8085/bill/shopping/one", this.bill).then((res)=>{
					console.log(res);
					});
					// 平台增加暂存金额
					this.$axios.post("http://localhost:8085/platform/money/", this.bill).then((res)=>{
					console.log(res);
					});
				} else {
					this.$message.success("账户余额不足，请充值");
				}
			},
			//充值
			recharge(){
				this.bill.userphone = this.loginInphone;
				this.bill.money = this.number;
				this.$axios.post("http://localhost:8085/bill/recharge/" + this.loginInphone + "/" + this.bill.money).then((res)=>{
				console.log(res);
				});
				this.comuser.comuserMoney = this.comuser.comuserMoney + this.bill.money;
			},
			handleChange(){
				this.allPrice = this.num*this.commodity.price;
			},
			gotoCar(){
				this.$router.push({  name:'shoppingcar', query:{loginInphone:this.loginInphone} });
			},
			gotoBill(){
				this.$router.push({  name:'billshow', query:{loginInphone:this.loginInphone} });
			},
			gotoOrders(){
				this.$router.push({  name:'ordersshow', query:{loginInphone:this.loginInphone} });
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
	.commodity_image img{
		margin-top: 30px;
		float: left;
		width: 300px;
		height: 300px;
	}
	.button {
		float: left;
		margin-top: 30px;
		margin-left: 50px;
	}
	.commodity_name {
		margin-left: 50px;
		text-align: left;
		float: left;
		font-size: 30px;
		font-weight: bolder;
		font-style: italic;
		margin-bottom: 20px;
	}
	.card{
		margin-left: 20%;
		margin-right: 20%;
		margin-top: 30px;
	}
	.card-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	}
</style>
