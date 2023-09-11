"use client"
import { Provider } from "react-redux"
import store from "./store"
import { AuthProvider } from "@/lib/context/AuthContext"
import { UserProvider } from "@/lib/context/UserContext"
import { LeaveProvider } from "@/lib/context/LeaveContext"
import { WorklogProvider } from "@/lib/context/WorklogContext"
import { ProjectProvider } from "@/lib/context/ProjectContext"
import { DepartmentProvider } from "@/lib/context/DepartmentContext"
import { LeaveManagementProvider } from "@/lib/context/LeaveManagementContext"

const ReduxProvider = ({ children }) => {
  return (
    <AuthProvider>
      <DepartmentProvider>
        <UserProvider>
          <ProjectProvider>
            <WorklogProvider>
              <LeaveProvider>
                <LeaveManagementProvider>
                  <Provider store={store}>
                    {children}
                  </Provider>
                </LeaveManagementProvider>
              </LeaveProvider>
            </WorklogProvider>
          </ProjectProvider>
        </UserProvider>
      </DepartmentProvider>
    </AuthProvider>
  )
}

export default ReduxProvider
