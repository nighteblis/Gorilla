<template>
  <div>
    <br/>
    <noticeinformation ref="noticeinformation"></noticeinformation>
    <br/>

    <Button type="primary"  @click="addPlugin">添加插件</Button>

    <Table border :columns="services" :data="servicesdata"></Table>

    <Modal v-model="modal1" title="测试" @on-ok="ok" @on-cancel="cancel">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>

    <Modal v-model="addPluginWindow" title="添加插件" width="600" @on-ok="addPluginConfirm" @on-cancel="addPluginCancel">


    <Form ref="formInline"  >

        <FormItem prop="user" label="启用插件名称：">
        <pluginselector   ref="pluginSelected"></pluginselector>
        </FormItem>

        <FormItem prop="user" label="针对服务和路由（二选一或者全部选择）：">
          <serviceselector ref="serviceSelected"></serviceselector>
          <routeselector ref="routeSelected"></routeselector>
        </FormItem>
        <FormItem prop="user" label="针对消费者：">
              <Select  v-model="consumerId" filterable>
                <Option v-for="item in rcomsumerslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </FormItem>

        <FormItem label="插件配置：">
       <Input v-model="pluginConfig" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter configs">
       </Input>
        </FormItem>

    </Form>


    </Modal>

  </div>
</template>
<script>


import kongadmin from '@/utils/kongadmin'

export default {
  name: "pluginmgmt",
  description: "",

  data() {
    return {
      modal1: false,
      addPluginWindow:false,
      msg: 'plugin mgmt',
      consumerId:'',
      pluginConfig:'',
      pluginname:'',
      pluginNames:[{value:'pre-function',label:'pre-function'}],

      serviceslist:[],

      routeslist:[{value:'91963006-01e4-4946-b24f-e1ce9144b2de',label:'router1'}],

      rcomsumerslist:[],

      servicesdata:[],

      services: [
        {
          title: "名称",

          key: "name"
        },

        {
          title: "ID",
          key: "id",

          width: 290
        },


        {
          title: "是否启用",

          key: "enabled",

          width: 100
        },

        {
          title: "路由Id",

          key: "route_id",

          width: 90
        },

        {
          title: "服务Id",

          key: "service_id",

          width: 90
        },

        {
          title: "消费者Id",

          key: "consumer_id",

          width: 100
        },

        {
          title: "配置内容",

          key: "config",

          width: 300
        },
        {
          title: "更新时间",

          key: "updated_at",

          width: 100
        },
        {
          title: "创建时间 ",

          key: "created_at",

          width: 100
        },

        {
          title: "操作",

          key: "action",

          width: 150,

          align: "center",

          fixed: "right",

          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",

                    size: "small"
                  },

                  style: {
                    marginRight: "5px"
                  },

                  on: {
                    click: () => {
                      this.modal1 = true //this.ok(params)
                    }
                  }
                },
                "更新"
              ),

              h(
                "Button",
                {
                  props: {
                    type: "primary",

                    size: "small"
                  },

                  style: {
                    marginRight: "5px"
                  },

                  on: {
                    click: () => {
                      this.cancel()
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    }
  },
  created: function() {

    
    console.log("route mgmt created")


     var success = function (response,component){
        console.log(component)
        component.servicesdata = response.data.data
     }

     var fail = function (response,component){
       console.log('fail function')
       console.log(response)
        component.$refs.noticeinformation.showalert(
            "error",
             "kong 有异常请尽快修复"
           )
     }
    kongadmin.getWorkingPlugins(success,fail,this)


  },

  methods: {

    addPluginConfirm() {

  var uri = this.$store.state.kongAdmin +'/plugins/'


  console.log(this.$refs)
  console.log("====")

  console.log(this.$refs.serviceSelected.serviceId)
  console.log(this.$refs.routeSelected.routeId)
  console.log(this.$refs.pluginSelected.pluginName)
  console.log(this.pluginConfig)

  // var s1= this.serviceId === '' ?  '' : 'service_id='+this.serviceId
  // var s2= this.routeId === '' ?  '' : 'route_id='+this.routeId
  // var s3= this.consumerId === '' ?  '' : 'consumer_id='+this.consumerId
  // var s4= this.pluginName === '' ? '':'name='+this.pluginName
  // var s5=this.pluginConfig === '' ? '':this.pluginConfig


  console.log(uri)

  this.axios.post(uri,this.checkAndGenerateWwwData(this.$refs.serviceSelected.serviceId,this.$refs.routeSelected.routeId,this.$refs.pluginSelected.pluginName,this.pluginConfig,consumerId),{headers: {'content-type': 'application/x-www-form-urlencoded'}})
 .then(response => {
 console.log(response)

 if( response.data.status != 0 ) {
     this.$Message.info("添加插件出错")
 }
 else
 {
     if(!showoriginalalert)
    this.$Message.info("添加成功")

 }


 })
 .catch(e => {

 console.log(e)

 })

      this.$Message.info("Clicked ok")
    },
    addPluginCancel() {
      this.$Message.info("Clicked cancel")
    },
    ok() {
      this.$Message.info("Clicked ok")
    },
    cancel() {
      this.$Message.info("Clicked cancel")
    },    
    changeDatetoString (date) {
      return new Date(date)
    },
    addPlugin(){

      console.log('add plugin...')
      this.addPluginWindow = true


    var success1 = function (response,component){
     //   component.servicesdata = response.data.data
        console.log(component.servicesdata)
     }

     var fail = function (response,component){
        component.$refs.noticeinformation.showalert(
            "error",
             "获取插件列表异常"
           )
     }
    kongadmin.getServices(success1,fail,this)
     

     var success2 = function (response,component){
        console.log(component)
       // component.routesdata = response.data.data
     }


    kongadmin.getRoutes(success2,fail,this)

     var success3 = function (response,component){
        console.log(component)
       // component.routesdata = response.data.data
     }

    kongadmin.getConsumers(success3,fail,this)




    },
        checkAndGenerateWwwData(){

         var returnstring = ''
         for (var i = 0; i < arguments.length; i++) {
            console.log(arguments[i]);
            if(arguments[i] === '' || arguments[i] == null ) 
            {
                continue       
            }
            else{
               if(i===0)   returnstring += arguments[i]
               else returnstring += '&'+arguments[i]
            }        

          }

          console.log(returnstring = returnstring.replace(/^&+|&+$/g, ''))
          return returnstring

    }
  }
}
</script>
<style scoped>
code {
}
</style>
