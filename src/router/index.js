import Login from '@/components/Login'
import PageNotFound from '@/components/404'
import Home from '@/components/Home'
import Submitted from '@/components/Submitted'
import Rankings from '@/components/Rankings'
import TieBreaker from '@/components/TieBreaker'


export default [
    { path: '/', name: 'Login', component: Login },
    { path: '/login', name: 'Login', component: Login },
    { path: '/404', name: '404', component: PageNotFound},
    { path: '/:judgeNumber/home', name: 'Home', component: Home},
    { path: '/:judgeNumber/submitted', name: 'Submitted', component: Submitted},
    { path: '/:judgeNumber/rankings', name: 'Rankings', component: Rankings},
    { path: '/:judgeNumber/tie_breaker', name: 'TieBreaker', component: TieBreaker}
  ]
