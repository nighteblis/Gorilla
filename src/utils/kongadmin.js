
import VueAxios from 'vue-axios'
import Vue from 'vue'
import axios from 'axios'
import KongAdminConfig from '@/config/kongAdminConfig.js'


Vue.use(VueAxios, axios)


export default {


    kongadminUri: KongAdminConfig.kongAdminBaseUrl,


    getServices: function (success, fail, handlervueComponent) {

        this.httpget('/services/', success, fail, handlervueComponent)

    },

    getRoutes: function (success, fail, handlervueComponent) {
        this.httpget('/routes/', success, fail, handlervueComponent)
    }
    ,
    getWorkingPlugins: function (success, fail, handlervueComponent) {

        this.httpget('/plugins/', success, fail, handlervueComponent)
    }
    ,
    getComsumers: function (success, fail, handlervueComponent) {
        this.httpget('/consumers/', success, fail, handlervueComponent)
    }
    , httppost: function () {
        var responseBody = { status: null, data: '' }

        Vue.axios
            .post(this.kongadminUri + uri, requestBody, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
            .then(response => {
                handleHttpResponse(responseBody,response,success,fail,handlervueComponent)
            })
            .catch(e => {
                handleHttpException(responseBody,e,fail,handlervueComponent)
            })
    }
    , httpput: function () {
        var responseBody = { status: null, data: '' }

        Vue.axios
            .put(this.kongadminUri + uri, requestBody, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
            .then(response => {
                handleHttpResponse(responseBody,response,success,fail,handlervueComponent)
            })
            .catch(e => {
                handleHttpException(responseBody,e,fail,handlervueComponent)
            })
    },
    httpget: function (uri, success, fail, handlervueComponent) {

        var responseBody = { status: null, data: '' }

        Vue.axios
            .get(this.kongadminUri + uri)

            .then(response => {

                handleHttpResponse(responseBody,response,success,fail,handlervueComponent)
            })
            .catch(e => {
                handleHttpException(responseBody,e,fail,handlervueComponent)
            })

    }
    ,
    httpdelete: function (uri, requestBody,success, fail, handlervueComponent) {

        var responseBody = { status: null, data: '' }

        Vue.axios
            .delete(this.kongadminUri + uri)
            .then(response => {
                handleHttpResponse(responseBody,response,success,fail,handlervueComponent)
            })
            .catch(e => {
                handleHttpException(responseBody,e,fail,handlervueComponent)
            })

    }
    ,
    handleHttpResponse(returnResponseToClient,httpResponseBody,successHandler,failHandler,handlervueComponent){

        returnResponseToClient.status = httpResponseBody.status

        if ((httpResponseBody.status === 200 ||  httpResponseBody.status ===201 )) {
            returnResponseToClient.data = httpResponseBody.data
            successHandler(responseBody, component)
        } else {
            if (httpResponseBody.data !== '') { returnResponseToClient.data = 'http request error' }
            failHandler(responseBody, handlervueComponent)
        }
    },

    handleHttpException(returnResponseToClient,exception,failHandler,handlervueComponent){


        if(returnResponseToClient.status == null){
            returnResponseToClient.status = 599 // exception internal error 
        }
        returnResponseToClient.data = exception
        failHandler(returnResponseToClient, handlervueComponent)



    }


}
