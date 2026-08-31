import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../services/api';
import { Activity, Database, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [status, setStatus] = useState<string>('Checking...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API_URL}/`)
      .then((res) => {
        if (!mounted) return;
        setStatus(typeof res.data === 'string' ? res.data : JSON.stringify(res.data));
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Error connecting to backend');
        setStatus('Unavailable');
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', background: 'var(--bg-surface)', borderRadius: 24, padding: 36, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid var(--border-light)', paddingBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Backend & API Health Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Diagnostic status for Express + Sequelize backend</p>
          </div>
          <Link to="/" className="btn btn-primary btn-sm">
            Go to SoloTrip App <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
          <div style={{ background: 'var(--bg-subtle)', padding: 18, borderRadius: 14, border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Database size={16} color="#0284c7" /> API Server Base
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{API_URL}</div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: 18, borderRadius: 14, border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Activity size={16} color="#10b981" /> Health Response
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: status.includes('running') ? '#10b981' : 'var(--text-primary)' }}>
              {status}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: 14, borderRadius: 12, marginBottom: 24, fontSize: '0.9rem' }}>
            <strong>Connection Error:</strong> {error}
          </div>
        )}

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Active API Endpoints</h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <li style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <code>POST /register</code> — Create new user
          </li>
          <li style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <code>POST /login</code> — Authenticate and return JWT token
          </li>
          <li style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <code>GET /api/places</code> — Fetch all destination places
          </li>
          <li style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <code>GET /api/trips</code> — Fetch all curated trips
          </li>
          <li style={{ padding: '8px 12px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
            <code>GET /api/categories</code> — Fetch category tags
          </li>
        </ul>
      </div>
    </div>
  );
}
