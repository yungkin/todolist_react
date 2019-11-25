const commonUrl = 'http://127.0.0.1:3100'
// localStorage.setItem("access_token","test")

function parseJSON(resp,req){
  return resp.json()
}
//格式化url查询参数为json
function formatUrl(url){ 
  var reg=/(?:[?&]+)([^&]+)=([^&]+)/g; 
  var data={}; 
  function fn(str,pro,value){ 
      data[decodeURIComponent(pro)]=decodeURIComponent(value); 
  } 
  url.replace(reg,fn); 
  // console.log(data)
  return data; 
} 

function checkStatus(response){
  if(response.status >= 200 && response.status < 500){
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}
  
  /**
   * 登录请求
   * 
   * @param data 数据
   */
  export function loginReq(data){ 
    const options = {}
    options.method = 'post'
    options.made = 'cors'
    options.body = JSON.stringify(data)
    options.headers={
      'Content-Type':'application/json'
    }
    return fetch('/loginOk',options,{credentials:'include'})
      .then(checkStatus)
      .then(parseJSON)
      .then((res)=>{
        if(res.retCode === '0001'){
          localStorage.setItem('x-access-token',res.retBody.AccessToken)
          return 'success'
        }
        else if(res.retCode === '0002'){
          return 'error'
        }
        else if(res.retCode === '0003'){
          return 'error'
        }else{
          return ;
        }
        
      })
      .catch(err=>({err}))
  }
  
  /**
   * 普通请求
   * @param {*url,*method,*data} options 
   */
 
export default function reqwest(options = {}){
  // const Authorization = localStorage.getItem('access_token')
  const {data,url} = options
  options = {...options}
  options.mode = 'cors'
  delete options.url
 
  // let methods = options.method.toLowerCase() 
  // options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE'
  if(options.method ) {
      // 对非get类请求头和请求体做处理
      if (data) {
        delete options.data
       
        options.body = JSON.stringify({
          data
        })
        // options.headers={
         
        //   // 'Authorization':Authorization,
        //   'Accept': 'application/json, text/plain, */*',
        //   'Content-Type': 'application/x-www-form-urlencoded'
        //   'Content-Type':'application/json;charset=UTF-8' 
        // }
      
      }
  }
  // else if(options.method === 'GET'){
  //   console.log('get',url)
  //   // 格式化get请求的数据(fetch的get请求需要需要将参数拼接到url后面)
  //   if(param){
  //     delete options.param
  //       // let mydata = formatUrl(param)
  //       // options.headers={
  //       //   'Accept': 'application/json, text/plain, */*',
  //       //   'Content-Type':'application/json;charset=UTF-8' 
  //       // }
  //   }
    
    
  // }
 
  return fetch(commonUrl + url,options,{credentials: 'include'})
    .then(checkStatus)
    .then(parseJSON)
    .catch(err=>({err}))
}

// import React from 'react'
// import request from './helper.js'
// class RequestDemo extends React.Component{
//   componentDidMount(){
//     request({
//       url:'/posttest',
//       method:'post',
//       data:{"Header":{"AccessToken":"eyJ0eXBlIjoiSldUIiwiYWxnIjoiSFM1MTIifQ.eyJzdWIiOiIxMDYiLCJleHBpciI6MTUxMDczODAzNjA5MiwiaXNzIjoiIn0.eo000vRNb_zQOibg_ndhlWbi27hPt3KaDwVk7lQiS5NJ4GS4esaaXxfoCbRc7-hjlyQ8tY_NZ24BTVLwUEoXlA"},"Body":{}}
//     }).then(function(res){
//       console.log(res)
//     })
//   }
//   render(){
//     return (
//       <div>
//     test
//       </div>
//     )
//   }
// }
// export default RequestDemo