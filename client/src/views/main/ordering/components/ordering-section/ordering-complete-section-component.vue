<template lang="pug">
body
    .container
        header
            h1 Your order has been placed
        .image
            lottie-player(src='https://assets5.lottiefiles.com/packages/lf20_p8xtmag7.json' 
                background='transparent' 
                speed='1'
                loop='' 
                autoplay='')
        .details
            h2 Kindly wait for 15-20mins 
            h2 while the kitchen is preparing your food
        .buttons(v-show="this.transactionId")
            b-button(size="is-medium" type="is-info" icon-left="chevron-left" @click="orderAgain()") Order Again
            b-button(size="is-medium" type="is-info" icon-left="cash-100" @click="payment()") Proceed to Payment

</template>

<script>
export default {
    name: "OrderingCheckoutContainer",
    components: {},
    directive: {},
    filters: {},
    mixins: [],
    props: {},
    data() {
        return this.initData();
    },
    computed: {},
    watch: {},
    created() {
        this.tableId = this.$store.getters.getTableId;
        this.transactionId = this.$store.getters.getTransactionId;
    },
    methods: {
         initData() {
            return {
                tableId: null,
                transactionId: null
            };
        },
        orderAgain() {
            this.$router.push(`/order/${this.tableId}/menu`);            
            this.$store.commit('setTransactionId', this.transactionId);             
        },
        payment() {
            this.$router.push(`/order/${this.tableId}/payment`);
        },
    },
    // third party libraries
}
</script>

<style lang="scss" scoped>
body {
    display: flex;
    font-family: "Poppins";
    height: 100vh;
    overflow: auto;
}

.container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    margin: auto;
}

header {
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: capitalize;
}

.details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
}

.buttons {
    display: flex;
    flex-direction: column;
    margin: 20px;
}

h1 {
    font-size: 40px;
    font-weight: bold;
}

h2 {
    font-size: 20px;
    font-weight: bold;
    margin: 10px;
}

lottie-player {
    width: 300px; 
    height: 300px;
    margin: 30px;
}

@media only screen and (max-width: 685px) { 
    .container {
        transform: scale(0.9);
        transition: 0.3s;
    }

    header {
        text-align: center;
    }
}
</style>