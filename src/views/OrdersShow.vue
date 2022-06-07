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
	
	<div class="main">
		<el-card>
			<div>
				<el-table :data="orders">
					<el-table-column prop="id" label="订单编号" width="120px"></el-table-column>
					<el-table-column label="image" width="120px">
						<template #default="scope">
						  <img :src="scope.row.image" style="width: 60px;height: 60px;"/>
						</template>
					</el-table-column>
					<el-table-column prop="commodityname" label="商品名称" width="250px"></el-table-column>
					<el-table-column prop="number" label="数量" width="120px"></el-table-column>
					<el-table-column prop="business" label="商家" width="150px"></el-table-column>
					
					<el-table-column prop="time" label="时间" width="250px"></el-table-column>
					<el-table-column label="状态" width="200px">
						<template #default="scope">
							<div v-if="scope.row.flag==0"><el-tag type="info">待发货</el-tag></div>
							<div v-if="scope.row.flag==1"><el-tag type="warning">已发货</el-tag></div>
							<div v-if="scope.row.flag==2"><el-tag>运输中</el-tag></div>
							<div v-if="scope.row.flag==3"><el-tag type="success">已到货</el-tag></div>
							<div v-if="scope.row.flag==4"><el-tag type="success">交易完成</el-tag></div>
							<div v-if="scope.row.flag==5"><el-tag type="danger">已退货</el-tag></div>
							<div v-if="scope.row.flag==6"><el-tag>退货中</el-tag></div>
							<div v-if="scope.row.flag==7" type="success"><el-tag>交易完成</el-tag></div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="scope">
							<!-- 商家还没发货，直接变成已退货状态 -->
							<div v-if="scope.row.flag==0">
								<el-popconfirm title="商家还未发货,请问是否申请退货？" @confirm="updateById(scope.row, 5)" @cancel="">
									<template #reference>
									<el-button type="danger">申请退货</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag==1">
								<el-button disabled type="primary">确认收货</el-button>
							</div>
							<div v-if="scope.row.flag==2">
								<el-button disabled type="primary">确认收货</el-button>
							</div>
							<div v-if="scope.row.flag==3">
								<el-popconfirm title="是否确认收货？" @confirm="updateById(scope.row, 4)" @cancel="">
									<template #reference>
									<el-button type="primary">确认收货</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag==4">
								<div v-if="Date.parse(scope.row.time) + 86400000 < new Date()">
									<el-button type="success" @click="this.evalCommodity={};dialogEval=true;furowid(scope.row)">评价</el-button>
								</div>
								<div v-if="Date.parse(scope.row.time) + 86400000 > new Date()">
								<el-popconfirm title="是否退货,需等待商家同意？" @confirm="updateById(scope.row, 6)" @cancel="">
									<template #reference>
									<el-button type="danger">申请退货</el-button>
									</template>
								</el-popconfirm>
								</div>
							</div>
							<div v-if="scope.row.flag==5">
								<div v-if="Date.parse(scope.row.time) + 86400000 < new Date()">
									<el-button disabled>评价</el-button>
								</div>
								<div v-if="Date.parse(scope.row.time) + 86400000 > new Date()">
									<el-button disabled type="danger">申请退货</el-button>
								</div>
							</div>
							<div v-if="scope.row.flag==6">
								<el-button type="warning" disabled>删除记录</el-button>
							</div>
							<div v-if="scope.row.flag==7">
								<div v-if="Date.parse(scope.row.time) + 86400000 < new Date()">
									<el-button type="success" @click="dialogShowEval=true;getEval(scope.row)">查看评价</el-button>
								</div>
								<div v-if="Date.parse(scope.row.time) + 86400000 > new Date()">
								<el-popconfirm title="是否退货,需等待商家同意？" @confirm="updateById(scope.row, 6)" @cancel="">
									<template #reference>
									<el-button type="danger">申请退货</el-button>
									</template>
								</el-popconfirm>
								</div>
							</div>
						</template>
					</el-table-column>
					
					<el-table-column label="删除">
						<template #default="scope">
							<div v-if="scope.row.flag==0">
								<el-popconfirm title="确定删除记录？" @confirm="deleteById(scope.row)" @cancel="">
									<template #reference>
									<el-button size="mini" disabled type="info">删除记录</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag==1">
								<el-popconfirm title="确定删除记录？" @confirm="deleteById(scope.row)" @cancel="">
									<template #reference>
									<el-button size="mini" disabled type="info">删除记录</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag==2">
								<el-popconfirm title="确定删除记录？" @confirm="deleteById(scope.row)" @cancel="">
									<template #reference>
									<el-button size="mini" disabled type="info">删除记录</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag==3">
								<el-popconfirm title="确定删除记录？" @confirm="deleteById(scope.row)" @cancel="">
									<template #reference>
									<el-button size="mini" disabled type="info">删除记录</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag==4">
								<el-popconfirm title="确定删除记录？" @confirm="deleteById(scope.row)" @cancel="">
									<template #reference>
									<el-button size="mini" type="info">删除记录</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag==5">
								<el-popconfirm title="确定删除记录？" @confirm="deleteById(scope.row)" @cancel="">
									<template #reference>
									<el-button size="mini" type="info">删除记录</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag==6">
								<el-popconfirm title="确定删除记录？" @confirm="deleteById(scope.row)" @cancel="">
									<template #reference>
									<el-button size="mini" type="info" disabled>删除记录</el-button>
									</template>
								</el-popconfirm>
							</div>
							<div v-if="scope.row.flag==7">
								<el-popconfirm title="确定删除记录？" @confirm="deleteById(scope.row)" @cancel="">
									<template #reference>
									<el-button size="mini" type="info">删除记录</el-button>
									</template>
								</el-popconfirm>
							</div>
						</template>
					</el-table-column>
					
				</el-table>
			</div>
		</el-card>
	</div>
	<el-dialog v-model="dialogEval">
		<span>请输入评价</span>
		<el-input v-model="this.evalCommodity.content" placeholder="Please input" clearable />
		  <div class="demo-rate-block">
		    <span class="demonstration">请为商品满意程度打分</span>
		    <el-rate v-model="evalCommodity.score" />
			<span class="demonstration" style="margin-top: 10px;">请为商家满意程度打分</span>
			<el-rate v-model="businessScore" />
		  </div>
		<el-button size="medium" type="primary" @click="dialogEval=false;evacommodity()">确定提交</el-button>
		<el-button size="medium" @click="dialogEval=false">取消</el-button>
	</el-dialog>
	
	<el-dialog v-model="dialogShowEval">
		<span>
			<i>评分</i>
			<el-input v-model="showEval.score" disabled></el-input>
		</span>
		<span>
			<i>评价</i>
			<el-input v-model="showEval.content" disabled></el-input>
		</span>
	</el-dialog>
	
