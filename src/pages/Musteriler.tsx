// src/pages/Musteriler.tsx
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Musteri } from '../types';
import { Search, Phone, AlertCircle, Award, RefreshCw } from 'lucide-react';

export default function Musteriler() {
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMusteriler(false); // İlk açılışta CACHE'den hızlıca oku
  }, []);

  const fetchMusteriler = async (forceRefresh: boolean = false) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await apiService.get<any>(forceRefresh);
      if (response.success && response.data) {
        const gelenVeri = response.data.musterilar || response.data.musteriler || response.data;
        if (Array.isArray(gelenVeri)) {
          setMusteriler(gelenVeri);
        } else {
          setMusteriler([]);
        }
      } else if (response.error) {
        setErrorMsg(response.error.message);
      } else {
        setMusteriler([]);
      }
    } catch (err) {
      setErrorMsg('Veriler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMusteriler = musteriler.filter((m) =>
    (m.ad || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.telefon || '').includes(searchQuery)
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* ÜST BAŞLIK VE EYLEM BUTONU */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A1A' }}>Müşteri Portföyü</h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
            Toplam {musteriler.length} kayıtlı müşteri
          </p>
        </div>
        <button
          onClick={() => fetchMusteriler(true)} // Butona basıldığında Google Sheets'ten ZORLA yenile
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

      {/* ARAMA ÇUBUĞU */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E8E93' }} />
        <input
          type="text"
          placeholder="İsim veya telefon ile ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            borderRadius: '10px',
            border: '1px solid #EAEAEA',
            backgroundColor: '#FFFFFF',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      {/* MÜŞTERİ LİSTESİ */}
      {loading && musteriler.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', fontSize: '14px' }}>
          Veriler senkronize ediliyor...
        </div>
      ) : errorMsg ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FF3B30', backgroundColor: '#FFF2F2', borderRadius: '12px', border: '1px solid #FFD6D6' }}>
          ⚠️ {errorMsg}
        </div>
      ) : filteredMusteriler.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          Henüz kayıtlı müşteri bulunamadı.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredMusteriler.map((m, index) => (
            <div
              key={m.id || index}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #EAEAEA',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.01)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                    {m.ad || 'İsimsiz Müşteri'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '13px', marginTop: '4px' }}>
                    <Phone size={13} />
                    <span>{m.telefon || 'Telefon Yok'}</span>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    backgroundColor: m.riskSeviyesi?.includes('Alerjik') ? '#FFF2F2' : '#F2F2F7',
                    color: m.riskSeviyesi?.includes('Alerjik') ? '#FF3B30' : '#1A1A1A',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <AlertCircle size={12} />
                  {m.riskSeviyesi || '🟢 Normal'}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  backgroundColor: '#FAFAFA',
                  padding: '10px',
                  borderRadius: '8px',
                  marginTop: '12px',
                  fontSize: '12px'
                }}
              >
                <div>
                  <span style={{ color: '#8E8E93', display: 'block' }}>Ziyaret</span>
                  <strong style={{ color: '#1A1A1A', fontSize: '13px' }}>{m.toplamZiyaret || 0} Kez</strong>
                </div>
                <div>
                  <span style={{ color: '#8E8E93', display: 'block' }}>Cari Bakiye</span>
                  <strong style={{ color: (m.musteriBakiyesi || 0) < 0 ? '#FF3B30' : '#1A1A1A', fontSize: '13px' }}>
                    {m.musteriBakiyesi || 0} TL
                  </strong>
                </div>
                <div>
                  <span style={{ color: '#8E8E93', display: 'block' }}>Sadakat Puanı</span>
                  <strong style={{ color: '#1A1A1A', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Award size={12} color="#D4AF37" /> {m.puan || 0}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}