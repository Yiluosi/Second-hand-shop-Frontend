<template>
		<div>
			<router-link to="/">
				<img src="../static/艺术字.png">
			</router-link>
		</div>
		

<el-card class="cardfirst">
	
	<div class="business_image">
		<img :src="business.image"/>
	</div>
	<div class="business_p">
		<p>{{business.name}}</p>
		<p>用户评分：{{business.level}}</p>
		<p>累计销量：{{business.number}}</p>
		<p>营业执照ID：{{business.license}}</p>
		<p>可提现金额：{{business.money}}</p>
	</div>
	<div class="business_licens">
		<p>营业执照</p>
	</div>
	
	<div class="business_licensimage" style="float: left;width: 200px;height: 200px;">
		<div v-if="this.licenseimage==0">
			<p>暂未上传营业执照，请尽快上传</p>
		</div>
		<div v-if="this.licenseimage==1">
			<img :src="this.business.licenseimage"/>
		</div>
	</div>
	
	
</el-card>

<el-card class="card_edit">
	<div>
		<p>管理店铺(更新内容需要等待重新审核)</p>
		<div class="card_edit_button">
			<el-button type="danger" @click="dialogAddCommodity = true">发布新商品</el-button>
			<el-button type="primary" @click="dialogWithdrawal=true">提现</el-button>
		</div>
		<el-dialog v-model="dialogWithdrawal">
			<el-input-number v-model="num" :min="1" :max="999999999" style="margin-right: 20px;"/>
			<el-button @click="dialogWithdrawal=false;getmoney()">确定</el-button>
			<el-button @click="dialogWithdrawal=false">取消</el-button>
		</el-dialog>
		<div class="card_edit_button">
			<el-button type="info" size="mini">更改店铺名称</el-button>
			<el-button type="info" size="mini">上传或更改头像</el-button>
		</div>
		<div class="card_edit_button">
			<el-button type="info" size="mini">更改营业执照ID</el-button>
			<el-button type="info" size="mini">上传或更改营业执照</el-button>
		</div>
	</div>
</el-card>

<el-card class="card">
	
	<div class="commodity">
		  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick()">
		    <el-tab-pane label="商品管理" name="first">
				<el-table :data="commodity">
					<el-table-column prop="name" label="商品名"/>
					<el-table-column prop="price" label="价格"/>
					<el-table-column prop="category" label="分类"/>
					<el-table-column prop="information" label="介绍"/>
					<el-table-column prop="stock" label="库存"/>
					<el-table-column prop="sales" label="销量"/>
					<el-table-column label="图片">
						<template #default="scope">
							<img :src="scope.row.image" style="height: 50px;width: 50px;"/>
						</template>
					</el-table-column>
					<el-table-column label="是否在买中">
						<template #default="scope">
							<div v-if="scope.row.flag==1">
								<el-tag>正在出售</el-tag>
							</div>
							<div v-if="scope.row.flag==0">
								<el-tag type="info">暂停出售</el-tag>
							</div>
							<div v-if="scope.row.flag==2">
								<el-tag type="warning">在审核</el-tag>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="编辑">
						<el-button type="primary" disabled>编辑商品</el-button>
					</el-table-column>
					<el-table-column label="查看评价">
						<template #default="scope">
							<el-button type="info" @click="dialogShowEval=true;getEval(scope.row)">查看评价</el-button>
						</template>
						
					</el-table-column>
				</el-table>
			</el-tab-pane>
			
		    <el-tab-pane label="订单管理" name="second">
				
				<el-table :data="orders">
					<el-table-column prop="commodityname" label="商品名"/>
					<el-table-column prop="userphone" label="用户"/>
					<el-table-column prop="number" label="数量" width="100px"/>
					<el-table-column prop="price" label="价格"/>
					<el-table-column label="状态">
						<template #default="scope">
							<div v-if="scope.row.flag == 0"><el-tag type="warning">已付款</el-tag></div>
							<div v-if="scope.row.flag == 1"><el-tag type="info">已发货</el-tag></div>
							<div v-if="scope.row.flag == 2"><el-tag type="info">运输中</el-tag></div>
							<div v-if="scope.row.flag == 3"><el-tag type="info">已收货</el-tag></div>
							<div v-if="scope.row.flag == 4"><el-tag type="success">交易完成</el-tag></div>
							<div v-if="scope.row.flag == 5"><el-tag type="danger">已退货</el-tag></div>
							<div v-if="scope.row.flag == 6"><el-tag type="danger">申请退货</el-tag></div>
							<div v-if="scope.row.flag == 7"><el-tag type="success">已评价</el-tag></div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="scope">
							<div v-if="scope.row.flag == 0">
								<el-popconfirm title="确定发货？" @confirm="updateFlag(scope.row, 1)" @cancel="">
									<template #reference>
									<el-button type="primary">发货</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag == 1">
								<el-popconfirm title="确定输入快递单号？" @confirm="updateFlag(scope.row, 2)" @cancel="">
									<template #reference>
										<el-button type="warning">快递单号</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag == 2">
								<el-popconfirm title="确定查看物流？" @confirm="updateFlag(scope.row, 3)" @cancel="">
									<template #reference>
										<el-button type="info">查询物流</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag == 3">
								<el-button disabled>已到货</el-button>
							</div>
							<div v-if="scope.row.flag == 4">
								<div v-if="Date.parse(scope.row.time) + 86400000 < new Date()">
									<el-popconfirm title="确定删除记录？" @confirm="deleteorder(scope.row)" @cancel="">
										<template #reference>
										<el-button  type="info">删除记录</el-button>
										</template>
									</el-popconfirm>
								</div>
								<div v-if="Date.parse(scope.row.time) + 86400000 > new Date()">
									<el-button disable>等待评价</el-button>
								</div>
							</div>
							<div v-if="scope.row.flag == 5">
								<el-popconfirm title="确定删除记录？" @confirm="deleteorder(scope.row)" @cancel="">
									<template #reference>
									<el-button  type="info">删除记录</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag == 6">
								<el-popconfirm title="确定同意退货？" @confirm="updateFlag(scope.row, 5);refund(scope.row)" @cancel="">
									<template #reference>
										<el-button type="danger">确认退货</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag == 7">
								<el-popconfirm title="确定删除记录？" @confirm="deleteorder(scope.row)" @cancel="">
									<template #reference>
									<el-button  type="info">删除记录</el-button>
									</template>
								</el-popconfirm>
							</div>
						</template>
					</el-table-column>
				</el-table>
				
			</el-tab-pane>
			
		  </el-tabs>
	</div>
	
