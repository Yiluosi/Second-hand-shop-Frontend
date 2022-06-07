<template>
	<div class="shortcut">
		<div class="routerlink">
			<div style="float: left;">
				<router-link to="/register">注册</router-link>  |
			</div>
			<div v-if="loginInphone==''" style="float: left;">
				<router-link to="/signin">欢迎，请登录解锁更多功能</router-link>
			</div>
			<div v-if="loginInphone!=''" style="float: left;">
				<router-link to="comusershow" @click="gotoComuser()">你好，{{comuser.comuserName}}</router-link>  |
				<router-link to="/shoppingcar" @click="gotoCar()">购物车</router-link>  |
				<router-link to="/billshow" @click="gotoBill()">钱包</router-link>  |
				<router-link to="/ordersshow" @click="gotoOrders()">订单中心</router-link>  |
				<router-link to="/" @click="loginInphone=''">退出登录</router-link>
			</div>

		</div>
	</div>
		
	<div class="search">
		<router-link to="/">
			<img src="../static/艺术字.png">
		</router-link>
			<el-select v-model="orderby" placeholder="点击选择排序" size="medium">
				<el-option label="价格升序" value="0" />
				<el-option label="价格降序" value="1" />
				<el-option label="默认" value="2" />
			  </el-select>
		<el-input v-model="xxx" placeholder="搜索商品" clearable style="margin-left: 200px;width: 250px;"/>
		<el-button style="margin-left: 5px;height: 90%;" @click="getXxx()">搜索</el-button>
	</div>
		
	<div class="" id="box">
		<ui v-for="(item,index) in commodity" >
		<el-card style="float: left;margin: 10px;">
			<li>
				<img :src="item.image" @click="getOne(item)"/> 
				<p>{{item.name}}</p>
				<el-descriptions>
					<el-descriptions-item>￥{{item.price}}</el-descriptions-item>
					<el-descriptions-item>
					  <el-tag size="small">{{item.category}}</el-tag>
					</el-descriptions-item>
				</el-descriptions>
			</li>
		</el-card>

		</ui>
	</div>

</template>

<script>
	export default{
		name: 'Main',
		data(){
			return{
				msg: "Into Main",
				commodity:[
					{
						id: 0,
						name: "",
						price: 0,
						category: "",
						information: "",
						stock: 0,
						sales: 0,
						number: 0,
						score: 0,
						business: "",
						busname: "",
						image:''
					}
				],
				pagination: {//分页相关模型数据
					currentPage: 1,//当前页码
					pageSize:5,//每页显示的记录数
					total:0,//总记录数
					type: "",
					name: "",
					description: ""
				},
				loginInphone: '',
				comuser: {
					comuserPhone: "",
					comuserName: "",
					comuserMail: "",
					comuserCity: "",
					comuserGender: "",
					comuserBankaccount: "",
					comuserNickname: "",
					comuserPassword: "",
					comuserInformation: "",
					comuserWechat: "",
					comuserBalance: 0,
					comuserAddress: "",
					comuserImage: '',
					comuserLevel: '2',
					comuserMoney: 0
				},
				xxx: '',
				orderby: '2'
			}
		},
		created() {
			this.getOnes();
			if(this.$route.query.phone!=undefined){
				this.loginInphone = this.$route.query.phone;
			}
			console.log(this.loginInphone);
			if(this.loginInphone!=''){
				this.$axios.get("http://localhost:8085/comuser/" + this.loginInphone).then((res)=>{
				console.log(res);
				this.comuser = res.data.data;
				});
			}
		},
		methods:
		{
			getOnes(){
				this.$axios.get("http://localhost:8085/commodity/getones").then((res)=>{
				console.log(res);
				this.commodity = res.data.data;
				});
			},
			
			handleCurrentChange(currentPage) {
				this.pagination.currentPage = currentPage;
				this.getAll();
			},
			getOne(item){
				console.log(item.id);
				this.$router.push({  name:'showbus', query:{id:item.id,loginInphone:this.loginInphone} });
			},
			handleCommand(){
				
			},
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
			// 模糊搜索
			getXxx(){
				console.log(this.xxx);
				if(this.orderby == 2){
					if(this.xxx.length!=0){
						this.$axios.get("http://localhost:8085/commodity/getxxx/" + this.xxx).then((res)=>{
						console.log(res);
						this.commodity = res.data.data;
						});
					} else {
						this.getOnes();
					}
				}
				//降序
				if(this.orderby == 1){
					if(this.xxx.length!=0){
						this.$axios.get("http://localhost:8085/commodity/getxxx/" + this.xxx).then((res)=>{
						console.log(res);
						this.commodity = res.data.data;
						});
					} else {
						this.$axios.get("http://localhost:8085/commodity/getOrder/" + "DESC").then((res)=>{
						console.log(res);
						this.commodity = res.data.data;
						});
					}
				}
				// 升序
				if(this.orderby == 0){
					if(this.xxx.length!=0){
						this.$axios.get("http://localhost:8085/commodity/getxxx/" + this.xxx).then((res)=>{
						console.log(res);
						this.commodity = res.data.data;
						});
					} else {
						this.$axios.get("http://localhost:8085/commodity/getOrder/" + "ASC").then((res)=>{
						console.log(res);
						this.commodity = res.data.data;
						});
					}
				}
			}
		}
	}
</script>

<style>
	#box ul{
			display: flex;
			flex-wrap: wrap;
	        position: absolute;
	        top: 220px;
			margin: 0 24px 24px 0;
		}
	#box li{
			padding: 3px;
			list-style: none;
			margin-right: 15px;
			border: 1px solid #eee;
			float:left;
	}
	#box img{
			width: 200px;
			height: 150px;
	}
	#box{
		margin-left: 200px;
		margin-right: 200px;
		margin-top: 20px;
	}
	.example-showcase .el-dropdown-link {
	  cursor: pointer;
	  color: var(--el-color-primary);
	  display: flex;
	  align-items: center;
	}
	.shortcut{
		background-color: aliceblue;
		height: 30px;
	}
	.routerlink{
		margin-left: 60%;
		font-size: 20px;
	}
	.search{
		/* float: left; */
		display: flex;
		padding:10px 0 15px 0;
	}
</style>
