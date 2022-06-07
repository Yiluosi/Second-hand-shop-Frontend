<template>
	<router-link to="/">
		<img src="../static/艺术字.png">
	</router-link>
	<div class="main">
		<el-form ref="loginForm" :model="loginForm" label-width="60px" class="login-box">
		<h3 class="login-title">欢迎登录</h3>
		<el-form-item label="账号" prop="uName">
			<el-input type="text" placeholder="请输入账号" v-model="loginForm.uName"/>
		</el-form-item>
		<el-form-item label="密码" prop="uPwd">
			<el-input type="password" placeholder="请输入密码" v-model="loginForm.uPwd"/>
		</el-form-item>
		<el-form-item label="类型">
			  <el-radio-group v-model="radio">
			    <el-radio :label="0">个人用户</el-radio>
			    <el-radio :label="3">商家</el-radio>
			    <el-radio :label="1">管理员</el-radio>
			  </el-radio-group>
		</el-form-item>

		<el-form-item>
			<el-space wrap :size="20">
			<el-button type="primary" v-on:click="onShow()">登录</el-button>
			<el-button type="warning" v-on:click="onReset()">重置</el-button>
			<router-link to="/register" style="margin-left: auto;">点我注册</router-link>
			</el-space>
		</el-form-item>
		</el-form>
	</div>
	   <!-- <button @click="onShow">开始验证</button> -->
		<Vcode :show="isShow" @success="onSubmit" @close="onClose" />
	   
</template>

<script>
	import Vcode from "vue3-puzzle-vcode";
	
	export default{
		name: "SignIn",
		data(){
			return {
				msg: 'Into SignIn',
				loginForm: {
					uName: '',
					uPwd: ''
				},
				radio: 0,
				isShow: false // 验证码模态框是否出现
			}
		},
		components:{
			Vcode
		},
		methods:{
			onSubmit () {
				console.log(this.loginForm.uName + '--' + this.loginForm.uPwd + "--" + this.radio);
				if(this.radio==0){
					this.$axios.get("http://localhost:8085/comuser/login/" + this.loginForm.uName + "/" + this.loginForm.uPwd + "/" + this.radio).then((res)=>{
						console.log(res);
						if(res.data.flag == false){
							this.$message.error(res.data.msg);
						} else {
							this.$router.push({  name:'main', query:{phone:this.loginForm.uName} });  //跳转界面
						}
					});
				} 
				if(this.radio==1){
					this.$axios.get("http://localhost:8085/comuser/login/" + this.loginForm.uName + "/" + this.loginForm.uPwd + "/" + this.radio).then((res)=>{
						console.log(res);
						if(res.data.flag == false){
							this.$message.error(res.data.msg);
						} else {
							this.$router.push({  name:'administrators', query:{phone:this.loginForm.uName} });  //跳转界面
						}
					});
				} 
				if(this.radio == 3) {
					this.$axios.get("http://localhost:8085/business/login/" + this.loginForm.uName + "/" + this.loginForm.uPwd).then((res)=>{
						console.log(res);
						if(res.data.flag == false){
							this.$message.error(res.data.msg);
						} else {
							this.$router.push({name:'business', query:{phone:this.loginForm.uName}});  //跳转界面
						}
					});
				}
			},
			// 重置输入
			onReset () {
				this.loginForm.uName = ''
				this.loginForm.uPwd = ''
			},
			onShow() {
				this.isShow = true;
			},
			onClose() {
				this.isShow = false;
			},
			onSuccess() {
			  this.onClose(); // 验证成功，需要手动关闭模态框
			}
		},
	}
</script>

<style>
	  .login-box {
	    border: 1px solid #DCDFE6;
	    width: 350px;
	    margin: 200px auto;
	    padding: 35px 35px 15px 35px;
	    border-radius: 10px;
	    -webkit-border-radius: 10px;
	    -moz-border-radius: 10px;
	    box-shadow: 0px 0 25px black;
	    background-color: white;
	  }
	  .login-title {
	    text-align: center;
	    margin: 0 auto 30px auto;
	    color: #303133;
	  }
	  /deep/ .el-form-item__label {
	    font-size: 18px;
	    color: black;
	  }
</style>
