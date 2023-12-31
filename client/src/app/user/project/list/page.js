'use client'
import React, { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { ScrollPanel } from 'primereact/scrollpanel';
import UserRoutes from '@/lib/components/Routes/UserRoutes';
import Loader from '@/lib/components/Loader';
import { useProject } from '@/lib/context/ProjectContext';
import { useAuth } from "@/lib/context/AuthContext";

function page() {
    const { userProject } = useProject()
    const { auth } = useAuth()
    const [projectList, setProjectList] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [visible, setVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState(-1);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [startDate, setStartDate] = useState("")

    const fetchProjects = async (query, sortField, sortOrder) => {
        setIsLoading(true);
        let projectData = await userProject(
            currentPage,
            rowsPerPage,
            query,
            sortField,
            sortOrder
        );
        const totalRecordsCount = projectData?.totalProjects;
        setTotalRecords(totalRecordsCount);
        setProjectList(projectData?.projects);
        setIsLoading(false);
    };
    useEffect(() => {
        fetchProjects();
    }, [currentPage, rowsPerPage, auth]);

    const handleSubmit = async () => {
        fetchProjects(globalFilterValue);
    };

    useEffect(() => {
        if (globalFilterValue.trim() === "") {
            fetchProjects();
        }
    }, [globalFilterValue, currentPage, rowsPerPage, auth]);

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
        fetchProjects(null, field, order);
    };

    const handleProjectdetail = async (project) => {
        setVisible(true)
        setName(project.name)
        setDescription(project.description)
        setStartDate(project.startDate)
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
                            <CModalTitle><strong>{name}</strong></CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <ScrollPanel style={{ width: '100%', height: '20rem' }} className="custom">
                                <div className="description" dangerouslySetInnerHTML={{ __html: description }} />
                            </ScrollPanel>
                            <div className='d-flex justify-content-end mt-3'>
                                <p>
                                    <strong>{startDate}</strong>
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
                                <h4>Projects</h4>
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
                            value={projectList}
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
                                field="name"
                                header="Name"
                                sortable
                                filterField="name"
                                align="center"
                            />
                            <Column
                                field="startDate"
                                sortable
                                header="Start Date"
                                filterField="startDate"
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
                                                title='View Project'
                                                rounded
                                                severity="info"
                                                className="ms-2"
                                                aria-label="view"
                                                onClick={() => handleProjectdetail(rowData)}
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
    )
}

export default page