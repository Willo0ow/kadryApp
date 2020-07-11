<template>
    <v-container fluid style="height: calc(100% - 56px);max-width:1200px">
        <v-row>
            <v-col>
                <v-card app raised class="gradient" dark>
                    <v-row justify="center" align="center">
                        <v-col v-if="filter">
                            <v-select :items="depts" calss="shrink" item-text="name" placeholder="Filtruj po dziale" item-value="name" v-if="depts" clearable v-model="filterDept" single-line dense autocomplete="off" dark filled rounded hide-details></v-select>
                        </v-col>
                        <v-col v-if="search">
                            <v-text-field type="search" v-model="searched" placeholder="Szukaj Pracownika" single-line dense autocomplete="off" dark filled rounded hide-details></v-text-field>
                        </v-col>
                        <v-col>
                            <v-btn text @click="dialog = !dialog">
                                <v-icon>mdi-plus</v-icon>
                                {{plusTitle}}
                            </v-btn>
                            <v-dialog v-model="dialog" v-if="dialog">
                                <formdialog type="new"></formdialog>
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
                                                    <formdialog type="edit" :pickForm="pickForm"></formdialog>
                                                </v-dialog>
                                            </template>
                                        </v-col>
                                        <v-col><v-icon @click="remove(item.id)">mdi-trash-can</v-icon></v-col>
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
    components:{
        formdialog
    },
    props:{info:Object, name:String},
    data(){
        return {...this.info, currentEdit:null}
/*         info:{
                pageTitle://title of the main card
                plusTitle://name of plus button to add a new record
                searched://searched phrase, if enabled, set ''
                search:// true - enables search input in the header
                filter:// true - enables filter-select
                filterDept:null,
                editDialog: //false - dialog to edit a record, hidden at mount
                dialog: //false - dialog to add a new record hidden at mount
                headers: //headers for the list [{title:'Imię i Nazwisko', cols:4}],
                keys: //keys for the values of the list [{title:'name', cols:4}],
                component: //name of the component that renders in dialog,
                pickForm: //null - prop will be assigned to and sent to editdialog,
                route: // route to controller,
                getList: // dispatch action in vuex to get items for the list,
                deleteMsg: // message to display when item of the list is deleted
            } */
    },
    computed:{
        ...mapState({
            depts: state => state.hr.depts,
            empls: state => state.hr.empls,
            holidays: state => state.hr.holidays,
            forms: state => state.hr.leaveForms,
        }),
        empl_id(){
            return this.$route.params.id
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
            //if filter by dept enabled show only forms from the selected dept
            //let res = this.filterDept? forms.filter((el)=>el.dept == this.filterDept) : forms
            //if search enabled show only forms with matching names
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
            await axios.delete(this.route + '/'+ id)
            if(this.$route.params.id) {await this.$store.dispatch('getEmplForms', this.$route.params.id)}
            else if(this.$route.params.dept) {await this.$store.dispatch('getDeptForms', this.$route.params.dept)}
            alert(this.deleteMsg)
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
        if(this.$route.params.id){
            await this.$store.dispatch('getEmplForms', this.$route.params.id)
        } else if (this.$route.params.dept){
            await this.$store.dispatch('getDeptForms', this.$route.params.dept)
        } else if (this.$route.path == '/allforms'){
            await this.$store.dispatch('getAllForms')
        }
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