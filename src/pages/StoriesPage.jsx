import React, { useState } from 'react';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';

export default function StoriesPage({ user, stories, setStories }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const [likedIds, setLikedIds] = useState([]);
  const categories = ['All','Anxiety','Depression','Grief & Loss','Self-Worth'];
  const filtered = filter==='All'?stories:stories.filter(s=>s.category===filter||s.tags.includes(filter));
  const isAuthorized = user.enrolled||user.role==='peer'||user.role==='counselor'||user.role==='admin';

  if (!isAuthorized) return (
    <div className="animate-fade">
      <div className="page-header"><div className="page-title">Healed Stories</div><div className="page-subtitle">Recovery journeys shared by students who've walked this path</div></div>
      <div className="card" style={{textAlign:'center',padding:'60px 40px'}}>
        <div style={{fontSize:48,marginBottom:20}}>🔒</div>
        <h3 style={{fontSize:20,fontWeight:700,marginBottom:12}}>Access Restricted</h3>
        <p style={{color:'#6b7280',maxWidth:480,margin:'0 auto 24px'}}>Healed Stories are only available to enrolled students. Please submit an enrollment application to access this library.</p>
        <div className="alert alert-info" style={{maxWidth:440,margin:'0 auto'}}>
          <i className="fas fa-info-circle" /> Your application is currently pending. You'll receive access once it's approved.
        </div>
      </div>
    </div>
  );

  if (selected) return (
    <div className="animate-fade">
      <button className="btn btn-outline btn-sm" onClick={()=>setSelected(null)} style={{marginBottom:20}}><i className="fas fa-arrow-left"/>Back to Stories</button>
      <div className="card" style={{maxWidth:760}}>
        <div style={{marginBottom:20}}>
          {selected.tags.map(t=><span key={t} className="tag">{t}</span>)}
        </div>
        <h2 style={{fontSize:22,fontWeight:800,lineHeight:1.4,marginBottom:16}}>{selected.title}</h2>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:24,paddingBottom:20,borderBottom:'1px solid #f3f4f6'}}>
          <div style={{width:36,height:36,borderRadius:'50%',background:selected.authorColor,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:14}}>A</div>
          <div><div style={{fontSize:14,fontWeight:600}}>{selected.author}</div><div style={{fontSize:12,color:'#9ca3af'}}>{selected.date}</div></div>
          <div style={{marginLeft:'auto',display:'flex',gap:16,color:'#9ca3af',fontSize:13}}>
            <span><i className="fas fa-heart" style={{color:'#f43f5e'}} /> {selected.likes+(likedIds.includes(selected.id)?1:0)}</span>
            <span><i className="fas fa-eye" /> {selected.views}</span>
          </div>
        </div>
        {selected.content.split('\n\n').map((p,i)=>(
          <p key={i} style={{fontSize:15,lineHeight:1.85,color:'#374151',marginBottom:20}}>{p}</p>
        ))}
        <div style={{display:'flex',gap:12,marginTop:24}}>
          <button className={`btn ${likedIds.includes(selected.id)?'btn-danger':'btn-outline'} btn-sm`} onClick={()=>setLikedIds(p=>p.includes(selected.id)?p.filter(x=>x!==selected.id):[...p,selected.id])}>
            <i className="fas fa-heart"/>{likedIds.includes(selected.id)?'Liked':'Like this story'}
          </button>
          <button className="btn btn-outline btn-sm"><i className="fas fa-share"/>Share</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-title">Healed Stories</div>
        <div className="page-subtitle">Real journeys of recovery — shared with hope, read in confidence</div>
      </div>
      <div className="alert alert-success" style={{marginBottom:20}}>
        <i className="fas fa-shield-alt"/>
        <div><strong>Confidential access.</strong> These stories are only visible to enrolled members of MindBridge. All authors chose to share anonymously.</div>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
        {categories.map(c=>(
          <button key={c} className={`btn btn-sm ${filter===c?'btn-primary':'btn-outline'}`} onClick={()=>setFilter(c)}>{c}</button>
        ))}
      </div>
      <div className="grid-2">
        {filtered.map(story=>(
          <div key={story.id} className="story-card" onClick={()=>setSelected(story)}>
            <div style={{marginBottom:12}}>{story.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
            <h3 style={{fontSize:16,fontWeight:700,lineHeight:1.45,marginBottom:10,color:'#1f2937'}}>{story.title}</h3>
            <p style={{fontSize:13,color:'#6b7280',lineHeight:1.7,marginBottom:16}}>{story.excerpt}</p>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:story.authorColor,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:12,fontWeight:700}}>A</div>
              <span style={{fontSize:13,color:'#6b7280',flex:1}}>{story.author}</span>
              <span style={{fontSize:12,color:'#9ca3af'}}><i className="fas fa-heart" style={{color:'#f43f5e'}}/> {story.likes}</span>
              <span style={{fontSize:12,color:'#9ca3af',marginLeft:8}}><i className="fas fa-eye"/> {story.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
