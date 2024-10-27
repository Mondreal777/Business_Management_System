<template lang="pug">
body
    .table-container
        header
            img(src="../../../../_shared/assets/logo.png" width="200" height="200")
            .title
                h1 Table {{ this.tableNo }}
                h1 {{ this.tableName }}
        .content
            .qrCode
                img(:src='qrCode' width="350" height="350")
</template>

<script>
import axios from 'axios';
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
name: "ReportsSalesPrintComponent",
components: {},
directive: {},
filters: {},
props: {},
mixins: [loginMixins, auditTrailMixins],
data() {
    this.checkLogin();
    return {
        //Table
        tableId: null,
        tableNo: null,
        tableName: null,
        qrCode: null,
    };
},
computed: {},
watch: {},
created() {
    try {
        this.tableId = this.$store.getters.getTableId;
        console.log("this.tableDetails.tableId ::> ", this.tableId);
        this.setTableData();
    } catch (err) {
        console.error(err);
    }

    
},
methods: {
    async getTableData() {
        try {
        const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/table/${this.tableId}`);

        const { tableData } = res.data.results.data;
        var loginDetails = this.$store.getters.getLoginDetails
        this.saveAuditTrail(loginDetails["loginUserId"], 'Tables', 'Print tables', null, null);
        return tableData[0];
        } catch (err) {
        console.log(err);
        }
    },
    async setTableData() {
      const tableData = await this.getTableData();
      this.tableNo = tableData.table_no;
      this.tableName = tableData.table_name;
      this.qrCode = tableData.qr_code;
      setTimeout(this.printFunction, 1000)
    },
    printFunction() {
        window.print();
    }

},
// third party libraries
};
</script>

<style lang="scss" scoped>
body {
    display: flex;
    flex-direction: column;
    font-family: "Poppins";
    overflow: auto;
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

header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px auto;
}

.table-container {
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
    padding: 0 20px 20px 20px;
    overflow: auto;
}

.title h1 {
    font-size: 35px;
    font-weight: bolder;
    text-align: center;
}

.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    font-size: 15px;
}

.content label.label {
    font-size: 20px;
}
</style>