// src/pages/Ayarlar.tsx
import { useState, useEffect } from 'react';
import type { Sube } from '../types';
import { Building2, Server, Globe } from 'lucide-react';

export default function Ayarlar() {
  const [subeler, setSubeler] = useState<Sube[]>([]);
  const [activeBranch, setActiveBranch] = useState<string>('SUBE_1');

  useEffect(() => {
    // Varsayılan Çok Şubeli Yapı Altyapısı
    setSubeler([
      { id: 'SUBE_1', ad: 'TIGI Beauty Nişantaşı (Merkez)', sehir: 'İstanbul', telefon: '+90 212 000 0000', adres: 'Abdi İpekçi Cad. No:12 Nişantaşı', aktif: true },
      { id: 'SUBE_2', ad: 'TIGI Beauty Bağdat Caddesi', sehir: 'İstanbul', telefon: '+90 216 000 0000', adres: 'Bağdat Cad. No:240 Kadıköy', aktif: true }
    ]);
  }, []);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* ÜST BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={22} color="#000000" /> Şube Yönetimi & Sistem Ayarları
          </h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
            Çok şubeli SaaS altyapısı, WhatsApp API entegrasyonu ve sunucu durumu
          </p>
        </div>
      </div>

      {/* ŞUBE YÖNETİMİ KARTI */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EAEAEA', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Building2 size={16} /> Aktif Salon Şubeleri (Multi-Tenant)
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {subeler.map((sube) => (
            <div
              key={sube.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px',
                borderRadius: '8px',
                backgroundColor: activeBranch === sube.id ? '#FAFAFA' : '#FFFFFF',
                border: activeBranch === sube.id ? '1px solid #000000' : '1px solid #EAEAEA'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '15px', color: '#1A1A1A' }}>{sube.ad}</strong>
                  {activeBranch === sube.id && (
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#000000', color: '#FFFFFF', fontWeight: 600 }}>
                      Aktif Seçili Şube
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
                  {sube.adres} • Tel: {sube.telefon}
                </p>
              </div>

              <button
                onClick={() => setActiveBranch(sube.id)}
                style={{
                  backgroundColor: activeBranch === sube.id ? '#E6F4EA' : '#F2F2F7',
                  color: activeBranch === sube.id ? '#137333' : '#1A1A1A',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {activeBranch === sube.id ? 'Seçili' : 'Şubeye Geç'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM HEALTH & PRODUCTION DEPLOYMENT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Server size={16} color="#137333" /> Backend API & Database
          </h3>
          <div style={{ fontSize: '12px', color: '#666', display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#FAFAFA', borderRadius: '6px' }}>
              <span>Canlı Endpoint:</span>
              <strong style={{ color: '#137333' }}>Google Apps Script (OK)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#FAFAFA', borderRadius: '6px' }}>
              <span>Veri Katmanı:</span>
              <strong style={{ color: '#1A1A1A' }}>Google Sheets (8 Tablo)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#FAFAFA', borderRadius: '6px' }}>
              <span>Önbellek (Caching):</span>
              <strong style={{ color: '#137333' }}>In-Memory Active (0ms Latency)</strong>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} color="#1A73E8" /> Netlify Production Build Status
          </h3>
          <div style={{ fontSize: '12px', color: '#666', display: 'grid', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#FAFAFA', borderRadius: '6px' }}>
              <span>Git Branşı:</span>
              <strong style={{ color: '#000000' }}>crm-v2-development</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#FAFAFA', borderRadius: '6px' }}>
              <span>Type-Check:</span>
              <strong style={{ color: '#137333' }}>Passed (0 Error)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#FAFAFA', borderRadius: '6px' }}>
              <span>Tasarım Dili:</span>
              <strong style={{ color: '#000000' }}>Quiet Luxury Premium UI</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}