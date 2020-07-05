import Axios from "axios"

export default{
    state:{
        user:null
    },
    mutations:{
        assignUser(state, payload){
            state.user = payload
        },
        assignUsers(state, payload){
            state.users = payload
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
        },
        async getUsers({commit}){
            let res = await Axios.get('/users')
            commit('assignUsers', res.data)
        }

    }
}