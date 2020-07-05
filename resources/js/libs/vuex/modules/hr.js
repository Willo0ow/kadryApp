import Axios from "axios"

export default{
    state:{
        empls:null,
        supervisors:null,
        depts:null,
        holidays: null
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
        }

    }
}