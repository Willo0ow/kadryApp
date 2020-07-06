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
                editDialog: false,
                headers: [{title:'Imię i Nazwisko', cols:3}, {title:'Dział', cols:2}, {title:'Stanowisko', cols:3}, {title:'Przełożony', cols:2}],
                keys: [{title:'name', cols:3}, {title:'dept', cols:2}, {title:'position', cols:3}, {title:'supervisor_id', cols:2}],
                component: 'employeedialog',
                pickForm:null,
                route: '/empls',
                getList: 'getEmplsAll',
                deleteMsg: 'Pracownik został usunięty'
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
            this.dialog = false
        })
    }
}
</script>
<style scoped>

</style>
