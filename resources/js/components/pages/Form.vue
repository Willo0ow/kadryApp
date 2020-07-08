<template>
    <v-card class="gradient" v-if="form.dates">
        <v-card-title class="headline white--text justify-center">{{temp.title}}</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col>
                        <v-select :items="deptEmpls" hint="Wybierz pracownika" v-model="empl" item-text="name" item-value="item" persistent-hint single-line dense autocomplete="off" dark filled rounded :readonly="disabled" v-if="this.$route.params.dept"></v-select>
                        <v-select :items="types" hint="Wybierz typ urlopu" v-model="form.type" persistent-hint single-line dense autocomplete="off" dark filled rounded :readonly="disabled"></v-select>
                        <v-select :items="subs" item-text="name" item-value="id" hint="Wybierz zastępcę" v-model="form.sub" persistent-hint single-line dense autocomplete="off" dark filled rounded :readonly="disabled"></v-select>
                        <v-text-field hint="Powód urlopu" v-model="form.note" persistent-hint single-line dense autocomplete="off" dark filled rounded v-if="ifNote" :readonly="disabled"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-date-picker class="grey" v-model="form.dates" range no-title locale="pl" first-day-of-week="1" :readonly="disabled"></v-date-picker>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-row justify="space-around">
            <v-card-actions>
                <v-col>
                    <v-btn dark color="teal darken-3" rounded @click="resetForm">Anuluj</v-btn>
                </v-col>
                <template v-if="!disabled">
                    <v-col>
                        <v-btn dark color="teal darken-3" rounded @click="saveForm">Zapisz</v-btn>
                    </v-col>
                    <v-col>
                        <v-btn dark color="teal darken-3" rounded @click="sendForm">Wyślij</v-btn>
                    </v-col>

                </template>
            </v-card-actions>
        </v-row>
    </v-card>

</template>

<script>
import {mapState} from 'vuex'
import EventBus from '../../libs/bus';
    export default {
        props:{
            pickForm:Object,
            type:String
        },
        data(){
            return {
                types:['wypoczynkowy', 'okolicznościowy', 'bezpłatny', 'na żądanie', 'inny'],
                form : {},
                empl:null
            }
        },
        computed:{
            ...mapState({
                empls : state => state.hr.empls,
                deptEmpls: state => state.hr.deptEmpls
            }),
            temp(){
                return this.type == 'new'? {title:'Dodaj Wniosek Urlopowy'} :{ title:'Wniosek Urlopowy'}
            },
/*             empl(){
                if(this.$route.params.id){let {id} = this.$route.params
                let res = this.empls? this.empls.find((el)=>el.id == id) : {}
                return res}
                return {}
            }, */
            subs(){
                if(this.empl){
                    let res = this.empls.filter((el)=>el.dept == this.empl.dept && el.id != this.empl.id)
                    return res
                } return []
            },
            ifNote(){ 
                return ['inny', 'bezpłatny', 'okolicznościowy'].indexOf(this.form.type)>=0 ? true : false
            },
            disabled(){
                return (this.form.status != 'draft' && this.$route.params.id)?  true : false
            },
        },
        methods:{
            resetForm(){
                EventBus.$emit('closeDialog')
            },
            prepForm(){
                let form = this.form
                let [date_start, date_end] = form.dates
                delete form.dates
                return form = {...form, date_start:date_start, date_end:date_end}
            },
            async saveForm(){
                let form = this.prepForm()
                await axios.post('/leaveform', form)
                await this.$store.dispatch('getEmplForms', this.$route.params.id)
                EventBus.$emit('closeDialog')
            },
            async sendForm(){
                let form = this.prepForm()
                form['date_sent'] = new Date().toISOString().slice(0,10)
                form.status = 'processed'
                if(!form.id){
                    await axios.post('/leaveform', form)
                } else {
                    delete form.name
                    await axios.patch('/leaveform/'+form.id, form)
                }
                await this.$store.dispatch('getEmplForms', this.$route.params.id)
                EventBus.$emit('closeDialog')
            }
        },
        mounted() {

        },
        async created(){
            await this.$store.dispatch('getEmplsAll')
            let form = {type:null,
                    dates:['',''],
                    status:'draft',
                    note:'',
                    reject_msg:'',
                    sub:null,
                    dept: '',
                    empl_id: '',
                    user_id: this.$store.state.user.user.id}
            if (this.type=='new'&& this.$route.params.id){
                console.log('newEmployee');
                let {id} = this.$route.params
                let res = this.empls? this.empls.find((el)=>el.id == id) : {}
                this.empl = res
                
                form.dept = this.empl.dept
                form.empl_id = parseInt(this.$route.params.id)
                this.form = form
            }
            else if (this.$route.params.dept){
                form.status = 'approved'
                form.dept = this.$route.params.dept
                this.form = form
            }
            else {
                this.form = this.pickForm
            }
            this.$store.commit('getDeptEmpls',this.form.dept)
        } 
    }
</script>
