'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import SimpleBar from 'simplebar-react'
import adminNavigatiion from './AdminNav'
import userNavigation from './UserNav'
import 'simplebar/dist/simplebar.min.css'
import { Avatar } from 'primereact/avatar'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

const AppSidebar = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { auth } = useAuth()
  const [role, setRole] = useState("")

  useEffect(() => {
    if (auth?.user?.role) {
      setRole(auth?.user?.role)
    }
  }, [auth])

  const userRole = auth?.user?.role;

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <div onClick={() => router.push(userRole === "user" ? '/user/dashboard' : "/admin/dashboard")} className="d-none d-md-flex pmSystem">
          <Avatar
            image='/kr_logo.ico'
            shape="circle"
            className='logo p-1'
          />  PM SYSTEM
        </div>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar style={{ cursor: "pointer" }}>
          {role && role === "admin" && <AppSidebarNav items={adminNavigatiion} />}
          {role && role === "user" && <AppSidebarNav items={userNavigation} />}
          {role === "" && <AppSidebarNav items={userNavigation} />}
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

