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
	  <el-table
	    :data="carts"
		ref="multipleTable"
	    style="width: 80%;margin-left: 10%;"
	    @selection-change="handleSelectionChange"
	  >
	    <el-table-column type="selection" width="55" />
	    <el-table-column label="image">
			<template #default="scope">
			  <img :src="scope.row.image" style="width: 60px;height: 60px;"/>
			</template>
	    </el-table-column>
	    <el-table-column property="commodityname" label="商品" show-overflow-tooltip/>
	    <el-table-column property="price" label="单价"/>
	    <el-table-column property="number" label="数量" show-overflow-tooltip />
	    <el-table-column label="小结">
			<template #default="scope">
			 {{scope.row.price*scope.row.number}}
			</template>
		</el-table-column>
	    <el-table-column label="操作">
			<template #default="scope">
			 <el-button type="primary" size="mini" @click="addNumber(scope.row)">数量+1</el-button>
			 <el-button type="info" size="mini"  @click="reduceNumber(scope.row)">数量-1</el-button>
			 <!-- <el-button type="danger" size="mini" @click="deleteRecord(scope.row)">删除</el-button> -->
			 <el-popconfirm title="确定删除这个商品？无法恢复!" @confirm="deleteRecord(scope.row)" @cancel="">
			 	<template #reference>
			 	<el-button size="mini" type="danger">删除</el-button>
			 	</template>
			 </el-popconfirm>
			</template>
		</el-table-column>
	  </el-table>
	  <div class="submint">
		  <el-button type="danger" @click="dialogSubmit=true;sumPrice()">去结算</el-button>
	  </div>
	  
	  <div class="submintDialog">
		  <el-dialog title="确认支付界面" v-model="dialogSubmit">
				<el-table :data="val" stripe style="width: 100%">
					<el-table-column prop="commodityname" label="Name" width="180" />
					<el-table-column prop="number" label="Number" width="180" />
					<el-table-column prop="price" label="Price" />
				</el-table>
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
					<el-button type="primary" @click="dialogSubmit=false;submit()">确定</el-button>
					<el-button @click="dialogSubmit=false">取消</el-button>
				</div>
		  </el-dialog>
		<!-- 充值 -->
		  <el-dialog v-model="dialogRecharge">
			  <el-input-number v-model="num" :min="1" :max="999999999" style="margin-right: 20px;"/>
			  <el-button @click="dialogRecharge=false;recharge()">确定</el-button>
			  <el-button @click="dialogRecharge=false">取消</el-button>
		  </el-dialog>
	  </div>
	  
</template>

<script>
	export default{
		name: 'ShoppingCar',
		data(){
			return{
				msg:'Into ShoppingCar',
				loginInphone: '',
				carts:[
					{	
						id: 0,
						userphone: '',
						commodityid: 0,
						number: 1,
						commodityname: '',
						price: 0,
						image: ''
					}
				],
				val:[],
				dialogSubmit: false,
				dialogRecharge: false,
				allPrice: 0,
				comuser:{},
				order:{
						userphone: '',
						commodityid: 0,
						number: 1,
						business: '',
						image: '',
						price: 0,
						flag: 0,
						commodityname: ''
					},
				orders:[],
				commodity:{},
				bill:{
					userphone: '',
					money: 0.0,
					orders: 0,
				},
				bills:[],
				num: 0
			}
		},
		created() {
			this.loginInphone = this.$route.query.loginInphone;
			if(this.loginInphone.length!=undefined){
				this.$axios.get("http://localhost:8085/cart/getone/" + this.loginInphone).then((res)=>{
				console.log(res);
				this.carts = res.data.data;
				});
				this.$axios.get("http://localhost:8085/comuser/" + this.loginInphone).then((res)=>{
				console.log(res);
				this.comuser = res.data.data;
				});
			}

		},
		methods: {
			handleSelectionChange(val){
				this.val = val;
				console.log(val);
			},
			submit(){
				console.log("submit()....");
				if(this.allPrice <= this.comuser.comuserMoney ){
					this.$message.success("支付成功");
					//生成订单记录
					for(var i = 0;i < this.val.length; i++){
						this.bill = {};
						this.order.userphone = this.loginInphone;
						this.order.commodityid = this.val[i].commodityid;
						this.order.number = this.val[i].number;
						this.order.image = this.val[i].image;
						this.order.price = this.val[i].price;
						this.order.commodityname = this.val[i].commodityname;
						this.orders.push(this.order);
						
						this.bill.userphone = this.loginInphone;
						this.bill.money = this.val[i].price*this.val[i].number;
						this.bill.orders = this.val[i].commodityid;
						this.bill.bian = 1;
						this.bills.push(this.bill);
					}
					console.log("this.bills:" + JSON.stringify(this.bills));
					console.log("this.order:" + JSON.stringify(this.orders));
					this.$axios.post("http://localhost:8085/order", JSON.stringify(this.orders)).then((res)=>{
					});
					console.log(JSON.stringify(this.val));
					//购物车里删除
					this.$axios.post("http://localhost:8085/cart/submit", JSON.stringify(this.val)).then((res)=>{
					console.log(res);
					location.reload();
					});
					//给账户扣费
					this.$axios.put("http://localhost:8085/comuser/reduceMoney/" + this.loginInphone + '/' + this.allPrice).then((res)=>{});
					//加入到账单中
					this.$axios.post("http://localhost:8085/bill/shopping", JSON.stringify(this.bills)).then((res)=>{
					console.log(res);
					});
					
				} else {
					this.$message.success("账户余额不足，请充值");
				}
			},
			returnMain(){
				if(this.loginInphone.length!=0){
					this.$router.push({name:'main', query:{phone:this.loginInphone}});
				} else {
					this.$router.push({name:'main'});
				}
			},
			sumPrice(){
				this.allPrice = 0;
				console.log("sumPrice()...");
				console.log("this.val.lenget:" + this.val.length);
				for(var i = 0;i < this.val.length; i++){
					this.allPrice+=this.val[i].price*this.val[i].number;
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
			},
			//数量加一
			addNumber(row){
				row.number = row.number + 1;
				this.$axios.put("http://localhost:8085/cart/add/" + row.id).then((res)=>{
				console.log(res);
				});
			},
			//数量减一
			reduceNumber(row){
				if(row.number <=1){
					this.$message.error("数量最低，无法继续减少");
				} else {
					row.number = row.number - 1;
					this.$axios.put("http://localhost:8085/cart/reduce/" + row.id).then((res)=>{
					console.log(res);
					});
				}
			},
			//删除
			deleteRecord(row){
				this.$axios.delete("http://localhost:8085/cart/" + row.id).then((res)=>{
				console.log(res);
				});
				for(let i = 0; i < this.carts.length; i++){
					if(this.carts[i].id == row.id){
						this.carts.splice(i, i);
						break;
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
			}
		}
	}
</script>

<style>
	.submint{
		margin-top: 20px;
		float: right;
		margin-right: 10%;
	}
	.shortcut{
		background-color: aliceblue;
		height: 30px;
	}
	.routerlink{
		margin-left: 60%;
		font-size: 20px;
	}
</style>