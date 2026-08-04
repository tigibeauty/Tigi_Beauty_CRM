// src/pages/Finans.tsx
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Odeme, IslemTuru, OdemeYontemi, Musteri } from '../types';
import { DollarSign, CreditCard, ArrowUpRight, ArrowDownLeft, Plus, RefreshCw, Wallet } from 'lucide-react';

export default function Finans() {
  const [odemeler, setOdemeler] = useState<Odeme[]>([]);
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isGiderModal, setIsGiderModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Odeme>>({
    musteriID: '',
    tarih: new Date().toISOString().split('T')[0],
    islemTuru: 'Hizmet Ödemesi' as IslemTuru,
    tutar: 0,
    odemeYontemi: 'Nakit' as OdemeYontemi,
    personel: 'Abdullah',
    aciklama: ''
  });

  useEffect(() => {
    fetchFinansData(false);
  }, []);

  const fetchFinansData = async (forceRefresh: boolean = false) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await apiService.get<any>(forceRefresh);
      if (response.success && response.data) {
        const gelenOdemeler = response.data.odemeler || response.data.islemler || [];
        const gelenMusteriler = response.data.musterilar || response.data.musteriler || [];
        
        setMusteriler(Array.isArray(gelenMusteriler) ? gelenMusteriler : []);

        if (Array.isArray(gelenOdemeler) && gelenOdemeler.length > 0) {
          setOdemeler(gelenOdemeler);
        } else {
          // Varsayılan Kasa/Finans Demo Verileri
          const bugun = new Date().toISOString().split('T')[0];
          setOdemeler([
            { id: 'O1', musteriID: 'M1', musteriAdi: 'Ayşe Yılmaz', tarih: bugun, islemTuru: 'Hizmet Ödemesi', tutar: 500, odemeYontemi: 'Kredi Kartı', personel: 'Abdullah', aciklama: 'Saç & Fön Ödemesi' },
            { id: 'O2', musteriID: 'M2', musteriAdi: 'Elif Kaya', tarih: bugun, islemTuru: 'Depozito', tutar: 200, odemeYontemi: 'Havale/EFT', personel: 'Aynure', aciklama: 'Protez Tırnak Randevu Depozitosu' },
            { id: 'O3', musteriID: '-', musteriAdi: 'Gider / Tedarik', tarih: bugun, islemTuru: 'Masraf/Gider', tutar: 350, odemeYontemi: 'Nakit', personel: 'Abdullah', aciklama: 'Boya & Sarf Malzeme Alımı' }
          ]);
        }
      } else if (response.error) {
        setErrorMsg(response.error.message);
      }
    } catch (err) {
      setErrorMsg('Finansal veriler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIslem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tutar || formData.tutar <= 0) {
      alert('Lütfen geçerli bir tutar giriniz.');
      return;
    }

    const secilenMusteri = musteriler.find(m => m.id === formData.musteriID);
    const yeniOdeme: Odeme = {
      id: 'O' + Math.floor(Math.random() * 10000),
      randevuID: '',
      musteriID: formData.musteriID || '-',
      musteriAdi: isGiderModal ? 'Gider Kaydı' : (secilenMusteri ? secilenMusteri.ad : 'Genel Müşteri'),
      tarih: formData.tarih || new Date().toISOString().split('T')[0],
      islemTuru: isGiderModal ? ('Masraf/Gider' as IslemTuru) : (formData.islemTuru || 'Hizmet Ödemesi'),
      tutar: Number(formData.tutar),
      odemeYontemi: formData.odemeYontemi || 'Nakit',
      personel: formData.personel || 'Abdullah',
      aciklama: formData.aciklama || ''
    };

    try {
      setLoading(true);
      const res = await apiService.post('yeniOdeme', yeniOdeme);
      if (res.success) {
        setOdemeler([yeniOdeme, ...odemeler]);
        setShowModal(false);
      } else {
        setOdemeler([yeniOdeme, ...odemeler]);
        setShowModal(false);
      }
    } catch (error) {
      setOdemeler([yeniOdeme, ...odemeler]);
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  // KASA VE METRİK HESAPLAMALARI
  const toplamGelir = odemeler
    .filter(o => o.islemTuru !== 'Masraf/Gider' && o.islemTuru !== 'İade')
    .reduce((sum, o) => sum + Number(o.tutar || 0), 0);

  const toplamGider = odemeler
    .filter(o => o.islemTuru === 'Masraf/Gider' || o.islemTuru === 'İade')
    .reduce((sum, o) => sum + Number(o.tutar || 0), 0);

  const netKasa = toplamGelir - toplamGider;

  const nakitToplam = odemeler
    .filter(o => o.odemeYontemi === 'Nakit' && o.islemTuru !== 'Masraf/Gider')
    .reduce((sum, o) => sum + Number(o.tutar || 0), 0);

  const kartToplam = odemeler
    .filter(o => o.odemeYontemi === 'Kredi Kartı')
    .reduce((sum, o) => sum + Number(o.tutar || 0), 0);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* ÜST BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A1A' }}>Kasa & Finans Yönetimi</h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
            Günlük tahsilatlar, masraflar ve kasa mutabakatı
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => fetchFinansData(true)}
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
            onClick={() => { setIsGiderModal(true); setShowModal(true); }}
            style={{
              backgroundColor: '#FFF2F2',
              color: '#FF3B30',
              border: '1px solid #FFD6D6',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ArrowDownLeft size={16} /> Gider Ekle
          </button>
          <button
            onClick={() => { setIsGiderModal(false); setShowModal(true); }}
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
            <Plus size={16} /> Tahsilat Gir
          </button>
        </div>
      </div>

      {/* FINANS ÖZET KARTLARI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', fontSize: '12px', marginBottom: '6px' }}>
            <span>Net Kasa Durumu</span>
            <Wallet size={16} color="#000000" />
          </div>
          <strong style={{ fontSize: '20px', color: netKasa >= 0 ? '#137333' : '#FF3B30' }}>
            {netKasa.toLocaleString('tr-TR')} TL
          </strong>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', fontSize: '12px', marginBottom: '6px' }}>
            <span>Nakit Kasa</span>
            <DollarSign size={16} color="#137333" />
          </div>
          <strong style={{ fontSize: '20px', color: '#1A1A1A' }}>
            {nakitToplam.toLocaleString('tr-TR')} TL
          </strong>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', fontSize: '12px', marginBottom: '6px' }}>
            <span>Kredi Kartı / EFT</span>
            <CreditCard size={16} color="#1A73E8" />
          </div>
          <strong style={{ fontSize: '20px', color: '#1A1A1A' }}>
            {kartToplam.toLocaleString('tr-TR')} TL
          </strong>
        </div>
      </div>

      {/* İŞLEM GEÇMİŞİ LİSTESİ */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', fontSize: '14px' }}>
          Finansal hareketler yükleniyor...
        </div>
      ) : errorMsg ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FF3B30', backgroundColor: '#FFF2F2', borderRadius: '12px' }}>
          ⚠️ {errorMsg}
        </div>
      ) : odemeler.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          Henüz kasa hareketi bulunmuyor.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {odemeler.map((o) => {
            const isGider = o.islemTuru === 'Masraf/Gider' || o.islemTuru === 'İade';
            return (
              <div
                key={o.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid #EAEAEA',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isGider ? '#FFF2F2' : '#E6F4EA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isGider ? '#FF3B30' : '#137333'
                    }}
                  >
                    {isGider ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                      {o.musteriAdi}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0 0' }}>
                      {o.islemTuru} • {o.odemeYontemi} • Uzman: {o.personel}
                    </p>
                    {o.aciklama && (
                      <span style={{ fontSize: '11px', color: '#8E8E93', display: 'block', marginTop: '2px' }}>
                        {o.aciklama}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: isGider ? '#FF3B30' : '#137333'
                    }}
                  >
                    {isGider ? '-' : '+'}{Number(o.tutar).toLocaleString('tr-TR')} TL
                  </span>
                  <span style={{ fontSize: '11px', color: '#8E8E93', display: 'block', marginTop: '2px' }}>
                    {o.tarih}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* YENİ İŞLEM / GİDER MODALI */}
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
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
              {isGiderModal ? 'Gider / Masraf Ekle' : 'Yeni Tahsilat Girişi'}
            </h3>
            <form onSubmit={handleAddIslem} style={{ display: 'grid', gap: '12px' }}>
              {!isGiderModal && (
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Müşteri</label>
                  <select
                    value={formData.musteriID}
                    onChange={(e) => setFormData({ ...formData, musteriID: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  >
                    <option value="">Genel Müşteri / Seçiniz</option>
                    {musteriler.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.ad} ({m.telefon})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Tutar (TL)</label>
                  <input
                    type="number"
                    value={formData.tutar}
                    onChange={(e) => setFormData({ ...formData, tutar: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA', fontWeight: 600, fontSize: '16px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Ödeme Yöntemi</label>
                  <select
                    value={formData.odemeYontemi}
                    onChange={(e) => setFormData({ ...formData, odemeYontemi: e.target.value as OdemeYontemi })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  >
                    <option value="Nakit">Nakit</option>
                    <option value="Kredi Kartı">Kredi Kartı</option>
                    <option value="Havale/EFT">Havale/EFT</option>
                  </select>
                </div>
              </div>

              {!isGiderModal && (
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>İşlem Türü</label>
                  <select
                    value={formData.islemTuru}
                    onChange={(e) => setFormData({ ...formData, islemTuru: e.target.value as IslemTuru })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  >
                    <option value="Hizmet Ödemesi">Hizmet Ödemesi</option>
                    <option value="Depozito">Depozito</option>
                    <option value="Ön Ödeme">Ön Ödeme</option>
                    <option value="Paket Satışı">Paket Satışı</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>İşlemi Yapan Personel</label>
                <select
                  value={formData.personel}
                  onChange={(e) => setFormData({ ...formData, personel: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                >
                  <option value="Abdullah">Abdullah</option>
                  <option value="Aynure">Aynure</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Açıklama / Not</label>
                <input
                  type="text"
                  placeholder={isGiderModal ? 'Örn: Şampuan ve sarf malzeme alımı' : 'Örn: Fön ve bakım ödemesi'}
                  value={formData.aciklama}
                  onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                />
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
                    backgroundColor: isGiderModal ? '#FF3B30' : '#000000',
                    color: '#FFFFFF',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {isGiderModal ? 'Gideri Kaydet' : 'Tahsilatı Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}