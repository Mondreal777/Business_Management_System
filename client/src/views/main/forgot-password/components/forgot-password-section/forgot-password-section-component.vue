<template lang="pug">
body
    .page-container
        .login-container
            .logo
                img(src="../../../../_shared/assets/logo.png" width="200" height="200")
            .login.username-form(v-if="isUserFormHidden")
                h2 Forgot Password
                b-field(label="Username" size="is-large")
                    input(v-on:keyup.enter="onContinue" id="username" v-model="username" name="username" type="text" required)
                p.error(v-if="continueStatus === 'USER_REQ'") Username is required.
                p.error(v-if="continueStatus === 'USER_ERROR'") Invalid Username.
                | *Please enter your username to verify your account.
                button(@click="onContinue") Continue
            .login.password-form(v-if="isPasswordFormHidden")
                b-field(label="New Password" size="is-large") 
                    input(v-on:keyup.enter="onSubmit" id="newPass" v-model="newPassword" name="newPassword" type="password" required)
                b-field(label="Confirm Password:" size="is-large")
                    input(v-on:keyup.enter="onSubmit" id="cPass" v-model="confirmPassword" name="confirmPassword" type="password" required)
                p.error(v-if="submitStatus === 'NEW_PASS'") New Password is required.
                p.error(v-if="submitStatus === 'C_PASS'") Confirm Password is required.
                p.error(v-if="submitStatus === 'NOT_MATCH'") Password did not match.
                p.error(v-if="submitStatus === 'ERROR'") Invalid password.
                button(@click="onSubmit") Reset Password
            p © All Rights Reserved POS-itive, 2022
</template>

<script>
import axios from "axios";
import jwt_decode from "jwt-decode";

export default {
  name: "ForgotPasswordComponent",
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
    const { userDetails } = this.$store.getters.getLoginDetails
    const { user_details } = userDetails;
    this.userDetails = user_details;
    console.log(this.userDetails)
  },
  methods: {
        initData() {
            return {
                username: null,
                newPassword: null,
                confirmPassword: null,         
                submitStatus: null,
                continueStatus: null,
                token: null,
                userDetails: null,
                isUserFormHidden: true,
                isPasswordFormHidden: false,
                loginDetails: {}
            }
        },
        async onContinue() {
            if (!this.username) {
                console.log("Username is required.");
                this.continueStatus = 'USER_REQ';
            } else if (this.username) {
                await axios.get(`${process.env.VUE_APP_API_BASE_URL}/user-details/list?searchKeyword=${this.username}`)
                .then(res => {
                    const { userList } = res.data.results.data;
                    console.log(userList)

                    if (userList.length !== 0) {
                        this.isPasswordFormHidden = true,
                        this.isUserFormHidden = false
                        this.loginDetails = {
                            loginUserId : userList[0].user_id,
                            loginUserRoleId : userList[0].role_id,
							changedPass: userList[0].changed_pass,
                            userDetails : userList[0]
                        }
                    } else {
                        this.continueStatus = 'USER_ERROR'
                    }
                })
            }
        },
        async onSubmit() {
            if (!this.newPassword) {
                console.log("New Password is required.");
                this.submitStatus = 'NEW_PASS';
            }
            else if (!this.confirmPassword) {
                console.log("Confirm Password is required.");
                this.submitStatus = 'C_PASS';
            }
            else if (this.newPassword !== this.confirmPassword) {
                console.log("Password did not match!");
                this.submitStatus = 'NOT_MATCH';
            }
            else if (this.newPassword && this.confirmPassword) {
                const userDetails = {
                    userId: this.loginDetails.userDetails.user_id,
                    username: this.loginDetails.userDetails.username,
                    lastName: this.loginDetails.userDetails.last_name,
                    firstName: this.loginDetails.userDetails.first_name,
                    userRole: this.loginDetails.userDetails.role_id,
                    organizationId: 1,
                    password: this.newPassword,
                    status: this.loginDetails.userDetails.status,
                    changedPass: 1
                }
                console.log(userDetails)
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/update-user`, {
                    userDetails
                }).then(res => {
                    const { updated } = res.data.results.data
                    console.log(updated)
                    if (updated) {
                        this.$store.commit('setMenuId', 1);
                        this.$router.push('/dashboard');
                    }
                }).catch(err => {
                    console.log(err);
                    this.submitStatus = 'ERROR';
                });                
            } else {
                this.submitStatus = 'ERROR';
            }
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
    background-position: center;
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
    padding: 25px;
    overflow: hidden;
    justify-content: center;
}

h2 {
    font-family: "Fira Sans";
    font-size: 25px;
    font-style: bold;
    padding: 0 0 25px 0;
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