</template>

<script>
	export default{
		name: 'OrderShow',
		data(){
			return{
				msg: 'Into OrderShow',
				loginInphone: '',
				comuser:{},
				orders:[{}],
				dialogEval: false,
				dialogOrder: false,
				evalCommodity:{
					commodityid: 0,
					commodityname: '',
					businessname: '',
					businessid: 0,
					content: '',
					score: 5,
					userphone: ''
				},
				rowid: 0,
				businessScore: 5,
				eval:{},
				evid: 0,
				eval_content: '',
				eval_score: 0,
				dialogShowEval: false,
				showEval: {
					commodityid: 0,
					commodityname: '',
					businessname: '',
					businessid: 0,
					content: '',
					score: 5,
					userphone: ''
				}
			}
		},
		created() {
			this.loginInphone = this.$route.query.loginInphone;
			this.$axios.get("http://localhost:8085/comuser/" + this.loginInphone).then((res)=>{
			console.log(res);
			this.comuser = res.data.data;
			});
			this.$axios.get("http://localhost:8085/order/getone/" + this.loginInphone).then((res)=>{
			console.log(res);
			this.orders = res.data.data;
			});
		},
		methods: {
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
			//删除订单
			deleteById(row){
				console.log(row.id)
				this.$axios.delete("http://localhost:8085/order/" + row.id).then((res)=>{
				console.log(res);
				});
				this.$axios.get("http://localhost:8085/order/getone/" + this.loginInphone).then((res)=>{
				console.log(res);
				this.orders = res.data.data;
				});
				for(let i = 0; i < this.orders.length; i++){
					if (this.orders[i].id == row.id){
						this.orders.splice(i, 1);
						break;
					}
				}
				this.$message.success("删除记录成功");
			},
			//修改订单状态
			updateById(row, flag){
				let id = -1;
				if(flag == 7){
					id = row;
				} else {
					id = row.id;
				}
				this.$axios.put("http://localhost:8085/order/update/" + id + "/" + flag).then((res)=>{
				console.log(res);
				this.$message.success("操作成功");
				for(let i = 0; i < this.orders.length; i++){
					if(this.orders[i].id == id){
						this.orders[i].flag = flag;
						break;
					}
				}
				});
			},
			//评价
			evacommodity(flag){
				console.log(this.evalCommodity);
				this.updateById(this.rowid, 7);
				this.$axios.post("http://localhost:8085/evalcommodity", this.evalCommodity).then((res)=>{
				console.log(res);
				});
				this.$axios.put("http://localhost:8085/business/score/" + this.evalCommodity.businessid + "/" + this.businessScore).then((res)=>{
				console.log(res);
				});
				this.$axios.put("http://localhost:8085/commodity/score/" + this.evalCommodity.commodityid + "/" + this.evalCommodity.score).then((res)=>{
				console.log(res);
				});
				this.getev.push(this.evalCommodity);
			},
			//赋值
			furowid(row){
				this.rowid = row.id;
				this.evalCommodity.commodityid = row.commodityid;
				this.evalCommodity.commodityname = row.commodityname;
				this.evalCommodity.businessname = row.business;
				this.$axios.get("http://localhost:8085/commodity/" + row.commodityid).then((res)=>{
				console.log(res);
				console.log( "res.data.data.business:" + res.data.data.businesses);
				this.evalCommodity.businessid = res.data.data.business;
				});
				this.evalCommodity.userphone = this.loginInphone;
			},
			getEval(row){
				this.$axios.get("http://localhost:8085/evalcommodity/getcommodity/" + row.commodityid + "/" + this.loginInphone).then((res)=>{
				console.log(res);
				this.showEval = res.data.data;
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
	.main{
		margin-left: 10%;
		margin-right: 10%;
	}
	
	.demo-rate-block {
	  padding: 30px 0;
	  text-align: center;
	  border-right: solid 1px var(--el-border-color);
	  display: inline-block;
	  width: 49%;
	  box-sizing: border-box;
	}
	.demo-rate-block:last-child {
	  border-right: none;
	}
	.demo-rate-block .demonstration {
	  display: block;
	  color: var(--el-text-color-secondary);
	  font-size: 14px;
	  margin-bottom: 20px;
	}
</style>