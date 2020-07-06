<template>
    <v-card class="gradient">
        <v-card-title class="headline white--text justify-center">{{temp.title}}</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col>
                        <v-text-field hint="Nazwa Święta" v-model="form.name" persistent-hint single-line dense autocomplete="off" dark filled rounded ></v-text-field>
                        <v-text-field :value="form.date" @click="picker = !picker" hint="Data Dnia Wolnego" persistent-hint single-line dense autocomplete="off" dark filled rounded></v-text-field>
                        <v-date-picker v-model="form.date" v-if="picker" no-title @input="picker= false" locale="pl" first-day-of-week="1" style="position:absolute; z-index: 4; top:20px; right:15px"></v-date-picker>
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
import EventBus from '../../libs/bus'
    export default {
        props:{
            type:String,
            pickForm:Object
        },
        data(){
            return {
                picker:false,
                form: {
                    name:'',
                    date:'',
                    //weekend: null
                },

            }
        },
        computed:{
            ...mapState({
                holidays: state => state.hr.holidays
            }),
            temp(){
                return this.type == 'new'? {title:'Dodaj Dzień Wolny'} :{ title:'Edytuj Dzień Wolny'}
            },
        },
        methods:{
            async checkHoliday(){
                let currMonth = new Date().getMonth()
                let holiMonth = new Date(this.form.date).getMonth()
                if(this.form.weekend && currMonth == holiMonth){
                    await axios.post('/updateLeaveAdd?newDate='+ this.form.date+'&oldDate=&num=1&change=false')
                }
            },
            async checkEditHoliday(){
                let now = new Date().getMonth()
                let form = new Date(this.form.date).getMonth()
                if(this.pickForm.weekend==1 && this.form.weekend==0){
                    await axios.post('/updateLeaveAdd?newDate='+ this.form.date+'&oldDate='+this.pickForm.date +'&num=-1&change=false')
                } else if (this.pickForm.weekend == 0 && this.form.weekend == 1 && form<=now){
                    await axios.post('/updateLeaveAdd?newDate='+ this.form.date+'&oldDate='+this.pickForm.date +'&num=1&change=false')
                } else if (this.pickForm.weekend == 1 && this.form.weekend == 1 && form<=now){
                    await axios.post('/updateLeaveAdd?newDate='+ this.form.date+'&oldDate='+this.pickForm.date +'&num=1&change=true')
                }
            },
            resetForm(){
                EventBus.$emit('closeDialog')
            },
            async saveForm(){
                let date = new Date(this.form.date)
                let weekend = [6, 0].includes(date.getDay())? true : false
                this.form.weekend = weekend
                if(this.type == 'new'){
                    this.checkHoliday()
                    await axios.post('/holis', this.form)
                } else if (this.type == 'edit'){
                    await this.checkEditHoliday()
                    await axios.patch('/holis/'+ this.form.id, this.form)
                }
                await this.$store.dispatch('getHolidays')
                EventBus.$emit('closeDialog')
            }
        },
        mounted() {

        },
        created(){
            this.form = this.type == 'new'? this.form : {...this.pickForm}
        }
    }
</script>
