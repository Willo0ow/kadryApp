<template>
    <listformcomp :info="info" name='forms' v-if="pTitle"></listformcomp>
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
            pTitle(){
                let {path} = this.$route
                if(path == '/allforms'){
                    return 'Wnioski Urlopowe'
                } else if(path.includes('deptforms')){
                    return 'Wnioski Urlopowe Dizału ' + this.$route.params.dept
                } else {
                    return 'Moje Wnioski Urlopowe'
                }
            },
            info(){return  {
                    component: 'formdialog',
                    pageTitle:this.pTitle,
                    plusTitle:'Dodaj Wniosek Urlopowy',
                    searched:'',
                    search:this.filters().search,
                    filter:this.filters().filter,
                    filterDept:null,
                    dialog: false,
                    headers: [{title:'Rodzaj urlopu', cols:5}, {title:'Data akceptacji', cols:3}, {title:'Pracownik', cols:3}],
                    keys: [{title:'type', cols:3},{title:'name', cols:3}, {title:'date_start', cols:2}, {title:'date_end', cols:2}],
                    editDialog: false,
                    getList: 'getEmplForms',
                    pickForm:null,
                    route:'/leaveform'
                }},
        },
        methods:{
            filters(){
                let {path} = this.$route
                if(path == '/allforms'){
                    return {search:true, filter:true}
                } else if (path.includes('deptforms')){
                    return {search:true, filter:false}
                }
                return {search:false, filter:false}
            },
        },
        mounted() {
            
        },
        created(){
            
        }
    }
</script>
