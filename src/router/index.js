import Login from '@/components/Login'
import PageNotFound from '@/components/404'
import Home from '@/components/Home'


export default [
    { path: '/', name: 'Login', component: Login },
    { path: '/login', name: 'Login', component: Login },
    { path: '/404', name: '404', component: PageNotFound},
    { path: '/home', name: 'home', component: Home}
  ]
