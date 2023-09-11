import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDescription,
  cilNotes,
  cilSpreadsheet,
  cilUser,
  cilCalendarCheck
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [

  {
    component: CNavGroup,
    name: 'User',
    to: '/user',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'User List',
        to: '/admin/user/list',
      },
      {
        component: CNavItem,
        name: 'Birthday on this Month',
        to: '/admin/user/employeebirthdate',
      },
      {
        component: CNavItem,
        name: 'Create User',
        to: '/admin/user/createuser',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Leaves',
    to: '/leave',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Leaves List',
        to: '/admin/leave/list',
      },
      {
        component: CNavItem,
        name: 'Create Leave',
        to: '/admin/leave/createleave',
      },
      {
        component: CNavItem,
        name: 'Manage Leave',
        to: '/admin/leave/manageleave',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Department',
    to: '/department',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Department List',
        to: '/admin/department/list',
      },
      {
        component: CNavItem,
        name: 'Create Department',
        to: '/admin/department/createdepartment',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Project',
    to: '/project',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Project List',
        to: '/admin/project/list',
      },
      {
        component: CNavItem,
        name: 'Create Project',
        to: '/admin/project/createproject',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Work Log',
    to: '/workLog',
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Work Log List',
        to: '/admin/worklog/list',
      }
    ],
  },
]

export default _nav
