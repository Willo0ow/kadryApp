<template>
    <v-container fluid style="height: calc(100% - 56px);max-width:1200px">
        <v-row>
            <v-col>
                <v-card app raised class="gradient" dark>
                    <v-row justify="center" align="center">
                        <v-col v-if="filter">
                            <v-select :items="depts" calss="shrink" item-text="label" placeholder="Filtruj po dziale" item-value="id" v-if="depts" clearable v-model="filterDept" single-line dense autocomplete="off" dark filled rounded hide-details></v-select>
                        </v-col>
                        <v-col v-if="search">
                            <v-text-field type="search" v-model="search" placeholder="Szukaj Pracownika" single-line dense autocomplete="off" dark filled rounded hide-details></v-text-field>
                        </v-col>
                        <v-col>
                            <v-btn text @click="dialog = !dialog">
                                <v-icon>mdi-plus</v-icon>
                                {{plusTitle}}
                            </v-btn>
                            <v-dialog v-model="dialog" v-if="dialog">
                                <component :is="component" type="new"></component>
                            </v-dialog>
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
                        <v-row align="center" justify="center">
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
import EventBus from '../../libs/bus';
export default {
    props:{info:Object, name:String},
    data(){
        return {...this.info}
    },
    computed:{
        items(){
            if(this.name == 'depts'&& this.$store.state.hr.depts){
                return this.$store.state.hr.depts
            } else if(this.name == 'empls' && this.$store.state.hr.empls){
                let res = this.filterDept? this.$store.state.hr.empls.filter((el)=>el.dept == this.filterDept) : this.$store.state.hr.empls
                if(this.search){
                    res = res.filter((el)=>{
                        let str = el.name.toLowerCase()
                        return str.includes(this.search.toLowerCase())
                    })
                }
                return res
            }
        },
        component(){
            if(this.name == 'depts'){
                return 'deptdialog'
            } else if (this.name == 'empls'){
                return 'employeedialog'
            }
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