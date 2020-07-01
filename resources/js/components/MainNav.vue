<template>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent app light width="300px" src="./images/background.jpg">
        <v-list-item @click="toggleMini()" class="blue-grey darken-1" dark>
            <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
            <v-list-item-content v-if="user">
                <v-list-item-title>{{user.name}}</v-list-item-title>
                <v-list-item-subtitle><a href="/" @click="logout">Logout</a></v-list-item-subtitle>
            </v-list-item-content>
        </v-list-item>
        <v-list-item v-for="el of list" :key="el.title" @click="toggleMini()">
            <v-list-item-icon><v-icon>{{el.icon}}</v-icon></v-list-item-icon>
            <v-list-item-content link :to="el.link">{{el.title}}</v-list-item-content>
        </v-list-item>
    </v-navigation-drawer>
</template>

<script>
    export default {
        data(){
            return {
                drawer:true,
                mini:true,
                list:[
                    {title: 'Moje wnioski', icon:'mdi-file-document', link:'/home'},
                    {title: 'Wnioski pracowników działu', icon:'mdi-clipboard-list', link:'/home'},
                    {title: 'Wnioski pracowników', icon:'mdi-clipboard-list', link:'/home'},
                    {title: 'Pracownicy', icon:'mdi-account-group', link:'/home'},
                    {title: 'Działy', icon:'mdi-apps', link:'/home'},
                    {title: 'Dni wolne od pracy', icon:'mdi-calendar', link:'/home'},
                ],
                user:null
            }
        },
        methods:{
            async logout(){
                this.$store.commit('resetUser')
                await axios.get('/logout')
            },
            toggleMini(){
                this.mini = !this.mini
            }
        },
        async beforeMount(){
            await this.$store.dispatch('getUser')
            this.user = this.$store.state.user.user
        },
        mounted() {
            
        }
    }
</script>
<style scoped>
    a{
        text-decoration: none;
        color: white !important;
    }
</style>
