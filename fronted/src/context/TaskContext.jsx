import { createContext, useState, useContext } from "react";
import {
  getAllTaskRequest,
  deleteTaskRequest,
  createTaskRequest,
  getTaskRequest,
  updateTaskRequest,
} from "../api/tasks.api";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks debe estar dentro del proveedor TaskProvider");
  }

  return context;
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState([]);

  const loadTasks = async () => {
    const res = await getAllTaskRequest();
    setTasks(res.data);
  };

  const loadTask = async (id) => {
    const res = await getTaskRequest(id);
    return res.data;
  };

  const deleteTasks = async (id) => {
    const res = await deleteTaskRequest(id);
    if (res.status === 204) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const createTask = async (task) => {
    try {
      const res = await createTaskRequest(task);
      setTasks([...tasks, res.data]);
      return res.data;
    } catch (error) {
      if (error.response) {
        setErrors([error.response.data.messsage]);
      }
    }
  };

  const updateTask = async (id, task) => {
    try {
      const res = await updateTaskRequest(id, task);
      return res.data;
    } catch (error) {
      if (error.response) {
        setErrors([error.response.data.messsage]);
      }
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loadTasks,
        loadTask,
        deleteTasks,
        createTask,
        errors,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export default TaskProvider;
