<template>

</template>

<script>
    export default {
        mounted() {

        },
        created(){
            this.$store.dispatch('getUser')
        }
    }
</script>
