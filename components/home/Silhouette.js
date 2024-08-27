export default function Silhouette({ children }) {
    return (
      <div className="silhouette" style={{ position: 'relative' }}>
        <img src="/silhouette.jpg" alt="Silhouette" style={{ position: 'absolute', zIndex: 1 }} />
        {children}
      </div>
    );
  }
  