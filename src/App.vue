<template>
	<div class="navigation">
		<nav>
<!-- 		    <router-link to="/">Main</router-link> |
			<router-link to="/register">注册</router-link> |
			<router-link to="/signin">登录</router-link> |
			<router-link to="/shoppingcar">购物车</router-link> -->
		</nav>
		<router-view/>
	</div>
</template>

<script>
	export default{
		name: 'App',
		data(){
			return{
			}
		}
	}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
 -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.navigation {
	text-align: center;
	color: #2c3e50;
	margin-top: 0px;
}
</style>
