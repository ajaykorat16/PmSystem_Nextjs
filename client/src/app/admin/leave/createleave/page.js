"use client"
import React, { useEffect, useState } from "react";
import { CForm, CCol, CFormInput, CFormSelect, CButton, CFormCheck } from "@coreui/react";
import { useLeave } from "@/lib/context/LeaveContext";
import { useUser } from "@/lib/context/UserContext";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/context/AuthContext";
import { Calendar } from "primereact/calendar";
import { useRouter } from "next/navigation";
import AdminRoutes from "@/lib/components/Routes/AdminRoutes";

const LeaveCreate = () => {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");
    const [reason, setReason] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalDays, setTotalDays] = useState("")
    const [type, setType] = useState("");
    const [isHalfDay, setIsHalfDay] = useState(false);

    const { auth } = useAuth();
    const { addLeave, addUserLeave } = useLeave();
    const { fetchUsers } = useUser();
    const typeList = ["paid", "lwp"];
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let leaveData;
            if (auth.user.role === "admin") {
                leaveData = { reason, startDate, endDate, type, totalDays, userId, status: "approved" }
            } else {
                leaveData = { reason, startDate, endDate, type, totalDays }
            }
            const data = auth.user.role === "admin" ? await addLeave(leaveData) : await addUserLeave(leaveData);
            if (data.error) {
                toast.error(data.message);
            } else {
                const redirectPath = auth.user.role === "admin" ? "/admin/leave/list" : "/dashboard-user/leave/list";
                router.push(redirectPath);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getUsers = async () => {
        if (auth.user !== null) {
            const { getAllUsers } = await fetchUsers();
            setUsers(getAllUsers);
        }
    };
    useEffect(() => {
        if (auth?.user?.role === "admin") {
            getUsers();
        }
    }, [auth?.user?.role, auth]);

    const leaveDaysCount = (startDate, endDate) => {
        const eDate = new Date(endDate);
        let currentDate = new Date(startDate);
        let totalDays = 0;
        while (currentDate <= eDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                totalDays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        setTotalDays(totalDays);
    };

    useEffect(() => {
        if (!isHalfDay) {
            leaveDaysCount(startDate, endDate);
        }
    }, [startDate, endDate]);

    const handleIsHalfDayChange = (e) => {
        setIsHalfDay(e.target.checked);
        let currentDate = new Date(startDate);
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            if (e.target.checked) {
                setEndDate(startDate);
                setTotalDays(0.5);
            }
        }
    };

    return (
        <>
        <AdminRoutes>
            <div className="mb-3">
                <h2 className="mb-5 mt-2">Create Leave</h2>
            </div>
            <CForm className="row g-3" onSubmit={handleSubmit}>
                {auth?.user?.role === "admin" && (
                    <CCol md={6}>
                        <CFormSelect
                            id="inputUserName"
                            label="User Name"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        >
                            <option value="" disabled>
                                Select User
                            </option>
                            {users.map((u) => (
                                <option
                                    key={u._id}
                                    value={u._id}
                                >{`${u.firstname} ${u.lastname}`}</option>
                            ))}
                        </CFormSelect>
                    </CCol>
                )}
                <CCol md={6}>
                    <CFormInput
                        id="inputReason"
                        label="Reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </CCol>
                {auth?.user?.role === "admin" && (
                    <CCol md={6}>
                        <CFormInput
                            id="inputStatus"
                            label="Status"
                            placeholder="Approved"
                            disabled
                        />
                    </CCol>
                )}
                <CCol md={6}>
                    <CFormSelect
                        id="inputType"
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="" disabled>
                            Select a Type
                        </option>
                        {typeList.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CCol xs={6}>
                    <label className="form-label">Leave Start</label>
                    <Calendar
                        value={startDate}
                        maxDate={endDate}
                        dateFormat="dd-mm-yy"
                        onChange={(e) => setStartDate(e.target.value)}
                        showIcon
                        id="date"
                        className="form-control"
                    />
                </CCol>
                <CCol xs={6}>
                    <CFormCheck
                        className="mt-4"
                        type="checkbox"
                        id="inputIsHalfDay"
                        label="Half Day"
                        checked={isHalfDay}
                        onChange={handleIsHalfDayChange}
                    />
                </CCol>
                <CCol xs={6}>
                    <label className="form-label">Leave End</label>
                    <Calendar
                        value={endDate}
                        minDate={startDate}
                        dateFormat="dd-mm-yy"
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={isHalfDay}
                        showIcon
                        id="date"
                        className="form-control"
                    />
                </CCol>
                <CCol xs={6}>
                    <CFormInput
                        id="inputendDate"
                        label="Total Days"
                        value={totalDays}
                        onChange={(e) => setTotalDays(e.target.value)}
                        disabled
                    />
                </CCol>

                <CCol xs={12}>
                    <CButton type="submit" className="me-md-2">
                        Submit
                    </CButton>
                </CCol>
            </CForm>
        </AdminRoutes>
        </>
    );
};

export default LeaveCreate;
