"use client"
import React, { useState } from "react";
import { CCol, CFormInput, CButton, CForm } from "@coreui/react";
import { useDepartment } from "@/lib/context/DepartmentContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const DepartmentCreate = ({ title }) => {
    const [name, setName] = useState("");
    const { addDepartment } = useDepartment();
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await addDepartment(name);
            if (data.error) {
                toast.error(data.message)
            } else {
                router.push("/admin/department/list");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="mb-3">
                <h2 className="mb-5 mt-2">Create Department</h2>
            </div>
            <CForm className="row g-3" onSubmit={handleSubmit}>
                <CCol sm={12}>
                    <CFormInput
                        placeholder="Department"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </CCol>
                <CCol xs="auto">
                    <CButton type="submit">Submit</CButton>
                </CCol>
            </CForm>
        </>
    );
};

export default DepartmentCreate;
