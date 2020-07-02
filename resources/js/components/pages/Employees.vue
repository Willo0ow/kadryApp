<template>
    <v-container fluid style="height: calc(100% - 56px);max-width:1200px">
        <v-row>
            <v-col>
                <v-card app raised class="gradient" dark>
                    <v-row justify="center" align="center">
                        <v-col>
                            <v-select :items="depts" calss="shrink" item-text="label" placeholder="Filtruj po dziale" item-value="id" v-if="depts" clearable v-model="filterDept" single-line dense autocomplete="off" dark filled rounded hide-details></v-select>
                        </v-col>
                        <v-col>
                            <v-text-field type="search" v-model="search" placeholder="Szukaj Pracownika" single-line dense autocomplete="off" dark filled rounded hide-details></v-text-field>
                        </v-col>
                        <v-col>
                            <v-btn text>
                                <v-icon>mdi-plus</v-icon>
                                {{plusTitle}}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="fill-height">
            <v-col>
                <v-card app raised class="gradient" dark style="height:100%">
                    <v-card-title class="text-h5 justify-center">{{pageTitle}}</v-card-title>
                    <v-card  class="cyan darken-4 ml-3 mb-2" dark width="94.5%">
                        <v-row>
                            <v-col :cols="cols" class="py-0" v-for="{title,cols} of headers" :key="title"><v-card-subtitle class="font-weight-bold py-2 text-center">{{title}}</v-card-subtitle></v-col>
                        </v-row>
                    </v-card>
                    <v-virtual-scroll dense height="350px" :items="items" :item-height="60">
                        <template v-slot="{item}">
                            <v-list-item :key="item.id">
                                <v-card width="97%" class="my-1 transparent">
                                    <v-row align="center" justify="center">
                                        <v-col :cols="cols" class="py-0" v-for="{title,cols} of keys" :key="title" justify="center"><v-card-subtitle class="font-weight-bold py-2 text-center">{{item[title]}}</v-card-subtitle></v-col>
                                    </v-row>
                                </v-card>
                            </v-list-item>
                        </template>
                    </v-virtual-scroll>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import {mapState} from 'vuex'
export default {
    data(){
        return{
            pageTitle:'Pracownicy',
            plusTitle:'Dodaj Pracownika',
            search:'',
            filterDept:null,
            depts:[{label:"HR", id:1}, {label:"IT", id:2}],
            empls: [
                {name:'Jan Kowalski', dept: 1, date_start:'2020-03-16', leave_base: 20, leave_used:0, leave_old:2, position:'programmer', supervisor_id:2, contract_type: 'B2B', user_id:1, leave_full:true, id:1},
                {name:'Anna Kowalski', dept: 2, date_start:'2020-03-16', leave_base: 20, leave_used:0, leave_old:2, position:'programmer', supervisor_id:2, contract_type: 'B2B', user_id:1, leave_full:true, id:1}
                ],
            headers: [{title:'Imię i Nazwisko', cols:4}, {title:'Dział', cols:2}, {title:'Stanowisko', cols:3}, {title:'Przełożony', cols:3}],
            keys: [{title:'name', cols:4}, {title:'dept', cols:2}, {title:'position', cols:3}, {title:'supervisor_id', cols:3}]
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
}
</script>
<style scoped>

</style>
