import { useContext, createContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const LeaveContext = createContext();

const LeaveProvider = ({ children }) => {
  const { auth } = useAuth();
  const headers = {
    Authorization: auth?.token,
  };

  //get leave
  const getLeave = async (page, limit, query, sortField, sortOrder) => {
    try {
      let res;
      if (query) {
        res = await axios.post(`http://localhost:8080/leaves/leavelist-search?page=${page}&limit=${limit}`, { filter: query }, { headers });
      } else {
        res = await axios.get(`http://localhost:8080/leaves/leavelist`, { params: { page, limit, sortField, sortOrder } }, { headers });
      }
      if (res.data.error === false) {
        return res.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //add leave
  const addLeave = async (leaveData) => {
    try {
      const { data } = await axios.post(`http://localhost:8080/leaves/createLeaveAdmin`, leaveData, { headers });

      if (data.error === false) {
        getLeave();
        setTimeout(function () {
          toast.success(data.message);
        }, 1000);
      }
      return data;
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors;
        if (errors && Array.isArray(errors) && errors.length > 0) {
          toast.error("Please fill all fields");
        } else {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        }
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  //delete leave
  const deleteLeave = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:8080/leaves/deleteLeave/${id}`, { headers });
      if (data.error === false) {
        getLeave();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //update leave
  const updateLeave = async (leaveData, id) => {
    try {
      const { data } = await axios.put(`http://localhost:8080/leaves/updateLeave/${id}`, leaveData, { headers });

      if (data.error === false) {
        getLeave();
        setTimeout(function () {
          toast.success(data.message);
        }, 1000);
      }
      return data
    } catch (error) {
      console.log(error);
    }
  };

  //update status
  const updateStatus = async (status, id, reasonForLeaveReject) => {
    try {
      const { data } = await axios.put(`http://localhost:8080/leaves/updateStatus/${id}`, { status, reasonForLeaveReject }, { headers })
      if (data.error === false) {
        getLeave()
      }
    } catch (error) {
      console.log(error);
    }
  }

  //get single leave
  const getLeaveById = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:8080/leaves/getLeaveById/${id}`, { headers });
      return data.leaves;
    } catch (error) {
      console.log(error);
    }
  };

  //get user leave
  const getUserLeave = async (page, limit, query, sortField, sortOrder) => {
    try {
      let res;
      if (query) {
        res = await axios.post(`http://localhost:8080/leaves/userLeaves-search?page=${page}&limit=${limit}`, { filter: query }, { headers });
      } else {
        res = await axios.get(`http://localhost:8080/leaves/userLeaves`, { params: { page, limit, sortField, sortOrder } }, { headers });
      }
      if (res.data.error === false) {
        return res.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  //add user leave
  const addUserLeave = async (leaveData) => {
    try {
      const { reason, startDate, endDate, type, status, totalDays } = leaveData;

      const { data } = await axios.post(`http://localhost:8080/leaves/createLeave`, { reason, startDate, endDate, type, status, totalDays }, { headers });
      if (data.error === false) {
        getUserLeave();
        setTimeout(function () {
          toast.success(data.message);
        }, 1000);
      }
      return data;
    } catch (error) {
      if (error.response) {
        const errors = error.response.data.errors;
        if (errors && Array.isArray(errors) && errors.length > 0) {
          toast.error("Please fill all fields");
        } else {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        }
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <LeaveContext.Provider value={{ getLeave, addLeave, deleteLeave, updateLeave, getLeaveById, addUserLeave, getUserLeave, updateStatus, }}>
      {children}
    </LeaveContext.Provider>
  );
};

//custom hook
const useLeave = () => useContext(LeaveContext);

export { useLeave, LeaveProvider };
