<template lang="pug">
body
    main
        section.order-details
            .details-container
                .header
                    b-button(v-show="!this.paymentMethodId" size="is-large" @click="back()" icon-left="chevron-left")
                    h1 Order details
                .cart.order-details
                    hr
                    .order-type
                        h2 Order Type: 
                        h2 {{ this.orderType }}
                    hr
                    h2 Items:
                    br
                    .items
                        .item(v-for="item in cartItems")
                            h3 {{ item.productName }}
                            p.quantity-text QTY {{ item.quantity }}
                            p.item-price Php {{ item.productPrice * item.quantity }}
                    hr
                    .subtotal
                        h2 Subtotal
                        p.subtotal-text Php {{ this.subTotal }}
                    hr(v-show="!this.paymentMethodId")
                    .discount(v-show="!this.paymentMethodId")
                        h2 Discount
                        .discount-button
                            b-button(rounded @click="addDiscount()") Add Discount
                    hr
                    .total-container
                        .discount-container(v-show="this.appliedDiscountValue")
                            p.has-text-weight-bold Discount Value
                            p Php {{ Math.ceil(this.appliedDiscountValue) }}
                        .surcharge-container(v-for="surcharge in surcharges")
                            p.has-text-weight-bold {{ surcharge.surcharges_name }}
                            p(v-if="surcharge.deduction_type === `Percentage`") Php {{ Math.ceil(Number(surcharge.deduction / 100) * subTotal) }}
                            p(v-else) Php {{ Number(surcharge.deduction) + subTotal }} 
                        .total
                            h2 Total
                            p Php {{ calcTotal }}
                    hr
            .special-instructions(v-show="!this.paymentMethodId")
                b-field(label='Special Instructions')
                b-input(maxlength='200' type='textarea' v-model="instructions")

    footer(v-show="!this.paymentMethodId")
        .proceed
            p By placing this order, you agree to all 
                a(href="") Terms & Conditions
            b-button(icon-left="check-circle" expanded @click="placeOrder()") PLACE ORDER
        .terms-conditions
            p I agree and I demand that you execute the ordered service before the end of the revocation period. I am aware that I lose my right of rescission when the service has started and has been completely fulfilled.    
    //Discount Modal                  
    b-modal(
        v-model="isAddDiscountModalActive",
        has-modal-card="",
        trap-focus="",
        :destroy-on-hide="false",
        aria-role="dialog",
        aria-label="Table",
        close-button-aria-label="Close",
        aria-modal=""
    )
        .modal-card(style="width: auto")
            header.modal-card-head
                p.modal-card-title Add Discount
            section.modal-card-body
                b-field(label="Select Discount Type:")
                    select.discount-select(v-model="discountId" size="is-small" @change="onChange($event)")
                        option(:value="null") None
                        option(v-for="discount in discountList" :value="discount.discount_id") {{ discount.discount_name }}
                b-field(label="ID Number:")
                    b-input(v-model="idNumber")   
                b-field(label="Upload Image")
                    input(@change="handleImage" id="upload-image" type="file" accept="image/*")
                    label(for="upload-image") 
                        b-icon(icon="upload")
                        | {{ this.fileName || "Click to upload" }}
                img(v-show="this.cardFileImage" :src="this.cardFileImage")
            footer.modal-card-foot.discount
                .buttons
                    b-button(
                        type="is-link",
                        label="Apply Discount",
                        :disabled="isDisabledApplyDiscountButton",
                        @click="applyDiscount()"
                    )
                    b-button(type="is-danger", label="Cancel", @click="cancelAddDiscount()")
</template>

<script>
import axios from 'axios';
import { DEDUCTION_TYPE, ORGANIZATION_ID } from "@/constants/enum/defaults.js"
import { STATUS } from '../../../../../constants/status/status';