</el-card>
		
	<div class="addcommodity">
		<el-dialog title="发布新商品" v-model="dialogAddCommodity">
			<el-form :model="addcommodity" label-width="120px">
				<el-form-item label="商品名">
				    <el-input v-model="addcommodity.name" />
				</el-form-item>
				<el-form-item label="价格" width="100px">
				    <el-input v-model="addcommodity.price" />
				</el-form-item>
				<el-form-item label="类型" width="70px">
					<el-select v-model="addcommodity.category" placeholder="点击选择分类">
						<el-option label="图书" value="图书" />
						<el-option label="食品酒饮" value="食品酒饮" />
						<el-option label="宠物鲜花" value="宠物鲜花" />
						<el-option label="手机" value="手机" />
						<el-option label="数码" value="数码" />
						<el-option label="电脑办公" value="电脑办公" />
						<el-option label="家居厨具" value="家居厨具" />
						<el-option label="家具家装" value="家具家装" />
						<el-option label="运动" value="运动" />
						<el-option label="户外" value="户外" />
						<el-option label="男装" value="女装" />
					</el-select>
				</el-form-item>
				<el-form-item label="库存">
				    <el-input v-model="addcommodity.stock" />
				</el-form-item>
				<el-form-item label="商品简介">
				    <el-input v-model="addcommodity.information" />
				</el-form-item>
				<el-form-item label="商品图片">
					<el-upload
					class="avatar-uploader"
					action="http://localhost:8085/file/upload"
					:show-file-list="false"
					:on-success="handleAvatarSuccessAddCommodity"
					>
					<img v-if="addcommodity.image" :src="addcommodity.image" class="avatar" style="width: 100px; height: 100px;"/>
					<p>点我添加或修改商品图片</p>
					</el-upload>
				</el-form-item>
			</el-form>
			<el-button type="primary" @click="addCommodity()">确定</el-button>
			<el-button @click="dialogAddCommodity = false;this.addcommodity={}">取消</el-button>
		</el-dialog>
	</div>
	
	<el-dialog v-model="dialogShowEval">
		<el-table :data="evalCommodity">
			<el-table-column prop="userphone" label="用户"></el-table-column>
			<el-table-column prop="score" label="评分"></el-table-column>
			<el-table-column prop="content" label="内容"></el-table-column>
		</el-table>
	</el-dialog>
	
	
</template>


