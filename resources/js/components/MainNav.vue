<template>
    <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent app light width="300px" src="../images/background.jpg" v-if="user">
        <v-list-item class="blue-grey darken-1" dark>
            <v-list-item-icon v-if="!mini"><v-icon>mdi-account</v-icon></v-list-item-icon>
            <v-list-item-content v-if="!mini">
                <v-list-item-title>{{user.name}}</v-list-item-title>
                <v-list-item-subtitle><a href="/" @click="logout">Logout</a></v-list-item-subtitle>
            </v-list-item-content>
            <v-btn icon @click.stop="mini = !mini">
                <v-icon>{{icon}}</v-icon>
            </v-btn>
        </v-list-item>
        <v-list-item v-for="el of list" :key="el.title" @click="mini = true" :to="link(el.link)" link>
            <v-list-item-icon><v-icon>{{el.icon}}</v-icon></v-list-item-icon>
            <v-list-item-title :to="el.link" link>{{el.title}}</v-list-item-title>
        </v-list-item>
    </v-navigation-drawer>
</template>

<script>
    export default {
        data(){
            return {
                drawer:true,
                mini:true,
                user:null
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
