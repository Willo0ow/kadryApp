<template>
    <v-card class="gradient" v-if="form.dates">
        <v-card-title class="headline white--text justify-center">{{temp.title}}</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col>
                        <v-select :items="deptEmpls" hint="Wybierz pracownika" v-model="empl" @input="assignEmpl" item-text="name" return-object persistent-hint single-line dense autocomplete="off" dark filled rounded :readonly="disabled" v-if="ifSelectEmpls"></v-select>
                        <v-select :items="types" hint="Wybierz typ urlopu" v-model="form.type" persistent-hint single-line dense autocomplete="off" dark filled rounded :readonly="disabled"></v-select>
                        <v-select :items="subs" item-text="name" item-value="id" hint="Wybierz zastępcę" v-model="form.sub" persistent-hint single-line dense autocomplete="off" dark filled rounded :readonly="disabled"></v-select>
                        <v-text-field hint="Powód urlopu" v-model="form.note" persistent-hint single-line dense autocomplete="off" dark filled rounded v-if="ifNote" :readonly="disabled"></v-text-field>
                        <v-text-field hint="Powód odrzucenia" v-model="form.reject_msg" persistent-hint single-line dense autocomplete="off" dark filled rounded v-if="ifReject" readonly></v-text-field>
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
                    <v-col v-if="role!='dept'">
                        <v-btn dark color="teal darken-3" rounded @click="saveForm">Zapisz</v-btn>
                    </v-col>
                    <v-col>
                        <v-btn dark color="teal darken-3" rounded @click="sendForm">Wyślij</v-btn>
                    </v-col>
                </template>
                <template v-if="role == 'dept' && type=='edit' && form.status=='processed'">
                    <v-col>
                        <v-btn dark color="teal darken-3" rounded @click="updateStatus('approved')">Zatwierdź</v-btn>
                    </v-col>
                    <v-col>
                        <v-btn dark color="teal darken-3" rounded @click="updateStatus('rejected')">Odrzuć</v-btn>
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
                form : {
                    type:null,
                    dates:['',''],
                    status:'draft',
                    note:'',
                    reject_msg:'',
                    sub:null,
                    dept: '',
                    empl_id: '',
                    user_id: this.$store.state.user.user.id
                },
                empl:null
            }
        },
        computed:{
            ...mapState({
                empls : state => state.hr.empls,
                //deptEmpls: state => state.hr.deptEmpls
            }),
            role(){
                let {params, path} = this.$route
                if(params.id){return 'empl'}
                else if(params.dept){return 'dept'}
                else if(path=='/allforms'){return 'all'}
            },
            deptEmpls(){
                if(this.role== 'dept'){
                    return this.empls.filter((el)=>{return el.dept == this.$route.params.dept})
                } else if (this.role == 'empl'){
                    return this.$store.state.hr.deptEmpls
                } else if(this.role == 'all'){
                    return this.empls
                }
            },
            temp(){
                //title of the component
                return this.type == 'new'? {title:'Dodaj Wniosek Urlopowy'} :{ title:'Wniosek Urlopowy'}
            },
            subs(){
                //substitutions for the employee
                if(this.empl && this.role != 'all'){
                    let res = this.deptEmpls.filter((el)=>el.id != this.$route.params.id)
                    return res
                } else if(this.role == 'all'&& this.empl){
                    let res = this.empls.filter((el)=>{return el.dept == this.empl.dept && el.id != this.empl.id})
                    return res
                }
                return []
            },
            ifNote(){ 
                //adds note input if a particular type of leave has been chosen
                return ['inny', 'bezpłatny', 'okolicznościowy'].indexOf(this.form.type)>=0 ? true : false
            },
            ifReject(){
                return this.form.status == 'rejected' ? true : false
            },
            ifSelectEmpls(){
                return (this.$route.path == '/allforms' || this.$route.params.dept) && this.deptEmpls
            },
            disabled(){
                //prevents changes in the form if already sent
                let role = this.role
                let status = this.form.status
                let empl = status != 'draft' && role == 'empl'
                if(role == 'empl'){return empl}
                else if((role == 'dept' || role == 'all' )&& this.type == 'new'){return false}
                return true
            },
        },
        methods:{
            async updateStatus(status){
                this.form.status = status
                await this.saveForm()
            },
            assignEmpl(){
                this.form.empl_id = this.empl.id
            },
            resetForm(){
                if(this.type== 'new'){
                    EventBus.$emit('closeDialog', 1)
                } else {
                    EventBus.$emit('closeDialog', this.pickForm.id)
                }
            },
            prepForm(){
                //prepares the form to be sent to db
                let form = this.form
                let [date_start, date_end] = form.dates
                delete form.dates
                return form = {...form, date_start:date_start, date_end:date_end}
            },
            async saveForm(){
                let form = this.prepForm()
                if(form.id){
                    //if edited form and save
                    delete form.name
                    await axios.patch('/leaveform/'+form.id, form)
                } else {
                    //if new form and save
                    await axios.post('/leaveform', form)
                }
                //gets updaetd list of employee's forms
                if(this.$route.params.id) {await this.$store.dispatch('getEmplForms', this.$route.params.id)}
                else if(this.$route.params.dept) {await this.$store.dispatch('getDeptForms', this.$route.params.dept)}
                EventBus.$emit('closeDialog', form.id)
            },
            async sendForm(){
                let form = this.prepForm()
                form['date_sent'] = new Date().toISOString().slice(0,10)
                form.status = this.$route.params.id? 'processed' : 'approved'
                if(!form.id){
                    //if new and send
                    await axios.post('/leaveform', form)
                } else {
                    //if editted form and send
                    delete form.name
                    await axios.patch('/leaveform/'+form.id, form)
                }
                //get updated list of employee's forms
                if(this.$route.params.id) {await this.$store.dispatch('getEmplForms', this.$route.params.id)}
                else if(this.$route.params.dept) {await this.$store.dispatch('getDeptForms', this.$route.params.dept)}
                EventBus.$emit('closeDialog', form.id)
            }
        },
        mounted() {

        },
        async created(){
            //get the list of all employees
            await this.$store.dispatch('getEmplsAll')
            if(this.type == 'edit' && this.$route.params.id){
                //if form editted, assign employee
                let {id} = this.$route.params
                let res = this.empls? this.empls.find((el)=>el.id == id) : {}
                this.empl = res
                this.form = this.pickForm
            }
            if (this.type=='new'&& this.$route.params.id){
                //if new form and created by the employee
                let {id} = this.$route.params
                let res = this.empls? this.empls.find((el)=>el.id == id) : {}
                this.empl = res
                this.form.dept = this.empl.dept
                this.form.empl_id = parseInt(this.$route.params.id)
            }
            else if (this.$route.params.dept && this.type == 'new'){
                //if created by the supervisor
                this.form.status = 'approved'
                this.form.dept = this.$route.params.dept
            }
            else if (this.$route.params.dept && this.type == 'edit'){
                //if edited by the supervisor
                this.form = this.pickForm
                this.empl = this.empls.find((el)=>{
                    return el.id == this.form.empl_id
                })
            }

            else if (this.$route.path== '/allforms' && this.type == 'edit'){
                //if employee edits the form
                this.form = this.pickForm
            }
            //get the staff of teh department
            this.$store.commit('getDeptEmpls',this.form.dept)
        } 
    }
</script>
