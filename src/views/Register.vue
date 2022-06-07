<template>

	<router-link to="/">
		<img src="../static/艺术字.png">
	</router-link>
	<div class="icon">
		<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8="" @click="back">
			<path fill="currentColor" d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z"></path>
		</svg>
	</div>
	<div>
		<p>请选择注册类型</p>
		<el-radio-group v-model="radio">
		  <el-radio-button label="2" size="large">普通用户</el-radio-button>
		  <el-radio-button label="1" size="large">商家</el-radio-button>
		</el-radio-group>
	</div>

	<div class="main" v-if="radio==2">
		<el-form :model="comuser" class="row" :rules="rules" ref="RegisterFrom" label-width="120px">
			<el-form-item label="头像">
				<el-upload
				class="avatar-uploader"
				action="http://localhost:8085/file/upload"
				:show-file-list="false"
				:on-success="handleAvatarSuccessComuser"
				>
				<img v-if="comuser.comuserImage" :src="comuser.comuserImage" class="avatar" style="width: 100px; height: 100px;"/>
				<p>点我添加或修改图片</p>
				</el-upload>
			</el-form-item>
			<el-form-item label="用户名" prop="comuserName">
				<el-input v-model="comuser.comuserName" placeholder="请输入姓名"/>
			</el-form-item>
			<el-form-item label="昵称">
				<el-input v-model="comuser.comuserNickname" placeholder="请输入昵称" />
			</el-form-item>
			<el-form-item label="手机号" prop="comuserPhone">
				<el-input v-model="comuser.comuserPhone" placeholder="请输入11位手机号码"/>
			</el-form-item>
			<el-form-item label="密码" prop="comuserPassword">
				<el-input v-model="comuser.comuserPassword" type="password" placeholder="请输入0-16位密码"/>
			</el-form-item>
			<el-form-item label="邮箱" >
				<el-input v-model="comuser.comuserMail" placeholder="请输入邮箱"/>
			</el-form-item>
			<el-form-item label="性别">
			      <el-radio-group v-model="comuser.comuserGender">
			        <el-radio label="男" name="gender"/>
			        <el-radio label="女" name="gender"/>
			      </el-radio-group>
			</el-form-item>
			<el-form-item label="微信号">
				<el-input v-model="comuser.comuserWechat" />
			</el-form-item>
			<el-form-item label="地址">
				<el-input v-model="comuser.comuserAddress" />
			</el-form-item>
			<el-form-item label="银行卡号">
				<el-input v-model="comuser.comuserBankaccount" placeholder="请输入16位银行卡号"/>
			</el-form-item>
			<el-form-item label="城市">
			  <el-select v-model="comuser.comuserCity" placeholder="点击选择所在城市">
				<el-option label="北京" value="北京" />
				<el-option label="上海" value="上海" />
				<el-option label="天津" value="天津" />
				<el-option label="重庆" value="重庆" />
				<el-option label="武汉" value="武汉" />
				<el-option label="广东" value="广东" />
				<el-option label="河北" value="河北" />
				<el-option label="辽宁" value="辽宁" />
				<el-option label="黑龙江" value="黑龙江" />
				<el-option label="四川" value="四川" />
				<el-option label="贵州" value="贵州" />
				<el-option label="广西" value="广西" />
				<el-option label="陕西" value="陕西" />
				<el-option label="新疆" value="新疆" />
				<el-option label="内蒙" value="内蒙" />
				<el-option label="四处为家" value="四处为家" />
			  </el-select>
			</el-form-item>
			<el-form-item label="个人介绍">
				<el-input v-model="comuser.comuserInformation" type="textarea" />
			</el-form-item>

			<el-form-item>
			    <el-button type="primary" @click="onSubmit()">注册</el-button>
			    <el-button @click="clear()">清空</el-button>
			</el-form-item>
		</el-form>
	</div>

	<div v-if="radio==1" style="margin-top: 20px;">
		<el-form :model="business" class="row" label-width="120px" :rules="ruleBusiness" ref="BusinessFrom">
			<el-form-item label="头像">
				<el-upload
				class="avatar-uploader"
				action="http://localhost:8085/file/upload"
				:show-file-list="false"
				:on-success="handleAvatarSuccess"
				>
				<img v-if="business.image" :src="business.image" class="avatar" style="width: 100px; height: 100px;"/>
				<p>点我添加或修改图片</p>
				</el-upload>
			</el-form-item>
			
			<el-form-item label="手机号" prop="phone">
				<el-input v-model="business.phone" placeholder="请输入11位手机号码"/>
			</el-form-item>
			<el-form-item label="店铺名称" prop="name">
				<el-input v-model="business.name" placeholder="请输入名称"/>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="business.password" type="password" placeholder="请输入0-16位密码"/>
			</el-form-item>
			<el-form-item label="营业执照" >
				<el-upload
				class="avatar-uploader"
				action="http://localhost:8085/file/upload"
				:show-file-list="false"
				:on-success="handleAvatarSuccesslicenseimage"
				>
				<img v-if="business.licenseimage" :src="business.licenseimage" class="avatar" style="width: 100px; height: 100px;"/>
				<p>点我添加或修改营业执照</p>
				</el-upload>
			</el-form-item>
			<el-form-item label="营业执照ID" prop="license">
				<el-input v-model="business.license" placeholder="营业执照ID"/>
			</el-form-item>
			<el-form-item>
			    <el-button type="primary" @click="onSubmitBusiness()">注册</el-button>
			    <el-button @click="clearBusiness()">清空</el-button>
			</el-form-item>
		</el-form>
		
	</div>
