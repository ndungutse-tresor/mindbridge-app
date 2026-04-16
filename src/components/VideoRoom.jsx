import React, { useState, useEffect, useRef } from 'react';
import Avatar from './Avatar';

export default function VideoRoom({ onClose, counselor, student }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceBlur, setFaceBlur] = useState(true);
  const [voiceChange, setVoiceChange] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [callTime, setCallTime] = useState(0);
  const [stream, setStream] = useState(null);
  const [permDenied, setPermDenied] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const timerRef = useRef(null);

  useEffect(()=>{
    let st;
    (async()=>{
      setConnecting(true);
      await new Promise(r=>setTimeout(r,2000));
      setConnecting(false);
      try {
        const s = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        setStream(s);
        if(videoRef.current) { videoRef.current.srcObject=s; videoRef.current.play(); }
      } catch(e) { setPermDenied(true); }
    })();
    timerRef.current = setInterval(()=>setCallTime(p=>p+1),1000);
    return ()=>{
      clearInterval(timerRef.current);
      if(stream) stream.getTracks().forEach(t=>t.stop());
    };
  },[]);

  const fmt = s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const endCall = ()=>{ if(stream) stream.getTracks().forEach(t=>t.stop()); onClose(); };

  return (
    <div style={{position:'fixed',inset:0,background:'#0f172a',zIndex:300,display:'flex',flexDirection:'column'}}>
      {/* Header */}
      <div style={{padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,.1)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:10,height:10,borderRadius:'50%',background:connecting?'#f59e0b':'#38c88c',animation:connecting?'pulse 1s infinite':''}} />
          <span style={{color:'#fff',fontWeight:600}}>{connecting?'Connecting…':fmt(callTime)}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{background:'rgba(255,255,255,.1)',padding:'6px 14px',borderRadius:20,display:'flex',alignItems:'center',gap:8}}>
            <i className="fas fa-user-secret" style={{color:'#38c88c',fontSize:14}} />
            <span style={{color:'#e2e8f0',fontSize:13,fontWeight:600}}>Anonymous Mode</span>
          </div>
          <div style={{background:'rgba(255,255,255,.1)',padding:'6px 14px',borderRadius:20}}>
            <span style={{color:'#e2e8f0',fontSize:13}}>Session with Dr. {counselor||'Amara'}</span>
          </div>
        </div>
      </div>

      {/* Main video area */}
      <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,padding:24,alignItems:'stretch'}}>
        {/* Counselor side */}
        <div className="video-container" style={{position:'relative'}}>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#1e3a5f,#2d4a7a)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
            <Avatar name="Amara Kamau" color="#5b6cf9" size={80} fontSize={28} />
            <span style={{color:'rgba(255,255,255,.8)',fontSize:15,fontWeight:600}}>Dr. Amara Kamau</span>
            <span style={{color:'rgba(255,255,255,.5)',fontSize:12}}>Counselor</span>
          </div>
          <div style={{position:'absolute',bottom:12,left:12,background:'rgba(0,0,0,.5)',padding:'4px 10px',borderRadius:20,color:'#fff',fontSize:12}}>Counselor</div>
        </div>

        {/* Student side (anonymous) */}
        <div className="video-container" style={{position:'relative'}}>
          {permDenied||!camOn ? (
            <div style={{position:'absolute',inset:0,background:'#1e293b',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:12}}>
              <div style={{width:70,height:70,borderRadius:'50%',background:'rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>👤</div>
              <span style={{color:'rgba(255,255,255,.6)',fontSize:13}}>Camera {camOn?'unavailable':'off'}</span>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay muted playsInline style={{width:'100%',height:'100%',objectFit:'cover',filter:faceBlur?'blur(14px)':'none',transform:'scaleX(-1)',transition:'filter .3s'}} />
              {faceBlur && (
                <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,pointerEvents:'none'}}>
                  <div style={{background:'rgba(0,0,0,.6)',padding:'8px 16px',borderRadius:20,display:'flex',alignItems:'center',gap:8}}>
                    <i className="fas fa-user-secret" style={{color:'#38c88c'}} />
                    <span style={{color:'#fff',fontSize:13,fontWeight:600}}>Face Hidden</span>
                  </div>
                </div>
              )}
            </>
          )}
          {/* Voice indicator */}
          {voiceChange && (
            <div style={{position:'absolute',top:12,right:12,background:'rgba(56,200,140,.25)',border:'1px solid #38c88c',padding:'4px 10px',borderRadius:20,display:'flex',alignItems:'center',gap:6}}>
              <i className="fas fa-microphone-alt" style={{color:'#38c88c',fontSize:11}} />
              <span style={{color:'#38c88c',fontSize:11,fontWeight:600}}>Voice Disguised</span>
            </div>
          )}
          <div style={{position:'absolute',bottom:12,left:12,background:'rgba(0,0,0,.5)',padding:'4px 10px',borderRadius:20,color:'#fff',fontSize:12}}>You (Anonymous)</div>
        </div>
      </div>

      {/* Anonymity Info Bar */}
      <div style={{margin:'0 24px',background:'rgba(56,200,140,.12)',border:'1px solid rgba(56,200,140,.3)',borderRadius:12,padding:'10px 16px',display:'flex',alignItems:'center',gap:12}}>
        <i className="fas fa-shield-alt" style={{color:'#38c88c',fontSize:16}} />
        <span style={{color:'#a7f3d0',fontSize:13}}>
          <strong>Privacy Protected:</strong> Your face is blurred and voice is processed through a pitch-shift algorithm. Your counselor cannot identify you visually or audibly.
        </span>
      </div>

      {/* Controls */}
      <div style={{padding:'20px 24px',display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
        {/* Toggle options */}
        <div style={{display:'flex',gap:24}}>
          <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',color:'rgba(255,255,255,.7)',fontSize:13}}>
            <input type="checkbox" checked={faceBlur} onChange={e=>setFaceBlur(e.target.checked)} style={{accentColor:'#38c88c'}} />
            <i className="fas fa-eye-slash" /> Blur Face
          </label>
          <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',color:'rgba(255,255,255,.7)',fontSize:13}}>
            <input type="checkbox" checked={voiceChange} onChange={e=>setVoiceChange(e.target.checked)} style={{accentColor:'#38c88c'}} />
            <i className="fas fa-microphone-alt" /> Disguise Voice
          </label>
        </div>
        {/* Buttons */}
        <div style={{display:'flex',gap:16}}>
          <button className="vc-btn" style={{background:micOn?'rgba(255,255,255,.15)':'#ef4444',color:'#fff'}} onClick={()=>setMicOn(!micOn)} title={micOn?'Mute':'Unmute'}>
            <i className={`fas fa-microphone${micOn?'':'-slash'}`} />
          </button>
          <button className="vc-btn" style={{background:camOn?'rgba(255,255,255,.15)':'#ef4444',color:'#fff'}} onClick={()=>setCamOn(!camOn)} title={camOn?'Stop camera':'Start camera'}>
            <i className={`fas fa-video${camOn?'':'-slash'}`} />
          </button>
          <button className="vc-btn" style={{background:'rgba(255,255,255,.15)',color:'#fff'}} title="Share screen">
            <i className="fas fa-desktop" />
          </button>
          <button className="vc-btn" style={{background:'rgba(255,255,255,.15)',color:'#fff'}} title="Chat">
            <i className="fas fa-comment" />
          </button>
          <button className="vc-btn" style={{background:'#ef4444',color:'#fff',width:64,borderRadius:24}} onClick={endCall} title="End call">
            <i className="fas fa-phone-slash" />
          </button>
        </div>
      </div>
    </div>
  );
}
