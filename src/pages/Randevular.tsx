// src/pages/Randevular.tsx
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Randevu, Musteri, RandevuDurumu, OdemeDurumu } from '../types';
import { Calendar, User, Plus, RefreshCw, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function Randevular() {
  const [randevular, setRandevular] = useState<Randevu[]>([]);
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    musteriID: '',
    tarih: new Date().toISOString().split('T')[0],
    saat: '10:00',
    hizmet: '',
    personel: 'Abdullah',
    sureDk: 60,
    hizmetUcreti: 0,
    depozito: 0,
    not: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await apiService.get<any>();
      if (response.success && response.data) {
        const gelenRandevular = response.data.randevular || [];
        const gelenMusteriler = response.data.musterilar || [];
        
        setRandevular(Array.isArray(gelenRandevular) ? gelenRandevular : []);
        setMusteriler(Array.isArray(gelenMusteriler) ? gelenMusteriler : []);
      } else if (response.error) {
        setErrorMsg(response.error.message);
      }
    } catch (err) {
      setErrorMsg('Randevu verileri yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRandevu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.musteriID || !formData.hizmet) {
      alert('Lütfen müşteri ve hizmet alanlarını doldurun.');
      return;
    }

    const secilenMusteri = musteriler.find((m) => m.id === formData.musteriID);
    const yeniRandevu: Partial<Randevu> = {
      id: 'R' + Math.floor(Math.random() * 10000),
      musteriID: formData.musteriID,
      musteriAdi: secilenMusteri ? secilenMusteri.ad : 'Bilinmiyor',
      tarih: formData.tarih,
      saat: formData.saat,
      hizmet: formData.hizmet,
      personel: formData.personel,
      sureDk: Number(formData.sureDk),
      randevuDurumu: 'Bekliyor' as RandevuDurumu,
      hizmetUcreti: Number(formData.hizmetUcreti),
      depozito: Number(formData.depozito),
      onOdeme: 0,
      odenenTutar: Number(formData.depozito),
      kalanTutar: Number(formData.hizmetUcreti) - Number(formData.depozito),
      odemeDurumu: Number(formData.depozito) > 0 ? ('Depozito' as OdemeDurumu) : ('Ödeme Yok' as OdemeDurumu),
      mesajDurum: 'Bekliyor',
      not: formData.not
    };

    try {
      setLoading(true);
      const res = await apiService.post('yeniRandevu', yeniRandevu);
      if (res.success) {
        setShowModal(false);
        fetchData();
      } else {
        alert('Randevu eklenemedi: ' + (res.error?.message || 'Bilinmeyen hata'));
      }
    } catch (error) {
      alert('API Bağlantı Hatası!');
    } finally {
      setLoading(false);
    }
  };

  const filteredRandevular = randevular.filter(
    (r) => r.tarih === selectedDate || !selectedDate
  );

  const getStatusBadge = (durum: RandevuDurumu) => {
    switch (durum) {
      case 'Tamamlandı':
        return { bg: '#E6F4EA', color: '#137333', icon: CheckCircle };
      case 'İptal':
      case 'Gelmedi':
        return { bg: '#FCE8E6', color: '#C5221F', icon: XCircle };
      case 'Geldi':
        return { bg: '#E8F0FE', color: '#1A73E8', icon: User };
      default:
        return { bg: '#FEF7E0', color: '#B06000', icon: AlertCircle };
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* ÜST BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A1A' }}>Randevu Takvimi</h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
            Günlük ve haftalık randevu takibi
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={fetchData}
            style={{
              backgroundColor: '#F2F2F7',
              color: '#1A1A1A',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowModal(true)}
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
            <Plus size={16} /> Yeni Randevu
          </button>
        </div>
      </div>

      {/* TARİH FİLTRESİ */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Calendar size={18} color="#666" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #EAEAEA',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={() => setSelectedDate('')}
          style={{
            fontSize: '12px',
            color: '#0066CC',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Tümünü Göster
        </button>
      </div>

      {/* LİSTE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', fontSize: '14px' }}>
          Randevular yükleniyor...
        </div>
      ) : errorMsg ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FF3B30', backgroundColor: '#FFF2F2', borderRadius: '12px' }}>
          ⚠️ {errorMsg}
        </div>
      ) : filteredRandevular.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          Bu tarihe ait randevu bulunamadı.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredRandevular.map((r, index) => {
            const BadgeIcon = getStatusBadge(r.randevuDurumu).icon;
            return (
              <div
                key={r.id || index}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #EAEAEA',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '16px', color: '#1A1A1A' }}>{r.saat}</strong>
                      <span style={{ fontSize: '13px', color: '#666' }}>({r.sureDk || 60} dk)</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginLeft: '8px' }}>
                        {r.musteriAdi}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#444', marginTop: '4px', margin: 0 }}>
                      <strong>Hizmet:</strong> {r.hizmet} | <strong>Personel:</strong> {r.personel}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor: getStatusBadge(r.randevuDurumu).bg,
                      color: getStatusBadge(r.randevuDurumu).color,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <BadgeIcon size={12} />
                    {r.randevuDurumu || 'Bekliyor'}
                  </span>
                </div>

                {/* FİNANSAL DETAY KARTI */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                    backgroundColor: '#FAFAFA',
                    padding: '10px',
                    borderRadius: '8px',
                    marginTop: '12px',
                    fontSize: '11px'
                  }}
                >
                  <div>
                    <span style={{ color: '#8E8E93', display: 'block' }}>Ücret</span>
                    <strong style={{ color: '#1A1A1A' }}>{r.hizmetUcreti || 0} TL</strong>
                  </div>
                  <div>
                    <span style={{ color: '#8E8E93', display: 'block' }}>Depozito</span>
                    <strong style={{ color: '#137333' }}>{r.depozito || 0} TL</strong>
                  </div>
                  <div>
                    <span style={{ color: '#8E8E93', display: 'block' }}>Kalan</span>
                    <strong style={{ color: (r.kalanTutar || 0) > 0 ? '#C5221F' : '#137333' }}>
                      {r.kalanTutar || 0} TL
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#8E8E93', display: 'block' }}>Ödeme</span>
                    <strong style={{ color: '#1A1A1A' }}>{r.odemeDurumu || 'Ödeme Yok'}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* YENİ RANDEVU MODAL */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Yeni Randevu Oluştur</h3>
            <form onSubmit={handleAddRandevu} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Müşteri</label>
                <select
                  value={formData.musteriID}
                  onChange={(e) => setFormData({ ...formData, musteriID: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  required
                >
                  <option value="">Müşteri Seçin...</option>
                  {musteriler.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.ad} ({m.telefon})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Tarih</label>
                  <input
                    type="date"
                    value={formData.tarih}
                    onChange={(e) => setFormData({ ...formData, tarih: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Saat</label>
                  <input
                    type="time"
                    value={formData.saat}
                    onChange={(e) => setFormData({ ...formData, saat: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Hizmet</label>
                  <input
                    type="text"
                    placeholder="Örn: Microblading"
                    value={formData.hizmet}
                    onChange={(e) => setFormData({ ...formData, hizmet: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Personel</label>
                  <select
                    value={formData.personel}
                    onChange={(e) => setFormData({ ...formData, personel: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  >
                    <option value="Abdullah">Abdullah</option>
                    <option value="Aynure">Aynure</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Hizmet Ücreti (TL)</label>
                  <input
                    type="number"
                    value={formData.hizmetUcreti}
                    onChange={(e) => setFormData({ ...formData, hizmetUcreti: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Alınan Depozito (TL)</label>
                  <input
                    type="number"
                    value={formData.depozito}
                    onChange={(e) => setFormData({ ...formData, depozito: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #EAEAEA',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Randevuyu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}