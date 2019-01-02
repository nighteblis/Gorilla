<template>
  <div>
    <br>
    <noticeinformation ref="noticeinformation"></noticeinformation>
    <br>

    <Button type="primary" @click="addPlugin">添加插件</Button>

    <Table border :columns="services" :data="servicesdata"></Table>

    <Modal v-model="modal1" title="测试" @on-ok="ok" @on-cancel="cancel">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>

    <Modal
      v-model="pluginformWindow"
      :title="pluginformTitle"
      width="600"
      @on-ok="addPluginConfirm"
      @on-cancel="addPluginCancel"
    >
      <Form v-model="pluginform">
        <FormItem prop="user" label="启用插件名称：">
          <pluginselector
            v-model="pluginform.plugin.value"
            :placeholder="pluginform.plugin.placeholder"
          ></pluginselector>
        </FormItem>
        <FormItem prop="user" label="针对服务和路由（二选一或者全部选择）：">
          <serviceselector
            v-model="pluginform.service.value"
            :placeholder="pluginform.service.placeholder"
          ></serviceselector>
          <routeselector
            v-model="pluginform.router.value"
            :placeholder="pluginform.router.placeholder"
          ></routeselector>
        </FormItem>
        <FormItem prop="user" label="针对消费者：">
          <consumerselector
            v-model="pluginform.consumer.value"
            :placeholder="pluginform.consumer.placeholder"
          ></consumerselector>
        </FormItem>
        <FormItem label="插件配置：">
          <Input
            v-model="pluginform.pluginConfig.value"
            type="textarea"
            :autosize="{minRows: 10,maxRows: 20}"
            :placeholder="pluginform.pluginConfig.placeholder"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import kongadmin from "@/utils/kongadmin";

export default {
  name: "pluginmgmt",
  description: "",

  data() {
    return {
      modal1: false,
      pluginformTitle:'添加插件',
      pluginform: {
        consumer: {
          placeholder: "请选择要应用的消费者",
          value: "",
          key: "consumer_id"
        },
        pluginConfig: { placeholder: "config.xxx=", value: "", key: "" },
        plugin: { placeholder: "请选择要添加的插件", value: "", key: "name" },
        service: {
          placeholder: "请选择要应用的服务",
          value: "",
          key: "service_id"
        },
        router: {
          placeholder: "请选择要应用的路由",
          value: "",
          key: "route_id"
        }
      },

      pluginformWindow: false,
      servicesdata: [],

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
                      this.pluginformWindow = true  //this.ok(params)
                      this.pluginformTitle = '更新插件'
                      console.log(params)

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
                      this.cancel();
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  },
  created: function() {
    console.log(" plugin mgmt created");

    var success = function(response, component) {
      console.log(component);
      component.servicesdata = response.data.data;
    };

    var fail = function(response, component) {
      console.log("fail function");
      console.log(response);
      component.$refs.noticeinformation.showalert(
        "error",
        "kong 有异常请尽快修复"
      );
    };
    kongadmin.getWorkingPlugins(success, fail, this);
  },

  methods: {
    addPluginConfirm() {
      var uri = this.$store.state.kongAdmin + "/plugins/";

      console.log("consumer value: " + this.pluginform.consumer.value);
      console.log(this.pluginform);
      console.log("====");
      console.log(this.$refs);

      // var s1= this.serviceId === '' ?  '' : 'service_id='+this.serviceId
      // var s2= this.routeId === '' ?  '' : 'route_id='+this.routeId
      // var s3= this.consumerId === '' ?  '' : 'consumer_id='+this.consumerId
      // var s4= this.pluginName === '' ? '':'name='+this.pluginName
      // var s5=this.pluginConfig === '' ? '':this.pluginConfig

      console.log(uri);

      this.axios
        .post(uri, this.checkAndGenerateWwwData(this.pluginform), {
          headers: { "content-type": "application/x-www-form-urlencoded" }
        })
        .then(response => {
          console.log(response);

          if (response.data.status != 0) {
            this.$Message.info("添加插件出错");
          } else {
            if (!showoriginalalert) this.$Message.info("添加成功");
          }
        })
        .catch(e => {
          console.log(e);
          this.$Message.info("添加插件出错");
        });

      //this.$Message.info("Clicked ok")
    },
    addPluginCancel() {
      this.$Message.info("Clicked cancel");
    },
    ok() {
      this.$Message.info("Clicked ok");
    },
    cancel() {
      this.$Message.info("Clicked cancel");
    },
    changeDatetoString(date) {
      return new Date(date)
    },
    addPlugin() {
      console.log("add plugin...")
      this.pluginformWindow = true
    },

    checkAndGenerateWwwData(formdata) {

       var returnstring = ""
       var i = 0
      Object.keys(formdata).forEach(function(key) {
        var valueObject = formdata[key];
        
        console.log(valueObject);
        if ( valueObject.value == null || valueObject.value === '' ) {
          
        } 
        else if( key === 'pluginConfig'){
          if (i === 0) returnstring +=  valueObject.value 
          else returnstring += '&' + valueObject.value
          
        }
        else {
          if (i === 0) returnstring += valueObject.key +"="+ valueObject.value 
          else returnstring += "&" + valueObject.key +"="+ valueObject.value
        }

        i++        

      })

      console.log((returnstring = returnstring.replace(/^&+|&+$/g, "")));
      return returnstring;
    }
  }
};
</script>
<style scoped>
code {
}
</style>