export default {
    name: "OrderingCheckoutComponent",
    components: {},
    directive: {},
    filters: {},
    mixins: [],
    props: {},
    watch: {},
    async created() {
        this.tableId = this.$store.getters.getTableId;
        this.orderType = this.$store.getters.getOrderType;
        this.cartItems = this.$store.getters.getCartItems;
        this.subTotal = this.$store.getters.getCartSubTotal;
        this.tableDetails.tableId = this.$store.getters.getTableId;
        this.surchargeId = this.$store.getters.getSurchargeId;
        this.orderId = this.$store.getters.getTransactionId;
        this.paymentMethodId = this.$store.getters.getPaymentMethodId;
        if (!this.orderId) {
            this.receiptNumber = this.$store.getters.getTransactionId;
        } else {
            this.receiptNumber = this.$store.getters.getReceiptNumber;
        }
        console.log(this.orderId);
        
        try {
            const discountList = await this.getDiscountList();
            const tableData = await this.getTableData();
            const surchargeList = await this.getSurchargeDetails()

            this.discountList = discountList;
            this.tableDetails.tableName = tableData.table_name;          
            this.tableDetails.tableNo = tableData.table_no;
            this.tableDetails.capacity = tableData.capacity;
            this.surcharges = surchargeList;

            console.log(this.surcharges);

        } catch (err) {
            console.error(err);
        }

    },
    data() {
        return this.initData();
    },
    methods: {
        initData() {
            return {
                mobileView: true,
                orderId: null,
                // Discount
                idNumber: null,
                discountId: null,
                discountValue: 0,
                appliedDiscountValue: null,
                discountList: [],
                cardFile : null,
                cardFileImage: null,
                imageUrl: null,
                fileName: null,
                // Cart Items
                cartItems: [],
                // Total
                subTotal: null,
                totalPrice: 0,
                orderType: null,
                serviceCharge: null,
                surchargeId: null,
                surchargeType: null,
                tax: null,
                paymentMethod: null,
                instructions: null,

                //Surcharges
                surcharges: [],
                // Table Details
                tableId: null,
                tableDetails: {
                    tableId: null,
                    tableName: null,
                    tableNo: null,
                    capacity: 0,
                    occupancy: 'occupied',
                    status: STATUS.ACTIVE
                },
                bgColor: null,
                color: null,
                transition: null,
                //Modal
                isAddDiscountModalActive: null,

                receiptNumber: null,
                updatedSubTotal: null,
                updatedDiscountValue: null,
                updatedSurchargeValue: null,
                updatedTotalPrice: null,
                paymentMethodId: null,
                
            };
        },
        async getDiscountList() {
            try {
                const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/discount/list`);

                const { discountList } = res.data.results.data;
                return discountList;
            } catch (err) {
                console.log(err);
            }
        },
        async getTableData() {
            try {
                const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/table/${this.tableDetails.tableId}`);

                const { tableData } = res.data.results.data;
                return tableData[0];
            } catch (err) {
                console.log(err);
            }
        },
        async getSurchargeDetails() {
            try {
                const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/surcharges/list/ordering-system?ordering_system=${this.orderType}`)
                const { surchargeList } = res.data.results.data;
                return surchargeList;
            } catch (err) {
                console.log(err);
            }
        },
        cancelAddDiscount() {
            if (!this.cardFileImage || !this.imageUrl || !this.discountId || !this.idNumber) {
                this.discountValue = 0;
                this.appliedDiscountValue = 0;
                this.discountId = null;
                this.cardFileImage = null;
                this.imageUrl = null;
                this.idNumber = null;
                this.fileName = null;
                this.isAddDiscountModalActive = false;
            } else {
                this.isAddDiscountModalActive = false;
            }
            
        },
        handleImage(e) {
            const selectedImage = e.target.files[0]; // get first file
            this.fileName = selectedImage.name;
            this.createBase64Image(selectedImage);
        },
        createBase64Image(fileObject) {
            const reader = new FileReader();

            reader.onload = (e) => {
                this.cardFileImage = e.target.result;
                this.imageUrl = e.target.result;
            };
            reader.readAsDataURL(fileObject);
            console.log(fileObject);
        
        },
        async onChange(event) {
            const discountId = event.target.value;
            let discountValue = 0;
            try {
                if (discountId) {
                    const res = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/discount/${discountId}`);
                    const { discountData } = res.data.results.data;
                    if (discountData.deduction_type === DEDUCTION_TYPE.P) {
                        discountValue = Math.ceil((this.subTotal / 100) * discountData.deduction)
                    } else {
                        discountValue = discountData.deduction;
                    }
                }
                this.appliedDiscountValue = discountValue;                
            } catch (err) {
                console.log(err)
            }
        },
        applyDiscount() {
            this.discountValue = this.appliedDiscountValue;
            this.totalPrice = this.subTotal - this.appliedDiscountValue;
            this.isAddDiscountModalActive = false;
        },
        // cashOrderType() {
        //     this.paymentMethod = 1;
        //     this.bgColor = '#D6A062';
        //     this.color = 'white';
        //     this.transition = '0.3s';
        // },
        // cardOrderType() {
        //     this.paymentMethod = 2;
        // },
        async placeOrder() {
            try {
                const res = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order/save`,
                    {
                        orderDetails: {
                            orderId: this.orderId,
                            receipt_number: this.receiptNumber,
                            order_type: this.orderType,
                            items_price: this.subTotal,
                            discount: this.discountId,
                            discount_value: this.discountValue,
                            discount_id_number: this.idNumber,
                            discount_image_url: this.imageUrl,
                            service_charge: this.calcTotalSurcharge,
                            tax: this.tax,
                            total_price: this.calcTotal,
                            table_id: this.tableId,
                            organization_id: ORGANIZATION_ID,
                            special_instructions: this.instructions,
                            payment_method: this.paymentMethod,
                        }
                    }
                )

                const insertId = res.data.results.data.result;
                console.log(insertId);
                if (!this.orderId) {
                    this.$store.commit('setTransactionId', insertId);
                    this.$store.commit('setReceiptNumber', insertId);
                } else {
                    this.$store.commit('setTransactionId', insertId);
                }
                
                

                let orderItemIds = [];
                for (let item of this.cartItems) {
                    const orderItemDetails = {
                        transaction_id: insertId,
                        product_id: item.productId,
                        quantity: item.quantity,
                        unit_price: item.productPrice,
                        total_price: item.productPrice * item.quantity
                    }

                    const res = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order-item/save`,
                        {
                            orderItemDetails: orderItemDetails
                        }
                    )

                    const orderItemId = res.data.results.data.result;
                    if (orderItemId) orderItemIds.push(orderItemId)
                }

                const updateTable = await axios.post(
                        `${process.env.VUE_APP_API_BASE_URL}/table/save`,
                        {
                            tableDetails: this.tableDetails
                        }
                    );

                console.log(updateTable);

                

                // await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order/${insertId}`, {
                //     status: STATUS.IN_P
                // }).then(async () => {
                //     await axios.post(`${process.env.VUE_APP_API_BASE_URL}/order/${insertId}`, {
                //     status: STATUS.IN_P
                //     })
                // })

                if(orderItemIds.length !== 0) this.$router.push(`/order/${this.tableId}/complete`);

            } catch (err) {
                console.log(err)
            }

        },

        back() {
            this.$router.push(`/order/${this.tableId}/menu`);
        },
        // Add Discount Modal
        async addDiscount() {
            

            this.isAddDiscountModalActive = true;
        }
    },
    // onResize() {
    //     this.mobileView = window.innerWidth < 770;
    // },
    computed: {
        isDisabledApplyDiscountButton() {
            return !this.discountId || !this.idNumber || !this.fileName;    
        },
        calcTotal() {
            if (!this.appliedDiscountValue) {
                let total = 0;
                const subTotal = this.subTotal;
                this.surcharges.forEach(item => {
                    total = Math.ceil(subTotal + Number(item.deduction / 100) * subTotal);
                    this.totalPrice = total;
                });
                return total;
            } else {
                let total = 0;
                const subTotal = this.subTotal;
                this.surcharges.forEach(item => {
                    total = Math.ceil(Number(subTotal + Number(item.deduction / 100) * subTotal) - this.appliedDiscountValue);
                    this.totalPrice = total;
                });
                return total;
            }           
            
        },
        calcTotalSurcharge() {
            let serviceCharge = 0;
            const subTotal = this.subTotal;
            this.surcharges.forEach(item => {
                serviceCharge = Math.ceil(Number(item.deduction / 100) * subTotal);
            });
            return serviceCharge;
        },
    },

};
</script>

