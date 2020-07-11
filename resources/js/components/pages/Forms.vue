<template>
    <listformcomp :info="info" name='forms' v-if="role && info"></listformcomp>
</template>

<script>
import {mapState} from 'vuex'
import EventBus from '../../libs/bus';
import listformcomp from './ListFormComp'
    export default {
        components:{
            listformcomp
        },
        data(){
            return {

            }
        },
        computed:{
            role(){
                if(this.$route.params.id){
                    return {role:'empl', data:this.$route.params.id, action: 'getEmplForms'}
                } else if (this.$route.params.dept){
                    return {role:'dept', data:this.$route.params.dept, action: 'getDeptForms'}
                } else {
                    return {role:'all', data:'', action:'getAllForms'}
                }
            },
            info(){
                switch (this.role.role){
                    case 'empl':
                        return {
                            pageTitle: 'Moje Wnioski Urlopowe',
                            search: false,
                            filter: false,
                            role: this.role
                        };
                        break;
                    case 'dept':
                        return {
                            pageTitle: 'Wnioski Urlopowe Pracowników Działu',
                            search: true,
                            filter: false,
                            role: this.role
                        };
                        break;
                    case 'all':
                        return {
                            pageTitle: 'Wnioski Urlopowe Pracowników',
                            search: true,
                            filter: true,
                            role: this.role
                        };
                        break;
                }
            },
        },
        methods:{

        },
        created(){
            
        }
    }
</script>
