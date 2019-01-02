<template>
  <div id="app">
    <div class="Core System Test Asistor">
      <Header>
        <Menu mode="horizontal" class="headermenu" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="ios-navigate"></Icon>Item 1
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>Item 2
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-analytics"></Icon>Item 3
            </MenuItem>
            <MenuItem name="4">
              <Icon type="ios-paper"></Icon>Item 4
            </MenuItem>
          </div>
        </Menu>
      </Header>

      <Menu class="leftmenu" active-name="1-2"  @on-select="select($event)">
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-people"/>应用
          </template>
          <MenuGroup title="vhosts管理">
            <MenuItem
              v-for="highapis in menutiems.highlevel"
              :key="highapis.name"
              :ref="'menuitem'+highapis.name"
              :name="highapis.name"
            >{{highapis.label}}</MenuItem>
          </MenuGroup>
        </Submenu>

        <Submenu name="2">
          <template slot="title">
            <Icon type="logo-usd"/>底层接口
          </template>
          <MenuItem
            v-for="lowapis in menutiems.lowlevel"
            :key="lowapis.name"
            :ref="'menuitem'+lowapis.name"
            :name="lowapis.name"
          >{{lowapis.label}}</MenuItem>
        </Submenu>
      </Menu>

      <Tabs type="card" closable @on-tab-remove="handleTabRemove">
        <TabPane
          ref="tabPanes"
          :key="tab.component"
          :name="tab.component"
          :label="tab.label"
          v-if="tab.display"
          v-for="tab in tabs"
        >
          <component ref="tabComponents" :is="tab.component"></component>
        </TabPane>
      </Tabs>

      <div class="welcome" v-if="welcomedisplay">core</div>

      <div id="footer">
        <Divider/>nighteblis@hotmail.com
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import "iview/dist/styles/iview.css"
import iview from "iview"
// import noticeinformation from "@/components/common/noticeinformation.vue"

import menuitems from "@/config/menuitems"
import axios from "axios"
import VueAxios from "vue-axios"
import testcomponents from "@/components/highlevel/"
import lowlevelmgmt from "@/components/lowlevel/"
import dashboard from "@/components/dashboard/"
import commons from "@/components/common/"


// 批量注册component
Object.keys(commons).forEach(function importallcomponent(component) {
  console.log(commons[component])
  console.log(commons[component].name)
  Vue.component(commons[component].name, commons[component])
});

// 批量注册component
Object.keys(testcomponents).forEach(function importallcomponent(component) {
  console.log(testcomponents[component])
  console.log(testcomponents[component].name)
  Vue.component(testcomponents[component].name, testcomponents[component])
})

// 批量注册component
Object.keys(lowlevelmgmt).forEach(function importallcomponent(component) {
  console.log(lowlevelmgmt[component])
  console.log(lowlevelmgmt[component].name)
  Vue.component(lowlevelmgmt[component].name, lowlevelmgmt[component])
})

// 批量注册component
Object.keys(dashboard).forEach(function importallcomponent(component) {
  console.log(dashboard[component])
  console.log(dashboard[component].name)
  Vue.component(dashboard[component].name, dashboard[component])
});

Vue.use(VueAxios, axios)
Vue.use(iview)

export default {
  name: "Home",

  data() {
    return {
      welcomedisplay: true,
      alert: this.$store.state.alert,
      msg: "Welcome to Your Vue.js App",
      tabs: [],
      menutiems: menuitems
    }
  },
  methods: {
    showinformation() {},
    handleTabRemove(name) {
      var thiz = this
      var index
      this.tabs.forEach(function(element) {
        if (element.component == name) {
          index = thiz.tabs.indexOf(element);
          element.display = false
        }
      })
    },
    select(event) {
      console.log(event)

      this.welcomedisplay = false
      var componentexist = false

      console.log(this.tabs)
      console.log("===========")
      console.log(this.$refs["menuitem" + event])
      console.log("menuitem" + event)
      var labelname = this.$refs["menuitem" + event][0].$el.innerText

      console.log(labelname)
      if (this.tabs.length == 0) {
        this.tabs.push({ display: true, component: event, label: labelname })
        console.log("returned when length == 0 ")
        return
      }

      var thiz = this
      this.tabs.forEach(function(element) {
        console.log(element.component + "----" + event)
        if (element.component == event) {
          componentexist = true
          console.log("equal")
          element.display = true
          return // no need more loop
        }
      })

      console.log('-------')

      if (!componentexist) {
        this.tabs.push({ display: true, component: event, label: labelname })
      }
      if (this.$refs.tabPanes.length > 0) {
        console.log('length greater than  0')
        this.$refs.tabPanes[0].$parent.activeKey = event
      } else {
        console.log('length equal 0')
      }
    },

    open() {
      console.log(this)
    },
    selectenv(selectvalue) {
      // console.log(this.$store.state.selectedEnv)
      // console.log(this.selectedEnv)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.leftmenu {
  float: left;
  text-align: left;
}

.leftmenu .ivu-menu-submenu {
  text-align: left;
}

.ivu-tabs {
  margin-top: 20px;
}
.headermenu .layout-logo {
  width: 100px;
  height: 30px;
  /*background: #5b6270;*/
  background: no-repeat center/40% url('../assets/logo.svg');
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}

.headermenu .layout-nav {
  margin: 0 auto;
  margin-right: 20px;
  float: right;
}

.welcome {
  font-size: 2rem;
  font-weight: bold;
  height:500px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

body {
  font-size: 1.1em;
}
ul.ivu-menu {
  margin-right: 20px;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
