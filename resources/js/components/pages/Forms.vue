<template>
    <listcomp :info="info" name='forms'></listcomp>
</template>

<script>
    export default {
        data(){
            return {
                info : {
                    component: 'formdialog',
                    pageTitle:'Wnioski Urlopowe',
                    plusTitle:'Dodaj Wniosek Urlopowy',
                    searched:'',
                    search:true,
                    filter:true,
                    filterDept:null,
                    dialog: false,
                    headers: [{title:'Rodzaj urlopu', cols:5}, {title:'Data akceptacji', cols:3}, {title:'Pracownik', cols:3}],
                    keys: [{title:'type', cols:5}, {title:'date_approved', cols:3}, {title:'employee_id', cols:3}],
                }
            }
        },
        mounted() {

        },
        created(){
            
        }
    }
</script>
