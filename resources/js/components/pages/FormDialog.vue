<template>
    <v-card class="gradient" v-if="form.dates">
        <v-card-title class="headline white--text justify-center">{{title}}</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col>
                        <v-select :items="deptEmpls" hint="Wybierz pracownika" v-model="empl" @input="assignEmpl" item-text="name" return-object persistent-hint single-line dense autocomplete="off" dark filled rounded :readonly="disabled" v-if="ifSelectEmpls && deptEmpls"></v-select>
                        <v-select :items="types" hint="Wybierz typ urlopu" v-model="form.type" persistent-hint single-line dense autocomplete="off" dark filled rounded :readonly="disabled"></v-select>
                        <v-select :items="subs" item-text="name" item-value="id" hint="Wybierz zastępcę" v-model="form.sub" persistent-hint single-line dense autocomplete="off" dark filled rounded :readonly="disabled"></v-select>
                        <v-text-field hint="Powód urlopu" v-model="form.note" persistent-hint single-line dense autocomplete="off" dark filled rounded v-if="ifNote" :readonly="disabled"></v-text-field>
                        <v-text-field hint="Powód odrzucenia" v-model="form.reject_msg" persistent-hint single-line dense autocomplete="off" dark filled rounded v-if="form.status == 'rejected'" readonly></v-text-field>
                    </v-col>
                    <v-col>
                        <v-date-picker  ref="datePicker" :allowed-dates="allowed" selected-items-text="$vuetify.datePicker.selected" class="grey" v-model="form.dates" range no-title locale="pl" first-day-of-week="1" :readonly="disabled"></v-date-picker>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-row justify="space-around">
            <v-card-actions>
                <v-col>
                    <v-btn dark color="teal darken-3" rounded @click="resetForm">Anuluj</v-btn>
                </v-col>
                    <v-col v-if="role.role=='empl' && !disabled">
                        <v-btn dark color="teal darken-3" rounded @click="saveForm">Zapisz</v-btn>
                    </v-col>
                    <v-col v-if="sendBtn">
                        <v-btn dark color="teal darken-3" rounded @click="sendForm">Wyślij</v-btn>
                    </v-col>
                <template v-if="approveBtn">
                    <v-col>
                        <v-btn dark color="teal darken-3" rounded @click="updateStatus()">Zatwierdź</v-btn>
                    </v-col>
                    <v-col>
                        <v-btn dark color="teal darken-3" rounded @click="rejectForm = true">Odrzuć</v-btn>
                        <v-dialog v-model="rejectForm">
                            <v-card>
                                <v-text-field v-model="form.reject_msg"></v-text-field>
                                <v-btn @click="reject()">Reject</v-btn>
                                <v-btn @click="reject = false">Cancel</v-btn>
                            </v-card>
                        </v-dialog>
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
            type:String,
            role: Object
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
                empl:null,
                rejectForm: false,
                disabled:null,
                ifSelectEmpls: false,
                title: '',
            }
        },
        computed:{
            ...mapState({
                empls : state => state.hr.empls,
                holidays: state => state.hr.holidays
            }),
            deptEmpls(){
                let role = this.role.role
                if(role== 'dept'){
                    return this.empls.filter((el)=>{return el.dept == this.form.dept})
                } else if (role == 'empl'){
                    return this.$store.state.hr.deptEmpls
                } else if(role == 'all'){
                    return this.empls
                }
            },
            subs(){
                //substitutions for the employee
                if(this.empl && this.role.role != 'all'){
                    let res = this.deptEmpls.filter((el)=>el.id != this.empl.id)
                    return res
                } else if(this.role.role == 'all' && this.empl){
                    let res = this.empls.filter((el)=>{return el.dept == this.empl.dept && el.id != this.empl.id})
                    return res
                }
                return []
            },
            ifNote(){ 
                //adds note input if a particular type of leave has been chosen
                return ['inny', 'bezpłatny', 'okolicznościowy'].indexOf(this.form.type)>=0 ? true : false
            },
            sendBtn(){
                let role = this.role.role
                let status = this.form.status
                let empl = role == 'empl' && status == 'draft'
                let dept = role == 'dept' && this.type == 'new' && status == 'approved'
                let all = role == 'all' && this.type == 'new' && status == 'granted'
                return empl || dept || all
            },
            approveBtn(){
                let status = this.form.status
                if (this.type == 'edit' && this.role.role == 'all'){
                    return status == 'approved' || status == 'processed'
                } else if (this.type == 'edit' && this.role.role == 'dept'){
                    return status == 'processed'
                }
                return false
            }
        },
        methods:{
            allowed(val){
                let date = new Date(val)
                let today = new Date()
                let day = date.getDay()
                let weekend = day == 0 || day == 6
                let holis = this.holidays.map((el)=>{
                    return el.date
                })
                let holiday = holis.includes(date.toISOString().slice(0,10))
                let status = this.type == 'new' || this.status == 'draft'
                if(status && this.role.role == 'empl'){
                    return !weekend && !holiday && (today<date)
                }
                return !weekend && !holiday
            },
            async reject(){
                this.form.status = 'rejected'
                await this.saveForm()
            },
            async updateStatus(){
                let status = this.role.role == 'all'? 'granted' : 'approved'
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
                if(this.role.role == 'all'){
                    form.dept = this.empl.dept
                }
                if(form.name){delete form.name}
                return form = {...form, date_start:date_start, date_end:date_end}
            },
            async saveForm(){
                let form = this.prepForm()
                if(form.id){
                    await axios.patch('/leaveform/'+form.id, form)
                } else {
                    await axios.post('/leaveform', form)
                }
                //gets updaetd list of employee's forms
                await this.$store.dispatch(this.role.action, this.role.data)
                EventBus.$emit('closeDialog', form.id)
            },
            async sendForm(){
                let form = this.prepForm()
                form['date_sent'] = new Date().toISOString().slice(0,10)
                if(this.$route.params.id){
                    form.status = 'processed'
                }
                if(form.id){
                    await axios.patch('/leaveform/'+form.id, form)
                } else {
                    await axios.post('/leaveform', form)
                }
                //get updated list of employee's forms
                await this.$store.dispatch(this.role.action, this.role.data)
                EventBus.$emit('closeDialog', form.id)
            }
        },
        mounted() {

        },
        async created(){
            //get the list of all employees
            await this.$store.dispatch('getEmplsAll')
            let {role,data} = this.role
            
            if(this.type=='edit'){
                this.title = 'Wniosek Urlopowy'
                this.form = this.pickForm
                this.empl = this.empls.find((el)=>{
                    return el.id == this.form.empl_id
                })
                let {status} = this.form
                switch(role){
                    case 'empl':
                        this.disabled = status != 'draft'? true : false
                    break;
                    case 'dept':
                        this.disabled = status != 'processed'? true : false
                    break;
                    case 'all':
                        this.disabled = ['granted', 'rejected'].includes(status)? true : false
                    break;
                }
            } else {
                this.title = 'Nowy Wniosek Urlopowy'
                this.disabled = false
                switch(role){
                case 'empl':
                    this.empl = this.empls.find((el)=>el.id == data)
                    this.form.dept = this.empl.dept
                    this.form.empl_id = parseInt(this.$route.params.id);
                    break;
                case 'dept':
                    this.form.status = 'approved'
                    this.form.dept = data;
                    this.ifSelectEmpls = true
                    break;
                case 'all':
                    this.form.status = 'granted';
                    this.ifSelectEmpls = true
                    break;
                }
            }
            //get the staff of teh department
            this.$store.commit('getDeptEmpls',this.form.dept)
        } 
    }
</script>
