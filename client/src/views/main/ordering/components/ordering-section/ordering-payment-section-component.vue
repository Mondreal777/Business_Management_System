<template lang="pug">
body
    main
        section.payment-method
            h1 Select Payment Method
            hr
            .cash(tabindex="1" :style="{backgroundColor: cashBgColor, color: cashColor, transition: cashTransition}" @click="cashOrderType()")
                .header
                    b-icon(icon="cash-100" size="is-medium")
                    h1 Cash
                .details
                    p Pay for your order right at counter.
                    p Please pay for the exact amount to avoid any inconveniences in preparing for your change. 
                    p Thank you!
            .card(tabindex="2" :style="{backgroundColor: cardBgColor, color: cardColor, transition: cardTransition}" @click="cardOrderType()" disabled="true")
                .header
                    b-icon(icon="credit-card-outline" size="is-medium")
                    h1 Card
                .details
                    p Pay using your debit/credit card.
                    p *Processing fees will apply
                    .tip(v-show="paymentMethod === 2")
                        p Tip: Php 
                            input(v-model="tipValue" type="number")
            .split(tabindex="2" :style="{backgroundColor: splitBgColor, color: splitColor, transition: splitTransition}" @click="splitOrderType()" disabled="true")
                .header
                    b-icon(icon="cash-100" size="is-medium")
                    b-icon(icon="credit-card-outline" size="is-medium")
                    h1 Split
                .details
                    p Split payment with cash and debit/credit card.
                    p *Processing fees will apply
                    .tip(v-show="paymentMethod === 3")
                        p Tip: Php 
                            input(v-model="tipValue" type="number")
            .credit(tabindex="2" :style="{backgroundColor: creditBgColor, color: creditColor, transition: creditTransition}" @click="creditOrderType()" disabled="true")
                .header
                    b-icon(icon="credit-card-outline" size="is-medium")
                    h1 Credit 
                .details
                    p Eat now pay later!
                    p *The store might ask for your contact information.
            .online(tabindex="2" :style="{backgroundColor: onlineBgColor, color: onlineColor, transition: onlineTransition}" @click="onlineOrderType()" disabled="true")
                .header
                    b-icon(icon="credit-card-outline" size="is-medium")
                    h1 Pay Online (Coming Soon)
                .details
                    p Pay online fast and secure!
                    p *Processing fees will apply

    footer
        .proceed
            p By placing this order, you agree to all 
                a(href="") Terms & Conditions
            b-button(v-show="!this.paymentMethod" icon-left="check-circle" expanded disabled) CONFIRM
            b-button(v-show="this.paymentMethod" icon-left="check-circle" expanded @click="confirm()") CONFIRM
        .terms-conditions
            p I agree and I demand that you execute the ordered service before the end of the revocation period. I am aware that I lose my right of rescission when the service has started and has been completely fulfilled.    
    
    //Feedback Modal                  
    b-modal(
        v-model="isFeedbackModalActive",
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
                p.modal-card-title Feedback
            section.modal-card-body
                b-field(label='Thank you for dining with us! A feedback is greatly appreciated.')
                    b-input(v-model="feedbackMessage" maxlength='200' type='textarea')
            footer.modal-card-foot.discount
                .buttons
                    b-button(
                        type="is-link",
                        label="Submit",
                        :disabled="isSubmitFeedbackButton",
                        @click="submit()"
                    )
                    b-button(type="is-link", label="Skip", @click="skip()")
</template>

<script>
import axios from 'axios';

export default {
    name: "OrderingPaymentComponent",
    components: {},
    directive: {},
    filters: {},
    mixins: [],
    props: {},
    watch: {},
    async created() {
        this.tableId = this.$store.getters.getTableId;
        this.transactionId = this.$store.getters.getTransactionId;

        try {
            const orderData = await this.getOrderDetails();
            
            this.totalPrice = parseInt(orderData[0].total_price);
        } catch (error) {
            
        }
    },
    data() {
        return this.initData();
    },
    methods: {
        initData() {
            return {
                mobileView: true,
                
                tableId: null,
                transactionId: null,
                paymentMethod: null,

                cashBgColor: null,
                cashColor: null,
                cashTransition: null,

                cardBgColor: null,
                cardColor: null,
                cardTransition: null,

                splitBgColor: null,
                splitColor: null,
                splitTransition: null,

                creditBgColor: null,
                creditColor: null,
                creditTransition: null,

                onlineBgColor: null,
                onlineColor: null,
                onlineTransition: null,

                isFeedbackModalActive: null,
                feedbackMessage: null,
                totalPrice: null,
                tipValue: null,
            };
        },

        async getOrderDetails() {
            const res = await axios.get(
                `${process.env.VUE_APP_API_BASE_URL}/order/${this.transactionId}`
            );

            const { orderData } = res.data.results.data;
            return orderData;
        },

        cashOrderType() {
            this.paymentMethod = 1;
            this.cashBgColor = '#D6A062';
            this.cashColor = 'white';
            this.cashTransition = '0.3s';

            this.cardBgColor = null;
            this.cardColor = null;
            this.cardTransition = null;

            this.splitBgColor = null;
            this.splitColor = null;
            this.splitTransition = null;

            this.creditBgColor = null;
            this.creditColor = null;
            this.creditTransition = null;

            this.onlineBgColor = null;
            this.onlineColor = null;
            this.onlineTransition = null;
        },
        cardOrderType() {
            this.paymentMethod = 2;

            this.cashBgColor = null;
            this.cashColor = null;
            this.cashTransition = null;

            this.cardBgColor = '#D6A062';
            this.cardColor = 'white';
            this.cardTransition = '0.3s';

            this.splitBgColor = null;
            this.splitColor = null;
            this.splitTransition = null;

            this.creditBgColor = null;
            this.creditColor = null;
            this.creditTransition = null;

            this.onlineBgColor = null;
            this.onlineColor = null;
            this.onlineTransition = null;
        },

        splitOrderType() {
            this.paymentMethod = 3;

            this.cashBgColor = null;
            this.cashColor = null;
            this.cashTransition = null;

            this.cardBgColor = null;
            this.cardColor = null;
            this.cardTransition = null;

            this.splitBgColor = '#D6A062';
            this.splitColor = 'white';
            this.splitTransition = '0.3s';

            this.creditBgColor = null;
            this.creditColor = null;
            this.creditTransition = null;

            this.onlineBgColor = null;
            this.onlineColor = null;
            this.onlineTransition = null;
        },

        creditOrderType() {
            this.paymentMethod = 4;

            this.cashBgColor = null;
            this.cashColor = null;
            this.cashTransition = null;

            this.cardBgColor = null;
            this.cardColor = null;
            this.cardTransition = null;

            this.splitBgColor = null;
            this.splitColor = null;
            this.splitTransition = null;

            this.creditBgColor = '#D6A062';
            this.creditColor = 'white';
            this.creditTransition = '0.3s';

            this.onlineBgColor = null;
            this.onlineColor = null;
            this.onlineTransition = null;
        },
        confirm() {
            this.isFeedbackModalActive = true;
            console.log(this.calcTotal);
        },
     
        async submit() {
            try {
                await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/order/payment-method`,
                    {
                        id: this.transactionId,
                        totalPrice: this.calcTotal,
                        payment_method_id: this.paymentMethod,
                        tipValue: this.tipValue,
                        feedback: this.feedbackMessage,
                    }
                );                
                
                this.$store.commit('setPaymentMethodId', this.paymentMethod);

                this.$router.push(`/order/${this.tableId}/checkout`);
                setTimeout(this.complete, 3000)   
                
            } catch (error) {
                console.log(error)
            }
        },
        
        async skip() {
            try {
                await axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/order/payment-method`,
                    {
                        id: this.transactionId,
                        totalPrice: this.calcTotal,
                        payment_method_id: this.paymentMethod,
                        tipValue: this.tipValue,
                        feedback: this.feedbackMessage,
                    }
                );                
                
                this.$store.commit('setPaymentMethodId', this.paymentMethod);

                this.$router.push(`/order/${this.tableId}/checkout`);
                setTimeout(this.complete, 3000)                
                
            } catch (err) {
                console.log(err)
            }
        },
        complete(){
            this.$store.commit('setCartItems', this.cart);
            this.$store.commit('setCartSubTotal', this.subTotal);
            this.$store.commit('setTransactionId', null);
            this.$store.commit('setReceiptNumber', null);
        },
        back() {
            this.$router.push(`/order/${this.tableId}/menu`);
        },
    },
    computed: {
        isSubmitFeedbackButton() {
            return !this.feedbackMessage;
        },
        calcTotal() {
            let total = 0;
            const tip = this.tipValue;
            const totalPrice = this.totalPrice;            
            total = Number(tip) + Number(totalPrice)
            return total
        }
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
    flex-grow: 2;
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
.card,
.split,
.credit,
.online {
    display: flex;
    flex-direction: column;
    border: 1px #d1d1d1 solid;
    border-radius: 20px;
    margin-bottom: 20px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    transition: 0.3s;
    cursor: pointer;
}

//Online Disabled
.online {
    pointer-events:none;
    opacity: 0.5;
}

.cash:hover,
.card:hover,
.split:hover,
.credit:hover,
.online:hover {
    background-color: #D6A062;
    color: white;
    transition: 0.3s;
}

.cash:focus,
.card:focus,
.split:focus,
.credit:focus,
.online:focus {
    background-color: #D6A062;
    color: white;
    transition: 0.3s;
}

.cash .header,
.card .header,
.split .header,
.credit .header,
.online .header {
    display: flex;
    flex-direction: row;
    margin: 20px;
    align-items: center;
}

.cash .header h1,
.card .header h1,
.split .header h1,
.credit .header h1,
.online .header h1 {
    margin: 0 10px;
}

.cash .details,
.card .details,
.split .details,
.credit .details,
.online .details {
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