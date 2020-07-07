import Axios from "axios"

export default{
    state:{
        empls:null,
        supervisors:null,
        depts:null,
        holidays: null,
        leaveForms:null
    },
    mutations:{
        assignEmpls(state, payload){
            state.empls = payload
            let res = payload.filter((el)=>el.supervisor==true)
            state.supervisors = res
        },
        assignDepts(state, payload){
            state.depts = payload
        },
        assignHolidays(state, payload){
            state.holidays = payload
        },
        assignLeaveForms(state, payload){
            payload.forEach((el, idx))
            let {date_start, date_end} = payload
            state.leaveForms = payload
        }
    },
    actions:{
        async getEmplsAll({commit}){
            let res = await Axios.get('/empls')
            commit('assignEmpls', res.data)
        },
        async getDepts({commit}){
            let res = await Axios.get('/depts')
            commit('assignDepts', res.data)
        },
        async getHolidays({commit}){
            let res = await Axios.get('/holis')
            commit('assignHolidays', res.data)
        },
        async getEmplForms({commit},data){
            let res = await Axios.get('/leaveform?range=empl&data='+data)
            commit('assignLeaveForms', res.data)
        }

    }
}