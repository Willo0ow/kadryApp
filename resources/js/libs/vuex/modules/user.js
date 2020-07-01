import Axios from "axios"

export default{
    state:{
        user:null
    },
    mutations:{
        assignUser(state, payload){
            state.user = payload
        },
        resetUser(state){
            console.log('user reset');
            
            state.user = null
        }
    },
    actions:{
        async getUser({commit}){
            let res = await Axios.get('/user')
            commit('assignUser', res.data)
        }

    }
}