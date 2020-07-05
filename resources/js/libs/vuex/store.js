import vue from  'vue';
import Vuex from 'vuex';
vue.use(Vuex);

import user from './modules/user'
import hr from './modules/hr'

export default new Vuex.Store({
    modules:{
        user,
        hr
    },
    state:{
        
    }
})