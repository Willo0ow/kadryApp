<template>
    <listcomp :info="info" name="holidays"></listcomp>
</template>

<script>
    export default {
        data(){
            return {
                info : {
                    component: 'holidaydialog',
                    pageTitle:'Dni Wolne od Pracy',
                    plusTitle:'Dodaj Dzień Wolny',
                    searched:'',
                    search:false,
                    filter:false,
                    filterDept:null,
                    dialog: false,
                    headers: [{title:'Nazwa Święta', cols:4}, {title:'Data', cols:3}, {title:'Weekend', cols:2}],
                    keys: [{title:'name', cols:4}, {title:'date', cols:3}, {title:'weekend', cols:2}],
                    component: 'holidaydialog',
                    pickForm: null,
                    route: '/holis',
                    getList: 'getHolidays',
                    deleteMsg: 'Dzień wolny został usunięty',
                    editDialog: false
                }
            }
        },
        mounted() {

        },
        created(){
            
        }
    }
</script>
