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
				<router-link to="/comusershow" @click="gotoComuser()">你好，{{comuser.comuserName}}</router-link>  |
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
	
	<div class="descr">
		<el-card>
			<el-descriptions title="头像">
				<el-descriptions-item label="">
							  <el-upload
								class="avatar-uploader"
								action="http://localhost:8085/file/upload"
								:show-file-list="false"
								:on-success="handleAvatarSuccess"
							  >
								<img v-if="comuser.comuserImage" :src="comuser.comuserImage" class="avatar" style="width: 200px; height: 200px;"/>
								<el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
							  </el-upload>
				</el-descriptions-item>
			</el-descriptions>
		</el-card>
	</div>
	
	<div class="mainComuser">
		<el-card>
			<el-form :model="comuser" label-width="120px">
				<el-form-item label="用户名:">
				    <el-input v-model="comuser.comuserName" :disabled="!edit"/>
				</el-form-item>
				<el-form-item label="手机号:">
				    <el-input v-model="comuser.comuserPhone" disabled/>
				</el-form-item>
				<el-form-item label="地址:">
				    <el-input v-model="comuser.comuserAddress" :disabled="!edit"/>
				</el-form-item>
				<el-form-item label="城市:">
				    <el-input v-model="comuser.comuserCity" disabled/>
				</el-form-item>
				<el-form-item label="微信:">
				    <el-input v-model="comuser.comuserWechat" :disabled="!edit"/>
				</el-form-item>
				<el-form-item label="邮箱:">
				    <el-input v-model="comuser.comuserMail" :disabled="!edit"/>
				</el-form-item>
				<el-form-item label="昵称:">
				    <el-input v-model="comuser.comuserNickname" :disabled="!edit"/>
				</el-form-item>
				<el-form-item label="个人简介:">
				    <el-input v-model="comuser.comuserInformation" :disabled="!edit"/>
				</el-form-item>
				<el-form-item label="银行卡号:">
				    <el-input v-model="comuser.comuserBankaccount" :disabled="!edit"/>
				</el-form-item>
				<el-form-item label="账户积分:">
				    <el-input v-model="comuser.comuserBalance" disabled/>
				</el-form-item>
				<el-form-item label="账户余额:">
				    <el-input v-model="comuser.comuserMoney" disabled/>
				</el-form-item>
			</el-form>
			<div v-if="edit==true">
				<el-button @click="edit=false;updateInfor()" type="primary" >保存</el-button>
			</div>
			<div v-if="edit==false">
				<el-button @click="edit=true" type="primary">修改</el-button>
			</div>
		</el-card>
	</div>
	
</template>

<script>
	export default{
		name: "ComUser",
		data(){
			return {
				msg: 'into comusershow',
				comuser:
					{
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
						comuserLevel: '0',
						comuserMoney: 0
					},
				loginInphone: "",
				edit: false,
				src: '../static/cae87f7e078a4983a7594ba67002076b.jpg',
			}
		},
		created() {
			this.loginInphone = this.$route.query.loginInphone;
			console.log(this.loginInphone);
			console.log(this.src);
			this.getOne();
		},
		methods: {
			getOne(){
				this.$axios.get("http://localhost:8085/comuser/" + this.loginInphone).then((res)=>{
				console.log(res);
				this.comuser = res.data.data;
				});
			},
			handleAvatarSuccess(res) {
				console.log(res);
				this.comuser.comuserImage = res;
				// src = "../static/" + res;
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
			returnMain(){
				if(this.loginInphone.length!=0){
					this.$router.push({name:'main', query:{phone:this.loginInphone}});
				} else {
					this.$router.push({name:'main'});
				}
			},
			updateInfor(){
				this.$axios.post("http://localhost:8085/comuser/updateInfo", this.comuser).then((res)=>{
				console.log(res);
				});
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
	.descr{
		float: left;
		margin-top: 2.6%;
		margin-left: 20%;
	}
	.mainComuser{
		width: 60%;
		margin-left: 20%;
	}
</style>
