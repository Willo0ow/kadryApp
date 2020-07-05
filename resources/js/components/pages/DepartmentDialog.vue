<template>
    <v-card class="gradient">
        <v-card-title class="headline white--text justify-center">{{temp.title}}</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col v-if="empls">
                        <v-text-field hint="Nazwa działu" v-model="form.name" persistent-hint single-line dense autocomplete="off" dark filled rounded ></v-text-field>
                        <v-select :items="empls" item-text="name" item-value="id" hint="Wybierz kierownika działu" v-model="form.supervisor_id" persistent-hint single-line dense autocomplete="off" dark filled rounded></v-select>
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
        data(){
            return {
                form: {
                    name:'',
                    supervisor_id:null
                },

            }
        },
        computed:{
            ...mapState({
                empls: state => state.hr.empls
            }),
            temp(){
                return this.type == 'new'? {title:'Dodaj Dział'} :{ title:'Edytuj Dział'}
            },
        },
        methods:{
            resetForm(){
                //this.form = {...this.cleanForm}
                EventBus.$emit('closeDialog')
            },
            async saveForm(){
                await axios.post('/depts', this.form)
                await this.$store.dispatch('getDepts')
                EventBus.$emit('closeDialog')
            }
        },
        mounted() {

        },
        created(){
            
        }
    }
</script>
