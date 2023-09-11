'use client'
import React, { useEffect, useState } from "react";
import { CCol, CFormInput, CButton, CForm } from "@coreui/react";
import { useDepartment } from "@/lib/context/DepartmentContext";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/lib/context/AuthContext";
import AdminRoutes from "@/lib/components/Routes/AdminRoutes";
import Loader from "@/lib/components/Loader";

function page({ params }) {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const { updateDepartment, getSingleDepartment } = useDepartment();
    const router = useRouter()
    const { auth } = useAuth();

    const singleDepartment = async () => {
        const data = await getSingleDepartment(params.id)
        if (data) {
            setName(data.name)
            setIsLoading(false)
        }
    }
    useEffect(() => {
        singleDepartment()
    }, [params.id, auth])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const id = params.id
            await updateDepartment(name, id);
            router.push("/admin/department/list");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <AdminRoutes>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="mb-3">
                            <h2 className="mb-5 mt-2">Update Department</h2>
                        </div>
                        <CForm className="row g-3" onSubmit={handleSubmit}>
                            <CCol sm={12}>
                                <CFormInput
                                    placeholder="Department"
                                    aria-label="Department"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </CCol>
                            <CCol xs="auto">
                                <CButton className="me-md-2" onClick={() => router.push("/admin/department/list")}>
                                    Back
                                </CButton>
                                <CButton type="submit" className="me-md-2">Submit</CButton>
                            </CCol>
                        </CForm>
                    </>
                )}
            </AdminRoutes>
        </>
    );
}

export default page