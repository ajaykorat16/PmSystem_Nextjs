'use client'
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useLeave } from "@/lib/context/LeaveContext";
import { useAuth } from "@/lib/context/AuthContext";
import UserRoutes from "@/lib/components/Routes/UserRoutes";
import Loader from "@/lib/components/Loader";

function page() {
    const { getUserLeave } = useLeave();
    const { auth } = useAuth();
    const [leaveList, setLeaveList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState(-1);

    const fetchLeaves = async (query, sortField, sortOrder) => {
        setIsLoading(true);
        let leaveData = await getUserLeave(
            currentPage,
            rowsPerPage,
            query,
            sortField,
            sortOrder
        );
        const totalRecordsCount = leaveData?.totalLeaves;
        setTotalRecords(totalRecordsCount);
        setLeaveList(leaveData?.leaves);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLeaves();
    }, [currentPage, rowsPerPage, auth]);

    const handleSubmit = async () => {
        fetchLeaves(globalFilterValue);
    };

    useEffect(() => {
        if (globalFilterValue.trim() === "") {
            fetchLeaves();
        }
    }, [globalFilterValue, auth]);


    const onPageChange = (event) => {
        const currentPage = Math.floor(event.first / event.rows) + 1;
        setCurrentPage(currentPage);
        const newRowsPerPage = event.rows;
        setRowsPerPage(newRowsPerPage);
    };

    const hanldeSorting = async (e) => {
        const field = e.sortField;
        const order = e.sortOrder;

        setSortField(field);
        setSortOrder(order);
        fetchLeaves(null, field, order);
    };

    const getSeverity = (status) => {
        switch (status) {
            case "Approved":
                return "success";

            case "Pending":
                return "warning";

            case "Rejected":
                return "danger";

            default:
                return null;
        }
    };

    return (
        <UserRoutes>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="card mb-5">
                        <div className="mainHeader d-flex align-items-center justify-content-between">
                            <div>
                                <h4>Leaves</h4>
                            </div>
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div className="p-inputgroup ">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-search" />
                                        </span>
                                        <InputText
                                            type="search"
                                            value={globalFilterValue}
                                            onChange={(e) => setGlobalFilterValue(e.target.value)}
                                            placeholder="Keyword Search"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <DataTable
                            totalRecords={totalRecords}
                            lazy
                            className="text-center"
                            paginator
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={hanldeSorting}
                            rows={rowsPerPage}
                            value={leaveList}
                            first={(currentPage - 1) * rowsPerPage}
                            onPage={onPageChange}
                            dataKey="_id"
                            emptyMessage="No leave found."
                            paginatorLeft={
                                <Dropdown
                                    value={rowsPerPage}
                                    options={[10, 25, 50]}
                                    onChange={(e) => setRowsPerPage(e.value)}
                                />
                            }
                        >
                            <Column
                                field="reason"
                                header="Reason"
                                filterField="reason"
                                alignHeader="center"
                                style={{ minWidth: "15rem", maxWidth: "15rem" }}
                            />
                            <Column
                                field="reasonForLeaveReject"
                                header="Reason For Leave Reject"
                                filterField="reason"
                                alignHeader="center"
                                style={{ minWidth: "15rem", maxWidth: "15rem" }}
                            />
                            <Column
                                field="startDate"
                                header="Start Date"
                                sortable
                                filterField="start"
                                align="center"
                            />
                            <Column
                                field="endDate"
                                header="End Date"
                                filterField="end"
                                align="center"
                            />
                            <Column
                                field="totalDays"
                                header="Days"
                                filterField="days"
                                align="center"
                            />
                            <Column
                                field="type"
                                header="Type"
                                filterField="type"
                                align="center"
                            />
                            <Column
                                header="Status"
                                alignHeader="center"
                                body={(rowData) => (
                                    <Tag
                                        value={rowData.status}
                                        severity={getSeverity(rowData.status)}
                                    />
                                )}
                                filterField="status"
                                align="center"
                            />
                        </DataTable>
                    </div>
                </>
            )}
        </UserRoutes>
    );
}

export default page