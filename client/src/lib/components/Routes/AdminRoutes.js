'use client'
import React, { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { useAuth } from "@/lib/context/AuthContext";

const AdminRoutes = ({ children }) => {
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
