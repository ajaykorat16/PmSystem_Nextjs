'use client'
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../Spinner";

const AdminRoutes = ({children}) => {
  const [ok, setOk] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await localStorage.getItem('auth')
      const data = JSON.parse(res)
      if (data.user.role == 'admin') {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? children : <Spinner />;
};

export default AdminRoutes;
