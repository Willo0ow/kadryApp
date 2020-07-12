<template>
    <v-container fluid style="height: calc(100% - 56px);max-width:1200px">
        <v-row>
            <v-col>
                <v-card app raised class="gradient" dark>
                    <v-row justify="center" align="center">
  
                            <v-select v-if="filter && depts" :items="depts" calss="shrink" item-text="name" placeholder="Filtruj po dziale" item-value="name" clearable v-model="filterDept" single-line dense autocomplete="off" dark filled rounded hide-details></v-select>

    
                            <v-text-field v-if="search" type="search" v-model="searched" placeholder="Szukaj Pracownika" single-line dense autocomplete="off" dark filled rounded hide-details></v-text-field>

                        <template v-if="this.role.role == 'empl'">
                                <v-tooltip top v-for="el of navInfo" :key="el.id" >
                                    <template v-slot:activator="{on,attrs}">
                                        <v-btn text v-bind="attrs" v-on="on" small>
                                            <v-icon class="pr-2">{{el.icon}}</v-icon>
                                            {{el.text}}
                                        </v-btn>
                                    </template>
                                    <span>{{el.tooltip}}</span>
                                </v-tooltip>
                        </template>
     
                            <v-btn text @click="dialog = !dialog">
                                <v-icon>mdi-plus</v-icon>
                               Dodaj Wniosek Urlopowy
                            </v-btn>
                            <v-dialog v-model="dialog" v-if="dialog">
                                <formdialog type="new" :role="role"></formdialog>
                            </v-dialog>

                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="fill-height">
            <v-col>
                <v-card app raised class="gradient" dark style="height:100%">
                    <v-card-title class="text-h5 justify-center">{{pageTitle}}</v-card-title>
                    <v-container v-for="el of categories" :key="el" id="catList">
                        <v-card-subtitle>{{el}}</v-card-subtitle>
                        <v-list dense v-for="item of items[el]" :key="item.id" class="transparent">
                            <v-list-item :key="item.id">
                                <v-card width="97%" class="my-1 transparent">
                                    <v-row align="center" justify="center">
                                        <v-col :cols="cols" class="py-0" v-for="{title,cols} of keys" :key="title" justify="center"><v-card-subtitle class="font-weight-bold py-2 text-center">{{item[title]}}</v-card-subtitle></v-col>
                                        <v-col>
                                            <v-btn @click="edit(item)" text small><v-icon>mdi-pencil</v-icon></v-btn>
                                            <template v-if="currentEdit == item.id">
                                                <v-dialog v-model="editDialog">
                                                    <formdialog type="edit" :pickForm="pickForm" :role="role"></formdialog>
                                                </v-dialog>
                                            </template>
                                        </v-col>
                                        <v-col v-if="item.status == 'draft'"><v-icon @click="remove(item.id)">mdi-trash-can</v-icon></v-col>
                                    </v-row>
                                </v-card>
                            </v-list-item>
                        </v-list>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import formdialog from './FormDialog'
import {mapState} from 'vuex'
import EventBus from '../../libs/bus';
export default {
    components:{formdialog},
    props:{info:Object, name:String},
    data(){
        return {
            ...this.info,
            searched:'',
            filterDept:null,
            editDialog: false,
            dialog: false,
            headers:[{title:'Typ Urlopu', cols:3},{title:'Imię i Nazwisko', cols:3},{title:'Akcje', cols:3}],
            keys: [{title:'type', cols:3},{title:'name', cols:3}, {title:'date_start', cols:2}, {title:'date_end', cols:2}],
            pickForm: null,
            currentEdit: null,
        }
    },
    computed:{
        ...mapState({
            depts: state => state.hr.depts,
            empls: state => state.hr.empls,
            holidays: state => state.hr.holidays,
            forms: state => state.hr.leaveForms,
            user: state => state.user.user
        }),
        navInfo(){
            let user
            if (this.empls) {
                let user = this.empls.find((el)=>el.user_id == this.user.id)
            return [
                {id:0, tooltip:'Imię i nazwisko', icon:'',text:user.name, cols:3},
                {id:1, tooltip:'Dział - stanowisko', icon:'mdi-apps',text:user.dept + " - "+ user.position, cols:3},
                {id:2, tooltip:'Urlop wykorzystany', icon:'mdi-calendar-check',text:user.leave_used, cols:1},
                {id:4, tooltip:'Urlop tegoroczny', icon:'mdi-plus-box-outline',text:user.leave_avbl, cols:1},
                {id:5, tooltip:'Urlop zaległy', icon:'mdi-timeline-clock-outline',text:user.leave_old_rest, cols:1},
            ]
            }
            console.log(user);
            
        },
        items(){
            let forms = {...this.forms}
            let res = {}
            if(this.filterDept){
                for(let el in forms){
                    res[el] = forms[el].filter((val)=>{
                        return val.dept == this.filterDept
                    })
                }
            } else {
                res = forms
            }
            if(this.search){
                for(let el in res){
                    res[el] = res[el].filter((val)=>{
                        let str = val.name.toLowerCase()
                        return str.includes(this.searched.toLowerCase())
                    })
                }
            }
            return res
        },
        categories(){
            let res = Object.keys(this.items)
            res = res.reduce((av, el)=>{
                if(this.items[el].length >0){ av.push(el)}
                return av
            }, [])
            let list =  ['granted', 'approved','processed', 'draft', 'rejected'].reduce((keys,el)=>{
                if(res.includes(el)){keys.push(el)}
                    return keys
                },[])
            return list
        }
    },
    methods:{
        edit(item){
            this.currentEdit = item.id
            this.pickForm = item
            this.editDialog = !this.editDialog
        },
        async remove(id){
            await axios.delete('/leaveform/'+ id)
            await this.$store.dispatch(this.role.action, this.role.data)
            alert('Wniosek został usunięty')
        },
    },
    async mounted(){
        await this.$store.dispatch('getUsers');
        await this.$store.dispatch('getEmplsAll')
        await this.$store.dispatch('getDepts')
        await this.$store.dispatch('getHolidays')
        EventBus.$on('closeDialog', ()=>{
            this.dialog = false
            this.editDialog = false
        })
    },
    async created(){
        await this.$store.dispatch(this.role.action, this.role.data)
    }
}
</script>
<style scoped>
    .v-card__subtitle{
        padding: 0;
        text-align: center;
    }
    #catList.container{
        padding: 0;
    }
</style>