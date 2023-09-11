'use client'
import React, { useEffect, useState } from 'react';
import { CRow, CCol, CWidgetStatsA, CNavLink } from '@coreui/react';
import { CChartLine, CChartBar } from '@coreui/react-chartjs';
import { useAuth } from '@/lib/context/AuthContext';
import { useLeave } from '@/lib/context/LeaveContext';
import { useWorklog } from '@/lib/context/WorklogContext';
import { useProject } from '@/lib/context/ProjectContext';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';

function page() {
  const router  = useRouter()
  const { auth } = useAuth()
  const { getUserLeave } = useLeave()
  const { getWorklog } = useWorklog()
  const { userProject } = useProject()
  const { getAllUsersByBirthMonth } = useUser()
  const [leaveCount, setLeaveCount] = useState(0)
  const [projectcount, setProjectCount] = useState(0)
  const [birthdayUsercount, setBirthdayUsercount] = useState(0)
  const [userWorklogCount, setUserWorklogCount] = useState(0)

  const fetchLeave = async () => {
    const { approvedLeave } = await getUserLeave()
    setLeaveCount(approvedLeave)
  }

  const fetchProjects = async () => {
    const { totalProjects } = await userProject()
    setProjectCount(totalProjects)
  }

  const fetchBirthdayUser = async () => {
    const { totalUsers } = await getAllUsersByBirthMonth()
    setBirthdayUsercount(totalUsers)
  }

  const fetchUserWorklog = async () => {
    const { totalWeekTime } = await getWorklog()
    setUserWorklogCount(totalWeekTime)
  }

  const fetchData = async () => {
    if (auth && auth.user) {
      fetchLeave();
      fetchProjects();
      fetchBirthdayUser();
      fetchUserWorklog();
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

  if (userRole === null || userRole === undefined) {
    return (
      <CRow>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={
              <>
                {leaveCount}
              </>
            }
            title="Leave This Month"
            chart={chart1()}
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={
              <>
                {projectcount}
              </>
            }
            title="My Projects"
            chart={chart2()}
          />
        </CCol>
        <CCol sm={3}>
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
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={
              <>
                {userWorklogCount} h
              </>
            }
            title="Worklog"
            chart={chart4()}
          />
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      <CCol sm={3}>
        <div onClick={()=>router.push("/user/leave/list")} className='dashboard'>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={
              <>
                {leaveCount}
              </>
            }
            title="Leave This Month"
            chart={chart1()}
          />
        </div>
      </CCol>
      <CCol sm={3}>
        <div onClick={()=>router.push("/user/project/list")} className='dashboard'>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={
              <>
                {projectcount}
              </>
            }
            title="My Projects"
            chart={chart2()}
          />
        </div>
      </CCol>
      <CCol sm={3}>
        <div onClick={()=>router.push("/user/employee/employeebirthdate")} className='dashboard'>
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
        <div onClick={()=>router.push("/user/worklog/list")} className='dashboard'>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={
              <>
                {userWorklogCount} h
              </>
            }
            title="Worklog"
            chart={chart4()}
          />
        </div>
      </CCol>
    </CRow>
  )
}

export default page