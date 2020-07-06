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
                plusTitle:'Dodaj Dział',
                search:false,
                filter: false,
                filterDept:null,
                dialog: false,
                headers: [{title:'Dział', cols:4}, {title:'Kierownik', cols:4}],
                keys: [{title:'name', cols:4}, {title:'supervisor_id', cols:4}],
                component: 'deptdialog',
                pickForm: null,
                route: '/depts',
                getList: 'getDepts',
                deleteMsg: 'Dział został usunięty',
                editDialog: false
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
