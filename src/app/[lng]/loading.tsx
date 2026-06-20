export default function Loading() {
  return (
    <div
      className="section-spacing"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <div className="loading-spinner-large">
        <div className="loading-spinner-ring" />
        <div className="loading-spinner-ring loading-spinner-ring-inner" />
      </div>
    </div>
  );
}
