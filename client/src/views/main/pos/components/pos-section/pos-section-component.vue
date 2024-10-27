<template lang="pug">
body
    .container 
        .navbar
            b-button(
                size="is-medium",
                icon-left="chevron-left",
                @click="navigateBack"
            ) Dashboard
        .tables-container
            h1 Select Table
            .table-numbers
                b-button(
                    v-for="table in tables",
                    v-bind:data="table",
                    v-bind:key="table.id",
                    :type="table.occupancy",
                    size="is-medium",
                    :v-model="table.table_name",
                    v-on:click="seeTableDetails(table.id)"
                ) 
                    p(style="font-size: 15px") {{ table.table_name }}
                    p(style="font-size: 35px; font-weight: 600") {{ table.table_no }}

    //Table Details Modal
    b-modal(
        v-model="isTableModalActive",
        has-modal-card="",
        trap-focus="",
        :destroy-on-hide="false",
        aria-role="dialog",
        aria-label="Table",
        close-button-aria-label="Close",
        aria-modal=""
    )
        .modal-card(:width="300")
            header.modal-card-head
                p.modal-card-title {{ this.tableDetails.tableName }} {{ this.tableDetails.tableNo }}
                button.delete(type="button", @click="isTableModalActive = false")
            section.modal-card-body.details
                b-field(:label="`Receipt #: ` + this.receiptNo")
                b-field(:label="`Order Type: ` + this.orderType")
                b-field(label="Items:")
                .table
                    b-table(:data="this.items", :range-before="1", :range-after="1")
                        b-table-column(
                            field="id",
                            label="ID",
                            width="40",
                            v-slot="props",
                            numeric,
                            centered
                        )
                            | {{ props.row.product_id }}
                        b-table-column(
                            field="product_name",
                            label="Description",
                            v-slot="props",
                            centered
                        )
                            | {{ props.row.product_name }}
                        b-table-column(
                            v-if="this.role === 'Admin'",
                            field="quantity",
                            label="QTY",
                            v-slot="props",
                            centered
                            width="15"
                        )
                            input(v-model="props.row.quantity" type="number" @change="editItem($event)")
                        b-table-column(
                            v-else,
                            field="quantity",
                            label="QTY",
                            v-slot="props",
                            centered
                        )
                            | {{ props.row.quantity }}

                        b-table-column(
                            field="unit_price",
                            label="Price",
                            v-slot="props",
                            centered
                        )
                            | {{ props.row.unit_price }}
                        b-table-column(
                            v-show="this.role === 'Admin'", 
                            field="action",
                            label="Action",
                            width="5",
                            v-slot="props",
                            centered
                        )
                            .actionButtons
                                .saveButton
                                    b-button(v-show="changedQuantity" size="is-small" type="is-success" icon-right="check" @click="saveItem(props.row)")
                                .deleteButton
                                    b-button(size="is-small" type="is-danger" icon-right="delete-outline" @click="voidItem(props.row.product_id)")
                        
                b-field(:label="`Discount: ` + this.appliedDiscountValue")
                b-field(:label="`Surcharge: ` + this.appliedSurchargeValue")
                b-field(v-show="this.tipValue" :label="`Tip: ` + this.tipValue")
                section.modal-card-body.total-price
                    b-field(:label="`Total Price: Php ` + this.totalPrice")
            footer.modal-card-foot
                .buttons(v-show="this.role === 'Kitchen Staff' && this.tableStatus != `completed`")
                    b-button(
                            label="Order Complete",
                            type="is-link",
                            @click="completeOrder()",
                            :disabled="isOrderCompleteBtnDisabled"
                        )                    
                .buttons(v-show="this.role !== 'Kitchen Staff'")                    
                    b-button(
                        label="Discount",
                        type="is-link",
                        @click="addDiscount()",
                        :disabled="isDiscountBtnDisabled"
                    )
                    b-button(
                        label="Bill Out",
                        type="is-link",
                        @click="billOut()",
                        :disabled="isBillOutBtnDisabled"
                    )
                    b-button(
                        label="Surcharge",
                        type="is-link",
                        @click="addSurcharge()",
                        :disabled="isSurchargeBtnDisabled"
                    )
                    b-button(
                        label="Pay Now",
                        type="is-link",
                        @click="payNow()",
                        :disabled="isPayNowBtnDisabled"
                    )
                    b-button(
                        label="Serve Order",
                        type="is-link",
                        @click="serveOrder()",
                        :disabled="isServeOrderBtnDisabled"
                    )

    //Add Discount Modal                  
    b-modal(
        v-model="isDiscountModalActive",
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
                p.modal-card-title Discount
            section.modal-card-body.details(v-show="this.discountIdNumber")
                b-field(:label="`Discount Type: ` + this.discountName")
                b-field(:label="`ID Number: ` + this.discountIdNumber")
                b-field(:label="`Discount Value: ` + this.discountValue")
                b-field(label="ID Details:")
                    b-image(:src="discountImageUrl"
                    ratio="2by1")
                b-button.is-info(size="is-small" label="View Image" @click="isDiscountImageModalActive = true")
            section.modal-card-body.details(v-show="!this.discountIdNumber")
                b-field(label="Discount Type:")
                    b-select(
                        v-model="selectedDiscountType",
                        placeholder="Select Discount Type",
                        @input="selectDiscountTypes()"
                    )
                        option(disabled) Select Discount Type
                        option(
                            v-for="discount in discountList",
                            :value="discount.discount_id"
                        ) {{ discount.discount_name }}
                        option(value="others") Others
                b-field(label="Type:")
                    b-radio(
                        v-model="discountType",
                        name="type",
                        native-value="%",
                        :disabled="isDisabledDiscountFields",
                        :checked="false"
                    )
                        | %
                    b-radio(
                        v-model="discountType",
                        name="type",
                        native-value="Php",
                        :disabled="isDisabledDiscountFields",
                        :checked="false"
                    )
                        | Php
                b-field(label="Amount:")
                b-input(
                    v-model="discountAmount",
                    type="number",
                    :min="1",
                    :max="20",
                    :editable="false",
                    :disabled="isDisabledAmountInput"
                )
                br
                section.modal-card-body.discount
                    b-field.amount(
                        v-show="selectedDiscountType === null",
                        :label="`Total Amount: Php ` + this.totalPrice"
                    )
                    b-field.amount(
                        v-show="discountType === null && isDisabledDiscountFields === false",
                        :label="`Total Amount: Php ` + this.totalAmount"
                    )
                    b-field.amount(
                        v-show="selectedDiscountType !== `others` && selectedDiscountType !== null ",
                        :label="`Total Amount: Php ` + this.totalAmount"
                    )
                    b-field.amount(
                        v-show="discountType === '%' && isDisabledAmountInput === false",
                        :label="`Total Amount: Php ` + calcPercentageDiscount"
                    )
                    b-field.amount(
                        v-show="discountType === 'Php' && isDisabledAmountInput === false",
                        :label="`Total Amount: Php ` + calcFixedDiscount"
                    )
                b-field(label="Remarks:")
                b-input(
                    v-model="discountRemarks",
                    type="textarea",
                    maxlength="30",
                    :disabled="isDisabledDiscountFields"
                )

            footer.modal-card-foot.discounts
                b-button(
                    v-show="!this.discountIdNumber"
                    type="is-link",
                    label="Apply Discount",
                    :disabled="isDisabledAddDiscountButton",
                    @click="applyDiscount()"
                )
                b-button(
                    v-show="this.discountIdNumber"
                    type="is-link",
                    label="Apply Discount",
                    @click="applyRequestedDiscount()"
                )
                b-button(type="is-danger", label="Cancel", @click="cancelDiscount()")

    b-modal(v-model='isDiscountImageModalActive')
        p.image.is-4by3
            img(:src='discountImageUrl')


    //Add Surcharge Modal                  
    b-modal(
        v-model="isSurchargeModalActive",
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
                p.modal-card-title Add Surcharge
            section.modal-card-body.surcharge
                b-field(label="Surcharge Type:")
                    b-select(
                        v-model="selectedSurchargeType",
                        placeholder="Select Surcharge Type"
                        @input="selectSurchargeTypes()"
                    )
                        option(value="", disabled) Select Surcharge Type
                        option(
                            v-for="surcharge in surcharges",
                            :value="surcharge.surcharges_id"
                        ) {{ surcharge.surcharges_name }}
            section.modal-card-body.discount
                b-field.amount(
                    v-show="!selectedSurchargeType",
                    :label="`Total Amount: Php ` + this.totalPrice"
                )
                b-field.amount(
                    v-show="selectedSurchargeType",
                    :label="`Total Amount: Php ` + this.calcSurcharge"
                )
            footer.modal-card-foot.discount
                b-button(
                    type="is-link",
                    label="Add Surcharge",
                    :disabled="isDisabledAddSurchargeButton",
                    @click="applySurcharge()"
                )
                b-button(type="is-danger", label="Cancel", @click="cancelSurcharge()")

    //Pay Now Modal                  
    b-modal(
        v-model="isPayNowModalActive",
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
                p.modal-card-title Pay Now
            section.modal-card-body
                b-field(label='Select Payment Method')
                    b-select(v-model="selectedPaymentMethod" placeholder='Select a character' expanded='')
                        option(value="", disabled) Select Surcharge Type
                        option(v-for="paymentMethod in paymentMethods",
                            :value="paymentMethod.payment_method_id") {{ paymentMethod.payment_method }}
            //Cash
            section.modal-card-body(v-show="selectedPaymentMethod === 1")
                b-field.amount(:label="`Total Price: Php ` + this.totalAmount")
                b-field(label="Cash Tendered:")
                    b-input(v-model="cashTendered", type="number")
                b-field.amount(
                    v-show="this.cashTendered < this.totalAmount",
                    label="Change: Php "
                )
                b-field.amount(
                    v-show="this.cashTendered >= this.totalAmount",
                    :label="`Change: Php ` + calcChange"
                )
            //Card
            section.modal-card-body(v-show="selectedPaymentMethod === 2")
                b-field.amount(:label="`Total Price: Php ` + this.totalAmount")
                b-field(label="Card Number:")
                    b-input(v-model="paymentCardNumber", type="number")
                b-field(label="Amount Received:")
                    b-input(v-model="amountReceived", type="number")
                b-field.amount(
                    v-show="this.amountReceived < this.totalAmount",
                    label="Change: Php "
                )
                b-field.amount(
                    v-show="this.amountReceived >= this.totalAmount",
                    :label="`Change: Php ` + calcCardChange"
                )
            //Split
            section.modal-card-body(v-show="selectedPaymentMethod === 3")
                b-field.amount(:label="`Total Price: Php ` + this.totalAmount")
                b-field(label="Cash Amount:")
                    b-input(v-model="cashTendered", type="number")
                b-field(label="Card Number:")
                    b-input(v-model="paymentCardNumber", type="number")
                b-field(label="Card Amount:")
                    b-input(v-model="amountReceived", type="number")
                b-field.amount(
                    v-show="calcTotalAmountTendered < this.totalAmount",
                    label="Change: Php "
                )
                b-field.amount(
                    v-show="calcTotalAmountTendered >= this.totalAmount",
                    :label="`Change: Php ` + calcSplitChange"
                )
            //Credit
            section.modal-card-body(v-show="selectedPaymentMethod === 4")
                b-field.amount(:label="`Total Price: Php ` + this.totalAmount")
                b-field(label="Customer Name:")
                    b-input(v-model="customerName")
                b-field(label="Customer Contact Number:")
                    b-input(v-model="customerContactNumber", type="number")

            footer.modal-card-foot.discounts
                b-button(
                    v-show="this.selectedPaymentMethod === 1"
                    type="is-link",
                    label="Confirm Payment",
                    :disabled="isDisabledCashPaymentConfirmButton",
                    @click="confirmPayment()"
                )
                b-button(
                    v-show="this.selectedPaymentMethod === 2"
                    type="is-link",
                    label="Confirm Payment",
                    :disabled="isDisabledCardPaymentConfirmButton",
                    @click="confirmPayment()"
                )
                b-button(
                    v-show="this.selectedPaymentMethod === 3"
                    type="is-link",
                    label="Confirm Payment",
                    :disabled="isDisabledSplitPaymentConfirmButton",
                    @click="confirmPayment()"
                )
                b-button(
                    v-show="this.selectedPaymentMethod === 4"
                    type="is-link",
                    label="Confirm Payment",
                    :disabled="isDisabledCreditPaymentConfirmButton",
                    @click="confirmPayment()"
                )
                b-button(type="is-danger", label="Cancel", @click="cancelPayment()")
</template>

<script>
import axios from "axios";
import { DEDUCTION_TYPE } from "@/constants/enum/defaults.js";
import { STATUS } from "../../../../../constants/status/status";
import loginMixins from "../../../../../mixins/login";
import auditTrailMixins from "../../../../../mixins/audit-trail";

export default {
    name: "POSSection",
    components: {},
    directive: {},
    filters: {},
    mixins: [loginMixins, auditTrailMixins],
    props: {},
    data() {
        return this.initData();
    },
    computed: {},
    watch: {},
    async created() {
        try {
            const tableList = await this.getTableList();

            this.tables = tableList;

            console.log(this.$store.getters.getRole)
            this.role = this.$store.getters.getRole;
        } catch (e) {
            console.error(e);
        }
    },
    methods: {
        initData() {
            this.checkLogin();
            return {
                //Table Details
                tables: [],
                tableID: null,
                tableName: null,
                receiptNo: null,
                orderType: null,
                items: [],
                discount: null,
                surcharge: null,
                totalAmount: 0,
                totalPrice: 0,
                subTotal: null,
                status: null,
                computedTotalAmount: null,
                role: '',
                tableDetails: {
                    tableId: null,
                    tableNo: null,
                    tableName: null,
                    capacity: 0,
                    occupancy: "vacant",
                    status: STATUS.ACTIVE
                },
                tableCompleteOrder: {
                    tableId: null,
                    tableNo: null,
                    tableName: null,
                    capacity: 0,
                    occupancy: "completed",
                    status: STATUS.ACTIVE
                },

                tableOrderServed: {
                    tableId: null,
                    tableNo: null,
                    tableName: null,
                    capacity: 0,
                    occupancy: "served",
                    status: STATUS.ACTIVE
                },

                //Discount Details
                discountList: [],
                discountId: null,
                discountName: null,
                discountValue: null,
                discountIdNumber: null,
                discountImageUrl: null,
                discountDeductionAmount: null,
                appliedDiscountValue: null, 

                //Modals
                isTableModalActive: null,
                isSurchargeModalActive: null,
                isDiscountModalActive: null,
                isPayNowModalActive: null,
                isDiscountImageModalActive: null,

                //Modal Buttons
                isDiscountBtnDisabled: null,
                isBillOutBtnDisabled: null,
                isSurchargeBtnDisabled: null,
                isPayNowBtnDisabled: null,
                isOrderCompleteBtnDisabled: null,
                isEditSaveDisabled: null,

                //Discount Modal Fields
                idDiscountNumber: null,
                idDiscountImage: null,
                selectedDiscountType: null,
                discountType: null,
                discountAmount: null,
                discountRemarks: null,
                computedDiscount: 0,

                //Surcharge Details
                surcharges: [],
                surchargeName: null,
                surchargeAdditionAmount: null,
                surchargeTypeID: null,
                surchargeType: null,
                calcSurcharge: 0,
                appliedSurchargeValue: null,

                //Surcharge Modal Fields
                selectedSurchargeType: null,
                computedSurcharge: null,

                //Pay Now Modal Fields
                //Payment Method List
                paymentMethods: [],
                selectedPaymentMethod: null,
                
                //Cash
                cashTendered: null,
                change: null,
                transactionId: null,
                //Card
                paymentCardNumber: null,
                amountReceived: null,
                //Split
                totalTenderedAmount: null,
                //Credit
                customerName: null,
                customerContactNumber: null,

                orderDetails: {
                    transactionId: null,
                    status: STATUS.DONE,
                },
                voidOrderDetails: {
                    transactionId: null,
                    transactionItemId: null,
                    status: STATUS.DELETED,
                },

                tableStatus: null,
                changedQuantity: null,
                tipValue: null,
            };
        },
        async saveItem(transactionItem) {
            console.log(transactionItem)
            if (transactionItem.quantity == 0) {   
                alert("0 quantity is not allowed else you delete the item.")
                transactionItem.quantity = 1
            } else {
                axios.post(
                `${process.env.VUE_APP_API_BASE_URL}/order-item/save`,
                {
                    orderItemDetails: transactionItem
                }
                ).then(res => {
                    this.changedQuantity = false;
                    this.isTableModalActive = false;
                    this.$toast.open({
                        message: 'Quantity successfully updated!',
                        type: 'success',
                        duration: 3000
                        // all of other options may go here
                    });
                    console.log(res)
                }).catch(err => {
                    this.$toast.open({
                        message: `Something went wrong! ${err}`,
                        type: 'error',
                        duration: 5000
                    });
                    console.log(err)
                });
                const tableList = await this.getTableList();
                this.tables = tableList;
            }
        },
        async serveOrder() {
            try {
                await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/table/save`,
                    {
                        tableDetails: this.tableOrderServed
                    }
                );
                this.isTableModalActive = false;

                this.$toast.open({
                    message: "Order served!",
                    type: "success",
                    duration: 5000,
                    // all of other options may go here
                });
                const tableList = await this.getTableList();
                this.tables = tableList;
            } catch (error) {
                
            }
        },
        async completeOrder() {
            try {
                for(let item of this.items) {
                    await axios.post(
                        `${process.env.VUE_APP_API_BASE_URL}/update-stocks-quantity`,
                        {
                            productId: item.product_id,
                            reduceQuantity: item.quantity
                        }
                    ).then(res => {
                        console.log(res);
                    });
                }
                await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/table/save`,
                    {
                        tableDetails: this.tableCompleteOrder
                    }
                );
                this.isTableModalActive = false;

                this.$toast.open({
                    message: "Order ready to serve!",
                    type: "success",
                    duration: 5000,
                    // all of other options may go here
                });
                const tableList = await this.getTableList();
                this.tables = tableList;

            } catch (error) {
                console.log(error);
            }
            
        },
        editItem(event){
            const itemQuantity = event.target.value;
            this.changedQuantity = itemQuantity;
        },
        async voidItem(productId) {
            try {
                await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/order-item/status`,
                    {
                        transactionId: this.transactionId,
                        productId: productId,
                        status: STATUS.DELETED,
                    }
                );
                this.isTableModalActive = false;
                this.$toast.open({
                    message: "Item deleted!",
                    type: "success",
                    duration: 5000,
                    // all of other options may go here
                });
                
            } catch (error) {
                console.log(error);
            }
            
        },
        async getTableList() {
            try {
                const res = await axios.get(
                    `${process.env.VUE_APP_API_BASE_URL}/table/list`
                );

                const { tableList } = res.data.results.data;
                return tableList;
            } catch (err) {
                throw err;
            }
        },
        async getTableData() {
            try {
                const res = await axios.get(
                    `${process.env.VUE_APP_API_BASE_URL}/table/${this.tableDetails.tableId}`
                );

                const { tableData } = res.data.results.data;
                return tableData[0];
            } catch (err) {
                console.log(err);
            }
        },
        navigateBack() {
            this.$router.push("/dashboard");
            this.$store.commit("setMenuId", 1);
        },
        //Select Table
        async seeTableDetails(id) {
            this.isDiscountBtnDisabled = true;
            this.isBillOutBtnDisabled = true;
            this.isSurchargeBtnDisabled = true;
            this.isPayNowBtnDisabled = true;
            this.isOrderCompleteBtnDisabled = true;

            try {
                const orderInput = await axios.get(
                    `${process.env.VUE_APP_API_BASE_URL}/order-item/` + id
                );
                const tableInput = await axios.get(
                    `${process.env.VUE_APP_API_BASE_URL}/table/` + id
                );

                const tableData = tableInput.data.results.data;
                const table = tableData.tableData;

                if (!orderInput.data.results.data) {
                    this.tableID = table[0].id;
                    this.tableDetails.tableName = table[0].table_name;
                    this.tableDetails.tableNo = table[0].table_no;
                    this.tableOccupancy = table[0].occupancy;
                    this.receiptNo = 0;
                    this.orderType = null;
                    this.items = [];
                    this.discountValue = 0;
                    this.surcharge = 0;                    
                    this.tipValue = transaction[0].tip;
                    console.log("false");
                } else {
                    const orderInput = await axios.get(
                        `${process.env.VUE_APP_API_BASE_URL}/order-item/` + id
                    );

                    const transactionData = orderInput.data.results.data;
                    const transaction = transactionData.orderItemsData;

                    this.tableID = table[0].id;
                    this.tableStatus = table[0].occupancy;
                    this.tableDetails.tableId = table[0].id;
                    this.tableDetails.tableNo = table[0].table_no;
                    this.tableDetails.tableName = table[0].table_name;                    
                    this.tableDetails.capacity = table[0].capacity;

                    this.tableCompleteOrder.tableId = table[0].id;
                    this.tableCompleteOrder.tableNo = table[0].table_no;
                    this.tableCompleteOrder.tableName = table[0].table_name;                    
                    this.tableCompleteOrder.capacity = table[0].capacity;
                    
                    this.tableOrderServed.tableId = table[0].id;
                    this.tableOrderServed.tableNo = table[0].table_no;
                    this.tableOrderServed.tableName = table[0].table_name;                    
                    this.tableOrderServed.capacity = table[0].capacity;

                    this.transactionId = transaction[0].transaction_id;
                    this.orderDetails.transactionId = transaction[0].transaction_id;
                    this.voidOrderDetails.transactionId = transaction[0].transaction_id;
                    this.tipValue = transaction[0].tip;

                    if (!transaction[0].receipt_number) {
                        this.receiptNo = transaction[0].transaction_id;
                    } else {
                        this.receiptNo = transaction[0].receipt_number;
                    }            
                           
                    this.orderType = transaction[0].order_type;
                    this.items = transaction;
                    this.discountValue = transaction[0].discount_value;
                    this.discount = transaction[0].discount;
                    this.surcharge = transaction[0].service_charge;
                    this.appliedDiscountValue = transaction[0].applied_discount_value;
                    this.appliedSurchargeValue = transaction[0].applied_service_charge;
                    this.discountId = transaction[0].discount;
                    this.discountIdNumber = transaction[0].discount_id_number;
                    this.discountImageUrl = transaction[0].discount_image_url;
                    this.selectedPaymentMethod = transaction[0].payment_method_id;

                    if (this.discountId) {
                        const discountInput = await axios.get(
                        `${process.env.VUE_APP_API_BASE_URL}/discount/` + this.discountId
                        );
                        const discountData = discountInput.data.results.data;
                        const discount = discountData.discountData;

                        this.discountName = discount.discount_name;
                    } else {
                        this.discountName = null;
                    }
                    

                    console.log(this.orderDetails.transactionId);

                    if (transaction[0].applied_service_charge === null) {
                        this.surcharge = 0;
                    } 

                    console.log("true");
                }

                if (this.items.length) {
                    this.isDiscountBtnDisabled = false;
                    this.isBillOutBtnDisabled = false;
                    this.isSurchargeBtnDisabled = false;
                    this.isPayNowBtnDisabled = false;
                    this.isOrderCompleteBtnDisabled = false;
                }


                if (!this.appliedDiscountValue && !this.appliedSurchargeValue) {
                    this.calcTotalAmount();
                    this.appliedDiscountValue = 0;
                    this.appliedSurchargeValue = 0;
                } else if (!this.appliedDiscountValue) {
                    const orderInput = await axios.get(
                        `${process.env.VUE_APP_API_BASE_URL}/order-item/` + id
                    );

                    const transactionData = orderInput.data.results.data;
                    const transaction = transactionData.orderItemsData;

                    this.totalPrice = Number(transaction[0].total_price);
                    this.totalAmount = Number(transaction[0].items_price);
                    this.subTotal = Number(transaction[0].items_price);

                    this.appliedDiscountValue = 0;
                } else if (!this.appliedSurchargeValue){
                    const orderInput = await axios.get(
                        `${process.env.VUE_APP_API_BASE_URL}/order-item/` + id
                    );

                    const transactionData = orderInput.data.results.data;
                    const transaction = transactionData.orderItemsData;

                    this.totalPrice = Number(transaction[0].total_price);
                    this.totalAmount = Number(transaction[0].items_price);
                    this.subTotal = Number(transaction[0].items_price);

                    this.appliedSurchargeValue = 0;
                } else {
                    const orderInput = await axios.get(
                        `${process.env.VUE_APP_API_BASE_URL}/order-item/` + id
                    );

                    const transactionData = orderInput.data.results.data;
                    const transaction = transactionData.orderItemsData;

                    this.totalPrice = Number(transaction[0].total_price);
                    this.totalAmount = Number(transaction[0].items_price);
                    this.subTotal = Number(transaction[0].items_price);
                }

                this.isTableModalActive = true;

                console.log(this.subTotal);

                return orderInput;
            } catch (error) {
                console.error(error);
            }
        },

        calcTotalAmount() {
            let total = 0;
            this.items.forEach((item) => {
                total += item.unit_price * item.quantity;
            });
            this.totalAmount = Number(total);
            this.totalPrice = Number(total);
            this.subTotal = Number(total);
            return total;
        },

        //Discount
        clearDiscountFields() {
            this.selectedDiscountType = null;
            this.discountType = null;
            this.discountAmount = null;
            this.discountRemarks = null;
        },
        async getDiscountList() {
            try {
                const res = await axios.get(
                    `${process.env.VUE_APP_API_BASE_URL}/discount/list`
                );

                const { discountList } = res.data.results.data;
                return discountList;
            } catch (err) {
                console.log(err);
            }
        },
        async selectDiscountTypes(event) {
          this.discountId = this.selectedDiscountType;
          let discountValue = 0;
          let calcTotalAmountDiscount = 0;
            if(this.discountId != "others"){
              try {
            
              if (this.discountId) {
                const res = await axios.get(
                  `${process.env.VUE_APP_API_BASE_URL}/discount/` + this.discountId
                );
                const { discountData } = res.data.results.data;
                if (discountData.deduction_type === DEDUCTION_TYPE.P) {
                  discountValue = (this.totalPrice / 100) * discountData.deduction;
                } else {
                  discountValue = discountData.deduction;
                }
                this.discountValue = discountValue;
              }
              this.computedTotalAmount = this.totalPrice - discountValue;
              this.totalAmount = this.computedTotalAmount;
            } catch (err) {
              console.log(err);
            }
          } else {
            this.totalAmount = this.totalPrice;
          }
        },
        async addDiscount() {
            this.isTableModalActive = false;

            try {
                const discountList = await this.getDiscountList();

                this.discountList = discountList;

                console.log(discountList);

                this.isDiscountModalActive = true;
            } catch (e) {
                console.error(e);
            }
        },
        async applyDiscount() {
          var discountType = '';
          if (this.selectedDiscountType != "others") {
            
            const itemInput = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/discount/` + this.selectedDiscountType);
            const item = itemInput.data.results.data.discountData;
            
            this.discountAmount = item.deduction;
            var deduction_type = item.deduction_type_id;
            this.computedDiscount = this.totalPrice - this.totalAmount;
            this.computedTotalAmount = this.totalAmount;
            discountType = this.selectedDiscountType;
          } else {
            if( this.discountType === "%" ){
              this.computedTotalAmount = Math.ceil(this.subTotal - Number(this.discountAmount / 100) * this.totalAmount);
              this.computedDiscount = Math.ceil(Number(this.discountAmount / 100) * this.totalAmount);
              discountType = 2;
            }
            discountType = 1;
          }
          try {
            const res = await axios.post(
              `${process.env.VUE_APP_API_BASE_URL}/order/discount`,
              {
                id: this.transactionId,
                discount_value: Math.ceil(this.computedDiscount),
                applied_discount_value:  Math.ceil(this.computedDiscount),
                discount: discountType,
                total_price: this.computedTotalAmount,
                discount_remarks: this.discountRemarks,
              }
            );
            this.isDiscountModalActive = false;
            this.clearDiscountFields();
            this.$toast.open({
              message: "Discount successfully applied!",
              type: "success",
              duration: 5000,
              // all of other options may go here
            });
            this.seeTableDetails(this.tableID);
            var loginDetails = this.$store.getters.getLoginDetails
            this.saveAuditTrail(loginDetails["loginUserId"], 'POS', 'Add discount', null, null);
          } catch (error) {
            console.error(error);
          }
        },
        async applyRequestedDiscount() {
            const discountValue = Math.ceil(this.discountValue);
            try {
            const res = await axios.post(
              `${process.env.VUE_APP_API_BASE_URL}/order/requested-discount`,
              {
                id: this.transactionId,
                applied_discount_value: discountValue,
              }
            );
            this.isDiscountModalActive = false;
            this.clearDiscountFields();
            this.$toast.open({
              message: "Discount successfully applied!",
              type: "success",
              duration: 5000,
              // all of other options may go here
            });
            this.seeTableDetails(this.tableID);
          } catch (error) {
            console.error(error);
          }
        },
        viewCardDetails() {
            this.isDiscountImageModalActive = true;
        },
        cancelDiscount() {
            this.isDiscountModalActive = false;
            this.isTableModalActive = true;
            this.clearDiscountFields();
            this.seeTableDetails(this.tableID);
        },

        //Surcharge
        clearSurchargeFields() {
            this.selectedSurchargeType = null;
        },
        async getSurchargeList(){
          try {
            const res = await axios.get(
              `${process.env.VUE_APP_API_BASE_URL}/surcharges/list`
            );
            const { surchargesList } = res.data.results.data;
            return surchargesList;
          } catch (err) {
            console.log(err);
          }
        },
        async addSurcharge() {
          this.isTableModalActive = false;
          try {
            const surchargeList = await this.getSurchargeList();
            this.surcharges = surchargeList;
            this.isSurchargeModalActive = true;
          } catch (e) {
            console.error(e);
          }
        },
        async selectSurchargeTypes(){
          const itemInput = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/surcharges/edit/` + this.selectedSurchargeType);
          const surchargesData = itemInput.data.results.data.surchargesData;
          console.log(surchargesData.deduction_type_id);
          if(surchargesData.deduction_type_id === 2){
            this.calcSurcharge =
                this.totalPrice +
                Number(surchargesData.deduction / 100) * this.totalPrice;
            this.computedSurcharge =
                Number(surchargesData.deduction / 100) * this.totalPrice;
          } else {
            this.calcSurcharge = parseInt(this.totalPrice) + parseInt(surchargesData.deduction);
            this.computedSurcharge = Math.round(surchargesData.deduction);
          }
          this.computedTotalAmount = this.calcSurcharge;
        },
        async applySurcharge() {
          try {
            const res = await axios.post(
              `${process.env.VUE_APP_API_BASE_URL}/order/surcharge`,
              {
                id: this.transactionId,
                items_price: Math.ceil(this.computedTotalAmount),
                service_charge: Math.ceil(this.computedSurcharge),
                applied_service_charge: Math.ceil(this.computedSurcharge),
              }
            );
            this.isSurchargeModalActive = false;
            this.clearSurchargeFields();
            this.$toast.open({
              message: "Surcharge successfully applied!",
              type: "success",
              duration: 5000,
              // all of other options may go here
            });
            this.seeTableDetails(this.tableID);
            var loginDetails = this.$store.getters.getLoginDetails
            this.saveAuditTrail(loginDetails["loginUserId"], 'POS', 'Add surcharge', null, null);
          } catch (error) {
            console.error(error);
          }
        },

        cancelSurcharge() {
            this.isSurchargeModalActive = false;
            this.isTableModalActive = true;
            this.clearSurchargeFields();
        },

        //Bill Out
        billOut() {
            this.$store.commit("setReceiptNo", this.receiptNo);
            this.$store.commit("setItems", this.items);
            this.$store.commit("setDiscount", this.discount);
            this.$store.commit("setSurcharge", this.surcharge);
            this.$store.commit("setTotalPrice", this.totalAmount);
            this.$store.commit("setOrderType", this.orderType);

            let route = this.$router.resolve({ path: "/pos/billout" });
            window.open(route.href);
        },

        //Pay Now
        async getPaymentMethodList() {
            try {
                const res = await axios.get(
                    `${process.env.VUE_APP_API_BASE_URL}/payment-method/list`
                );

                const { paymentMethodList } = res.data.results.data;
                return paymentMethodList;
            } catch (err) {
                throw err;
            }
        },
        clearPayNowFields() {
            this.cashTendered = null;
            this.selectedPaymentMethod = null;
            this.paymentCardNumber = null;
            this.amountReceived = null;
        },
        async payNow() {
            this.isPayNowModalActive = true;
            this.isTableModalActive = false;
            console.log(this.isPayNowModalActive);

            this.isTableModalActive = false;

            try {
                const paymentMethodList = await this.getPaymentMethodList();

                this.paymentMethods = paymentMethodList;

                this.isPayNowModalActive = true;
            } catch (e) {
                console.error(e);
            }
        },
        cancelPayment() {
            this.clearPayNowFields();
            this.isPayNowModalActive = false;
            this.isTableModalActive = true;
        },
        
        async confirmPayment() {
            this.$store.commit("setReceiptNo", this.receiptNo);
            this.$store.commit("setItems", this.items);
            this.$store.commit("setDiscount", this.discount);
            this.$store.commit("setSurcharge", this.surcharge);
            this.$store.commit("setTotalPrice", this.totalAmount);
            this.$store.commit("setCashTendered", this.cashTendered);
            this.$store.commit("setChange", this.change);

            let route = this.$router.resolve({ path: "/pos/confirm-payment" });
                window.open(route.href);

            try {

                const updatePaymentMethod = await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/order/payment-method`,
                    {
                        id: this.transactionId,
                        payment_method_id: this.selectedPaymentMethod,
                    }
                );
                
                const updateOrderPaymentDetails = await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/order/payment-details`,
                    {
                        id: this.transactionId,
                        payment_card_number: this.paymentCardNumber, 
                        cash_tendered: this.cashTendered, 
                        card_amount_received: this.amountReceived, 
                        customer_name: this.customerName,                
                        customer_contact_number: this.customerContactNumber
                    }
                );

                for(let item of this.items) {
                    console.log(item.productId)
                    await axios.post(
                        `${process.env.VUE_APP_API_BASE_URL}/order-item/status`,
                        {
                            transactionId: this.transactionId,
                            productId: item.productId,
                            status: STATUS.DONE,
                        }
                    ).then(res => {
                        console.log(res);
                    });
                }          

                const updateOrder = await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/order/` +
                    this.transactionId,
                    {
                        orderDetails: this.orderDetails,
                    }
                );

                const updateTable = await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/table/save`,
                    {
                        tableDetails: this.tableDetails
                    }
                );             
                
                this.isPayNowModalActive = false; 

                this.$toast.open({
                    message: "Payment Success!",
                    type: "success",
                    duration: 5000,
                    // all of other options may go here
                });

                console.log(updateTable);
                console.log(updatePaymentMethod);
                console.log(updateOrderPaymentDetails);
                console.log(updateOrder);
                console.log(updateOrderStatus);                               

                

                
            } catch (error) {
                console.error(error);
            }
            this.clearPayNowFields();

            try {
                const tableList = await this.getTableList();

                this.tables = tableList;
            } catch (e) {
                console.error(e);
            }
        },
    },
    computed: {
        isServeOrderBtnDisabled() {
            return !this.tableStatus || this.tableStatus === "served" || this.tableStatus != "completed";
        },
        isDisabledDiscountFields() {
            return this.selectedDiscountType != "others";
        },
        isDisabledAmountInput() {
            return !this.discountType || this.selectedDiscountType != "others";
        },
        isDisabledAddDiscountButton() {
            return (
                !this.selectedDiscountType ||
                (this.selectedDiscountType === "others" &&
                    !this.discountAmount &&
                    !this.discountRemarks)
            );
        },
        isDisabledAddSurchargeButton() {
            return !this.selectedSurchargeType;
        },
        isDisabledCashPaymentConfirmButton() {
            return this.cashTendered < this.totalAmount;
        },
        isDisabledCardPaymentConfirmButton() {
            return !this.paymentCardNumber || this.amountReceived < this.totalAmount;
        },
        isDisabledSplitPaymentConfirmButton() {
            return !this.cashTendered || !this.paymentCardNumber || this.totalTenderedAmount < this.totalAmount;
        },
        isDisabledCreditPaymentConfirmButton() {
            return !this.customerName || !this.customerContactNumber;
        },
        calcDiscountType() {
            let calcDiscountType = 0;
            calcDiscountType =
                this.totalAmount -
                (Number(this.discountValue) / 100) * this.totalAmount;
            return calcDiscountType;
        },
        calcPercentageDiscount() {
            let calcPercentageDiscount = 0;
            calcPercentageDiscount =
                this.totalAmount - Number(this.discountAmount / 100) * this.totalAmount;
            this.computedDiscount =
                Number(this.discountAmount / 100) * this.totalAmount;
            this.computedTotalAmount = calcPercentageDiscount;
            return calcPercentageDiscount;
        },
        calcFixedDiscount() {
            let calcFixedDiscount = 0;
            calcFixedDiscount = this.totalAmount - this.discountAmount;
            this.computedDiscount = this.discountAmount;
            this.computedTotalAmount = calcFixedDiscount;
            return calcFixedDiscount;
        },
        calcChange() {
            let calcChange = 0;
            calcChange = this.cashTendered - this.totalAmount;
            this.change = calcChange;
            return calcChange;
        },
        calcCardChange() {
            let calcCardChange = 0;
            calcCardChange = this.amountReceived - this.totalAmount;
            this.change = calcCardChange;
            return calcCardChange;
        },
        calcTotalAmountTendered(){
            let calcTotalAmountTendered = 0;
            calcTotalAmountTendered = (Number(this.amountReceived) + Number(this.cashTendered));
            this.totalTenderedAmount = calcTotalAmountTendered
            return calcTotalAmountTendered;
        },
        calcSplitChange() {
            let calcSplitChange = 0;
            calcSplitChange = (Number(this.amountReceived) + Number(this.cashTendered)) - this.totalAmount;
            this.change = calcSplitChange;
            return calcSplitChange;
        },
    },
};
// third party libraries
</script>

<style lang="scss" scoped>
body {
    font-family: "Poppins";
    background-image: url("../../../../_shared/assets/background.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    overflow: auto;
}

.container {
    min-height: 100vh;
    min-width: 100vw;
    background-color: rgba(255, 255, 255, 0.5);
    overflow: auto;
}

.navbar {
    background-color: transparent;
    display: flex;
    align-content: center;
    height: 100px;
}

.navbar button {
    background-color: #38d0ed;
    color: white;
    font-weight: 600;
}

.tables-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    max-height: 800px;
    margin: auto;
    padding: 0 20px 20px 20px;
}

.table-numbers {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
}

.tables-container h1 {
    font-family: "Fira Sans";
    font-weight: 800;
    font-size: 40px;
    color: #00084e;
    margin-bottom: 20px;
}

.tables-container button {
    font-size: 35px;
    font-weight: 600;
    color: #00084e;
    border: 5px solid #bfbfbf;
    border-radius: 25%;
    margin: 20px;
    width: 90px;
}

.tables-container button:hover,
.tables-container button:focus {
    background-color: #bfbfbf;
    border: 5px solid #777777;
    color: white;
}


.tables-container button.occupied {
    background-color: #ff0000;
    border: 5px solid #bf0000;
    color: white;
}

.tables-container button.completed {
    background-color: #48c78e;
    border: 5px solid #349167;
    color: white;
}

.tables-container button.served {
    background-color: #ffe08a;
    border: 5px solid #c4ab68;
    color: white;
}

.tables-container button.occupied:hover,
.tables-container button.occupied:focus {
    background-color: #bf0000;
    border: 5px solid #7c0000;
    color: white;
}

.tables-container button.completed:hover,
.tables-container button.completed:focus {
    background-color: #3aa072;
    border: 5px solid #287050;
    color: white;
}

.tables-container button.served:hover,
.tables-container button.served:focus {
    background-color: #c4ab68;
    border: 5px solid #94814e;
    color: white;
}

// Modal
header.modal-card-head p.modal-card-title {
    display: flex;
    justify-content: center;
    font-weight: 800;
    font-size: 30px;
    align-content: center;
}

footer.modal-card-foot .buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 350px;
}

button {
    width: 150px;
    margin: 5px;
}

section.modal-card-body.surcharge .control {
    box-sizing: border-box;
    clear: both;
    font-size: 1rem;
    position: relative;
    text-align: center;
}

.amount label.label {
    font-size: 20px;
}

input[type=number]{
    width: 50px;
}

.actionButtons {
  display: flex;
  justify-content: center;
}

.saveButton button {
    width: 20px;
}

.deleteButton button {
    width: 20px;
}


</style>