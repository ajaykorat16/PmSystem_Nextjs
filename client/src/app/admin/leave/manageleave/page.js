"use client"
import React, { useEffect, useState } from "react";
import Loader from "@/lib/components/Loader";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useLeaveManagement } from "@/lib/context/LeaveManagementContext";
import { CButton, CForm, CFormInput, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, } from "@coreui/react";
import { useUser } from "@/lib/context/UserContext";
import { toast } from "react-hot-toast";
import { useAuth } from "@/lib/context/AuthContext";
import AdminRoutes from "@/lib/components/Routes/AdminRoutes";

const LeaveManagementList = () => {
    const { getLeavesMonthWise, getSingleLeave, updateLeave, createLeave } = useLeaveManagement();
    const { fetchUsers } = useUser();
    const { auth } = useAuth()
    const [isLoading, setIsLoading] = useState(true);
    const [leavelist, setLeaveList] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [visible, setVisible] = useState(false);
    const [newVisible, setNewVisible] = useState(false);
    const [leave, setLeave] = useState("");
    const [leaveId, setLeaveId] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [month, setMonth] = useState(null);
    const [users, setUsers] = useState([]);
    const [manageLeave, setManageLeave] = useState({
        user: "",
        monthly: "",
        leave: 1.5,
    });

    const fetchLeaves = async (query) => {
        setIsLoading(true);
        if (auth.user !== null) {
            let leaveManagementData;
            if (!query) {
                leaveManagementData = await getLeavesMonthWise(currentPage, rowsPerPage);
            } else {
                let month = parseInt(query, 10);
                leaveManagementData = await getLeavesMonthWise(
                    currentPage,
                    rowsPerPage,
                    month
                );
            }
            const totalRecordsCount = leaveManagementData.totalLeaves;
            setTotalRecords(totalRecordsCount);
            setLeaveList(leaveManagementData.leaves);
            setIsLoading(false);
        }
    };

    const getUsers = async () => {
        if (auth.user !== null) {
            const { getAllUsers } = await fetchUsers();
            setUsers(getAllUsers);
        }
    };

    useEffect(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        setGlobalFilterValue(currentMonth.toString());
        fetchLeaves(currentMonth);
        getUsers();
    }, [auth]);

    useEffect(() => {
        fetchLeaves(globalFilterValue);
    }, [currentPage, rowsPerPage, globalFilterValue, auth]);

    const singleLeave = async () => {
        const data = await getSingleLeave(leaveId);
        if (data) {
            setLeave(data.leave);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (leaveId !== null) {
            singleLeave();
        }
    }, [leaveId]);

    const handleChange = async (e) => {
        e.preventDefault();
        try {
            const id = leaveId;
            const getMonth = new Date(month);
            const m = getMonth.getMonth() + 1;
            await updateLeave(leave, id);
            setVisible(false);
            fetchLeaves(m);
        } catch (error) {
            console.log(error);
        }
    };

    const onPageChange = (event) => {
        const currentPage = Math.floor(event.first / event.rows) + 1;
        setCurrentPage(currentPage);
        const newRowsPerPage = event.rows;
        setRowsPerPage(newRowsPerPage);
    };

    const handleUpdate = async (id, fullName, monthly) => {
        setVisible(!visible);
        setLeaveId(id);
        setFullName(fullName);
        setMonth(monthly);
    };

    const handleCreate = async () => {
        setNewVisible(true);
        setManageLeave({
            user: "",
            monthly: "",
            leave: 1.5,
        })
    };

    const addLeave = async (e) => {
        e.preventDefault();
        try {
            const data = await createLeave(manageLeave);
            if (data.error) {
                toast.error(data.message)
            }
            setNewVisible(false);
            fetchLeaves(globalFilterValue);
            setManageLeave({
                user: "",
                monthly: "",
                leave: "",
            })
        } catch (error) {
            console.log(error);
        }
    }

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <>
        <AdminRoutes>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div>
                        <CModal
                            alignment="center"
                            visible={visible}
                            onClose={() => setVisible(false)}
                        >
                            <CModalHeader>
                                <CModalTitle>{fullName}</CModalTitle>
                            </CModalHeader>
                            <CForm onSubmit={handleChange}>
                                <CModalBody>
                                    <CFormInput
                                        type="number"
                                        id="leave"
                                        label="Manage Leave"
                                        value={leave}
                                        onChange={(e) => setLeave(e.target.value)}
                                    />
                                </CModalBody>
                                <CModalFooter>
                                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                                    <CButton color="primary" type="submit">Save changes</CButton>
                                </CModalFooter>
                            </CForm>
                        </CModal>
                    </div>
                    <div>
                        <CModal
                            alignment="center"
                            visible={newVisible}
                            onClose={() => setNewVisible(false)}
                        >
                            <CModalHeader>
                                <CModalTitle>Manage Leave</CModalTitle>
                            </CModalHeader>
                            <CForm onSubmit={addLeave}>
                                <CModalBody>
                                    <CFormSelect
                                        id="inputUserName"
                                        label="User Name"
                                        className="mb-2"
                                        value={manageLeave.user}
                                        onChange={(e) =>
                                            setManageLeave({ ...manageLeave, user: e.target.value })
                                        }>
                                        <option value="" disabled>
                                            Select User
                                        </option>
                                        {users.map((u) => (
                                            <option key={u._id} value={u._id}>
                                                {`${u.firstname} ${u.lastname}`}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                    <CFormSelect
                                        id="inputMonth"
                                        label="Month"
                                        className="mb-2"
                                        value={manageLeave.monthly}
                                        onChange={(e) =>
                                            setManageLeave({ ...manageLeave, monthly: e.target.value })
                                        }
                                    >
                                        <option value="" disabled>
                                            Select Month
                                        </option>
                                        {months.map((month, index) => (
                                            <option key={index} value={index + 1}>
                                                {month}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                    <CFormInput
                                        type="number"
                                        id="leave"
                                        label="Manage Leave"
                                        value={manageLeave.leave}
                                        onChange={(e) =>
                                            setManageLeave({ ...manageLeave, leave: e.target.value })
                                        }
                                    />
                                </CModalBody>
                                <CModalFooter>
                                    <CButton color="secondary" onClick={() => setNewVisible(false)}> Close</CButton>
                                    <CButton color="primary" type="submit">Submit</CButton>
                                </CModalFooter>
                            </CForm>
                        </CModal>
                    </div>
                    <div className="card mb-5">
                        <div className="mainHeader d-flex align-items-center justify-content-between ">
                            <div>
                                <h4>Manage Leave</h4>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <select
                                    className="box"
                                    value={globalFilterValue}
                                    onChange={(e) => setGlobalFilterValue(e.target.value)}
                                >
                                    {months.map((month, index) => (
                                        <option key={index} value={index + 1}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                                <div className="ms-3">
                                    <CButton
                                        onClick={() => handleCreate()}
                                        title="Add Leave"
                                        className="btn btn-light"
                                        style={{ height: "40px" }}
                                    >
                                        <i className="pi pi-plus" />
                                    </CButton>
                                </div>
                            </div>
                        </div>
                        <DataTable
                            totalRecords={totalRecords}
                            lazy
                            paginator
                            rows={rowsPerPage}
                            value={leavelist}
                            first={(currentPage - 1) * rowsPerPage}
                            onPage={onPageChange}
                            dataKey="_id"
                            emptyMessage="No user found."
                            paginatorLeft={
                                <Dropdown
                                    value={rowsPerPage}
                                    options={[10, 25, 50]}
                                    onChange={(e) => setRowsPerPage(e.value)}
                                />
                            }
                        >
                            <Column
                                field="user.fullName"
                                header="Emp. Name"
                                filterField="employeeName"
                                align="center"
                            />
                            <Column
                                field="leave"
                                header="Leaves"
                                filterField="leaves"
                                align="center"
                            />
                            <Column
                                header="Action"
                                body={(rowData) => (
                                    <div>
                                        <Button
                                            icon="pi pi-pencil"
                                            rounded
                                            severity="info"
                                            className="ms-2"
                                            title="Edit"
                                            onClick={() =>
                                                handleUpdate(
                                                    rowData._id,
                                                    rowData.user.fullName,
                                                    rowData.monthly
                                                )
                                            }
                                            raised
                                        />
                                    </div>
                                )}
                                align="center"
                            />
                        </DataTable>
                    </div>
                </>
            )}
            </AdminRoutes>
        </>
    );
};

export default LeaveManagementList;
