import React from 'react';
import './todoList.css';
import InfiniteScroll from 'react-infinite-scroller';
import { List, message, Modal, Spin, Button} from 'antd';
import { Link } from "react-router-dom";
import reqwest from '../../utils/fetch'

class ToDoList extends React.Component {
  
   constructor(props) {
     super(props);
     this.state = {
      data: [],
      loading: false,
      hasMore: true,
      visible: false,
      id:0,
      title: '',
      content: '',
      timer: null,
      checkImportant: false,
      checked: false
      
    };
    this.handleChange = this.handleChange.bind(this);
   };
  
    componentDidMount() {
      this.fetchData(res =>{
        if(res && res.code === 100){
          this.setState({
            data: res.data.list
          })
        }
      })
     
      // let storage = window.localStorage
      // let oldData = JSON.parse(storage.getItem('storageData'))
        
        // if(oldData) {
        //   this.setState({
        //       data: oldData,
        //     });
        // }
       
      };
      
      fetchData = callback => {
        reqwest({
          url: '/todolist',
          method: 'GET'
        }).then(res => {
          callback(res)
        });
      };
    
      handleInfiniteOnLoad = () => {
        let { data } = this.state;
        this.setState({
          loading: true,
        });
        if (data.length > 14) {
          message.warning('Infinite List loaded all');
          this.setState({
            hasMore: false,
            loading: false,
          });
          return;
        }
        this.fetchData(res => {
          data = data.concat(res.list);
          this.setState({
            data,
            loading: false,
          });
        });
      };
      showModal = (id) => {
        let formData = this.state.data;
        let editData = {
            title: '',
            content: '',
            checkImportant:false,
            time:null,
            checked:false

        }
        formData.map( item => {
          if(item.id == id){
              editData.title = item.title
              editData.content = item.content
              editData.checkImportant = item.checkImportant
              editData.time = item.time
              editData.checked = item.checked
          }
          
        })
        this.setState({
          visible: true,
          title: editData.title,
          content: editData.content,
          id: id,
          timer:editData.time,
          checkImportant: editData.checkImportant,
          checked: editData.checked
        });
      };
      handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        // console.log(value)
        this.setState({
          [name]: value
        });
      };
      handleSubmit = (e) => {
        // let arr = []
        // let oldData = JSON.parse( window.localStorage.getItem('storageData'))
        let formData = {
          // id: this.state.id,
          title:  this.state.title,
          content: this.state.content,
          checkImportant: this.state.checkImportant,
          time: this.state.timer,
          checked:this.state.checked
          
        }
        reqwest({
          url: `/editlist/${this.state.id}`,
          method: 'POST',
          data: formData
          
        }).then(() => {
          this.setState({
            visible: false
          })
        });
          // this.setState({
          //   visible: false
          // })
          // if(oldData){
          //   arr.push(...oldData)
          // }
          // arr.push(formData)
          // window.localStorage.setItem('storageData',JSON.stringify(arr))
          e.preventDefault();
      };
      handleCancel = e => {
        this.setState({
          visible: false,
        });
      };
     
      deleteData=(index,lid)=>{
        // console.log(index)
        // let formList  = this.state.data
        // formList.splice(index,1)
        // this.setState({
        //   data: formList
        // })
        
        // window.localStorage.setItem('storageData',JSON.stringify(formList));
        reqwest({
          url: '/deletelist',
          method: 'POST',
          data: {id:lid}
          
        }).then(() => {
          this.fetchData(res =>{
            if(res && res.code === 100){
              this.setState({
                data: res.data.list
              })
            }
          })
        });

      };
      render() {
        const { visible} = this.state;
      
        return (
         
          <div className="demo-infinite-container">
            <div className="addBtn">
              <Link to='/addToDo'>
                  <Button type="primary" icon="diff">
                    Add
                  </Button>
              </Link>
              
            </div>
            <hr />
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.loading && this.state.hasMore}
              useWindow={false}
            >
              <List
                dataSource={this.state.data}
                renderItem={(item,index)=> {
                  if(item.checked == false) {
                    return (
                      <List.Item key={item.id}
                      actions={[<a key="list-loadmore-edit" 
                      onClick={this.showModal.bind(this,item.id)}>Edit</a>, 
                      <a key="list-loadmore-delete" 
                      onClick={this.deleteData.bind(this,index,item.id)}>Delete</a>]}>
                        <List.Item.Meta
                          title={item.title}
                          description={item.time}
                        />
                        
                            <div >{item.content}</div>
                       
                        <Modal
                          visible={visible}
                          centered = {true}
                          footer = {null}
                          width={680}
                          onCancel={this.handleCancel}
                        >
                            <div className="container">
                              <form onSubmit={this.handleSubmit} className="content">
                                <label>标题：
                                  <input value={this.state.title} name="title" onChange={this.handleChange}/>
                                  </label>
                                <div className="center"> 
                                  <span>  内容:</span>
                                <textarea value={this.state.content} name="content" onChange={this.handleChange} rows='8' cols='46'/>
                                
                                </div>
                                {/* <Checkbox checked={this.state.checked} onChange={this.handleChange}>
                                  设置为已完成事项？
                                </Checkbox> */}
                                <div className="checked">
                                <input name="checked" type="checkbox" checked={this.state.checked} onChange={this.handleChange} />
                                  设置为已完成事项？
                                </div> 
                                <Button type="primary" htmlType="submit" style={{ marginTop: 30 }} >
                                  完成
                                </Button>
                            </form>
                            </div>
                        </Modal>
                      </List.Item>
                    )
                  }else
                  {
                    return <span></span>
                  }
                }}
              >
                {this.state.loading && this.state.hasMore && (
                  <div className="demo-loading-container">
                    <Spin />
                  </div>
                )}
              </List>
            </InfiniteScroll>
          </div>
        );
      }
} 

export default ToDoList;
