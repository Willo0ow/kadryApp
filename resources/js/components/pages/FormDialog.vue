<template>
    <v-card class="gradient">
        <v-card-title class="headline white--text justify-center">{{temp.title}}</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col v-if="empls">
                        <v-select :items="types" hint="Wybierz typ urlopu" v-model="form.type" persistent-hint single-line dense autocomplete="off" dark filled rounded></v-select>
                        <v-select :items="subs" item-text="name" item-value="id" hint="Wybierz zastępcę" v-model="form.sub" persistent-hint single-line dense autocomplete="off" dark filled rounded></v-select>
                        <v-text-field hint="Powód urlopu" v-model="form.note" persistent-hint single-line dense autocomplete="off" dark filled rounded v-if="ifNote()"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-date-picker class="grey" v-model="form.dates" range no-title locale="pl" first-day-of-week="1"></v-date-picker>
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
                <v-col>
                    <v-btn dark color="teal darken-3" rounded @click="sendForm">Wyślij</v-btn>
                </v-col>
            </v-card-actions>
        </v-row>
    </v-card>

</template>

<script>
import {mapState} from 'vuex'
    export default {
        data(){
            return {
                types:['wypoczynkowy', 'okolicznościowy', 'bezpłatny', 'na żądanie', 'inny'],
                form : {
                    type:null,
                    dates:['',''],
                    status:'new',
                    date_send:null,
                    note:'',
                    reject_msg:'',
                    sub:null,
                }
            }
        },
        computed:{
            ...mapState({
                empls : state => state.hr.empls
            }),
            temp(){
                return this.type == 'new'? {title:'Dodaj Wniosek Urlopowy'} :{ title:'Wniosek Urlopowy'}
            },
            empl(){
                let {id} = this.$route.params
                let res = this.empls? this.empls.find((el)=>el.id == id) : {}
                return res
            },
            subs(){
                return this.empls.filter((el)=>el.dept == this.empl.dept)
            },
        },
        methods:{
            ifNote(){
                return []this.form.type == 'okolicznościowy' || this.form.type == 'na żądanie'? false : true
            },
            resetForm(){

            },
            saveForm(){

            },
            sendForm(){

            }
        },
        mounted() {

        },
        created(){
            this.$store.dispatch('getEmplsAll')
        }
    }
</script>
