export default function Sidebar() {
  return (
    <aside style={{
      width: 72, background: '#fff', borderRight: '1px solid #e8e8e8',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '16px 0', position: 'fixed', top: 0, left: 0, bottom: 0,
      zIndex: 100, gap: 8
    }}>
      <div style={{
        width: 36, height: 36, background: '#1a1a1a', borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: 18, marginBottom: 16, cursor: 'pointer',
        fontFamily: 'Pacifico, cursive'
      }}>P</div>

      <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
        {/* 홈 */}
        <button style={navStyle(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </button>
        {/* 알림 */}
        <button style={navStyle()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
        {/* 추가 */}
        <button style={navStyle()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </button>
        {/* 친구 */}
        <button style={{ ...navStyle(), position: 'relative' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
          <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, background: '#ff4d4d', borderRadius: '50%', border: '2px solid white' }} />
        </button>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button style={navStyle()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}

function navStyle(active = false) {
  return {
    width: 48, height: 48, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', border: 'none',
    background: active ? '#f4f4f0' : 'transparent',
    color: active ? '#1a1a1a' : '#888',
  } as React.CSSProperties;
}