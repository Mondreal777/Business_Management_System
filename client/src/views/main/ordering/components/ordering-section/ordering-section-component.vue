<template lang="pug">
body
    .order-container
        h1 Table {{ tableNo }}
        .buttons
            b-button.dine-in(@click="navigateToMenuDineIn('Dine In')")
                h2 Dine In
                img(src="../../../../_shared/assets/dinner.png")
            b-button.take-out(@click="navigateToMenuTakeOut('Take Out')")
                h2 Takeout
                img(src="../../../../_shared/assets/take-away.png")



</template>

<script>
import axios from 'axios';

export default {
    name: "OrderingComponent",
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
	methods: {
		initData() {
			return {
                tableId: null,
				tableNo: null,
			}
		},
		navigateToMenuDineIn(orderType) {
			this.$store.commit('setTableId', this.tableId);
            this.$store.commit('setTableNo', this.tableNo);
			this.$store.commit('setOrderType', orderType);
            this.$store.commit('setSurchargeId', 1);
			this.$router.push(`/order/${this.tableId}/menu?${orderType}`);
		},
        navigateToMenuTakeOut(orderType) {
			this.$store.commit('setTableId', this.tableId);
            this.$store.commit('setTableNo', this.tableNo);
			this.$store.commit('setOrderType', orderType);
            this.$store.commit('setSurchargeId', 2);
			this.$router.push(`/order/${this.tableId}/menu?${orderType}`);
		},
        async getTableDetails(tableNo) {
            try {
                const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/table/table-no/${tableNo}`);
                console.log(res.data.results.data);
                const { tableData } = res.data.results.data;
                return tableData[0];
            } catch (err) {
                console.log(err)
            }
        },
        async getSurchargeDetails() {
            try {
                const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/surcharges/list`)
                const { surchargesList } = res.data.results.data;
                return surchargesList;
            } catch (err) {
                console.log(err);
            }
        }
	},
    async created() {
		const pathArray = window.location.pathname.split('/');
		const tableNo = pathArray[2]
		console.log(tableNo)
        const tableData = await this.getTableDetails(tableNo);
        this.tableId = tableData.id;
		this.tableNo = tableData.table_no;
        console.log(this.tableId)
		this.$store.commit('clearCart');
        this.$store.commit('setTransactionId', null);
        this.$store.commit('setPaymentMethodId', null);
    }
    // third party libraries
}
</script>

<style lang="scss" scoped>
body {
   font-family: "Poppins";
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-content: center;
   height: 100vh;
   background-image: url('../../../../_shared/assets/background.jpg');
   background-repeat: no-repeat;
   background-size: cover;
   background-position: center;
   overflow: auto;
   text-transform: capitalize;
}

.order-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;
    border: 5px solid #946D42;
    border-radius: 50px;
    background-color: rgba(255, 255, 255, 0.900);
    margin: auto;
    overflow: auto;
}

h1 {
    font-family: "Fira Sans";
    font-size: 48px;
    font-style: bold;
    padding: 50px 0 0 0;
    
}
.buttons {
   display: flex;
   flex-direction: row;
   justify-content: center;
   margin: 50px;
}

button.dine-in{
    font-family: "Poppins";
    font-weight: bold;
    border: none;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #C3925A;
    font-size: 30px;
    color: white;
    border-radius: 50px;
    height: 250px;
    width: 250px;
    cursor: pointer;
    transition: 0.3s;
}

button.dine-in h2{
    font-weight: bold;
}

button.dine-in img:hover{
    transform: scale(1.1);
    transition: 0.3s;
}

button.take-out{
    display: flex;
    justify-content: center;
    align-content: flex-start;
    font-family: "Poppins";
    font-weight: bold;
    border: none;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #C3925A;
    font-size: 30px;
    color: white;
    border-radius: 50px;
    height: 250px;
    width: 250px;
    cursor: pointer;
    transition: 0.3s;
}

button.take-out h2{
    font-weight: bold;
}


button.take-out img:hover{
    transform: scale(1.1);
    transition: 0.3s;
}

@media only screen and (max-width: 685px) { 

    button {
        transform: scale(0.8);
        transition: 0.3s;
    }

    .buttons {
        margin: unset;
        height: unset;
    }

    .order-container {
        margin: auto 30px;
        height: unset;
    }

}
</style>