<style lang="scss" scoped>
body {
    font-family: 'Poppins';
    height: 100vh;
    overflow: auto;
    scroll-behavior: smooth;
}

main {
    display: flex;
    flex-direction: row;
    padding: 30px;
    overflow: auto;
}

footer {
    display: flex;
    flex-direction: column;
    padding: 0 30px 30px 30px;
    overflow: auto;
}

.discount-select {
    padding: 4px;
    border-radius: 4px;
    width: 100%;
}

.file-cta {
    background-color: #D6A062;
    color: whitesmoke;
    transition: 0.3s;
}

.file-cta:hover {
    background-color: #a87d4d;
    color: whitesmoke;
}

.discount-button {
    display: flex;
    justify-content: flex-end;
}

input[type="file"] {
    display: none;
}

label{
    display: flex;
    align-items: center;
    height: 20px;
    margin: 300px;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0 auto 0 auto;
    background-color: #007bff;
    color: white;
    padding: 20px;
    border-radius: 50px;
    cursor: pointer;
    
}

img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 200px;
    object-fit: contain;
    margin: 0 auto 0 auto;
}

.custom-input {
    display: flex;
    margin-right: auto;
    margin-left: auto;
    width: fit-content;
}


.button.is-rounded {
    background-color: #D6A062;
    color: white;
    transition: 0.3s;
}
.button.is-rounded:hover {
    background-color: #a87d4d;
}

