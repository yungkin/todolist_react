import React from 'react';
import './todoInfo.css';
import InfiniteScroll from 'react-infinite-scroller';
import { List, message, Modal, Spin, Button,   } from 'antd';



class importantList extends React.Component {
  
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
      checkImportant: false
      
    };
    this.handleChange = this.handleChange.bind(this);
   };
  
    componentDidMount() {
      let storage = window.localStorage
      let oldData = JSON.parse(storage.getItem('storageData'))
        if(oldData) {
          this.setState({
              data: oldData,
            });
        }
       
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
          data = data.concat(res.results);
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
            time:null

        }
        formData.map( item => {
          if(item.id == id){
              editData.title = item.title
              editData.content = item.content
              editData.checkImportant = item.checkImportant
              editData.time = item.time
          }
          
        })
        this.setState({
          visible: true,
          title: editData.title,
          content: editData.content,
          id: id,
          timer:editData.time,
          checkImportant: editData.checkImportant
        });
      };
      handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      };
      handleSubmit = (e) => {
        
        let arr = []
        let formData = {
          id: this.state.id,
          title:  this.state.title,
          content: this.state.content,
          checkImportant: this.state.checkImportant,
          time: this.state.timer
          
        }
          // console.log(formData)
          arr.push(formData)
          window.localStorage.setItem('storageData',JSON.stringify(arr))
          this.setState({
            visible: false,
            data: formData
          })

          e.preventDefault();
      };
      handleCancel = e => {
        this.setState({
          visible: false,
        });
      };
     
    deleteData=(index)=>{
      // console.log(index)
      let formList  = this.state.data
      formList.splice(index,1)
      this.setState({
        data: formList
      })
      
      window.localStorage.setItem('storageData',JSON.stringify(formList));

  };
      render() {
        const { visible} = this.state;
      
        return (
         
          <div className="demo-infinite-container">
            
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
                  if(item.checked){
                    return (<List.Item key={item.id}
                    actions={[<a key="list-loadmore-edit" onClick={this.showModal.bind(this,item.id)}>Edit</a>, 
                    <a key="list-loadmore-delete" onClick={this.deleteData.bind(this,index)}>Delete</a>]}>
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
                              
                              <Button type="primary" htmlType="submit" style={{ marginTop: 30 }} >
                                完成
                              </Button>
                          </form>
                          </div>
                      </Modal>
                    </List.Item>)
                  } else
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

export default importantList;
