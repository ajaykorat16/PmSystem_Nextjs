'use client'
import React, { useEffect } from 'react'
import { CForm, CCol, CFormInput, CFormSelect, CButton, CRow, CFormTextarea } from '@coreui/react';
import { MultiSelect } from 'primereact/multiselect';
import { useState } from 'react';
import { CImage } from '@coreui/react'
import { Calendar } from 'primereact/calendar';
import { useRouter } from "next/navigation";
import { useUser } from '@/lib/context/UserContext';
import { useDepartment } from '@/lib/context/DepartmentContext';
import { useProject } from '@/lib/context/ProjectContext';
import { useAuth } from '@/lib/context/AuthContext';
import AdminRoutes from '@/lib/components/Routes/AdminRoutes';
import Loader from '@/lib/components/Loader';
import toast from 'react-hot-toast';

function page({ params }) {
    const [employeeNumber, setEmployeeNumber] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [departments, setDepartments] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [newPhoto, setNewPhoto] = useState(null);
    const [dateOfJoining, setDateOfJoining] = useState("");
    const [photo, setPhoto] = useState("");
    const [projects, setProjects] = useState([]);
    const [newProjects, setNewProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { updateUser, getUserProfile } = useUser()
    const { getDepartmentList } = useDepartment()
    const [departmentsList, setDepartmentsList] = useState([]);
    const { fetchProjects } = useProject()
    const { auth } = useAuth()
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let { getProfile } = await getUserProfile(params.id);
                if (getProfile) {
                    setEmployeeNumber(getProfile.employeeNumber)
                    setFirstname(getProfile.firstname);
                    setLastname(getProfile.lastname);
                    setEmail(getProfile.email);
                    setAddress(getProfile.address)
                    setPhone(getProfile.phone)
                    setDepartments(getProfile.department ? getProfile.department._id : "")
                    setDateOfBirth(new Date(getProfile.dateOfBirth))
                    setDateOfJoining(new Date(getProfile.dateOfJoining))
                    setPhoto(getProfile.photo)
                    if (getProfile.projects && getProfile.projects.length > 0) {
                        setNewProjects(getProfile.projects.map((e) => e.id._id));
                    } else {
                        setNewProjects([]);
                    }
                    setIsLoading(false)
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
        fetchData();
    }, [params.id, getUserProfile, auth]);

    const fetchDepartment = async () => {
        const data = await getDepartmentList()
        setDepartmentsList(data?.departments)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let updateUsers = { employeeNumber, firstname, lastname, email, phone, address, dateOfBirth, department: departments, dateOfJoining, photo: newPhoto || photo, projects: newProjects }
            let id = params.id
            const data = await updateUser(updateUsers, id)
            if (data.error) {
                toast.error(data.message)
            } else {
                router.push('/admin/user/list')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePhoto = async (e) => {
        setNewPhoto(e.target.files[0]);
    };

    const getProjects = async () => {
        const data = await fetchProjects();
        setProjects(data?.getAllProjects);
    };

    useEffect(() => {
        fetchDepartment()
        getProjects();
    }, [auth]);

    return (
        <>
            <AdminRoutes>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="mb-3">
                            <h2 className='mb-5 mt-2'>Update User</h2>
                        </div>
                        <CForm className="row g-3 mb-3" onSubmit={handleSubmit}>
                            {photo && !newPhoto && (
                                <CCol xs={12}>
                                    <CImage
                                        align="start"
                                        rounded
                                        src={photo}
                                        width={200}
                                        height={200}
                                    />
                                </CCol>
                            )}

                            {!photo && newPhoto && (
                                <CCol xs={12}>
                                    <CImage
                                        align="left"
                                        rounded
                                        src={URL.createObjectURL(newPhoto)}
                                        width={200}
                                        height={200}
                                    />
                                </CCol>
                            )}

                            {photo && newPhoto && (
                                <CCol xs={12}>
                                    <CImage
                                        align="left"
                                        rounded
                                        src={URL.createObjectURL(newPhoto)}
                                        width={200}
                                        height={200}
                                    />
                                </CCol>
                            )}
                            <CRow>
                                <CCol md={4}>
                                    <CFormInput
                                        id="inputEmployeeNo"
                                        label="Employee Number"
                                        value={employeeNumber}
                                        onChange={(e) => setEmployeeNumber(e.target.value)}
                                        disabled
                                    />
                                </CCol>
                            </CRow>
                            <CCol md={6}>
                                <CFormInput
                                    id="inputFirstName"
                                    label="First Name"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    id="inputLastName"
                                    label="Last Name"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    type="email"
                                    id="inputEmail4"
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    type="number"
                                    id="inputPhone"
                                    label="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </CCol>
                            <CCol xs={6}>
                                <CFormTextarea
                                    type="text"
                                    id="inputAddress"
                                    label="Address"
                                    placeholder="Enter your address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormSelect
                                    id="inputDepartment"
                                    label="Department"
                                    placeholder="Select Department"
                                    value={departments}
                                    onChange={(e) => setDepartments(e.target.value)}
                                >
                                    <option value="" disabled>Select a Department</option>
                                    {departmentsList?.map((d) => (
                                        <option key={d._id} value={d._id}>
                                            {d.name}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol xs={6}>
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
                            <CCol xs={6}>
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
                            <CCol xs={6}>
                                <CFormInput
                                    type="file"
                                    className="form-control"
                                    label={"Upload Photo"}
                                    id="inputGroupFile04"
                                    accept="image/*"
                                    aria-describedby="inputGroupFileAddon04"
                                    aria-label="Upload"
                                    onChange={handlePhoto}
                                />
                            </CCol>
                            <CCol xs={6}>
                                <label htmlFor="projectSelect" className="form-label">Project</label>
                                <MultiSelect
                                    value={newProjects}
                                    onChange={(e) => setNewProjects(e.target.value)}
                                    options={projects}
                                    size={6}
                                    optionLabel="name"
                                    optionValue='_id'
                                    placeholder="Select Projects"
                                    id="date"
                                    className="form-control"
                                />
                            </CCol>
                            <CCol xs={12}>
                                <CButton className="me-md-2" onClick={() => router.push('/admin/user/list')}>
                                    Back
                                </CButton>
                                <CButton type="submit" className="me-md-2">
                                    Submit
                                </CButton>
                            </CCol>
                        </CForm>
                    </>
                )}
            </AdminRoutes>
        </>
    )
}

export default page