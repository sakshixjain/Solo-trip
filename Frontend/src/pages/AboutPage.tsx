import React from 'react';
import { ShieldCheck, Compass, Users, Heart, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            About SoloTrip
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            We believe solo travel is the ultimate catalyst for personal freedom, self-reliance, and genuine empathy across cultures.
          </p>
        </div>

        {/* Mission Card */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
            color: '#ffffff', 
            borderRadius: 24, 
            padding: '40px 36px', 
            marginBottom: 48,
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#38bdf8', fontWeight: 700, marginBottom: 12 }}>
            <Compass size={24} /> OUR CORE MISSION
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: 16 }}>
            Eliminating Fear. Empowering Wanderers.
          </h2>
          <p style={{ fontSize: '1.02rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
            Over 70% of people dream of traveling solo, yet fear of safety, loneliness, and logistics prevents them from taking the first step. SoloTrip was created to bridge this gap: curated itineraries with certified on-ground leaders, vetted solo-friendly stays, and an active community ready to welcome you with open arms.
          </p>
        </div>

        {/* 3 Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 48 }}>
          <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <ShieldCheck size={28} color="#10b981" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>100% Vetted Stays</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Every hostel, boutique stay, and homestay undergoes a 25-point safety and hygiene inspection.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <Users size={28} color="#0284c7" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>No Solo Alienation</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Connect with fellow solo wanderers before you even board your bus or flight.
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: 24, borderRadius: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <Heart size={28} color="#f43f5e" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>Respect for Locals</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              We collaborate with local guides and family-run stays to support indigenous economies.
            </p>
          </div>
        </div>

        {/* Solo Safety Checklist */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 20, padding: 36, border: '1px solid var(--border-light)', marginBottom: 48, boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 20, color: 'var(--text-primary)' }}>
            Solo Safety Guidelines
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Share Your Live Itinerary:</strong> Always ensure at least one family member or friend has access to your live GPS location and stay addresses.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Offline Navigation:</strong> Download offline Google Maps for mountain regions where cellular connectivity can drop.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Emergency First-Aid:</strong> Carry personal essential medications, water purification tablets for high-altitude treks, and emergency cash.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
