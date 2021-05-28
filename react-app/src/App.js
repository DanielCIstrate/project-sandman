/* eslint-disable no-unused-vars */
import './App.css';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css'

import React, {useState, useEffect} from 'react';
import {  
  BrowserRouter as Router,
  Route,
  Switch  
} from "react-router-dom";

import ProfilePage from "./ProfilePage";

const MenuItems = [
  {
    title: 'Home',
    url: '#',
    cName: 'nav-links'
  }
]

var taskData = [
  {
      "id": 6,
      "name": "Yet Another Task (YAT)",
      "importance": 3,
      "category": "General",
      "done": false
  },
  {
      "id": 7,
      "name": "React scheme",
      "importance": 3,
      "category": "General",
      "done": false
  },
  {
      "id": 8,
      "name": "Get some sleep",
      "importance": 3,
      "category": "General",
      "done": false
  },
  {
      "id": 1045836344,
      "name": "Nou",
      "done": true
  }
];
const userId = 1;
const userName = "Developer";



function App() {

  const[taskName, setTaskName] = useState('');
  const[taskList, setTaskList] = useState(taskData);
  const[canGetTaskList, setCanGetTaskList] = useState(true);

  useEffect(() => {
    if (canGetTaskList) {fetch('http://localhost:8080/api/tasks?user=3',{
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
            'Accept': '*/*'
        }
    }).then(response => response.json())
        .then(data => setTaskList(data))
        .then(err => err ? console.error("Logging an error: "+err) : null)
        .then(setCanGetTaskList(false));
  }    
    return () => {
      // setCanDoFetch(false);
    }
  })

    
  function createNewTask(someName) {
    let nameString;
    if (!(typeof someName === 'string')) {
      nameString = '';
    } else {
      nameString = someName.slice();
    }

    return {
      "name": nameString,
      "importance": 3,
      "category": "General",
      "done": false
    }
  }

  function addTask() {
    let newList = [...taskList];
    newList.push(createNewTask(taskName));
    setTaskList(newList);
    setTaskName('');
  }

  function deleteTask(index) {
    if (taskList.length <= 1) {
      setTaskList([]);
    } else {
    var duplicateArray = [...taskList];
    duplicateArray.splice(index,1);
    setTaskList(duplicateArray);
  }
  }

  function updateTaskName(event) {
    setTaskName(event.target.value)
  }

  function handleCheckBoxClick(event) {
    let checkedState = event.target.checked;

    let idString = `${event.target.id}`.slice(6);
    let idAsInt = parseInt(idString);
    var newArray = [...taskList];
    newArray[idAsInt].done = checkedState;
    setTaskList(newArray);
    // console.log(newArray[idAsInt]);  // for debug purposes
  }
  
  function colorClassForCategory(someString) {
    if (!(typeof someString === 'string')) {
      return 'color-label-general'
    } else {  
      return `color-label-${someString.toLowerCase().split(' ').join('-').slice(0, Math.min(someString.length, 10))}`;
    }
  }


  async function doPost(url = '', data) { const response = await fetch(url,{
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    return response;
  }    
        
  function persistToServer() {
    doPost('http://localhost:8080/api/task', taskList)
        .then(responseData => console.log(responseData))
        .then(err => err ? console.error("Error while trying to save Tasks: "+err) : null)
        .then(setCanGetTaskList(true));
  }
  

  class LoginContainer extends React.Component {
    render() {
      return(
        <div className="login-container">
        You are logged in as <a className="user-name" href="/profile">
          {userName}
          </a>
      </div>
      )
    }
  }

  class TaskTable extends React.Component {
    
    render() {
      return(
        <table className="table table-success table-striped">
          <tbody>
            {taskList.map(
              (task, index) => (
                <tr key={index}>
                  <td>                      
                    <input type="checkbox" id={`check-${index}`} onChange={handleCheckBoxClick} checked={task.done}></input>
                  </td>
                  <td>{index+1}</td>
                  <td><div className={`category-text ${colorClassForCategory(task.category)}`}>{task.category}</div></td>
                  <td>{task.name}</td>
                  <td>{task.importance}</td>
                  <td><i className="far fa-trash-alt" onClick={() => deleteTask(index)}></i></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )
    }
  }

  class Navbar extends React.Component {
    render() { 
      return (
        <nav className="NavbarItems">
          <h1 className="nav-logo">Menu </h1>
          <ul>
            <li><a className={MenuItems.cName}></a></li>

          </ul>
        </nav>

      )
    }
  }


  return (    
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" >

            {/* === INDEX PAGE === */}
            <Navbar></Navbar>
            <LoginContainer></LoginContainer>
            <div className="row justify-content-center">
              <div className="col-md-5">
                
                <input type="text" placeholder="Enter task..." className="form-control" 
                value={taskName} onChange={updateTaskName}
                />
                <button className="btn btn-primary" onClick={addTask}>ADD</button>
                <button className="btn btn-primary btn-success" onClick={persistToServer}>Save to cloud</button>

                <TaskTable></TaskTable>
                
              </div>
            </div>
            {/* === END OF INDEX PAGE === */}

            </Route>

          <Route path="/profile"><ProfilePage /></Route>
        </Switch>
      </Router>
    </div>
  );


}

export default App;





