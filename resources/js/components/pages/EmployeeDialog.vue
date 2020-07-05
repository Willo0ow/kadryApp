<template>
        <v-card class="gradient">
            <v-card-title class="headline white--text justify-center">{{temp.title}}</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <v-text-field v-for="el of inputs1" :key="el.hint" :hint="el.hint" v-model="form[el.model]" :type="el.type" persistent-hint single-line dense autocomplete="off" dark filled rounded ></v-text-field>
                        </v-col>
                        <v-col v-if="selects">
                            <v-text-field v-for="el of inputs2" :key="el.hint" :hint="el.hint" v-model="form[el.model]" :type="el.type" persistent-hint single-line dense autocomplete="off" dark filled rounded ></v-text-field>
                            <v-select v-for="el of selects" :key="el.hint" :items="el.items" :item-text="el.label" :item-value="el.value" :hint="el.hint" v-model="form[el.model]" persistent-hint single-line dense autocomplete="off" dark filled rounded></v-select>
                        </v-col>
                        <v-col>
                            <template v-for="el of datepickers">
                                <v-text-field :key="el.dmodel" :value="form[el.model]" @click="pickers[el.dmodel] = !pickers[el.dmodel]" :hint="el.hint" persistent-hint single-line dense autocomplete="off" dark filled rounded></v-text-field>
                                <v-date-picker v-model="form[el.model]" :key="el.model" v-if="pickers[el.dmodel]" no-title @input="pickers[el.dmodel]= false" locale="pl" first-day-of-week="1" style="position:absolute; z-index: 4; top:20px; right:15px"></v-date-picker>
                            </template>
                            <v-switch v-for="el of switches" :key="el.model" v-model="form[el.model]" :label="el.label" dark color="green accent-3"></v-switch>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-row justify="space-around">
                <v-card-actions>
                    <v-col>
                        <v-btn dark color="teal darken-3" rounded @click="resetForm">Anuluj</v-btn>
                    </v-col>
                    <v-col>
                        <v-btn dark color="teal darken-3" rounded @click="saveForm">Zapisz</v-btn>
                    </v-col>
                </v-card-actions>
            </v-row>
        </v-card>
</template>
<script>
import {mapState} from 'vuex'
import EventBus from '../../libs/bus';
export default {
    props:{
        type: String,
        item:Object
    },
    data(){
        return{
            inputs1 : [
                {hint: 'Imię i Nazwisko', model:'name',type:'text'},
                {hint: 'Podstawa urlopu', model:'leave_base',type:'number'},
                {hint: 'Urlop zaległy', model:'leave_old',type:'number'},
                {hint: 'Urlop wyykorzystany', model:'leave_used',type:'number'},
                {hint: 'Urlop na żądanie', model:'leave_emerg',type:'number'},
                {hint: 'Okres wypowiedzenia', model:'notice_period',type:'number'}
            ],
            inputs2:[
                {hint: 'Stanowisko', model:'position',type:'text'},
            ],
            switches:[
                {model: 'supervisor', label: 'Pracownik jest przełożonym'},
                {model: 'leave_accum', label: 'Urlop nalicza się co miesiąc'}
            ],
            contract:[{label:'B2B'}, {label:'Umowa o Pracę'}],
            form:{
                name:'',
                date_start:'',
                date_end:'',
                date_notice:'',
                notice_period:null,
                contract_type:'',
                user_id:null,
                dept:'',
                position:'',
                supervisor_id:'',
                supervisor:false,
                leave_base:'',
                leave_old:'',
                leave_used:'',
                leave_emerg:'',
                leave_accum:false
            },
            pickers:{
                d1:false,
                d2:false,
                d3:false
            }
        }
    },
    computed:{
        ...mapState({
            //employees: state => state.hr.employees
            supervisors: state => state.hr.supervisors,
            users: state => state.user.users,
            depts: state => state.hr.depts
        }),
        selects(){
            return [
                {items:this.users, hint:'user', model:'user_id', label:'name', value:'id'},
                {items:this.contract, hint:'umowa', model:'contract_type', label:'label', value:'label'},
                {items:this.supervisors, hint:'Przełożony', model:'supervisor_id', label:'label', value:'id'},
                {items:this.depts, hint:'dzial', model:'dept', label:'name', value:'name'}
            ]
        },
        datepickers(){
            return [
                {hint:'Data rozpoczęcia pracy', dmodel:'d1', model:'date_start'},
                {hint:'Data zakończenia pracy', dmodel:'d2', model:'date_end'},
                {hint:'Data złożenia wypowiedzenia', dmodel:'d3', model:'date_notice'}
            ]
        },
        temp(){
            return this.type == 'new'? {title:'Dodaj Pracownika'} :{ title:'Edytuj Pracownika'}
        },
    },
    methods:{
        resetForm(){
            this.form = {...this.cleanForm}
            EventBus.$emit('closeDialog')
        },
        async saveForm(){
            await axios.post('/empls', this.form)
            await this.$store.dispatch('getEmplsAll')
            EventBus.$emit('closeDialog')
            //console.log('saved');

            
        }
    },
    created(){
        this.form = this.item? this.item : this.form
    }
}
</script>
<style scoped>

</style>
