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
                    headers: [{title:'Nazwa Święta', cols:5}, {title:'Data', cols:3}, {title:'Weekend', cols:3}],
                    keys: [{title:'name', cols:5}, {title:'date', cols:3}, {title:'weekend', cols:3}],
                }
            }
        },
        mounted() {

        },
        created(){
            
        }
    }
</script>
