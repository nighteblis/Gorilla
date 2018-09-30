<template>
    <div>
    
        <br/>
        <noticeinformation ref="noticeinformation"></noticeinformation>
        <br/>
        
        <Table border :columns="services" :data="servicesdata"></Table>

    
                
    </div>
</template>
<script>
    export default {
    
        name: 'servicemgmt',
        description:'',
    
        data() {
    
            return {

    
                msg: 'service mgmt',
    
    
                servicesdata: [],
    
                services: [

                      {
    
                        title: '名称',
    
                        key: 'name'
    
                    },

                                        {
    
                        title: 'ID',
                        key: 'id',

                        width:290
    
                    },
    {
                        title: '服务器',
    
                        key: 'host',
    
                        width: 200,
    
    
                    },
    

    
                    {
    
                        title: '链接超时',
    
                        key: 'connect_timeout',
    
    
                        width: 100
    
                    },
    

    
                    {
    
                        title: '协议',
    
                        key: 'protocol',
    
                        width: 90
    
                    },
    

    
                    {
    
                        title: '读取超时',
    
                        key: 'read_timeout',
    
                        width: 90
    
                    },
    
                    {
    
                        title: '端口',
    
                        key: 'port',
    
                        width: 100
    
    
    
                    },
    
                    {
    
                        title: '路径',
    
                        key: 'path',
    
                        width: 100
    
                    }, {
    
                        title: '更新时间',
    
                        key: 'updated_at',
    
                        width: 100
    
                    },                    {
    
                        title: '创建时间 ',
    
                        key: 'created_at',
    
    
                        width: 100
    
                    },
    
                    {
    
                        title: '重试',
    
                        key: 'retries',
                         width: 90   
    
                    },
    
                    {
    
                        title: '写超时',
    
                        key: 'write_timeout',
    
                        width: 90
                    },
    
                    {
    
                        title: '操作',
    
                        key: 'action',
    
                        width: 150,
    
                        align: 'center',
    
                        fixed: 'right',
    
                        render: (h, params) => {
    
                            return h('div', [
    
                                h('Button', {
    
                                    props: {
    
                                        type: 'primary',
    
                                        size: 'small'
    
                                    },
    
                                    style: {
    
                                        marginRight: '5px'
    
                                    },
    
                                    on: {
    
                                        click: () => {
    
                                            this.initjob(params)
    
                                        }
    
                                    }
    
                                }, '  '),
    
                                h('Button', {
    
                                    props: {
    
                                        type: 'primary',
    
                                        size: 'small'
    
                                    },
    
                                    style: {
    
                                        marginRight: '5px'
    
                                    },
    
                                    on: {
    
                                        click: () => {
    
                                            this.failjob(params)
    
                                        }
    
                                    }
    
                                }, '  ')
    
                            ]);
    
                        }
    
                    }
    
    
    
    
    
                ]
    
            }
    
        },
            created: function () {
       
       console.log("dashboard created")

       this.axios.get("http://172.16.2.39:50001/services/")
    
                    .then(response => {
                        if(response.status = "200")
                        {

                            console.log(response)                            
                            this.servicesdata =response.data.data


                        }
                        else{
                            this.$refs.noticeinformation.showalert('error', 'kong 有异常请尽快修复')
                        }
                    })
    
                    .catch(e => {

                        console.log(e)

                    })

        
          },
    
        methods: {
    
            changeDatetoString(date) {    
                return new Date(date)
            }
    
    
    
    
    
        }
    
    }
</script>
<style scoped>
    code {}
</style>
