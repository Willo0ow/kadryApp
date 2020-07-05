<template>
    <listcomp :info="info" name='empls'></listcomp>
</template>
<script>
import {mapState} from 'vuex'
import EventBus from '../../libs/bus';
export default {
    data(){
        return{
            info:{
                pageTitle:'Pracownicy',
                plusTitle:'Dodaj Pracownika',
                searched:'',
                search:true,
                filter:true,
                filterDept:null,
                dialog: false,
                // depts:[{label:"HR", id:1}, {label:"IT", id:2}],
                // empls: [
                //     {name:'Jan Kowalski', dept: 1, date_start:'2020-03-16', leave_base: 20, leave_used:0, leave_old:2, position:'programmer', supervisor_id:2, contract_type: 'B2B', user_id:1, leave_full:true, id:1},
                //     {name:'Anna Kowalski', dept: 2, date_start:'2020-03-16', leave_base: 20, leave_used:0, leave_old:2, position:'programmer', supervisor_id:2, contract_type: 'B2B', user_id:1, leave_full:true, id:1}
                //     ],
                headers: [{title:'Imię i Nazwisko', cols:4}, {title:'Dział', cols:2}, {title:'Stanowisko', cols:3}, {title:'Przełożony', cols:3}],
                keys: [{title:'name', cols:4}, {title:'dept', cols:2}, {title:'position', cols:3}, {title:'supervisor_id', cols:3}],
                component: 'employeedialog'
            }
        }
    },
    computed:{
        items(){
            let res = this.filterDept? this.empls.filter((el)=>el.dept == this.filterDept) : this.empls
            if(this.search){
                res = res.filter((el)=>{
                    let str = el.name.toLowerCase()
                    return str.includes(this.search.toLowerCase())
                })
            }
            return res
            
        }

    },
    methods:{
 
    },
    async mounted(){
        await this.$store.dispatch('getUsers');
        await this.$store.dispatch('getEmplsAll')
        await this.$store.dispatch('getDepts')
        EventBus.$on('closeDialog', ()=>{
            console.log('bus');
            
            this.dialog = false
        })
    }
}
</script>
<style scoped>

</style>
