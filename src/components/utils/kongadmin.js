
import VueAxios from 'vue-axios'
import Vue from 'vue'
import axios from 'axios'
import KongAdminConfig from '@/config/kongAdminConfig.js'


Vue.use(VueAxios, axios)


export default {

    
    kongadminUri:KongAdminConfig.kongAdminBaseUrl,


    getServices:function(success,fail,component){

        console.log("getServices")

        this.httpget('/services/',success,fail,component)
    
        },

    getRoutes:function(){

    }
    ,
    getWorkingPlugins:function(){

    }
    ,
    getComsumers:function(){

    }
    , httppost:function(){

    }
    , httpput:function(){

    },
    httpget:function(uri,success,fail,component){

        var responseBody = {status:null,data:''}
        // "/services/"
        Vue.axios
        .get(this.kongadminUri + uri)
  
        .then(response => {

          responseBody.status = response.status

          if ((response.status == 200)) {
              responseBody.data =  response.data
              success(responseBody,component)
          } else {
              responseBody.data =  'errorOccured'
              fail(responseBody,component)
          }
        })    
        .catch(e => {
          console.log(uri+e)
          responseBody.data = e
          fail(responseBody,component)
        })

    }
    ,
    httpdelete:function(){

    }
 
    
  }
  