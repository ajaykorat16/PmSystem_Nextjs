'use client'
import React, { useEffect, useState } from 'react'
import "react-quill/dist/quill.snow.css";
import { CButton, CCol, CForm, CFormInput, CFormSelect } from '@coreui/react'
import { toast } from 'react-hot-toast';
import { Calendar } from 'primereact/calendar';
import { Editor } from 'primereact/editor';
import { useRouter } from 'next/navigation';
import { useProject } from '@/lib/context/ProjectContext';
import { useWorklog } from '@/lib/context/WorklogContext';
import { useAuth } from '@/lib/context/AuthContext';
import UserRoutes from '@/lib/components/Routes/UserRoutes';

function page() {
    const [projects, setProjects] = useState([]);
    const [selectproject, setSelectProject] = useState("");
    const [description, setDescription] = useState("")
    const [logDate, setLogDate] = useState("")
    const [time, setTime] = useState("")
    const { createWorkLog } = useWorklog()
    const { getUserProject } = useProject()
    const { auth } = useAuth()
    const router = useRouter()

    const getProjects = async () => {
        const data = await getUserProject();
        setProjects(data?.project);
    };

    useEffect(() => {
        getProjects();
    }, [auth]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const addWorkLog = { project: selectproject, description, logDate, time }
            const data = await createWorkLog(addWorkLog)
            if (data.error) {
                toast.error(data.message)
            } else {
                router.push('/user/worklog/list')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <UserRoutes>

            <>
                <div className="mb-3">
                    <h2 className="mb-5 mt-2">Create Work Log</h2>
                </div>
                <CForm className="row g-3" onSubmit={handleSubmit}>
                    <CCol xs={4}>
                        <CFormSelect id="inputProject" label="Project" value={selectproject} onChange={(e) => setSelectProject(e.target.value)} >
                            <option value="" disabled>Select a project</option>
                            {projects?.map((p) => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                        <CFormInput id="inputTime" label="Time" type="number" value={time} onChange={(e) => setTime(e.target.value)} />
                    </CCol>
                    <CCol md={4}>
                        <label className="form-label">Log Date</label>
                        <Calendar
                            value={logDate}
                            dateFormat="dd-mm-yy"
                            onChange={(e) => setLogDate(e.target.value)}
                            maxDate={new Date()}
                            showIcon
                            id="date"
                            className="form-control"
                        />
                    </CCol>
                    <CCol md={12}>
                        <label className='mb-2'>Description</label>
                        <div className="card">
                            <Editor
                                value={description}
                                onTextChange={(e) => setDescription(e.htmlValue)}
                                className="editorContainer"
                            />
                        </div>
                    </CCol>
                    <CCol xs={12}>
                        <CButton type="submit">Submit</CButton>
                    </CCol>
                </CForm>
            </>
        </UserRoutes>
    )
}

export default page