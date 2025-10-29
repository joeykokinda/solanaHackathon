export default function SkeletonCard() {
  return (
    <div className="card-no-hover" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="skeleton" style={{ aspectRatio: '16/9', width: '100%' }} />
      <div style={{ padding: '1.5rem', paddingTop: '2rem' }}>
        <div className="skeleton" style={{ height: '1.5rem', width: '70%', marginBottom: '0.5rem', borderRadius: '0.25rem' }} />
        <div className="skeleton" style={{ height: '1rem', width: '50%', marginBottom: '1rem', borderRadius: '0.25rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
          <div className="skeleton" style={{ height: '60px', borderRadius: '0.5rem' }} />
          <div className="skeleton" style={{ height: '60px', borderRadius: '0.5rem' }} />
          <div className="skeleton" style={{ height: '60px', borderRadius: '0.5rem' }} />
        </div>
        <div className="skeleton" style={{ height: '2rem', width: '60%', marginBottom: '0.5rem', borderRadius: '0.25rem' }} />
        <div className="skeleton" style={{ height: '1rem', width: '40%', marginBottom: '1rem', borderRadius: '0.25rem' }} />
        <div className="skeleton" style={{ height: '2.5rem', width: '100%', borderRadius: '0.5rem' }} />
      </div>
    </div>
  );
}
