import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from "react-router-dom";
import ToDoList from './todoList/index';
import ImportantList from './todoInfo/index'


const { Header, Sider, Content } = Layout;
class SiderNav extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: null,
        collapsed: false,
        itemKey: 1,

      };
      this.toggle = this.toggle.bind(this);
      this.onCollapse = this.onCollapse.bind(this);

      this.hasSelected = this.hasSelected.bind(this);

    }
   
    toggle = () => {
      this.setState({
        collapsed: !this.state.collapsed,
      });
    };
  
  
    onCollapse = collapsed => {
      console.log(collapsed);
      this.setState({ collapsed });
    };
    
    hasSelected = (item) => {
      let mykey = parseInt(item.key)
    
        this.setState({
          itemKey: mykey
        })
  };
    render() {
      let navkey = this.state.itemKey
     
      return (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          {/* <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}> */}
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={this.hasSelected.bind(this)}>
              <Menu.Item key="1">
                    <Icon type="user" />
                    <span>首页</span>
              </Menu.Item>
              
              <Menu.Item key="2">
                    <Icon type="desktop" />
                    <span>已完成事项</span>
              </Menu.Item>
             
            </Menu>
          </Sider>
          <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            </Header>
            <Content style={{  margin: '24px 16px' }}>
              
              <div 
                  style={{ padding: 24, background: '#fff', minHeight: 360 }} 
              >
                {navkey == 1?(<ToDoList/>) : (<ImportantList />)}
                 
              </div>
            </Content>
          
          </Layout>
  
        </Layout>
      );
    }
  }

  export default SiderNav;