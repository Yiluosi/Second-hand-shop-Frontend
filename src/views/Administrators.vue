<template>
	<router-link to="/">
		<img src="../static/艺术字.png">
	</router-link>
	<div>
		<el-dialog v-model="dialogWithdrawal">
			<el-input-number v-model="num" :min="1" :max="999999999" style="margin-right: 20px;"/>
			<el-button @click="dialogWithdrawal=false;withdrawal()">确定</el-button>
			<el-button @click="dialogWithdrawal=false">取消</el-button>
		</el-dialog>
		<el-tabs v-model="activeName" class="demo-tabs">
			
			<el-tab-pane label="平台信息" name="first">
				<div style="float: left">
					<el-button @click="updatePlat()" type="primary">更新平台信息</el-button>
					<el-button @click="dialogWithdrawal=true" type="primary">提现</el-button>

				</div>
				<div style="clear: both;width: 60%;	margin-left: 20%; margin-right: 20%;">
					<el-card class="card">
						<span>
							<i>当前用户总数：{{platform.sumuser}}</i>
						</span>
					</el-card>
					<el-card class="card">
						<span>
							<i>当前商家总数：{{platform.sumbusiness}}</i>
						</span>
					</el-card>
					<el-card class="card">
						<span>
							<i>当前商品总数：{{platform.sumcommodity}}</i>
						</span>
					</el-card>
					<el-card class="card">
						<span>
							<i>当前订单总数：{{platform.sumorder}}</i>
						</span>
					</el-card>
					<el-card class="card">
						<span>
							<i>当前暂存金额：{{platform.tempmoney}}</i>
						</span>
					</el-card>
					<el-card class="card">
						<span>
							<i>当前可提现金额：{{platform.profit}}</i>
						</span>
					</el-card>
				</div>


			</el-tab-pane>
			
			<el-tab-pane label="用户注册审核" name="second">
				<el-table :data="logincomuser">
					<el-table-column prop="comuserPhone" label="手机号"/>
					<el-table-column prop="comuserName" label="姓名"/>
					<el-table-column prop="comuserMail" label="邮箱"/>
					<el-table-column prop="comuserWechat" label="微信"/>
					<el-table-column prop="comuserInformation" label="个人介绍"/>
					<el-table-column label="用户类型">
						<template #default="scope">
							<div  v-if="scope.row.comuserLevel==2">
								<el-tag type="warning">待审核用户</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="scope">
							  <!-- 待批准用户 -->
							<div  v-if="scope.row.comuserLevel==2">
								<el-popconfirm title="确定批准这个申请？" @confirm="comUserUpdate(scope.row,0)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="primary">批准</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定驳回这个申请？" @confirm="comUserDelete(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="info">驳回</el-button>
									</template>
								</el-popconfirm>
							</div>
						  </template>
						</el-table-column>
				</el-table>
			</el-tab-pane>
			
			<el-tab-pane label="商家注册审核" name="third">
				
				<el-table :data="loginbusiness">
					<el-table-column prop="phone" label="手机号"/>
					<el-table-column prop="name" label="姓名"/>
					<el-table-column prop="level" label="商家评分"/>
					<el-table-column prop="license" label="营业执照ID"/>
					<el-table-column prop="number" label="销售次数"/>
					<el-table-column label="商家类型">
						<template #default="scope">
								<el-tag type="warning">待审核商家</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="scope">
							  <!-- 待批准商家 -->
								<el-popconfirm title="确定批准这个申请？" @confirm="businessUpdate(scope.row,0)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="primary">批准</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定驳回这个申请？" @confirm="businessDelete(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="info">驳回</el-button>
									</template>
								</el-popconfirm>
						  </template>
						</el-table-column>
				</el-table>
			
			</el-tab-pane>
			
			<el-tab-pane label="商品管理" name="fourth">
				
				<div class="filter-container">
					  <el-select v-model="fourthOptions.value" placeholder="选择商品状态" style="width:150px;" clearable>
					    <el-option
					      v-for="item in fourthOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					    />
					  </el-select>
					<el-button type="primary" style="margin-left: 5px;" @click="commodityQuery()">查询</el-button>
				</div>
				
				<el-table :data="commodity">
					<el-table-column prop="name" label="商品名"/>
					<el-table-column prop="price" label="价格"/>
					<el-table-column prop="category" label="类型"/>
					<el-table-column prop="stock" label="库存"/>
					<el-table-column prop="information" label="商品简介"/>
					<el-table-column label="商品状态">
						<template #default="scope">
							<div  v-if="scope.row.flag==0">
								<el-tag type="info">暂停销售</el-tag>
							</div>
							<div  v-if="scope.row.flag==1">
								<el-tag type="success">在售</el-tag>
							</div>
							<div  v-if="scope.row.flag==2">
								<el-tag type="warning">待审核</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="scope">
							  <!-- 待审核的 -->
							<div  v-if="scope.row.flag==2">
								<el-popconfirm title="确定批准这个商品发布请求？" @confirm="commodityUpdate(scope.row,1)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="primary">批准</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定驳回这个商品的请求？无法恢复!" @confirm="commodityDelete(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="info">驳回</el-button>
									</template>
								</el-popconfirm>
							</div>
							<!-- 在售商品 -->
							<div  v-if="scope.row.flag==1">
								<el-popconfirm title="确定封禁这个商品？" @confirm="commodityUpdate(scope.row,2)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="warning">封禁</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定删除这个商品？无法恢复!" @confirm="commodityDelete(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="danger">删除</el-button>
									</template>
								</el-popconfirm>
							</div>
							<!-- 封禁商品 -->
							<div  v-if="scope.row.flag==0">
								<el-popconfirm title="确定解封这个商品？" @confirm="commodityUpdate(scope.row,1)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="success">解封</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定删除这个商品？无法恢复!" @confirm="commodityUpdate(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="danger">删除</el-button>
									</template>
								</el-popconfirm>
							</div>
						  </template>
						</el-table-column>
				</el-table>
				
			</el-tab-pane>
			
			<el-tab-pane label="用户管理" name="fifth">
				<div class="filter-container">
					<el-input placeholder="用户手机号" v-model="searchUser.phone" style="width:200px;" clearable></el-input>
					  <el-select v-model="fifthOptions.value" placeholder="选择用户类型" style="width:150px;" clearable>
					    <el-option
					      v-for="item in fifthOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					    />
					  </el-select>
					<el-button type="primary" style="margin-left: 5px;" @click="comUserQuery()">查询</el-button>
				</div>
							
				<el-table :data="comuser">
					<el-table-column prop="comuserPhone" label="手机号"/>
					<el-table-column prop="comuserName" label="姓名"/>
					<el-table-column prop="comuserMail" label="邮箱"/>
					<el-table-column prop="comuserWechat" label="微信"/>
					<el-table-column prop="comuserInformation" label="个人介绍"/>
					<el-table-column label="用户类型">
						<template #default="scope">
							<div  v-if="scope.row.comuserLevel==0">
								<el-tag>普通用户</el-tag>
							</div>
							<div  v-if="scope.row.comuserLevel==1">
								<el-tag type="info">管理员</el-tag>
							</div>
							<div  v-if="scope.row.comuserLevel==2">
								<el-tag type="warning">待审核用户</el-tag>
							</div>
							<div  v-if="scope.row.comuserLevel==3">
								<el-tag type="danger">封号用户</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="scope">
							  <!-- 普通用户 -->
							<div  v-if="scope.row.comuserLevel==0">
								<el-popconfirm title="确定封禁这个账号？" @confirm="comUserUpdate(scope.row,3)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="warning">封号</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定删除这个账号？无法恢复!" @confirm="comUserDelete(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="danger">删除</el-button>
									</template>
								</el-popconfirm>
							</div>
							  <!-- 管理员 -->
							<div v-if="scope.row.comuserLevel==1"> 
								<p>无权限</p>
							</div>
							  <!-- 待批准用户 -->
							<div  v-if="scope.row.comuserLevel==2">
								<el-popconfirm title="确定批准这个申请？" @confirm="comUserUpdate(scope.row,0)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="primary">批准</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定驳回这个申请？" @confirm="comUserDelete(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="info">驳回</el-button>
									</template>
								</el-popconfirm>
							</div>
							  <!-- 封号用户 -->
							<div v-if="scope.row.comuserLevel==3">
								<el-popconfirm title="确定解封这个账户？" @confirm="comUserUpdate(scope.row,0)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="success">解封</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定删除这个账户？" @confirm="comUserDelete(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="danger">删除</el-button>
									</template>
								</el-popconfirm>
							</div>
						  </template>
						</el-table-column>
				</el-table>
			</el-tab-pane>
			
			<el-tab-pane label="商家管理" name="sixth">
				<div class="filter-container">
					<el-input placeholder="用户手机号" v-model="searchUser.phone" style="width:200px;" clearable></el-input>
					  <el-select v-model="fifthOptions.value" placeholder="选择商家类型" style="width:150px;" clearable>
					    <el-option
					      v-for="item in fifthOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value"
					    />
					  </el-select>
					<el-button type="primary" style="margin-left: 5px;" @click="comUserQuery()">查询</el-button>
				</div>
				<el-table :data="business">
					<el-table-column prop="phone" label="手机号"/>
					<el-table-column prop="name" label="姓名"/>
					<el-table-column prop="level" label="商家评分"/>
					<el-table-column prop="license" label="营业执照ID"/>
					<el-table-column prop="number" label="销售次数"/>
					<el-table-column label="商家类型">
						<template #default="scope">
							<div  v-if="scope.row.flag==0">
								<el-tag type="warning">待审核商家</el-tag>
							</div>
							<div  v-if="scope.row.flag==1">
								<el-tag>营业商家</el-tag>
							</div>
							<div  v-if="scope.row.flag==2">
								<el-tag type="danger">封禁商家</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="scope">
							  <!-- 待审核的 -->
							<div  v-if="scope.row.flag==0">
								<el-popconfirm title="确定批准这个账号？" @confirm="businessUpdate()(scope.row,1)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="primary">批准</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定驳回这个账号？无法恢复!" @confirm="businessDelete(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="info">驳回</el-button>
									</template>
								</el-popconfirm>
							</div>
							  <!-- 正在营业 -->
							<div v-if="scope.row.flag==1"> 
								<el-popconfirm title="确定封禁这个账号？无法恢复!" @confirm="businessUpdate(scope.row,2)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="warning">封禁</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定删除这个账号？无法恢复!" @confirm="businessDelete(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="danger">删除</el-button>
									</template>
								</el-popconfirm>
							</div>
							  <!-- 封禁的 -->
							<div  v-if="scope.row.flag==2">
								<el-popconfirm title="确定解封这个账号？" @confirm="businessUpdate(scope.row,1)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="success">解封</el-button>
									</template>
								</el-popconfirm>
								<el-popconfirm title="确定删除这个账号？无法恢复!" @confirm="businessDelete()(scope.row)" @cancel="cancel()">
									<template #reference>
									<el-button size="small" type="danger">删除</el-button>
									</template>
								</el-popconfirm>
							</div>
						  </template>
						</el-table-column>
				</el-table>
			</el-tab-pane>
			
		</el-tabs>
	</div>

