import React from 'react';
import Avatar from '../components/Avatar';
import WellnessResourcesPage from './WellnessResourcesPage';

export default function Dashboard({ user, users, stories, sessions, applications, setPage, setInVideoRoom }) {
  const enrolledStudents = users.filter(u=>u.role==='student'&&u.enrolled).length;
  const pendingApps = applications.filter(a=>a.status==='pending').length;
  const upcomingSessions = sessions.filter(s=>s.status==='upcoming').length;
  const myStudents = user.role==='counselor'?sessions.filter(s=>s.counselorId===user.id).map(s=>s.studentId):[];

  if(user.role==='admin') return (
    <div className="animate-fade">
      <div className="page-header"><div className="page-title">Admin Dashboard</div><div className="page-subtitle">MindBridge platform overview</div></div>
      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#eef0ff',color:'#5b6cf9'}}>👥</div>
          <div className="stat-value">{enrolledStudents}</div>
          <div className="stat-label">Enrolled Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#fff1f3',color:'#f43f5e'}}>📋</div>
          <div className="stat-value">{pendingApps}</div>
          <div className="stat-label">Pending Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#d1fae5',color:'#38c88c'}}>🎥</div>
          <div className="stat-value">{upcomingSessions}</div>
          <div className="stat-label">Upcoming Sessions</div>
        </div>
      </div>
    </div>
  );

  if(user.role==='student'||user.role==='peer') return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-title">Welcome, {user.name.split(' ')[0]}!</div>
        <div className="page-subtitle">{user.enrolled?'You are enrolled and have full access to all features.':'Your application is being reviewed.'}</div>
      </div>
      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#f0fdf4',color:'#38c88c'}}>📖</div>
          <div className="stat-value">{stories.length}</div>
          <div className="stat-label">Stories Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#eff6ff',color:'#5b6cf9'}}>🎥</div>
          <div className="stat-value">{sessions.filter(s=>s.studentId===user.id).length}</div>
          <div className="stat-label">My Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#f3effe',color:'#8b5cf6'}}>💚</div>
          <div className="stat-value">{stories.reduce((sum,s)=>sum+s.likes,0)}</div>
          <div className="stat-label">Community Likes</div>
        </div>
      </div>
    </div>
  );

  if(user.role==='counselor') return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-title">Counselor Dashboard</div>
        <div className="page-subtitle">Your schedule and student updates</div>
      </div>
      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#eef0ff',color:'#5b6cf9'}}>👥</div>
          <div className="stat-value">{new Set(myStudents).size}</div>
          <div className="stat-label">Students You Support</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#fffbeb',color:'#f59e0b'}}>📅</div>
          <div className="stat-value">{sessions.filter(s=>s.counselorId===user.id&&s.status==='upcoming').length}</div>
          <div className="stat-label">Upcoming Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'#f0fdf4',color:'#38c88c'}}>✅</div>
          <div className="stat-value">{sessions.filter(s=>s.counselorId===user.id&&s.status==='completed').length}</div>
          <div className="stat-label">Completed Sessions</div>
        </div>
      </div>
    </div>
  );

  return null;
}
