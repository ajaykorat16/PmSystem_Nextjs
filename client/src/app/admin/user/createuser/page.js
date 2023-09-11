"use client"
import React, { useEffect } from 'react'
import { CForm, CCol, CFormInput, CFormSelect, CButton, CFormTextarea } from '@coreui/react';
import { useState } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useDepartment } from '@/lib/context/DepartmentContext';
import toast from "react-hot-toast"
import { Calendar } from 'primereact/calendar';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/lib/context/AuthContext";

const UserCreate = () => {
    const [employeeNumber, setEmployeeNumber] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [departments, setDepartments] = useState("");
    const [departmentsList, setDepartmentsList] = useState([]);
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [dateOfJoining, setDateOfJoining] = useState("");
    const { createUser } = useUser()
    const { getDepartmentList } = useDepartment()
    const router = useRouter()
    const { auth } = useAuth()
    // console.log(auth);

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (password !== confirmPassword) {
                toast.error("Password and Confirm Password must be same");
            } else {
                let addUser = { employeeNumber, firstname, lastname, email, password, phone, address, dateOfBirth, department: departments, dateOfJoining }
                const data = await createUser(addUser)
                if (data.error) {
                    toast.error(data.message)
                } else {
                    router.push('/admin/user/list')
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const fetchDepartment = async () => {
        if (auth?.user !== null) {
            const { departments } = await getDepartmentList()
            setDepartmentsList(departments)
        }
    }
    // console.log(departmentsList);
    useEffect(() => {
        fetchDepartment()
    }, [auth])

    return (
        <div>
            <div className="mb-3">
                <h2 className='mb-5 mt-2'>Create User</h2>
            </div>
            <CForm className="row g-3" onSubmit={handleSubmit}>
                <CCol md={6}>
                    <CFormInput id="inputEmployeeNo" label="Employee Number" value={employeeNumber} onChange={(e) => setEmployeeNumber(e.target.value)} />
                </CCol>
                <CCol md={6}>
                    <CFormInput type="email" id="inputEmail4" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </CCol>
                <CCol md={6}>
                    <CFormInput id="inputFirstName" label="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                </CCol>
                <CCol md={6}>
                    <CFormInput id="inputLastName" label="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                </CCol>
                <CCol md={6}>
                    <CFormInput type="password" id="inputPassword4" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </CCol>
                <CCol md={6}>
                    <CFormInput type="password" id="inputConfirmPassword" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </CCol>
                <CCol md={6}>
                    <CFormInput type="number" id="inputPhone" label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </CCol>
                <CCol xs={6}>
                    <CFormTextarea type="area" id="inputAddress" label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </CCol>
                <CCol md={4}>
                    <CFormSelect id="inputDepartment" label="Department" value={departments} onChange={(e) => setDepartments(e.target.value)}>
                        <option value="" disabled>Select a department</option>
                        {departmentsList.map((d) => (
                            <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol xs={4}>
                    <label className="form-label">Date Of Joining</label>
                    <Calendar
                        value={dateOfJoining}
                        dateFormat="dd-mm-yy"
                        onChange={(e) => setDateOfJoining(e.target.value)}
                        showIcon
                        id="date"
                        className="form-control"
                    />
                </CCol>
                <CCol xs={4}>
                    <label className="form-label">Date Of Birth</label>
                    <Calendar
                        value={dateOfBirth}
                        dateFormat="dd-mm-yy"
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        maxDate={new Date()}
                        showIcon
                        id="date"
                        className="form-control"
                    />
                </CCol>
                <CCol xs={12}>
                    <CButton type="submit" className="me-md-2">Submit</CButton>
                </CCol>
            </CForm>
        </div>

    )
}

export default UserCreate
