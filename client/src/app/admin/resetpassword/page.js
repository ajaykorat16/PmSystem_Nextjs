'use client'
import React, { useState } from 'react'
import {
    CButton,
    CCol,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import toast from "react-hot-toast"
import { useRouter } from "next/navigation";
import { useUser } from '@/lib/context/UserContext'
import AdminRoutes from '@/lib/components/Routes/AdminRoutes'

const Login = ({ title }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword } = useUser()
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (password !== confirmPassword) {
                toast.error("Password and Confirm Password must be same");
            } else {
                const data = await resetPassword(password)
                if (data.error) {
                    toast.error(data.message)
                } else {
                    router.push("/")
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <AdminRoutes>
                <CForm onSubmit={handleSubmit}>
                    <h1 className="mb-4">Reset Password</h1>
                    <CCol md={4}>
                        <CInputGroup className="mb-4">
                            <CInputGroupText>
                                <CIcon icon={cilLockLocked} />
                            </CInputGroupText>
                            <CFormInput
                                type="password"
                                placeholder="New Password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </CInputGroup>
                    </CCol>
                    <CCol md={4}>
                        <CInputGroup className="mb-4">
                            <CInputGroupText>
                                <CIcon icon={cilLockLocked} />
                            </CInputGroupText>
                            <CFormInput
                                type="password"
                                placeholder="Confirm Password"
                                autoComplete="current-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </CInputGroup>
                    </CCol>
                    <CRow>
                        <CCol xs={6}>
                            <CButton color="primary" className="px-4" type='submit'>
                                Reset
                            </CButton>
                        </CCol>
                    </CRow>
                </CForm>
            </AdminRoutes>
        </>
    )
}

export default Login
