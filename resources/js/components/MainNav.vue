<template>
<div>
    <v-app-bar app class="gradient" dark elevation="0">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-menu open-on-hover bottom offset-y v-if="user" content-class="transparent">
            <template v-slot:activator="{ on, attrs }">
                <v-chip v-if="user" class="transparent pr-10" v-bind="attrs" v-on="on">
                    <v-icon class="mr-2" >mdi-account</v-icon>
                    {{user.name}}
                </v-chip>
            </template>
            <v-btn @click="logout" width="100%" class="logout"><a href="/">Wyloguj</a></v-btn>
        </v-menu>
    </v-app-bar>
    <v-navigation-drawer 
        v-model="drawer" 
        app
        floating
        :permanent="drawer"
        mini-variant
        >
        <v-list dense dark>
            <v-list-item>
                <v-list-item-action>
                    <v-icon @click.stop="drawer = !drawer" :color="teal">mdi-arrow-left-drop-circle</v-icon>
                </v-list-item-action>
            </v-list-item>
        </v-list>
        <v-list>
            <v-list-item v-for="el in list" :key="el.title" link :to="el.link">
                <v-tooltip right>
                    <template v-slot:activator="{on,attrs}">
                            <v-icon :color="teal" v-bind="attrs" v-on="on">{{ el.icon }}</v-icon>
                    </template>
                    <span class="white--text">{{ el.title }}</span>
                </v-tooltip>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                drawer:true,
                mini:true,
                user:null,
                teal:'#005555',
                out:false
            }
        },
        computed:{
            list(){
                if(this.user){
                    let {role} = this.user
                    let tiles =  [
                        {title: 'Moje wnioski', icon:'mdi-file-document', link:'/forms/'+this.user.id},
                    ]
                    if(role == 5){return tiles}
                    if(role !=2 && role !=1){
                        tiles.push({title: 'Wnioski pracowników działu', icon:'mdi-clipboard-list', link:'/deptforms/HR'})
                    }
                    if([1,2,3].indexOf(role)>=0){
                        tiles.push({title: 'Wnioski pracowników', icon:'mdi-clipboard-list', link:'/allforms'},
                        {title: 'Pracownicy', icon:'mdi-account-group', link:'/employees'},
                        {title: 'Działy', icon:'mdi-apps', link:'/departments'},
                        {title: 'Dni wolne od pracy', icon:'mdi-calendar', link:'/holidays'},)
                    }
                    if(role == 1){
                         tiles.push({title: 'Ustawienia', icon: 'mdi-cog', link:'/settings'})
                    }
                    return tiles
                        
                }
            },
            icon(){
                return this.mini? 'mdi-chevron-right':'mdi-chevron-left'
            },
        },
        methods:{
            async logout(){
                this.$store.commit('resetUser')
                await axios.get('/logout')
            },
            toggleMini(){
                this.mini = true
            },
            link(link){
                if(!this.mini){
                    return link
                }
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
        color: black !important;
    }
</style>
