<template lang="pug">
body
    .page-container
        .login-container
            .logo
                img(src="../../../../_shared/assets/logo.png" width="200" height="200")
            .login
                b-field(label="Username:" size="is-large") 
                    input(v-on:keyup.enter="onSubmit" id="name" v-model="username" name="username" type="text" required)
                b-field(label="Password:" size="is-large")
                    input(v-on:keyup.enter="onSubmit" id="password" v-model="password" name="password" type="password" required)
                p.error(v-if="submitStatus === 'USER_EMPTY'") Username is required.
                p.error(v-if="submitStatus === 'PASSWORD_EMPTY'") Password is required.
                p.error(v-if="submitStatus === 'ERROR'") Invalid username or password.
                button(@click="onSubmit") Login
                a.forgot-password(@click="forgotPassword") Forgot username or password.
            p © All Rights Reserved POS-itive, 2022
</template>

<script>
import axios from "axios";
import jwt_decode from "jwt-decode";

export default {
  name: "LoginComponent",
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
  created() {},
  methods: {
        initData() {
            return {  
                username: null,
                password: null,         
                submitStatus: null,
                token: null,
            }
        },
        async onSubmit(){
            if (!this.username) {
                console.log("Username is required.");
                this.submitStatus = 'USER_EMPTY';
            }
            else if (!this.password) {
                console.log("Password is required.");
                this.submitStatus = 'PASSWORD_EMPTY';
            }
            else if (this.username && this.password) {
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/login`, {
                    username: this.username,
                    password: this.password
                }).then(res => {
                    const { token } = res.data.results.data
                    this.token = token;
                    var decoded = jwt_decode(this.token);
                    var loginDetails = { 
                            loginUserId : decoded["user_details"]["user_id"],
                            loginUserRoleId : decoded["user_details"]["role_id"],
							changedPass: decoded["user_details"]["changed_pass"],
                            userDetails : decoded
                        }
                    this.$store.commit('setLoginDetails', loginDetails);
                    this.$store.commit('setMenuId', 1);
                    console.log("token :: ", this.token);
					console.log(loginDetails);
					if (loginDetails.changedPass === 0 || !loginDetails.changedPass ) {
						this.$router.push('/new-user-change-password');
					} else {
						this.$router.push('/dashboard');
					}
                }).catch(err => {
                    console.log(err);
                    this.submitStatus = 'ERROR';
                });                
            } else {
                this.submitStatus = 'ERROR';
            }
    },
    forgotPassword(){
        this.$router.push('/forgot-password');
    }
  },
  // third party libraries
};
</script>

<style lang="scss" scoped>
body {
    font-family: "Poppins";
    display: flex;
    justify-content: center;
    align-content: center;
    min-height: 100vh;
    background-image: url('../../../../_shared/assets/background.jpg');
    background-repeat: no-repeat;
    background-size: cover;
}
.page-container {
    display: flex;
    background-color: rgba(0,0,0,0.5);
    width: 100%;
}

.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: fit-content;
    height: fit-content;
    border: 5px solid #946D42;
    border-radius: 50px;
    background-color: rgba(255, 255, 255, 0.900);
    margin: auto;
    padding: 0 30px 25px 30px;
    overflow: hidden;
}

h1 {
    font-family: "Fira Sans";
    font-size: 48px;
    font-style: bold;
    padding: 50px 0 100px 0;
}

.login {
    display: flex;
    flex-direction: column;
    align-items: center;
}


input[type="text"], input[type="password"] {
    border: none;
    border-bottom: 3px solid #636363;
    background: transparent;
    width: 300px;
    transition: 0.3s;
    font-size: 20px;
}

input[type="text"]:focus, input[type="password"]:focus {
    outline: none !important;
    border:3px solid #956b43;
    border-radius: 5px;
    transition: 0.3s;
}

input[type="text"]:hover, input[type="password"]:hover {
    border-bottom: 3px solid #956b43;
    transition: 0.3s;
}


button {
    font-family: "Poppins";
    font-weight: bold;
    border: none;
    background-color: #C3925A;
    font-size: 20px;
    color: white;
    border-radius: 50px;
    height: 55px;
    width: 300px;
    margin: 20px 0 10px 0;
    cursor: pointer;
    transition: 0.3s;
}

a.forgot-password {
    color: #5551FF;
    font-size: 15px;
    margin: 10px 0 20px 0;
}

a.forgot-password:hover {
    color: #252381;
}


p {
    font-size: 15px;
    width: 180px;
    text-align: center;
}

button:hover {
    background-color: #946D42;
    transition: 0.3s;
}

p.error {
    color: red;
    width: 400px;
    font-size: 15px;
}

@media only screen and (max-width: 685px) { 

    button {
        transform: scale(0.8);
        transition: 0.3s;
    }

    img {
        transform: scale(0.9);
        transition: 0.3s;
    }

    .login-container {
        margin: auto 30px;
        height: unset;
        padding: 20px 0;
    }

    input[type="text"], input[type="password"] {
        width: 250px;
        font-size: 15px;
    }

}

</style>
