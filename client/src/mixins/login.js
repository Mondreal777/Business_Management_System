export default {
    methods: {
        checkLogin(){
            if(!this.$store.getters.getLoginDetails)
            {
                this.$router.push('/');
            }
        }
    }
}