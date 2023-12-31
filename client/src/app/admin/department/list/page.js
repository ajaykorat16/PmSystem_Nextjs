"use client"
import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useAuth } from "@/lib/context/AuthContext";
import { useDepartment } from '@/lib/context/DepartmentContext';
import Loader from '@/lib/components/Loader';
import AdminRoutes from '@/lib/components/Routes/AdminRoutes';
import { useRouter } from 'next/navigation';

const DepartmentList = () => {
    const { getDepartment, deleteDepartment } = useDepartment();
    const [isLoading, setIsLoading] = useState(true);
    const [departmentList, setDepartmentList] = useState([])
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState(-1);
    const { auth } = useAuth();
    const router = useRouter()

    const fetchDepartments = async (query, sortField, sortOrder) => {
        setIsLoading(true);
        if (auth.user !== null) {
            let departmentData = {};
            departmentData = await getDepartment(currentPage, rowsPerPage, query, sortField, sortOrder);

            const totalRecordsCount = departmentData.totalDepartments;

            setTotalRecords(totalRecordsCount);
            setDepartmentList(departmentData.departments)
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [currentPage, rowsPerPage, auth]);

    useEffect(() => {
        if (globalFilterValue.trim() === '') {
            fetchDepartments();
        }
    }, [globalFilterValue])

    const handleSubmit = async () => {
        fetchDepartments(globalFilterValue)
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this department?'
        );
        if (confirmDelete) {
            await deleteDepartment(id);
            fetchDepartments();
        }
    };

    const handleUpdate = async (id) => {
        router.push(`/admin/department/update/${id}`)
    };

    const onPageChange = (event) => {
        const currentPage = Math.floor(event.first / event.rows) + 1;
        setCurrentPage(currentPage);
        const newRowsPerPage = event.rows;
        setRowsPerPage(newRowsPerPage);
    };

    const handleSorting = async (e) => {
        const field = e.sortField;
        const order = e.sortOrder;

        setSortField(field);
        setSortOrder(order);
        fetchDepartments(null, field, order)
    };

    return (
        <>
            <AdminRoutes>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <div className="card mb-5">
                            <div className="mainHeader d-flex align-items-center justify-content-between">
                                <div>
                                    <h4>Departments</h4>
                                </div>
                                <div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="p-inputgroup ">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-search" />
                                            </span>
                                            <InputText
                                                type='search'
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
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSorting}
                                paginator
                                rows={rowsPerPage}
                                value={departmentList}
                                first={(currentPage - 1) * rowsPerPage}
                                onPage={onPageChange}
                                dataKey="_id"
                                emptyMessage="No departments found."
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
                                    filterMenuStyle={{ width: '14rem' }}
                                    style={{ minWidth: '12rem' }}
                                />
                                <Column
                                    field="action"
                                    header="Action"
                                    body={(rowData) => (
                                        <div>
                                            <Button icon="pi pi-pencil" title='Edit' rounded severity="success" aria-label="edit" onClick={() => handleUpdate(rowData._id)} />
                                            <Button icon="pi pi-trash" title='Delete' rounded severity="danger" className="ms-2" aria-label="Cancel" onClick={() => handleDelete(rowData._id)} />
                                        </div>
                                    )}
                                    style={{ width: '8rem' }}
                                />
                            </DataTable>
                        </div>
                    </>
                )}
            </AdminRoutes>
        </>
    );
};

export default DepartmentList;
