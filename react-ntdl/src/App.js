import { useEffect, useState } from "react";
import "./App.css";
import { Form } from "./components/form/Form";
import { List } from "./components/List";
import { addTask, deleteTasks, fetchTasks, updateTask } from "./helpers/axiosHelper";

const ttlHrPerWek = 24 * 7;
function App() {
  const [tasks, setTasks] = useState([]);
  const [response, setResponse] = useState({});
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [allEntrySelected,setAllEntrySelected]= useState(false);
  const [allBadSelected,setAllBadSelected]= useState(false);

  const totalHrs = tasks.reduce((acc, item) => acc + item.hr, 0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await fetchTasks();
    console.log(res.data.data);
    setTasks(res.data.data);
  };

  const taskEntry = async (taskObj) => {
    if (totalHrs + taskObj.hr > ttlHrPerWek) {
      setResponse({
        status: "error",
        message: "Yo Boss, too many hours, can't fit the task.",
      });
      return;
    }
    // console.log(taskObj);
    // instead of adding in the array, add to the server
    // setTasks([...tasks, taskObj]);
    const { data } = await addTask(taskObj);

    if (data.status === "success") {
      getData();
    }

    setResponse(data);
  };

  //remove soon
  // const handleOnDelete = (_id) => {
  //   if (!window.confirm("Are you sure you want to delete?")) {
  //     return;
  //   }

  //   const filteredArg = tasks.filter((item) => item._id !== _id);
  //   setTasks(filteredArg);
  // };

  const handleOnManyDelete = async () => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }

    
    const { data } = await deleteTasks(idsToDelete);

    setResponse(data);

    data.status === "success" && getData();
    setIdsToDelete([]);
    // call axios helper to call delete api to delete item from database

    // const filteredArg = tasks.filter((item) => !idsToDelete.includes(item._id));
    // setTasks(filteredArg);

    // setIdsToDelete([]);
  };

  const taskSwitcher = async (_id, type) => {
    

  //   const updatedArg = tasks.map((item) => {
  //     if (_id === item._id) {
  //       item.type = type;
  //     }

  //     return item;
  //   });
  //   console.log(updatedArg);
  //   setTasks(updatedArg);
  // };
  //call axios to call put method with data
  const {data} = await updateTask({type,_id});
  
  setResponse(data);
  data.status==="success" && getData();
  //on successful update refetch all the tasks
  }
  const handleOnCheck = (e) => {
    const { checked, value } = e.target;

    if (checked) {
      const {type}=tasks.filter((item)=>item._id===value)[0];
      type==="entry" ? setAllEntrySelected(false):
      setAllBadSelected(false);
    }
      if(checked){
      setIdsToDelete([...idsToDelete, value]);
    } else {
      const tempArg = idsToDelete.filter((item) => item !== value);
      setIdsToDelete(tempArg);
    }
  };



  const handleOnSelectAll=(e)=>{
      const {checked,value}=e.target;
      console.log(checked,value)
      if(value==="entry"){
        checked ? setAllEntrySelected(true):setAllEntrySelected(false)
      }
      if(value==="bad"){
        checked ? setAllBadSelected(true):setAllBadSelected(false)
      }
      
      if(checked){
        //Select all
        const argToGetIds = tasks.filter((item)=>{
          return item.type===value
        });
        const ids = argToGetIds.map((item)=>item._id);
        
        setIdsToDelete(ids);
      }else{
        //unselect
        setIdsToDelete([]);
        //challenge: on unselect the ids that belons to the value ==entry//bad
      }
  }
  return (
    <div className="wrapper">
      <div className="container">
        {/* <!-- top title --> */}
        <div className="row">
          <div className="col text-center mt-5">
            <h1>Not To Do List</h1>
          </div>
        </div>

        {response.message && (
          <div
            className={
              response.status === "success"
                ? "alert alert-success"
                : "alert alert-danger"
            }
          >
            {response.message}
          </div>
        )}

        <Form taskEntry={taskEntry} />

        <List
          tasks={tasks}
          // handleOnDelete={handleOnDelete}
          taskSwitcher={taskSwitcher}
          handleOnCheck={handleOnCheck}
          handleOnSelectAll={handleOnSelectAll}
          idsToDelete={idsToDelete}

      
          
        />

        {idsToDelete.length > 0 && (
          <div className="d-grid py-4">
            <button
              className="btn btn-lg btn-danger"
              onClick={handleOnManyDelete}
            >
              Delete selected tasks
            </button>
          </div>
        )}

        {/* <!-- total hr area --> */}
        <div className="row fw-bold">
          <div className="col">The total hours allocated = {totalHrs} Hrs</div>
        </div>
      </div>
    </div>
  );
}

export default App;