</template>

<script>
	export default{
		name: 'Administrators',
		data(){
			return{
				msg: 'Into Administrators',
				activeName: 'first', //默认在第一个
				num: 0,
				comuser:[
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
						comuserImage: "",
						comuserLevel: '0',
						comuserMoney: 0
					}
				],
				logincomuser:[
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
						comuserImage: "",
						comuserLevel: '0',
						comuserMoney: 0
					}
				],
				loginbusiness: [
					{
						phone: '',
						password: '',
						name: '',
						level: 5,
						image: '',
						license_image: '',
						license:'',
						number: 0,
						flag: 0
					}
				],
				business: [
					{
						phone: '',
						password: '',
						name: '',
						level: 5,
						image: '',
						license_image: '',
						license:'',
						number: 0,
						flag: 0
					}
				],
				commodity:[
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
						flag: 1,
						image:''
					}
				],
				searchUser:{
					phone: ''
				},
				fifthOptions:[
					{
						value: '0',
						label: '普通用户',
					},
					{
						value: '1',
						label: '管理员',
					},
					{
						value: '2',
						label: '待批准用户',
					},
					{
						value: '3',
						label: '封号用户',
					}
				],
				fourthOptions: [
					{
						value: '0',
						label: '暂停出售商品',
					},
					{
						value: '1',
						label: '正在出售商品',
					},
					{
						value: '2',
						label: '待审核商品',
					}
				],
				platform:{
					id: 1,
					sumuser: 0,
					sumbusiness: 0,
					sumorder: 0,
					sumcommodity: 0,
					tempmoney: 0.0,
					profit: 0.0
				},
				dialogWithdrawal: false
			}
		},
		created() {
			this.getComUsers();
		},
		methods:{
			getComUsers(){
				//所有用户
				this.$axios.get("http://localhost:8085/comuser/getones").then((res)=>{
					console.log(res);
					this.comuser = res.data.data;
				});
				//注册申请用户
				this.$axios.get("http://localhost:8085/comuser/screen/2").then((res)=>{
					console.log(res);
					this.logincomuser = res.data.data;
				});
				//所有商家
				this.$axios.get("http://localhost:8085/business/getones").then((res)=>{
					console.log(res);
					this.business = res.data.data;
				});
				//注册申请商家
				this.$axios.get("http://localhost:8085/business/flag/0").then((res)=>{
					console.log(res);
					this.loginbusiness = res.data.data;
				});
				//所有商品
				this.$axios.get("http://localhost:8085/commodity/getones").then((res)=>{
					console.log(res);
					this.commodity = res.data.data;
				});
				//平台信息
				this.$axios.get("http://localhost:8085/platform/info").then((res)=>{
					console.log(res);
					this.platform = res.data.data;
				});
			},
			//更改级别
			comUserUpdate(row, level){
				// this.$message.success(row.comuserPhone+"level:"+level);
				this.$axios.put("http://localhost:8085/comuser/update/" + row.comuserPhone + "/" + level).then((res)=>{
					this.$message.success("修改成功");
					this.getComUsers();
				});
			},
			//删除用户
			comUserDelete(row){
				// this.$message.success(row.comuserPhone);
				console.log("comUserDelete()...")
				this.$axios.delete("http://localhost:8085/comuser/" + row.comuserPhone).then((res)=>{
					if(res.data.flag=true){
						this.$message.success("删除成功");
						this.getComUsers();
					}
				});
			},
			cancel(){
				this.$message.info("取消操作");
			},
			//用户管理的查找功能
			comUserQuery(){
				console.log("comUserQuery()...");
				console.log(this.searchUser.phone);
				console.log(this.fifthOptions.value);
				if(this.searchUser.phone.length==0 && (this.fifthOptions.value=='0'||this.fifthOptions.value=='1'||this.fifthOptions.value=='2'||this.fifthOptions.value=='3')){
					console.log(1);
					this.$axios.get("http://localhost:8085/comuser/screen/" +this.fifthOptions.value).then((res)=>{
						this.$message.success("查询成功");
						this.comuser = res.data.data;
					});
				}
				else if(this.searchUser.phone.length==0){
					console.log(2);
					this.getComUsers();
				}
				else if(this.searchUser.phone!=""){
					console.log(3);
					this.$axios.get("http://localhost:8085/comuser/one/" +this.searchUser.phone).then((res)=>{
						this.$message.success("查询成功");
						this.comuser = res.data.data;
					});
				}
			},
			commodityQuery(){
				if(this.fourthOptions.value=='0'||this.fourthOptions.value=='1'||this.fourthOptions.value=='2'){
					console.log(this.fourthOptions.value);
					this.$axios.get("http://localhost:8085/commodity/flag/" + this.fourthOptions.value).then((res)=>{
						this.$message.success("查询成功");
						this.commodity = res.data.data;
					});
				} else {
					console.log("this.fourthOptions.value是空的");
					this.$axios.get("http://localhost:8085/commodity/getones").then((res)=>{
						this.$message.success("查询成功");
						this.commodity = res.data.data;
					});
				}
			},
			businessUpdate(row,flag){
				console.log("businessUpdate()...");
				this.$axios.put("http://localhost:8085/business/update/" + row.phone + "/" + flag).then((res)=>{
					this.$message.success("修改成功");
					this.getComUsers();
				});
			},
			businessDelete(row){
				console.log("businessDelete()...");
				this.$axios.delete("http://localhost:8085/business/" + row.phone).then((res)=>{
					if(res.data.flag=true){
						this.$message.success("操作成功");
						this.getComUsers();
					}
				});
			},
			commodityUpdate(row, flag) {
				console.log("commodityUpdate()...");
				this.$axios.put("http://localhost:8085/commodity/update/" + row.id + "/" + flag).then((res)=>{
					this.$message.success("修改成功");
					this.getComUsers();
				});
			},
			commodityDelete(row) {
				console.log("commodityDelete()...");
				this.$axios.delete("http://localhost:8085/commodity/" + row.id).then((res)=>{
					if(res.data.flag=true){
						this.$message.success("操作成功");
						this.getComUsers();
					}
				});
			},
			// 更新平台信息
			updatePlat(){
				this.$axios.post("http://localhost:8085/platform", this.platform).then((res)=>{
					this.$message.success("更新成功");
					this.getComUsers();
				});
			},
			//  提现
			withdrawal(){
				if(this.num > this.platform.profit){
					this.$message.error("超出提现金额");
				} else {
					this.$axios.put("http://localhost:8085/platform/withdrawal/" + this.num).then((res)=>{
						this.$message.success("提现成功");
					});
					this.platform.profit = this.platform.profit - this.num;
				}
			}
		}
	}
</script>

<style>
	.demo-tabs > .el-tabs__content {
	  padding: 32px;
	  color: #6b778c;
	  font-size: 32px;
	  font-weight: 600;
	}
	.filter-container{
		float: left;
		padding:10px 0 15px 0;
	}
	.filter-item{
		line-height:36px;
		padding:0 10px;
		cursor:pointer;
		font-size:14px
		}
	.card{
		width: 60%;
		margin-left: 20%;
		margin-top: 10px;
		margin-right: 20%;
	}
</style>
