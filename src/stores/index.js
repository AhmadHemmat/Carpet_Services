import { defineStore } from 'pinia'
import axios from "axios"

export const loginStore = defineStore('login', {
    state: () => ({
      isAuthenticated: false,
      token: '',
      isStaff: null,
      // APIUrl: "http://192.168.1.62:8000/"
      APIUrl: "https://carpet.iran.liara.run/"
      // APIUr: "http://localhost:8000/"
    }),

    actions: {
      // since we rely on `this`, we cannot use an arrow function
      async onStart(isStaff) {
        let token = localStorage.getItem("token")
        if (token) {
            this.isAuthenticated = true
            this.token = token
            axios.defaults.headers.common['Authorization'] = "Token " + token
            await axios.get(this.APIUrl + "api/account/user/").then((response) => {
              this.isStaff = response?.data?.is_staff;
            });
        } else {
            this.isAuthenticated = false
            this.token = ""
            axios.defaults.headers.common['Authorization'] = ""
        }
      },

      async login(token) {
         // this should dynamic by get response of auth from API
        if (token) {
            this.isAuthenticated = true
            this.token = token
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = "Token " + token
            await axios.get(this.APIUrl + "api/account/user/").then((response) => {
              this.isStaff = response?.data?.is_staff;
            });
        } else { // some times event by hackers
            this.isAuthenticated = false
            this.token = ''
            localStorage.removeItem('token')
            axios.defaults.headers.common['Authorization'] = ""
        }
      },

      logout() {
        this.isAuthenticated = false
        this.token = ''
        axios.defaults.headers.common['Authorization'] = ""
        localStorage.removeItem('token')
        this.isStaff = null
      }, 
    },
  })