<script>
	export default{
		name: 'Business',
		data(){
			return{
				business: {
					phone: '',
					password: '',
					name: '',
					level: 5,
					image: '',
					licenseimage: '',
					license:'',
					number: 0,
					flag: 0,
					money: 0
				},
				phone: '',
				licenseimage: 1,
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
				// 发布新商品
				addcommodity:{
					id: 0,
					name: "",
					price: 0,
					category: "",
					information: "",
					stock: 0,
					sales: 0,
					score: 0,
					flag: 2,
					business: "",
					busname: "",
					image:''
				},
				dialogAddCommodity: false,
				dialogShowEval: false,
				activeName: 'first',
				orders:[{}],
				evalCommodity:[
					{
						commodityid: 0,
						commodityname: '',
						businessname: '',
						businessid: 0,
						content: '',
						score: 5,
						userphone: ''
					}
				],
				dialogWithdrawal: false,
				num: 0
			}
		},
		created() {
			this.create();
		},
		methods: {
			create(){
			this.phone = this.$route.query.phone;
			this.$axios.get("http://localhost:8085/business/" + this.phone).then((res)=>{
				console.log(res);
				this.business = res.data.data;
			});
			if (this.business.licenseimage.length==0){
				this.licenseimage == 0;
			}
			console.log(this.licenseimage);
			
			this.$axios.get("http://localhost:8085/commodity/business/" + this.phone).then((res)=>{
				console.log(res);
				this.commodity = res.data.data;
			});
			
		},
			handleAvatarSuccessLicense(res){
				console.log(res);
				this.business.license_image = res;
				console.log("business()...license_image" + this.business.license_image);
			},
			handleAvatarSuccessAddCommodity(res){
				console.log(res);
				this.addcommodity.image = res;
			},
			addCommodity(){
				this.addcommodity.business=this.business.phone;
				this.addcommodity.busname=this.business.name;
				this.$axios.post("http://localhost:8085/commodity", this.addcommodity).then((res)=>{
					if(res.data.flag){
						this.$message.success(res.data.msg);
						this.addcommodity = {};
					} else {
						this.$message.success(res.data.msg);
					}
				});
				this.dialogAddCommodity = false;
				location.reload();
			},
			handleClick(){
				this.$axios.get("http://localhost:8085/order/business/" + this.business.name).then((res)=>{
					console.log(res);
					this.orders = res.data.data;
				});
				this.$axios.get("http://localhost:8085/commodity/business/" + this.phone).then((res)=>{
					console.log(res);
					this.commodity = res.data.data;
				});
			},
			deleteorder(row){
				this.$axios.delete("http://localhost:8085/order/" + row.id).then((res)=>{
				console.log(res);
				});
				for(let i = 0; i < this.orders.length; i++){
					if(this.orders[i].id = row.id){
						this.orders.splice(i, 1);
						break;
					}
				}
				this.$message.success("删除记录成功");
			},
			updateFlag(row, flag){
				this.$axios.put("http://localhost:8085/order/update/" + row.id + "/" + flag).then((res)=>{
				console.log(res);
				this.$message.success("操作成功");
				for(let i = 0; i < this.orders.length; i++){
					if(this.orders[i].id == row.id){
						this.orders[i].flag = flag;
						break;
					}
				}
				});
			},
			getEval(row){
				this.$axios.get("http://localhost:8085/evalcommodity/getcommodity/" + row.id).then((res)=>{
				console.log(res);
				this.evalCommodity = res.data.data;
				});
			},
			// 提现
			getmoney(){
				if(this.num > this.business.money){
					this.$message.error("超出提现金额");
				} else if (this.business.money - this.num < 500) {
					this.$message.error("提现后低于保证金500元");
				} else {
					let temp = (this.num*0.95).toFixed(2);
					let profit = this.num - temp;
					if(this.business.level >= 3){
						temp = (this.num*0.94).toFixed(2);
						profit = this.num - temp;
					}
					if(this.business.level >= 2){
						temp = (this.num*0.93).toFixed(2);
						profit = this.num - temp;
					}
					if(this.business.level >= 1){
						temp = (this.num*0.92).toFixed(2);
						profit = this.num - temp;
					}
					if(this.business.level >= 0){
						temp = (this.num*0.91).toFixed(2);
						profit = this.num - temp;
					}
					this.$axios.put("http://localhost:8085/business/money/" + this.business.phone + "/" + this.num).then((res)=>{
					console.log(res);
					});
					this.$axios.put("http://localhost:8085/platform/profit/" + profit).then((res)=>{
					console.log(res);
					});
					this.$message.success("提现成功");
				}
			},
			// 退款
			refund(row){
				// 平台

				// 商家
				this.$axios.put("http://localhost:8085/business/refund/" + row.business + "/" + row.price*row.number).then((res)=>{
				console.log(res);
				});
				// 客户
				this.$axios.post("http://localhost:8085/bill/refund/" + row.userphone + "/" + row.price*row.number).then((res)=>{
				console.log(res);
				});
			}
			
		}
	}
</script>

<style>
	.business_image img{
		margin-left: 5%;
		margin-top: 20px;
		float: left;
		width: 200px;
		height: 200px;
	}
	.business_p p{
		text-align: left;
		margin-left: 20px;
		font-size: 20px;
		font-weight: bolder;
		font-style: italic;
	}
	.business_p{
		float: left;
	}
	.business_licens{
		margin-left: 100px;
		float: left;
		font-size: 20px;
		font-weight: bolder;
		font-style: italic;
	}
	.business_editor{
		margin-left: 200px;
	}
	.business_editor p{
		text-align: left;
		margin-left: 20px;
		font-size: 20px;
		font-weight: bolder;
		font-style: italic;
	}
	.business_licens img{
		float: left;
		width: 200px;
		height: 200px;
	}
	.business_licensimage img{
		float: left;
		width: 200px;
		height: 200px;
		margin-top: 20px;
		margin-left: 50px;
	}
	.card{
		float: left;
		margin-left: 10%;
		width: 80%;
	}
	.cardfirst{
		float: left;
		margin-left: 10%;
		width: 60%;
		margin-top: 20px;
		height: 300px;
	}
	.card_edit{
		width: 20%;
		height: 300px;
		margin: 20px;
	}
	.card_edit_button{
		margin-top: 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>