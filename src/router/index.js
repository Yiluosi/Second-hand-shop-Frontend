import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ComuserShow from '../views/ComuserShow.vue'
import Register from '../views/Register.vue'
import SignIn from '../views/SignIn.vue'
import Administrators from '../views/Administrators.vue'
import Main from '../views/Main.vue'
import ShowBus from "../views/ShowBus.vue"
import ShoppingCar from "../views/ShoppingCar.vue"
import Business from "../views/Business.vue"
import BillShow from "../views/BillShow.vue"
import OrdersShow from "../views/OrdersShow.vue"
import Test from "../views/test.vue"

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/comusershow',
    name: 'comusershow',
    component: ComuserShow
  },
  {
	  path: '/register',
	  component: Register
  },
  {
	  path: '/signin',
	  name: 'signin',
	  component: SignIn
  },
  {
	  path: '/administrators',
	  name: 'administrators',
	  component: Administrators
  },
  {
  	  path: '/',
	  name: 'main',
  	  component: Main
  },
  {
	  path: '/showbus',
	  name: 'showbus',
	  component: ShowBus
  },
  {
  	  path: '/shoppingcar',
  	  name: 'shoppingcar',
  	  component: ShoppingCar
  },
  {
  	  path: '/business',
  	  name: 'business',
  	  component: Business
  },
  {
  	  path: '/billshow',
  	  name: 'billshow',
  	  component: BillShow
  },
  {
  	  path: '/ordersshow',
  	  name: 'ordersshow',
  	  component: OrdersShow
  },
  {
  	  path: '/test',
  	  name: 'test',
  	  components: Test
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
