<template>
    <listcomp :info="info" name='depts'></listcomp>
</template>
<script>
import listcomp from './ListComp'
export default {
    components:{listcomp},
    data(){
        return {
            info:{
                pageTitle:'Działy',
                //plus button title
                plusTitle:'Dodaj Dział',
                //search input won't render
                search:false,
                //filter select won't render
                filter: false,
                //selected filter
                filterDept:null,
                //dialog ot add a record
                dialog: false,
                depts:[{name:"HR", id:1, supervisor: 'Jan Kowalski'}, {name:"IT", id:2, supervisor: 'Betty Kowalski'}],
                empls: [
                    {name:'Jan Kowalski', dept: 1, date_start:'2020-03-16', leave_base: 20, leave_used:0, leave_old:2, position:'programmer', supervisor_id:2, contract_type: 'B2B', user_id:1, leave_full:true, id:1},
                    {name:'Anna Kowalski', dept: 2, date_start:'2020-03-16', leave_base: 20, leave_used:0, leave_old:2, position:'programmer', supervisor_id:2, contract_type: 'B2B', user_id:1, leave_full:true, id:1}
                    ],
                //header for the list
                headers: [{title:'Dział', cols:4}, {title:'Kierownik', cols:4}],
                //values for the header columns
                keys: [{title:'name', cols:4}, {title:'supervisor', cols:4}]
            }
        }
    },
    async mounted() {
        await this.$store.dispatch('getEmplsAll')

    },
    async created(){
        await this.$store.dispatch('getDepts')
        
    }
}
</script>
