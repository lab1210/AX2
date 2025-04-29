"use client";
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import LeftSidebar from './LeftSidebar';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const attendanceData = [
  { day: 'Mon', present: 85, absent: 15 },
  { day: 'Tues', present: 80, absent: 20 },
  { day: 'Wed', present: 20, absent: 80 },
  { day: 'Thurs', present: 75, absent: 25 },
  { day: 'Fri', present: 90, absent: 10 },
];

const stats = [
  { label: 'Total Classes', value: 10, icon: '👥' },
  { label: 'Total Lessons', value: 10, icon: '💻' },
  { label: 'Total Assignments', value: 10, icon: '📝' },
];

const progress = [
  { className: 'JSS1 A', pupils: 31, percent: 32 },
  { className: 'JSS1 B', pupils: 26, percent: 43 },
  { className: 'JSS1 C', pupils: 20, percent: 67 },
];

const events = [
  { date: 12, title: 'Send Mr Ayo class Schedule', subtitle: 'Send Document via email', time: '8 A.M', status: 'today' },
  { date: 12, title: 'Send Mr Ayo class Schedule', subtitle: 'Send Document via email', time: '8 A.M', status: 'today' },
  { date: 12, title: 'Meet with Prefects', subtitle: 'Have a work flow', time: '8 A.M', status: 'due' },
  { date: 25, title: 'JSS1B Test', subtitle: 'Set Question', time: '8 A.M', status: 'upcoming' },
  { date: 30, title: 'Send a Doc to Admin', subtitle: 'Send Document via email', time: '10:00 A.M', status: 'upcoming' },
];

export default function Dashboard() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="flex min-h-screen bg-gray-100">
      <LeftSidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center">
            <button className="relative mr-4">
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full" />
              🔔
            </button>
            <div className="flex items-center space-x-2">
              <img
                src="/female2.png"
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">Joshua Daniel</p>
                <p className="text-xs text-gray-500">Teacher</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="bg-blue-800 text-white rounded-lg p-6 flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Hi, Mr Joshua</h2>
            <p>Welcome to My Schoolight Portal.</p>
          </div>
          <img
            src="/male_teacher.png"
            alt="Teacher illustration"
            className="w-32 h-32"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">{s.label}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-2xl font-bold">{s.value}</p>
                <span className="text-xl">{s.icon}</span>
              </div>
              <p className="text-xs text-green-500 mt-1">+0.5% than last term</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Attendance Chart */}
          <div className="col-span-2 bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" name="Total Present">
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-present-${index}`} />
                  ))}
                </Bar>
                <Bar dataKey="absent" name="Total Absent">
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-absent-${index}`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right Sidebar Widgets */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-lg shadow p-4">
              <Calendar onChange={setDate} value={date} />
            </div>

            {/* Teaching Progress */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Teaching Progress in English Language</h3>
              <div className="space-y-4">
                {progress.map((p) => (
                  <div key={p.className} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{p.className}</p>
                      <p className="text-sm text-gray-500">{p.pupils} pupils</p>
                    </div>
                    <div className="w-16 h-16 relative">
                      <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path
                          className="text-gray-200"
                          strokeWidth="4"
                          fill="none"
                          d="M18 2.0845
                             a 15.9155 15.9155 0 0 1 0 31.831
                             a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-blue-500"
                          strokeWidth="4"
                          strokeDasharray={`${p.percent}, 100`}
                          fill="none"
                          d="M18 2.0845
                             a 15.9155 15.9155 0 0 1 0 31.831
                             a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.35" className="text-xs text-center" textAnchor="middle">
                          {p.percent}%
                        </text>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Events</h3>
                <button className="text-sm text-blue-600">View All</button>
              </div>
              <ul className="space-y-3">
                {events.map((e, idx) => {
                  const bg = e.status === 'due' ? 'bg-red-100' : e.status === 'upcoming' ? 'bg-yellow-100' : 'bg-blue-50';
                  return (
                    <li key={idx} className={`flex items-center p-3 rounded-lg ${bg}`}>                      
                      <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                        {e.date}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="font-medium">{e.title}</p>
                        <p className="text-xs text-gray-500">{e.subtitle} • {e.time}</p>
                      </div>
                      {e.status === 'due' && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
