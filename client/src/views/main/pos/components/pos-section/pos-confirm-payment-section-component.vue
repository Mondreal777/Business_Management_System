<template lang="pug">
body
    header
        //- .title
        //-     h1 h1 POS-itive
        img(src="../../../../_shared/assets/logo.png" width="200" height="200")
    .content
        b-field(:label="`Receipt #: ` + this.receiptNo")
        b-field(:label="`Order Type: ` + this.orderType")
        b-field(label="Items:")
        b-table(
            :data="this.items" 
            :range-before="1",
            :range-after="1"
            )
            b-table-column(field="id" label="ID" width="40" v-slot="props" numeric centered)
                | {{ props.row.product_id }}
            b-table-column(field="description" label="Description" v-slot="props" centered)
                | {{ props.row.product_name }}
            b-table-column(field="quantity" label="QTY" v-slot="props" centered)
                | {{ props.row.quantity }}
            b-table-column(field="price" label="Price" v-slot="props" centered)
                | {{ props.row.unit_price }}
        b-field(:label="`Discount: ` + this.discount")
        b-field(:label="`Surcharge: ` + this.surcharge")
        b-field(:label="`Total Price: Php ` + this.totalAmount")
        .transaction
            b-field(:label="`Cash Tendered: Php ` + this.cashTendered")
            b-field(:label="`Change: Php ` + this.change")
</template>

<script>
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
    name: "POSBillOutComponent",
    components: {},
    directive: {},
    filters: {},
    mixins: [loginMixins, auditTrailMixins],
    props: {},
    data() {
        return {
            receiptNo: null,
            items: [],
            discount: null,
            surcharge: null,
            totalAmount: null,
            cashTendered: null,
            change: null,
            orderType: null,
        };
    },
    computed: {},
    watch: {},
    created() {
        this.checkLogin();
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'POS', 'Confirm payment', null, null);
        this.receiptNo = this.$store.getters.getReceiptNo;
        this.orderType = this.$store.getters.getOrderType;
        this.items = this.$store.getters.getItems;
        this.discount = this.$store.getters.getDiscount;
        this.surcharge = this.$store.getters.getSurcharge;
        this.totalAmount = this.$store.getters.getTotalPrice;
        this.cashTendered = this.$store.getters.getCashTendered;
        this.change = this.$store.getters.getChange;

        window.print();
    },
    methods: {},
    // third party libraries
};
</script>

<style lang="scss" scoped>
body {
    font-family: "Poppins";
    overflow: auto;
}

header {
    display: flex;
    justify-content: center;
}

.title h1 {
    font-size: 35px;
    font-weight: bolder;
}

.content {
    display: flex;
    flex-direction: column;
    width: 700px;
    margin: auto;
    font-size: 15px;
}

.content label.label {
    font-size: 20px;
}

.transaction {
    text-align: right;
}
</style>