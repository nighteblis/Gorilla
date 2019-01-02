
import VueAxios from 'vue-axios'
import Vue from 'vue'
import axios from 'axios'
import KongAdminConfig from '@/config/kongAdminConfig.js'


Vue.use(VueAxios, axios)


export default {

    kongadminUri: KongAdminConfig.kongAdminBaseUrl,


    getAllPlugins:function(success, fail, handlervueComponent){

        this.httpget('/', success, fail, handlervueComponent)     
    },

    addPlugin:function(postbody,success, fail, handlervueComponent){

        this.httppost('/plugins/', postbody,success, fail, handlervueComponent)     
    },

    getServices: function (success, fail, handlervueComponent) {
        this.httpget('/services/', success, fail, handlervueComponent)
    },
    addService: function (postbody,success, fail, handlervueComponent) {
        this.httppost('/services/',postbody, success, fail, handlervueComponent)
    },
    getRoutes: function (success, fail, handlervueComponent) {
        this.httpget('/routes/', success, fail, handlervueComponent)
    }
    ,
    getWorkingPlugins: function (success, fail, handlervueComponent) {

        this.httpget('/plugins/', success, fail, handlervueComponent)
    }
    ,
    getConsumers: function (success, fail, handlervueComponent) {
        this.httpget('/consumers/', success, fail, handlervueComponent)
    }    
    ,
    getUpstreams: function (success, fail, handlervueComponent) {
        this.httpget('/upstreams/', success, fail, handlervueComponent)
    }
    , httppost: function (uri, requestBody,success, fail, handlervueComponent) {
        var responseBody = { status: null, data: '' }
        var header = null

        if ( typeof requestBody === 'string'){

            header = { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        }
        else {
            header = { headers: { 'content-type': 'application/json' } }
        }

        Vue.axios
            .post(this.kongadminUri + uri, requestBody, header)
            .then(response => {
                this.handleHttpResponse(responseBody,response,success,fail,handlervueComponent)
            })
            .catch(e => {
                this.handleHttpException(responseBody,e,fail,handlervueComponent)
            })
    }
    , httpput: function (uri, requestBody,success, fail, handlervueComponent) {
        var responseBody = { status: null, data: '' }

        if ( typeof requestBody === 'string'){

            header = { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        }
        else {
            header = { headers: { 'content-type': 'application/json' } }
        }

        Vue.axios
            .put(this.kongadminUri + uri, requestBody, header)
            .then(response => {
                this.handleHttpResponse(responseBody,response,success,fail,handlervueComponent)
            })
            .catch(e => {
                this.handleHttpException(responseBody,e,fail,handlervueComponent)
            })
    },
    httpget: function (uri, success, fail, handlervueComponent) {

        var responseBody = { status: null, data: '' }

        Vue.axios
            .get(this.kongadminUri + uri)

            .then(response => {

                this.handleHttpResponse(responseBody,response,success,fail,handlervueComponent)
            })
            .catch(e => {
                this.handleHttpException(responseBody,e,fail,handlervueComponent)
            })

    }
    ,
    httpdelete: function (uri, requestBody,success, fail, handlervueComponent) {

        var responseBody = { status: null, data: '' }

        Vue.axios
            .delete(this.kongadminUri + uri)
            .then(response => {
                this.handleHttpResponse(responseBody,response,success,fail,handlervueComponent)
            })
            .catch(e => {
                this.handleHttpException(responseBody,e,fail,handlervueComponent)
            })

    }
    ,
    handleHttpResponse(returnResponseToClient,httpResponseBody,successHandler,failHandler,handlervueComponent){

        returnResponseToClient.status = httpResponseBody.status

        if ((httpResponseBody.status === 200 ||  httpResponseBody.status ===201 )) {
            returnResponseToClient.data = httpResponseBody.data
            successHandler(returnResponseToClient, handlervueComponent)
        } else {
            if (httpResponseBody.data !== '') { returnResponseToClient.data = 'http request error' }
            failHandler(returnResponseToClient, handlervueComponent)
        }
    },

    handleHttpException(returnResponseToClient,exception,failHandler,handlervueComponent){

        console.log(exception)

        if(returnResponseToClient.status == null){
            returnResponseToClient.status = 599 // exception internal error 
        }
        returnResponseToClient.data = exception
        failHandler(returnResponseToClient, handlervueComponent)



    }


}
