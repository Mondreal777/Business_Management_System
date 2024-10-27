<template lang="pug">
.checkout
    section(v-show="!mobileView")
        .title
            h2 Your Selections
        .cart
            p(v-if="cart.length === 0") Your cart is empty.
            .item(v-for="items in cart")
                .top
                    p {{ items.productName }}
                    b-button(icon-right="delete" size="is-medium" @click="removeItem(items.productId)")
                .bottom
                    b-numberinput(v-model="items.quantity" controls-position="compact" :min="1" controls-rounded :value="items.quantity")
                    p Php {{ items.productPrice }}
        .subtotal
            p SUBTOTAL
            h3 Php {{ calcSum }}
            b-button(v-show="cart.length === 0" expanded icon-left="cart" disabled) CHECKOUT
            b-button(v-show="cart.length" expanded icon-left="cart" @click="checkout()") CHECKOUT
    section(v-show="mobileView")
        Transition(name="slide")
            .details(v-if="showDetails")
                .title
                    b-button(icon-left="chevron-left" size="is-large" @click="showDetails = !showDetails")
                    h2 Your Selections
                .cart
                    p(v-if="cart.length === 0") Your cart is empty.
                    .item(v-for="items in cart")
                        .top
                            p {{ items.productName }}
                            b-button(icon-left="delete" size="is-medium" @click="removeItem(items.productId)")
                        .bottom
                            b-numberinput(v-model="items.quantity" controls-position="compact" :min="1" controls-rounded :value="items.quantity")
                            p Php {{ items.productPrice }}
                .subtotal
                    p SUBTOTAL
                    h3 Php {{ calcSum }}
                    b-button(v-show="cart.length === 0" expanded icon-left="cart" disabled) CHECKOUT
                    b-button(v-show="cart.length" expanded icon-left="cart" @click="checkout()") CHECKOUT
        .buttons
            b-button(v-show="cart.length === 0 && mobileView && !showDetails" expanded icon-left="cart" @click="showDetails = !showDetails") No Items Selected
            b-button(v-show="cart.length && !showDetails && mobileView" expanded icon-left="cart" @click="showDetails = !showDetails") {{ calcCartQuantity }} Items Selected
</template>

<script>
export default {
    name: "OrderingCartContainer",
    components: {},
    directive: {},
    filters: {},
    mixins: [],
    props: {
        cart: {
			type: Array,
			default: () => {
				return []
			}
		}
    },
    data() {
        return this.initData();
    },
    watch: {},
    created() {
        this.tableId = this.$store.getters.getTableId;
        this.orderType = this.$store.getters.getOrderType;
    },
    methods: {
        initData() {
            return {
                mobileView: true,
                tableId: null,
                orderType: null,
                subTotal: null,
                showDetails: null,
                cartQuantity: null,
            }
        },
        removeItem(productId){
            this.cart.splice(this.cart.indexOf(productId-1), 1);
        },
        onResize() {
            this.mobileView = window.innerWidth < 770;
        },
        checkout(){
            this.$router.push(`/order/${this.tableId}/checkout`);
            this.$store.commit('setCartItems', this.cart);
            this.$store.commit('setCartSubTotal', this.subTotal);
        }
    },
    computed: {
        calcSum(){
            let total = 0;
            if (this.cart.length !== 0) {
                this.cart.forEach(item => {
                    total += item.productPrice * item.quantity;
                    this.subTotal = total;
                });
            
            }            
            return total;
        },
        calcCartQuantity(){
            let cartQuantity = 0;
            if (this.cart.length !== 0) {
                this.cart.forEach(item => {
                    cartQuantity += item.quantity;
                    this.cartQuantity = cartQuantity;
                });
            
            }            
            return cartQuantity;
        }
    },
    mounted() {
        this.onResize();
        window.addEventListener("resize", this.onResize, { passive: true });
    },
    beforeDestroy() {
        if (typeof window !== "undefined") {
        window.removeEventListener("resize", this.onResize, { passive: true });
        }
    },
    
  // third party libraries
}
</script>

<style lang="scss" scoped>
.checkout {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 400px;
}

.checkout .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background-color: #D6A062;
    margin: 0;
}

.checkout .title h2 {
    color: white;
    font-size: 20px;
    font-weight: bold;
}

.checkout .cart {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border: 1px solid #cfcfcf;
}

.checkout .cart .item .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.checkout .cart .item .top button {
    border: none;
    color: #D6A062;
}

.b-numberinput input[type=number] {
    width: 30px;
}

.checkout .cart .item .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.checkout .subtotal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px 10px;
    border: 1px solid #cfcfcf;
}

.checkout .subtotal p {
    font-size: 15px;
    margin-bottom: 1rem;
}

.checkout .subtotal h3 {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 16px;
}

.checkout .subtotal button {
    border-radius: 50px;
    color: white;
    font-weight: bold;
    background-color: #D6A062;
}

.slide-enter-active {
    transition: all 0.3s ease-out;
}

.slide-leave-active {
    transition: all 0.3s ease-out;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(20px);
    opacity: 0;
}

@media only screen and (max-width: 770px) { 
    .checkout {
        position: -webkit-sticky;
        position: sticky;
        bottom: 2vw;
        height: unset;
        z-index: 10;
        background: white;
        overflow: auto;
    }

    .checkout section .details {
        height: 100vh;
    }

    .checkout .title {  
        display: grid;
        grid-template-columns: 25% 50% 25%;
        height: 60px;
        background-color: #D6A062;
        margin: 0;

        h2 {
            text-align: center;
        }
    }

    .checkout .buttons {
        padding: 0 20px;
    }

    .checkout .buttons button{
        background-color: #D6A062;
        color: #fff!important;
        text-align: center;
        height: 52px;
        vertical-align: middle;
        justify-content: center;
        line-height: 52px;
        letter-spacing: .5px;
        font-weight: 400;
        position: fixed;
        bottom: 2vw;
        width: 92vw;
        z-index: 10;
        margin: 0 auto;
        left: 4vw;
        border-radius: 30px;
        box-shadow: 0 0 10px #D6A062;
    }

    .checkout button{ 
        border-radius: 50px;
        color: white;
        background-color: #D6A062;
        font-weight: bold;
        
    }

    .checkout .title button{
        border: none;
        border-radius: 0;
        box-shadow: none;
        justify-self: flex-start;
        background-color: #D6A062;
        color: white;
    }
    
    .checkout .cart .item .top button {
        border: none;
        border-radius: unset;
        color: #D6A062;
        background-color: unset;
    }

    .checkout .details .subtotal {
        margin-top: auto;
    }

    

}
</style>