import React, { useState, useRef, useEffect } from 'react';
import Avatar from '../components/Avatar';

export default function MessagesPage({ user, users, messages, setMessages }) {
  const [activeChat, setActiveChat] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const bottomRef = useRef(null);

  const contacts = users.filter(u => {
    if (u.id===user.id) return false;
    if (user.role==='student') return u.role==='counselor';
    if (user.role==='counselor') return u.role==='student'&&u.enrolled;
    if (user.role==='admin') return u.role==='counselor';
    if (user.role==='peer') return u.role==='student'&&u.enrolled;
    return false;
  });

  const convoWith = (uid) => messages.filter(m=>(m.from===user.id&&m.to===uid)||(m.to===user.id&&m.from===uid));
  const lastMsg = (uid) => { const msgs=convoWith(uid); return msgs[msgs.length-1]; };
  const unread = (uid) => convoWith(uid).filter(m=>m.from===uid&&!m.read).length;

  const sendMsg = () => {
    if(!newMsg.trim()||!activeChat) return;
    const msg={id:'msg'+Date.now(),from:user.id,to:activeChat.id,text:newMsg.trim(),time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),date:'Today'};
    setMessages(p=>[...p,msg]);
    setNewMsg('');
    if(activeChat.role==='counselor') {
      const replies=["Thank you for sharing. How are you feeling right now?","I understand. Let's explore that further in our next session.","That's a great observation. Keep journaling about this.","Remember, progress isn't always linear. You're doing well."];
      setTimeout(()=>{
        setMessages(p=>[...p,{id:'msg'+(Date.now()+1),from:activeChat.id,to:user.id,text:replies[Math.floor(Math.random()*replies.length)],time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),date:'Today'}]);
      },1500+Math.random()*1000);
    }
  };

  useEffect(()=>{ if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:'smooth'}); },[messages,activeChat]);

  const convo = activeChat ? convoWith(activeChat.id) : [];

  return (
    <div className="animate-fade">
      <div className="page-header"><div className="page-title">Messages</div><div className="page-subtitle">Secure messaging with your support team</div></div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'280px 1fr',height:'60vh'}}>
          <div style={{borderRight:'1px solid #f3f4f6',overflow:'auto'}}>
            <div style={{padding:'16px',borderBottom:'1px solid #f3f4f6',fontWeight:600,fontSize:14,color:'#374151'}}>Conversations</div>
            {contacts.length===0&&<div style={{padding:20,color:'#9ca3af',fontSize:14,textAlign:'center'}}>No contacts yet</div>}
            {contacts.map(c=>{
              const lm=lastMsg(c.id); const cnt=unread(c.id);
              return (
                <div key={c.id} onClick={()=>setActiveChat(c)} style={{padding:'14px 16px',cursor:'pointer',background:(activeChat&&activeChat.id===c.id)?'#eef0ff':'transparent',borderBottom:'1px solid #f9fafb',display:'flex',gap:12,alignItems:'center',transition:'background .15s'}}>
                  <div style={{position:'relative'}}>
                    <Avatar name={c.name} color={c.color} size={40} />
                    {c.online&&<div style={{width:10,height:10,borderRadius:'50%',background:'#38c88c',position:'absolute',bottom:0,right:0,border:'2px solid #fff'}} />}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontWeight:600,fontSize:14,color:'#1f2937'}}>{c.name.split(' ')[0]} {c.name.split(' ')[1]?c.name.split(' ')[1][0]+'.':''}</span>
                      {cnt>0&&<span style={{background:'#5b6cf9',color:'#fff',borderRadius:'50%',width:18,height:18,fontSize:11,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{cnt}</span>}
                    </div>
                    <div style={{fontSize:12,color:'#9ca3af',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{lm?lm.text:'No messages yet'}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {activeChat ? (
            <div style={{display:'flex',flexDirection:'column'}}>
              <div style={{padding:'14px 20px',borderBottom:'1px solid #f3f4f6',display:'flex',alignItems:'center',gap:12}}>
                <Avatar name={activeChat.name} color={activeChat.color} size={36} />
                <div><div style={{fontWeight:600,fontSize:15}}>{activeChat.name}</div><div style={{fontSize:12,color:activeChat.online?'#38c88c':'#9ca3af'}}>{activeChat.online?'Online':'Offline'}</div></div>
                <div style={{marginLeft:'auto',display:'flex',gap:8}}>
                  <button className="btn btn-outline btn-sm"><i className="fas fa-video"/>Video Call</button>
                </div>
              </div>
              <div style={{flex:1,overflow:'auto',padding:'20px',display:'flex',flexDirection:'column'}}>
                {convo.length===0&&<div style={{textAlign:'center',color:'#9ca3af',fontSize:14,marginTop:40}}>No messages yet. Say hello!</div>}
                {convo.map(m=>(
                  <div key={m.id} style={{marginBottom:12,display:'flex',flexDirection:m.from===user.id?'row-reverse':'row',alignItems:'flex-end',gap:8}}>
                    {m.from!==user.id&&<Avatar name={activeChat.name} color={activeChat.color} size={28} fontSize={11} />}
                    <div>
                      <div className={`chat-bubble ${m.from===user.id?'bubble-out':'bubble-in'}`}>{m.text}</div>
                      <div style={{fontSize:11,color:'#9ca3af',textAlign:m.from===user.id?'right':'left',marginTop:2}}>{m.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef}/>
              </div>
              <div style={{padding:'14px 20px',borderTop:'1px solid #f3f4f6',display:'flex',gap:10}}>
                <input className="input" value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder="Type a message..." style={{flex:1}} />
                <button className="btn btn-primary btn-sm" onClick={sendMsg}><i className="fas fa-paper-plane"/></button>
              </div>
            </div>
          ) : (
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',color:'#9ca3af',flexDirection:'column',gap:12}}>
              <i className="fas fa-comments" style={{fontSize:40,opacity:.4}}/>
              <span style={{fontSize:15}}>Select a conversation</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
