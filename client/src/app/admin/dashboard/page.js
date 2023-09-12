'use client'
import React, { useEffect, useState } from 'react';
import { CRow, CCol, CWidgetStatsA } from '@coreui/react';
import { CChartLine, CChartBar } from '@coreui/react-chartjs';
import { useAuth } from '@/lib/context/AuthContext';
import { useWorklog } from '@/lib/context/WorklogContext';
import { useProject } from '@/lib/context/ProjectContext';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import AdminRoutes from '@/lib/components/Routes/AdminRoutes';

function page() {
  const router = useRouter()
  const { auth } = useAuth()
  const { getAdminWorklog } = useWorklog()
  const { getProject } = useProject()
  const { getAllUsersByBirthMonth, getAllEmployee } = useUser()
  const [allProjectsCount, setAllProjectsCount] = useState(0)
  const [birthdayUsercount, setBirthdayUsercount] = useState(0)
  const [employeeCount, setEmployeeCount] = useState(0)
  const [adminWorklogCount, setAdminWorklogCount] = useState(0)

  const fetchAllProjects = async () => {
    const { totalProjects } = await getProject()
    setAllProjectsCount(totalProjects)
  }

  const fetchBirthdayUser = async () => {
    const { totalUsers } = await getAllUsersByBirthMonth()
    setBirthdayUsercount(totalUsers)
  }

  const fetchEmployee = async () => {
    const { totalEmployee } = await getAllEmployee()
    setEmployeeCount(totalEmployee)
  }

  const fetchAdminWorklog = async () => {
    const { worklogUserCount } = await getAdminWorklog()
    setAdminWorklogCount(worklogUserCount)
  }

  const fetchData = async () => {
    if (auth && auth.user) {
      fetchBirthdayUser();
      fetchAllProjects();
      fetchEmployee();
      fetchAdminWorklog();
    }
  };

  useEffect(() => {
    fetchData();
  }, [auth]);

  const userRole = auth?.user?.role;

  const chart1 = () => {
    return (
      <CChartLine
        className="mt-3 mx-3"
        style={{ height: '70px' }}
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'My First dataset',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,.55)',
              pointBackgroundColor: '#321fdb',
              data: [65, 59, 84, 84, 51, 55, 40],
            },
          ],
        }}
        options={{
          events: [],
          plugins: {
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                display: false,
              },
            },
            y: {
              min: 30,
              max: 89,
              display: false,
              grid: {
                display: false,
              },
              ticks: {
                display: false,
              },
            },
          },
          elements: {
            line: {
              borderWidth: 1,
              tension: 0.4,
            },
            point: {
              radius: 4,
              hitRadius: 10,
              hoverRadius: 4,
            },
          },
        }}
      />
    )
  }

  const chart2 = () => {
    return (
      <CChartLine
        className="mt-3 mx-3"
        style={{ height: '70px' }}
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'My First dataset',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,.55)',
              pointBackgroundColor: '#39f',
              data: [1, 18, 9, 17, 34, 22, 11],
            },
          ],
        }}
        options={{
          events: [],
          plugins: {
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                display: false,
              },
            },
            y: {
              min: -9,
              max: 39,
              display: false,
              grid: {
                display: false,
              },
              ticks: {
                display: false,
              },
            },
          },
          elements: {
            line: {
              borderWidth: 1,
            },
            point: {
              radius: 4,
              hitRadius: 10,
              hoverRadius: 4,
            },
          },
        }}
      />
    )
  }

  const chart3 = () => {
    return (
      <CChartLine
        className="mt-3"
        style={{ height: '70px' }}
        data={{
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'My First dataset',
              backgroundColor: 'rgba(255,255,255,.2)',
              borderColor: 'rgba(255,255,255,.55)',
              data: [78, 81, 80, 45, 34, 12, 40],
              fill: true,
            },
          ],
        }}
        options={{
          events: [],
          plugins: {
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
          elements: {
            line: {
              borderWidth: 2,
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
            },
          },
        }}
      />
    )
  }

  const chart4 = () => {
    return (
      <CChartBar
        className="mt-3 mx-3"
        style={{ height: '70px' }}
        data={{
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
            'January',
            'February',
            'March',
            'April',
          ],
          datasets: [
            {
              label: 'My First dataset',
              backgroundColor: 'rgba(255,255,255,.2)',
              borderColor: 'rgba(255,255,255,.55)',
              data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
              barPercentage: 0.6,
            },
          ],
        }}
        options={{
          events: [],
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
                drawTicks: false,
              },
              ticks: {
                display: false,
              },
            },
            y: {
              grid: {
                display: false,
                drawBorder: false,
                drawTicks: false,
              },
              ticks: {
                display: false,
              },
            },
          },
        }}
      />
    )
  }

  return (
    <>
      <AdminRoutes>
        <CRow>
          <CCol sm={3}>
            <div onClick={() => router.push("/admin/user/list")} className="dashboard">
              <CWidgetStatsA
                color="primary"
                className="mb-4"
                value={
                  <>
                    {employeeCount}
                  </>
                }
                title="Employee"
                chart={chart1()}
              />
            </div>
          </CCol>
          <CCol sm={3}>
            <div onClick={() => router.push("/admin/project/list")} className="dashboard">
              <CWidgetStatsA
                className="mb-4"
                color="info"
                value={
                  <>
                    {allProjectsCount}
                  </>
                }
                title="Projects"
                chart={chart2()}
              />
            </div>
          </CCol>
          <CCol sm={3}>
            <div onClick={() => router.push("/admin/user/employeebirthdate")} className="dashboard">
              <CWidgetStatsA
                className="mb-4"
                color="warning"
                value={
                  <>
                    {birthdayUsercount}
                  </>
                }
                title="Birthday on this month"
                chart={chart3()}
              />
            </div>
          </CCol>
          <CCol sm={3}>
            <div onClick={() => router.push("/admin/worklog/list")} className="dashboard">
              <CWidgetStatsA
                className="mb-4"
                color="danger"
                value={
                  <>
                    {adminWorklogCount}
                  </>
                }
                title="Worklog"
                chart={chart4()}
              />
            </div>
          </CCol>
        </CRow>
      </AdminRoutes>
    </>
  )
}

export default page;
