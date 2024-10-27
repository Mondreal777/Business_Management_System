<template lang="pug">
body
    header
        img(src="../../../../../_shared/assets/logo.png" width="200" height="200")
        .title
            h1 Transaction Details
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
</template>

<script>
import loginMixins from "../../../../../../mixins/login";
import auditTrailMixins from "../../../../../../mixins/audit-trail";

export default {
    name: "ReportsSalesPrintComponent",
    components: {},
    directive: {},
    filters: {},
    mixins: [loginMixins, auditTrailMixins],
    props: {},
    data() {
        this.checkLogin();
        return {
            transactionNo: null,
            receiptNo: null,
            items: [],
            discount: null,
            surcharge: null,
            totalAmount: null,
            orderType: null,
        };
    },
    computed: {},
    watch: {},
    created() {
        this.receiptNo = this.$store.getters.getReceiptNo;
        this.items = this.$store.getters.getItems;
        this.discount = this.$store.getters.getDiscount;
        this.surcharge = this.$store.getters.getSurcharge;
        this.totalAmount = this.$store.getters.getTotalPrice;
        this.orderType = this.$store.getters.getOrderType;
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'Reports Sales', 'Print sales reports', null, null); 
        
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.title h1 {
    font-size: 35px;
    font-weight: bolder;
}

.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    width: 700px;
    margin: auto;
    font-size: 15px;
}

.content label.label {
    font-size: 20px;
}
</style>