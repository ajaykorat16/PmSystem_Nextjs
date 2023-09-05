"use client"

import { Provider } from "react-redux"
import store from "./store"
import { AuthProvider } from "@/lib/context/AuthContext"
import { UserProvider } from "@/lib/context/UserContext"
import { LeaveProvider } from "@/lib/context/LeaveContext"


const ReduxProvider = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
      <LeaveProvider>
        <Provider store={store}>
          {children}
        </Provider>
        </LeaveProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default ReduxProvider
