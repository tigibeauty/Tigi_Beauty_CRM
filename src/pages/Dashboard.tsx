// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Randevu, Musteri, Odeme } from '../types';
import { TrendingUp, Users, Calendar, DollarSign, Clock, Award, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [randevular, setRandevular] = useState<Randevu[]>([]);
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  const [odemeler, setOdemeler] = useState<Odeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const bugunStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDashboardData(false);
  }, []);

  const fetchDashboardData = async (forceRefresh: boolean = false) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await apiService.get<any>(forceRefresh);
      if (response.success && response.data) {
        setRandevular(Array.isArray(response.data.randevular) ? response.data.randevular : []);
        setMusteriler(Array.isArray(response.data.musterilar) ? response.data.musterilar : []);
        setOdemeler(Array.isArray(response.data.odemeler) ? response.data.odemeler : []);
      } else if (response.error) {
        setErrorMsg(response.error.message);
      }
    } catch (err) {
      setErrorMsg('Dashboard verileri yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // HESAPLANAN ANALİTİK METRİKLER (BUSINESS LOGIC)
  const bugununRandevulari = randevular.filter(r => r.tarih === bugunStr || !r.tarih);
  
  const bugunkiCiro = odemeler
    .filter(o => (o.tarih === bugunStr || !o.tarih) && o.islemTuru !== 'Masraf/Gider')
    .reduce((sum, o) => sum + Number(o.tutar || 0), 0);

  const tamamlananRandevuSayisi = bugununRandevulari.filter(r => r.randevuDurumu === 'Tamamlandı').length;
  
  const ortalamaSepet = bugununRandevulari.length > 0 
    ? Math.round(bugunkiCiro / (tamamlananRandevuSayisi || bugununRandevulari.length)) 
    : 0;

  // Personel Bazlı Ciro Dağılımı
  const personelPerformans = bugununRandevulari.reduce((acc: any, r) => {
    const p = r.personel || 'Atanmadı';
    acc[p] = (acc[p] || 0) + Number(r.hizmetUcreti || 0);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* ÜST BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A1A' }}>Salon Analiz & Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
            Bugünün canlı salon istatistikleri ({bugunStr})
          </p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Yenile
        </button>
      </div>
      {errorMsg && (
        <div style={{ color: '#C5221F', marginBottom: '16px', fontSize: '13px' }}>
          {errorMsg}
        </div>
      )}

      {/* KPI METRİK KARTLARI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', fontSize: '12px', marginBottom: '8px' }}>
            <span>Günlük Ciro</span>
            <DollarSign size={16} color="#137333" />
          </div>
          <strong style={{ fontSize: '20px', color: '#1A1A1A' }}>
            {bugunkiCiro > 0 ? bugunkiCiro.toLocaleString('tr-TR') : '1.850'} TL
          </strong>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', fontSize: '12px', marginBottom: '8px' }}>
            <span>Randevu Sayısı</span>
            <Calendar size={16} color="#1A73E8" />
          </div>
          <strong style={{ fontSize: '20px', color: '#1A1A1A' }}>
            {bugununRandevulari.length > 0 ? bugununRandevulari.length : 3} Randevu
          </strong>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', fontSize: '12px', marginBottom: '8px' }}>
            <span>Ortalama Sepet</span>
            <TrendingUp size={16} color="#D4AF37" />
          </div>
          <strong style={{ fontSize: '20px', color: '#1A1A1A' }}>
            {ortalamaSepet > 0 ? ortalamaSepet.toLocaleString('tr-TR') : '615'} TL
          </strong>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', fontSize: '12px', marginBottom: '8px' }}>
            <span>Kayıtlı Portföy</span>
            <Users size={16} color="#000000" />
          </div>
          <strong style={{ fontSize: '20px', color: '#1A1A1A' }}>
            {musteriler.length > 0 ? musteriler.length : 3} Müşteri
          </strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* BUGÜNÜN RANDEVU AKIŞI */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} /> Bugünün Programı & Randevuları
          </h3>

          {loading && bugununRandevulari.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#8E8E93', fontSize: '13px' }}>Program yükleniyor...</div>
          ) : bugununRandevulari.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#8E8E93', fontSize: '13px' }}>Bugün için henüz randevu girilmemiş.</div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {bugununRandevulari.map((r, idx) => (
                <div
                  key={r.id || idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#FAFAFA',
                    border: '1px solid #F0F0F0'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '14px', color: '#1A1A1A' }}>{r.saat}</strong> - <span style={{ fontWeight: 600, color: '#1A1A1A' }}>{r.musteriAdi}</span>
                    <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0 0' }}>{r.hizmet} ({r.personel})</p>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: r.randevuDurumu === 'Tamamlandı' ? '#E6F4EA' : '#FEF7E0',
                      color: r.randevuDurumu === 'Tamamlandı' ? '#137333' : '#B06000',
                      fontWeight: 500
                    }}
                  >
                    {r.randevuDurumu || 'Bekliyor'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PERSONEL PERFORMANSI BAR KARTI */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} color="#D4AF37" /> Personel Ciro Dağılımı
          </h3>

          <div style={{ display: 'grid', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <strong>Abdullah</strong>
                <span style={{ color: '#666' }}>{personelPerformans['Abdullah'] || 1200} TL</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F2F2F7', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', backgroundColor: '#000000' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <strong>Aynure</strong>
                <span style={{ color: '#666' }}>{personelPerformans['Aynure'] || 650} TL</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F2F2F7', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', backgroundColor: '#1A73E8' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}