<template lang="pug">
body
    header
        img(src="../../../../../_shared/assets/logo.png" width="200" height="200")
        .title
            h1 Inventory Details
    .content
        b-field(:label="`Item ID: ` + this.inventoryId")
        b-field(:label="`Item No: ` + this.itemNo")
        b-field(:label="`Item Name: ` + this.itemName")
        b-field(:label="`Quantity: ` + this.quantity")
        b-field(:label="`Threshold: ` + this.threshold")
        b-field(:label="`Date Created: ` + this.createdDate")
        b-field(:label="`Date Modified: ` + this.modifiedDate")
</template>

<script>
import loginMixins from "../../../../../../mixins/login";
import auditTrailMixins from "../../../../../../mixins/audit-trail";

export default {
    name: "ReportsSalesDownloadComponent",
    components: {},
    directive: {},
    filters: {},
    mixins: [loginMixins, auditTrailMixins],
    props: {},
    data() {
        this.checkLogin();
        return {
            //Inventory
            inventoryId: null,
            itemNo: null,
            itemName: null,
            quantity: null,
            threshold: null,
            createdDate: null,
            modifiedDate: null,
            
        };
    },
    computed: {},
    watch: {},
    created() {
        this.inventoryId = this.$store.getters.getInventoryId;
        this.itemNo = this.$store.getters.getProductId;
        this.itemName = this.$store.getters.getProductName;
        this.quantity = this.$store.getters.getStockQuantity;
        this.threshold = this.$store.getters.getStockThreshold;
        this.createdDate = this.$store.getters.getStockCreatedDate;
        this.modifiedDate = this.$store.getters.getStockModifiedDate;
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'Reports Inventory', 'Download inventory reports', null, null); 
      
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
    margin: 20px auto;
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
    width: 400px;
    margin: auto;
    font-size: 15px;
}

.content label.label {
    font-size: 20px;
}
</style>