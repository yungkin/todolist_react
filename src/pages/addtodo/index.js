import React from 'react'
import './index.css'
import { Form, Input, Button, Checkbox, Affix, message, Upload,Icon} from 'antd';
import reqwest from '../../utils/fetch'
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10, offset: 6 },
};

class AddToDOForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
      checkImportant: false,
    };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.goback = this.goback.bind(this);
   
      this.handleReset = this.handleReset.bind(this);
      this.formatTime = this.formatTime.bind(this);
  }
  componentDidMount() {
  
   
  };

  formatTime = () => {
    let myDate = new Date()
   
    let year = myDate.getFullYear()
    let month = myDate.getMonth() + 1
    let day = myDate.getDate()
    let hour = myDate.getHours()
    let min = myDate.getMinutes()
    let second = myDate.getSeconds()
    month = month < 10 ? ('0' + month) : month
    day = day < 10 ? ('0' + day) : day

    hour = hour < 10 ? ('0' + hour) : hour
    min = min < 10 ? ('0' + min) : min
    second = second < 10 ? ('0' + second) : second
  
    let time = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + second
    return time
  };
  goback = () => {
    window.history.back(); // 返回
  };
  handleChange = e => {
    // console.log(e.target)
    this.setState(
      { 
        checkImportant: e.target.checked,
      },
      // () => {
      //   this.props.form.validateFields(['nickname'], { force: true });
      // },
    );
  };
  normFile = (info)=> {
    console.log('Upload event:', info);
    // const { status } = info.file;
    // if (status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    // if (status === 'done') {
    //   message.success(`${info.file.name} file uploaded successfully.`);
    // } else if (status === 'error') {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  
    // if (Array.isArray(e)) {
    //   return e;
    // }
    // return e && e.fileList;
  };
  handleReset = () => {
    this.props.form.resetFields();
  };

  handleSubmit = e => {
    let timer = null
    // let storage = window.localStorage;
    // let arr = []
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log('error ', err);
      }else {
        timer = this.formatTime()
        let formData = {
              title:  values.title,
              content: values.content,
              checkImportant: this.state.checkImportant,
              time: timer,
              checked: false
            }
            const hide = message.loading("Loading", 0)    
            reqwest({
              url: '/addlist',
              method: 'POST',
              data: formData
              
            }).then(() => {
         
              message.success('Add Success!',() =>{
                  // Dismiss manually and asynchronously
                  setTimeout(hide, 1000);
                  this.props.history.push("/home")
                  
              })
        });
        // if(storage){
        //   let oldData = JSON.parse(storage.getItem('storageData'))
        //   let formData = {
        //     id: Math.floor(Math.random()*10000 +1),
        //     title:  values.title,
        //     content: values.content,
        //     checkImportant: this.state.checkImportant,
        //     time: timer,
        //     checked: false
        //   }
        //     if(oldData){
        //       arr.push(...oldData)
        //     }
        //     arr.push(formData)
        //     // console.log(arr)
        //     storage.setItem('storageData',JSON.stringify(arr))
        //     const hide = message.loading("Loading", 0)
        //     message.success('Add Success!',() =>{
        //         // Dismiss manually and asynchronously
        //         this.props.history.push("/home")
        //         setTimeout(hide, 1500);
        //     })
        // }
      }
    });
    e.preventDefault();
  };
 
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="form-container" ref={node => {
        this.container = node;
      }}>
        <Affix className="goback"  target={() => this.container} >
          <Button type="primary" icon="left" onClick={this.goback}>返回</Button>
        </Affix>
       <header>
          <h1>ADD TO-DO List</h1>
          <p>Do Not Forget</p>
        </header>
        <Form layout="vertical" className="form-content" onSubmit={this.handleSubmit} >
          <Form.Item {...formItemLayout} label="标题">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Please input your title',
                },
              ],
            })(<Input  placeholder="Please input your title" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="内容">
            {getFieldDecorator('content', {
              rules: [
                {
                  required: true,
                  message: 'Please input your plan',
                },
              ],
            })(<TextArea rows={6} placeholder="Please input your plan" 
                autoSize={{ minRows: 6, maxRows: 15 }}
            />)}
          </Form.Item>
         
          <Form.Item label="上传图片：">
          {getFieldDecorator('dragger', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload.Dragger name="files" action="/upload.do">
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload.</p>
            </Upload.Dragger>,
          )}
        </Form.Item>
          <Form.Item {...formTailLayout}>
            <Checkbox checked={this.state.checkImportant} onChange={this.handleChange}>
              设置为重要事项？
            </Checkbox>
          </Form.Item>
          <Form.Item {...formTailLayout}>
            <Button onClick={this.handleReset}>
              清空
            </Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }} >
              完成
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const AddToDO = Form.create({ name: 'dynamic_rule' })(AddToDOForm);


  export default AddToDO;