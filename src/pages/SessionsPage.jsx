import React, { useState } from 'react';
import VideoRoom from '../components/VideoRoom';

export default function SessionsPage({ user, sessions, setSessions, users }) {
  const [showBook, setShowBook] = useState(false);
  const [booking, setBooking] = useState({ date:'', time:'', note:'', type:'counseling' });
  const [inCall, setInCall] = useState(false);
  const isPeer = user.role==='peer';
  const isStudent = user.role==='student';
  const isAdmin = user.role==='admin';
  const isCounselor = user.role==='counselor';
  const userSessions = isStudent ? sessions.filter(s=>s.studentId===user.id) : isAdmin ? sessions : sessions;

  const bookSession = (e) => {
    e.preventDefault();
    const isPeerSession = booking.type==='peer';
    const s = {
      id:'sess'+Date.now(),
      studentId: user.id,
      counselorId: isPeerSession ? 'u6' : 'u1',
      studentName: user.name,
      date: booking.date,
      time: booking.time,
      status: 'upcoming',
      type: 'video',
      sessionType: booking.type,
      anonymous: true,
      notes: booking.note
    };
    setSessions(p=>[...p,s]);
    setShowBook(false);
    setBooking({ date:'', time:'', note:'', type:'counseling' });
  };

  if (inCall) return <VideoRoom onClose={()=>setInCall(false)} counselor={isPeer?'Peer Supporter':'Amara'} />;

  const upcomingSessions = userSessions.filter(s=>s.status==='upcoming');
  const pastSessions = userSessions.filter(s=>s.status==='completed');

  return (
    <div className="animate-fade">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:28}}>
        <div>
          <div className="page-title">{isPeer ? 'Peer Support Sessions' : 'Counseling Sessions'}</div>
          <div className="page-subtitle">Anonymous, safe, and confidential video sessions</div>
        </div>
        {(isStudent&&user.enrolled)||isPeer ? (
          <button className="btn btn-primary" onClick={()=>setShowBook(true)}><i className="fas fa-plus"/>Book Session</button>
        ) : null}
      </div>

      {!user.enrolled&&isStudent&&(
        <div className="alert alert-warning" style={{marginBottom:20}}><i className="fas fa-lock"/>You must be enrolled to book counseling sessions.</div>
      )}

      <div className="alert alert-info" style={{marginBottom:24}}>
        <i className="fas fa-user-secret"/>
        <div>
          <strong>Anonymous by default.</strong> Your face is blurred and voice disguised in every video session.
          {isPeer && ' As a peer supporter, you join sessions to offer lived-experience support alongside the counselor.'}
        </div>
      </div>

      {((isStudent&&user.enrolled)||isPeer||isCounselor) && (
        <div className="card" style={{marginBottom:24,borderLeft:'4px solid #38c88c',display:'flex',alignItems:'center',gap:20}}>
          <div style={{width:56,height:56,borderRadius:'50%',background:'#d1fae5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28}}>🎥</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:16}}>
              {isPeer ? 'Join a Peer Support Video Session' : 'Start Anonymous Video Session'}
            </div>
            <div style={{color:'#6b7280',fontSize:14}}>
              {isPeer
                ? 'Connect with a student as an anonymous peer supporter — your face and voice are also protected'
                : 'Your face is blurred and voice disguised. Click to test the system or start a live session.'}
            </div>
          </div>
          <button className="btn btn-success" onClick={()=>setInCall(true)}><i className="fas fa-video"/>Join Now</button>
        </div>
      )}

      <div style={{marginBottom:16,fontWeight:600,fontSize:16}}>Upcoming Sessions ({upcomingSessions.length})</div>
      <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:28}}>
        {upcomingSessions.map(s=>(
          <div key={s.id} className="card">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:600,fontSize:15}}>{s.studentName}</div>
                <div style={{fontSize:13,color:'#6b7280',marginTop:4}}><i className="fas fa-calendar"/> {s.date} at {s.time}</div>
              </div>
              <button className="btn btn-success btn-sm" onClick={()=>setInCall(true)}><i className="fas fa-video"/>Join</button>
            </div>
          </div>
        ))}
        {upcomingSessions.length===0&&<div style={{color:'#9ca3af',textAlign:'center',padding:'20px'}}>No upcoming sessions</div>}
      </div>

      <div style={{marginBottom:16,fontWeight:600,fontSize:16}}>Past Sessions ({pastSessions.length})</div>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {pastSessions.map(s=>(
          <div key={s.id} className="card" style={{opacity:.7}}>
            <div style={{fontWeight:600,fontSize:15}}>{s.studentName}</div>
            <div style={{fontSize:13,color:'#6b7280',marginTop:4}}><i className="fas fa-calendar"/> {s.date} at {s.time}</div>
            {s.notes&&<div style={{marginTop:8,fontSize:13,color:'#374151',background:'#f9fafb',padding:'10px',borderRadius:8}}>Notes: {s.notes}</div>}
          </div>
        ))}
        {pastSessions.length===0&&<div style={{color:'#9ca3af',textAlign:'center',padding:'20px'}}>No past sessions</div>}
      </div>
    </div>
  );
}
