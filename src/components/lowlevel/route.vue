<template>
  <div>
    <br>
    <noticeinformation ref="noticeinformation"></noticeinformation>
    <br>

    <Table border :columns="routes" :data="routesdata"></Table>

    <Modal v-model="modal1" title="测试" @on-ok="ok" @on-cancel="cancel">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
  </div>
</template>
<script>
import kongadmin from "@/utils/kongadmin";

export default {
  name: "routemgmt",
  description: "",

  data() {
    return {
      modal1: false,
      msg: "route mgmt",
      routesdata: [],
      routes: [
        {
          title: "route ID",
          key: "id",
          width: 290
        },
        {
          title: "协议",
          key: "protocols",
          width: 90
        },
        {
          title: "访问主机",
          key: "hosts",
          width: 150
        },
        {
          title: "请求方法",
          key: "methods",
          width: 100
        },

        {
          title: "路径",
          key: "path",
          width: 100
        },

        {
          title: "关联服务",
          key: "service",
          width: 200
        },

        {
          title: "strip path",

          key: "strip_path",

          width: 90
        },

        {
          title: "regex priority",

          key: "regex_priority",

          width: 100
        },

        {
          title: "preserve host",

          key: "preserve_host",

          width: 100
        },
        {
          title: "创建时间 ",

          key: "created_at",

          width: 100
        },

        {
          title: "更新时间",

          key: "updated_at",

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
                      this.modal1 = true; //this.ok(params)
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
    console.log("route mgmt created");

    var success = function(response, component) {
      console.log(component);
      component.routesdata = response.data.data;
    };

    var fail = function(response, component) {
      component.$refs.noticeinformation.showalert(
        "error",
        "kong 有异常请尽快修复"
      );
    };
    kongadmin.getRoutes(success, fail, this);
  },

  methods: {
    ok() {
      this.$Message.info("Clicked ok");
    },
    cancel() {
      this.$Message.info("Clicked cancel");
    },
    changeDatetoString(date) {
      return new Date(date);
    }
  }
};
</script>
<style scoped>
code {
}
</style>
