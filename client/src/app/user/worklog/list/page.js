'use client'
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";
import { ScrollPanel } from "primereact/scrollpanel";
import UserRoutes from "@/lib/components/Routes/UserRoutes";
import Loader from "@/lib/components/Loader";
import { useWorklog } from "@/lib/context/WorklogContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from 'next/navigation';

function page() {
    const { getWorklog, deleteWorklog } = useWorklog();
    const { auth } = useAuth()
    const [isLoading, setIsLoading] = useState(true);
    const [worklogList, setWorklogList] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState(-1);
    const [visible, setVisible] = useState(false);
    const router = useRouter()
    const [worklog, setWorklog] = useState({
        project: "",
        description: "",
        logDate: "",
        time: ""
    });

    const fetchWorklog = async (query, sortField, sortOrder) => {
        setIsLoading(true);
        let worklogData = await getWorklog(
            currentPage,
            rowsPerPage,
            query,
            sortField,
            sortOrder
        );
        const totalRecordsCount = worklogData?.totalWorklog;
        setTotalRecords(totalRecordsCount);
        setWorklogList(worklogData?.worklog);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchWorklog();
    }, [currentPage, rowsPerPage, auth]);

    const handleSubmit = async () => {
        fetchWorklog(globalFilterValue);
    };

    useEffect(() => {
        if (globalFilterValue.trim() === "") {
            fetchWorklog();
        }
    }, [globalFilterValue, auth]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );
        if (confirmDelete) {
            await deleteWorklog(id);
            fetchWorklog();
        }
    };

    const handleUpdate = async (id) => {
        router.push(`/user/worklog/update/${id}`);
    };

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
        fetchWorklog(null, field, order);
    };

    const handleWorklogDetail = async (worklog) => {
        setVisible(true)
        setWorklog({
            userId: worklog.userId.fullName,
            project: worklog.project.name,
            description: worklog.description,
            logDate: worklog.logDate,
            time: worklog.time
        })
    }

    return (
        <UserRoutes>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <CModal
                        alignment="center"
                        visible={visible}
                        onClose={() => setVisible(false)}
                        className='mainBody'
                    >
                        <CModalHeader>
                            <CModalTitle><strong>{worklog.project}</strong></CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <div className='description'>
                                <ScrollPanel style={{ width: '100%', height: '20rem' }} className="custom">
                                    <div className="description" dangerouslySetInnerHTML={{ __html: worklog.description }} />
                                </ScrollPanel>
                            </div>
                            <div className='d-flex justify-content-end mt-3'>
                                <p>
                                    <strong>{worklog.logDate}</strong>
                                </p>
                            </div>
                            <div className='d-flex justify-content-end '>
                                <p>
                                    <strong>Time: {worklog.time} h</strong>
                                </p>
                            </div>
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setVisible(false)}>
                                Ok
                            </CButton>
                        </CModalFooter>
                    </CModal>
                    <div className="card mb-5">
                        <div className="mainHeader d-flex align-items-center justify-content-between">
                            <div>
                                <h4>Work Log</h4>
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
                            paginator
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={hanldeSorting}
                            rows={rowsPerPage}
                            value={worklogList}
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
                                field="project.name"
                                header="Project Name"
                                sortable
                                filterField="Project"
                                align="center"
                            />
                            <Column
                                field="logDate"
                                sortable
                                header="Log Date"
                                filterField="logDate"
                                align="center"
                            />
                            <Column
                                field="time"
                                sortable
                                header="Time"
                                filterField="time"
                                align="center"
                            />
                            <Column
                                field="action"
                                header="Action"
                                body={(rowData) => (
                                    <div>
                                        <>
                                            <Button
                                                icon="pi pi-eye"
                                                title="View Work Log"
                                                rounded
                                                severity="info"
                                                aria-label="view"
                                                onClick={() => handleWorklogDetail(rowData)}
                                            />
                                            <Button
                                                icon="pi pi-pencil"
                                                title="Edit"
                                                rounded
                                                className="ms-2"
                                                severity="success"
                                                aria-label="edit"
                                                onClick={() => handleUpdate(rowData._id)}
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                title="Delete"
                                                rounded
                                                severity="danger"
                                                className="ms-2"
                                                aria-label="delete"
                                                onClick={() => handleDelete(rowData._id)}
                                            />
                                        </>
                                    </div>
                                )}
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