</template>

<script>
	
	export default
	{
		name: 'Register',
		data() {
			return {
				msg: 'Into Register',
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
				business: {
					phone: '',
					password: '',
					name: '',
					level: 5,
					image: '',
					licenseimage: '',
					license:'',
					number: 0,
					flag: 0
				},
				rules:{
					comuserPhone:[
						{
							required:true,
							trigger:'change',
							message:'请输入11位电话号码'
						}
					],
					comuserPassword:[
						{
							required:true,
							trigger:'change',
							message:'请输入0-16位密码'
						}
					],
					comuserName:[
						{
							required:true,
							trigger:'change',
							message:'请输入姓名'
						}
					]
				},
				ruleBusiness:{
					phone:[
						{
							required:true,
							trigger:'change',
							message:'请输入11位电话号码'
						}
					],
					password:[
						{
							required:true,
							trigger:'change',
							message:'请输入0-16位密码'
						}
					],
					license:[
						{
							required:true,
							trigger:'change',
							message:'请输入营业执照ID'
						}
					],
					name:[
						{
							required:true,
							trigger:'change',
							message:'请输入店铺名称'
						}
					]
				},
				radio: 2
			}
		},
		methods:
		{
			onSubmit()
			{	
				console.log(this.comuser);
				this.comuser.comuserLevel=2;
				this.$refs.RegisterFrom.validate(valid=>{
					if(valid){
						console.log("验证通过");
						console.log(this.comuser);
						this.$axios.post("http://localhost:8085/comuser", this.comuser).then((res)=>{
							if(res.data.flag){
								this.$message.success(res.data.msg + "请等待管理员通过");
								this.comuser = {};
								this.$router.push({path:'/'});
							} else {
								this.$message.success(res.data.msg);
							}
						});
					}
				})
			},
			clear()
			{
				this.comuser = {};
			},
			back(){
				this.$router.push({  name:'signin' });
			},
			handleAvatarSuccess(res) {
				console.log(res);
				this.business.image = res;
				console.log("business()...image" + this.business.image);
				// src = "../static/" + res;
			},
			handleAvatarSuccesslicenseimage(res) {
				console.log(res);
				this.business.licenseimage = res;
				console.log("business()...license_image" + this.business.licenseimage);
			},
			handleAvatarSuccessComuser(res) {
				console.log(res);
				this.comuser.comuserImage = res;
				console.log("comuser()...comuserImage" + this.comuser.comuserImage);
			},
			onSubmitBusiness(){
				this.$refs.BusinessFrom.validate(valid=>{
					if(valid){
						console.log("验证通过");
						console.log(this.comuser);
						this.$axios.post("http://localhost:8085/business", this.business).then((res)=>{
							if(res.data.flag){
								this.$message.success(res.data.msg + "请等待管理员通过");
								this.business = {};
								this.$router.push({path:'/'});
							} else {
								this.$message.success(res.data.msg);
							}
						});
					}
				})
			},
			clearBusiness(){
				
				this.business = {};
			}
			

		}
	}
</script>

<style>
	.row{
		width: 900px;
		margin: 0px auto;
	}
	.avatar-uploader .el-upload {
	  border: 1px dashed var(--el-border-color);
	  border-radius: 6px;
	  cursor: pointer;
	  position: relative;
	  overflow: hidden;
	  transition: var(--el-transition-duration-fast);
	}

	.avatar-uploader .el-upload:hover {
	  border-color: var(--el-color-primary);
	}

	.el-icon.avatar-uploader-icon {
	  font-size: 28px;
	  color: #8c939d;
	  width: 178px;
	  height: 178px;
	  text-align: center;
	}
	.main{
		margin-top: 50px;
	}
	.icon{
		width: 50px;
		height: 50px;
		margin-right: auto;
		margin-left: 50px;
	}
</style>
