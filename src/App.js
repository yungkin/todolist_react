import React from 'react';
import './App.css';

import {BrowserRouter, Switch,  Route, Redirect} from 'react-router-dom';
import mongoose from 'mongoose'
//导入页面子组件
import DashBoard from './pages/Dashboard'
import ToDoList from './pages/todoList';
import AddToDO from './pages/addtodo';
import ImportantList from './pages/todoInfo';

function App() {
  //使用nodejs的mongoose库方法连接MongoDB数据库
  // mongoose.connect('mongodb://127.0.0.1:27017/todo')
  return (
    <BrowserRouter>
      <Switch>
          <Route path="/home" exact component={DashBoard} />
          <Route path="/todoList" exact component={ToDoList} />
          <Route path="/importantList" exact component={ImportantList} />
          <Route path="/addToDo" component={AddToDO} />
          <Redirect from="/" to="/home" />
      </Switch>
  </BrowserRouter>
  );
}

export default App;
