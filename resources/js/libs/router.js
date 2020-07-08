import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../components/Home'
import sett from '../components/Settings'
import depts from '../components/pages/Departments'
import empls from '../components/pages/Employees'
import forms from '../components/pages/Forms'
import holidays from '../components/pages/Holidays'
import form from '../components/pages/Form'


Vue.use(VueRouter)
export default new VueRouter({
    mode:'history',
    base:"/main",
    routes:[
        {path:'/home', component:home},
        {path:'/departments', component:depts},
        {path:'/employees', component:empls},
        {path:'/forms/:id', component:forms},
        {path:'/deptforms/:dept', component:forms},
        {path:'/allforms', component:forms},
        {path:'/holidays', component:holidays},
        {path:'/settings', component:sett},
        {path:'/form/:id', component:form},
        
    ]
})