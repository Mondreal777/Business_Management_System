<template lang="pug">
header
    .header-bg
        .header-container
            .logo
                img(src="../../../../../_shared/assets/logo.jpg")
            .table-info
                h1 Table {{ tableNo }}
                h1 Reference No: 0001
                h1 {{ orderType }}
</template>

<script>
export default {
    name: "OrderingHeaderComponent",
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
        this.tableNo = this.$store.getters.getTableNo;
        this.orderType = this.$store.getters.getOrderType;
    },
    methods: {
        initData() {
		return {
			discount: null,
			items: [],
			tableNo: null,
			orderType: null
		};
	}
    },
    // third party libraries
}
</script>

<style lang="scss" scoped>
header {
    height: 200px;
    background-image: url('../../../../../_shared/assets/cover_photo.jpg');
    background-size: cover;
    background-position: center;
    text-transform: capitalize;
}

.header-bg {
    height: 200px;
    transition: background-image 1s ease-in-out;
    background: linear-gradient(180deg,rgba(30,30,30,0) 0,rgba(30,30,30,.3) 30%,rgba(0,0,0,.6));
}

.header-container {
    display: flex;
    align-content: center;
    justify-content: center;
    height: 200px;
    transition: 0.3s;
}

.logo {
    align-content: center;
    height: 150px;
    width: 150px;
    margin: 20px;
}

.table-info {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    height: 150px;
    margin: 20px;
    background: transparent;
}

.table-info h1 {
    color: white;
	font-weight: 700;
	font-size: 25px;
    margin-bottom: 5px;
}

@media only screen and (max-width: 760px) { 

    .header-container {
        transform: scale(0.8);
        transition: 0.3s;
    }

    .logo {
        min-width: 150px;
    }

    .table-info {
        min-width: 240px;
    }
}

@media only screen and (max-width: 375px) { 

    .header-container {
        transform: scale(0.7);
        transition: 0.3s;
    }

}

@media only screen and (max-width: 280px) { 

    .header-container {
        transform: scale(0.6);
        transition: 0.3s;
    }

}
</style>