'use client'
import React, { useEffect, useState } from "react";
import { CForm, CCol, CFormInput, CFormSelect, CButton, CFormCheck } from "@coreui/react";
import toast from "react-hot-toast";
import { Calendar } from "primereact/calendar";
import { useLeave } from "@/lib/context/LeaveContext";
import { useUser } from "@/lib/context/UserContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "@/lib/components/Loader";
import AdminRoutes from "@/lib/components/Routes/AdminRoutes";

function page({ params }) {
    const [userId, setUserId] = useState("");
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalDays, setTotalDays] = useState("");
    const [type, setType] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [isHalfDay, setIsHalfDay] = useState(false);
    const { updateLeave, getLeaveById } = useLeave();
    const { fetchUsers } = useUser();
    const router = useRouter()
    const { auth } = useAuth();
    const typeList = ["paid", "lwp"];

    useEffect(() => {
        const setValues = async () => {
            const data = await getLeaveById(params.id);
            if (data) {
                setUserId(data.userId ? data.userId._id : "");
                setReason(data.reason);
                setStatus(data.status);
                setStartDate(new Date(data.startDate));
                setEndDate(new Date(data.endDate));
                setTotalDays(data.totalDays);
                setType(data.type);
                setIsLoading(false);
            }
        };
        setValues();
    }, [getLeaveById, params.id, auth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const leaveData = {
                reason,
                startDate,
                endDate,
                type,
                userId,
                status,
                totalDays,
            };
            const data = await updateLeave(leaveData, params.id);
            if (data.error) {
                toast.error(data.message);
            } else {
                router.push("/admin/leave/list");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getUsers = async () => {
        const data = await fetchUsers();
        setUsers(data?.getAllUsers);
    };

    useEffect(() => {
        getUsers();
    }, [auth]);

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
        } else {
            toast.error("You can't take a leave on Saturday and Sunday")
            setEndDate(startDate);
            setTotalDays(0)
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
                            <h2 className="mb-5 mt-2">Update Leave</h2>
                        </div>
                        <CForm className="row g-3 mb-3" onSubmit={handleSubmit}>
                            <CCol md={6}>
                                <CFormSelect
                                    id="inputUserName"
                                    label="User Name"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                >
                                    {users?.map((u) => (
                                        <option
                                            key={u._id}
                                            value={u._id}
                                        >{`${u.firstname} ${u.lastname}`}</option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    id="inputReason"
                                    label="Reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormInput
                                    id="inputStatus"
                                    label="Status"
                                    value={status}
                                    disabled
                                />
                            </CCol>
                            <CCol md={6}>
                                <CFormSelect
                                    id="inputType"
                                    label="Type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
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
                                    dateFormat="dd-mm-yy"
                                    minDate={startDate}
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
                                <CButton className="me-md-2" onClick={() => router.push('/admin/leave/list')}>
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
    );
}

export default page