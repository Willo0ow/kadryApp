<template>
    <v-parallax dark src='./images/background.jpg' style="height:100%; width:100%">
        <v-app-bar permanent app flat class="grey lighten-3">
             <v-btn @click="loginDialog=!loginDialog" text>Logowanie</v-btn>
            <v-dialog max-width="700px" v-model="loginDialog" v-if="loginDialog">
                <v-card class="grey lighten-3">
                    <v-card-title class="blue-grey darken-1 white--text">Logowanie</v-card-title>
                    <slot name="form-login"></slot>
                </v-card>
            </v-dialog>
            <v-btn @click="registerDialog=!registerDialog" text>Rejestracja</v-btn>
            <v-dialog max-width="700px" v-model="registerDialog" v-if="registerDialog">
                <v-card class="grey lighten-3">
                    <v-card-title class="blue-grey darken-1 white--text">Rejestracja</v-card-title>
                    <slot name="form-register"></slot>
                </v-card>
            </v-dialog>
        </v-app-bar>
        <v-container fluid>
            <v-row align="center" justify="center">
                <v-col cols="12" class="d-flex flex-column text-right">
                    <h1 class="display-1 font-weight-thin mb-4 text-h2 to-uppercase">KadryApp</h1>
                    <h4 class="subheading"></h4>
                </v-col>
            </v-row>
        </v-container>
    </v-parallax>
</template>

<script>
    export default {
        data(){
            return{
                loginDialog: false,
                registerDialog:false
            }
        },
        mounted() {
            
        }
    }
</script>
