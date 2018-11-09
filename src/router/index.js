import Login from '@/components/Login'
import PageNotFound from '@/components/404'
import Home from '@/components/Home'
import Submitted from '@/components/Submitted'


export default [
    { path: '/', name: 'Login', component: Login },
    { path: '/login', name: 'Login', component: Login },
    { path: '/404', name: '404', component: PageNotFound},
    { path: '/home', name: 'home', component: Home},
    { path: '/submitted', name:'submitted', component: Submitted}
  ]
