import vue from  'vue';
import Vuex from 'vuex';
vue.use(Vuex);

import user from './modules/user'

export default new Vuex.Store({
    modules:{
        user
    },
    state:{
        
    }
})