section.order-details {
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    min-width: 500px;
    margin: 0 30px;
}

section.order-details .header {
    display: flex;
    align-items: center;
    margin-left: -20px;
}

section.order-details .header button {
    border: none;
    height: 30px;
    width: 20px;
}

section.payment-method {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: 600px;
    margin: 0 80px;
}

.cart.order-details {

    div,
    .total-container {
        width: 100%;
        display: inline-grid;
        row-gap: 1rem;

        p:last-child, h2:last-child {
            text-align: right;
        }
    }

    .item {
        grid-template-columns: 50% 20% 30%;
    }

    .order-type,
    .subtotal,
    .discount,
    .discount-container,
    .surcharge-container,
    .surcharges,
    .total {
        grid-template-columns: 60% 40%;
    }
}

.cash,
.card {
    display: flex;
    flex-direction: column;
    border: 1px #d1d1d1 solid;
    border-radius: 20px;
    margin-bottom: 20px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    transition: 0.3s;
    cursor: pointer;
}

//Card Disabled
.card {
    pointer-events:none;
    opacity: 0.5;
}

.cash:hover,
.card:hover {
    background-color: #D6A062;
    color: white;
    transition: 0.3s;
}

.cash:focus,
.card:focus {
    background-color: #D6A062;
    color: white;
    transition: 0.3s;
}

.cash .header,
.card .header {
    display: flex;
    flex-direction: row;
    margin: 20px;
    align-items: center;
}

.cash .header h1,
.card .header h1 {
    margin: 0 10px;
}

.cash .details,
.card .details {
    margin: 0 20px 20px 20px;
    font-size: 10px;

}

h1 {
    font-size: 20px;
    font-weight: bold;
}

h2 {
    font-size: 18px;
    font-weight: bold;
}

h3 {
    font-size: 13px;
    font-weight: bold;
}

footer .proceed {
    margin: 0 30px;
    max-width: 390px;
}

footer .terms-conditions {
    margin: 0 30px;
    max-width: 700px;
}

footer .proceed a {
    color: #D6A062;
    font-size: 15px;
    transition: 0.3s;
}

footer .proceed a:hover {
    color: #a87d4d;
    font-size: 15px;
    text-decoration: none;
    transition: 0.3s;
}

footer .proceed button {
    background-color: #D6A062;
    color: white;
    border-radius: 50px;
    margin: 20px 0;
    transition: 0.3s;
}

footer .proceed button:hover {
    background-color: #a87d4d;
    transition: 0.3s;
}

// Modal 
header.modal-card-head p.modal-card-title {
    display: flex;
    justify-content: center;
    font-weight: 800;
    font-size: 30px;
    align-content: center;
}

section.modal-card-body.discount label.label{
    font-weight: 400;
}

.file {
    align-items: stretch;
    display: flex;
    justify-content: center;
    position: relative;
}

footer.modal-card-foot .buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 350px;
}

footer {
    padding: 20px;
}

button {
    width: 150px;
    margin: 5px;
}

section.modal-card-body.discount {
    box-sizing: border-box;
    clear: both;
    font-size: 1rem;
    position: relative;
    text-align: center;
    overflow: hidden;
}

@media only screen and (max-width: 770px) {

    main,
    footer {
        display: flex;
        flex-direction: column;
        padding: unset;
        margin: 20px 0;
    }

    section.order-details {
        min-width: unset;
    }

    section.payment-method {
        margin: 0 30px;
    }

    footer {
        padding: 0 0 100px 0;
    }
}
</style>