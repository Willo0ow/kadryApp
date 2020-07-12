import Axios from "axios"

export default{
    state:{
        empls:null,
        supervisors:null,
        depts:null,
        holidays: null,
        leaveForms:null,
        deptEmpls:null,
    },
    mutations:{
        getDeptEmpls(state, dept){
            let res = state.empls.filter((el)=>el.dept == dept)
            state.deptEmpls = res
        },
        assignEmpls(state, payload){
            let calc = payload.map((val)=>{
                
                let {leave_base, leave_used, leave_old, leave_emerg, date_start, leave_accum} = val
                let used = leave_used + leave_emerg
                let old_rest = leave_old < used? {old:0, rest: used - leave_old} : {old: leave_old - used, rest:0}
                let all
                let sDate = new Date(date_start)
                let now = new Date()
                
                if(leave_accum == 1 && sDate.getFullYear() == now.getFullYear()){
                    let sDay = sDate.getDate()
                    let sMonth = sDate.getMonth()
                    let day = now.getDate()
                    let month = now.getMonth()
                    let mpl = (day-1)>= sDay? month - sMonth : month-sMonth-1
                    
                    mpl = mpl<0? 0 : mpl
                    all = Math.ceil(mpl*leave_base/12) - old_rest.rest
                    
                } else {
                    all = leave_base - old_rest.rest
                }
                val.leave_avbl = all
                val.leave_old_rest = old_rest.old
                return val
            })
            
            state.empls = calc
            let res = calc.filter((el)=>el.supervisor==true)
            state.supervisors = res
        },
        assignDepts(state, payload){
            state.depts = payload
        },
        assignHolidays(state, payload){
            state.holidays = payload
        },
        assignLeaveForms(state, payload){
            let arr = payload.reduce((res, el)=>{
                let {date_start, date_end} = el
                let rec = el
                delete rec.date_start
                delete rec.date_end
                rec = {...rec, dates:[date_start, date_end]}
                res.push(rec)
                return res
            },[])
            arr = arr.reduce((groups, val)=>{
                let {status} = val
                groups[status]? groups[status].push(val) : groups[status] = [val]
                return groups
            }, {})
            state.leaveForms = arr
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
        },
        async getDeptForms({commit},data){
            let res = await Axios.get('/leaveform?range=dept&data='+data)
            commit('assignLeaveForms', res.data)
        },
        async getAllForms({commit},data){
            let res = await Axios.get('/leaveform?range=&data=')
            commit('assignLeaveForms', res.data)
        }

    }
}