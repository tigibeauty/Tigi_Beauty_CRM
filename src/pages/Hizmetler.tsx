// src/pages/Hizmetler.tsx
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Clock, Tag, Plus, RefreshCw, PackageCheck } from 'lucide-react';

export interface HizmetKatalogu {
  id: string;
  ad: string;
  kategori: string;
  sureDk: number;
  fiyat: number;
  isPaket: boolean;
  seansSayisi?: number;
  aciklama?: string;
}

export default function Hizmetler() {
  const [hizmetler, setHizmetler] = useState<HizmetKatalogu[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedKategori, setSelectedKategori] = useState<string>('Tümü');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<HizmetKatalogu>>({
    ad: '',
    kategori: 'Saç',
    sureDk: 45,
    fiyat: 0,
    isPaket: false,
    seansSayisi: 1,
    aciklama: ''
  });

  useEffect(() => {
    fetchHizmetler();
  }, []);

  const fetchHizmetler = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await apiService.get<any>();
      if (response.success && response.data) {
        const gelenHizmetler = response.data.hizmetler || [];
        if (Array.isArray(gelenHizmetler) && gelenHizmetler.length > 0) {
          setHizmetler(gelenHizmetler);
        } else {
          // Varsayılan TIGI Beauty Hizmet Kataloğu
          setHizmetler([
            { id: 'H1', ad: 'Saç Kesimi & Yıkama', kategori: 'Saç', sureDk: 45, fiyat: 350, isPaket: false, aciklama: 'Modern kesim ve saç yıkama' },
            { id: 'H2', ad: 'Fön Macera', kategori: 'Saç', sureDk: 25, fiyat: 150, isPaket: false, aciklama: 'Hacimli ve parlak fön' },
            { id: 'H3', ad: 'Cilt Bakımı (Klasik)', kategori: 'Cilt', sureDk: 60, fiyat: 500, isPaket: false, aciklama: 'Gözenek temizliği ve nem maskesi' },
            { id: 'H4', ad: 'Protez Tırnak & Nail Art', kategori: 'Tırnak', sureDk: 90, fiyat: 650, isPaket: false, aciklama: 'Jel tırnak süsleme ve bakım' },
            { id: 'H5', ad: 'Lazer Epilasyon (Tüm Vücut)', kategori: 'Cilt', sureDk: 50, fiyat: 4800, isPaket: true, seansSayisi: 8, aciklama: '8 Seanslık pürüzsüz cilt paketi' },
            { id: 'H6', ad: 'Cilt Profesyonel Bakım Paketi', kategori: 'Cilt', sureDk: 60, fiyat: 3600, isPaket: true, seansSayisi: 6, aciklama: 'Mineral maske ve canlandırıcı seanslar' }
          ]);
        }
      } else if (response.error) {
        setErrorMsg(response.error.message);
      }
    } catch (err) {
      setErrorMsg('Hizmet verileri yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHizmet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ad || !formData.fiyat) {
      alert('Lütfen hizmet adı ve fiyatını giriniz.');
      return;
    }

    const yeniHizmet: HizmetKatalogu = {
      id: 'H' + Math.floor(Math.random() * 10000),
      ad: formData.ad || '',
      kategori: formData.kategori || 'Genel',
      sureDk: Number(formData.sureDk) || 30,
      fiyat: Number(formData.fiyat) || 0,
      isPaket: Boolean(formData.isPaket),
      seansSayisi: formData.isPaket ? Number(formData.seansSayisi) : 1,
      aciklama: formData.aciklama || ''
    };

    try {
      setLoading(true);
      const res = await apiService.post('yeniHizmet', yeniHizmet);
      if (res.success) {
        setHizmetler([...hizmetler, yeniHizmet]);
        setShowModal(false);
      } else {
        // Mock fallback if API not deployed yet
        setHizmetler([...hizmetler, yeniHizmet]);
        setShowModal(false);
      }
    } catch (error) {
      setHizmetler([...hizmetler, yeniHizmet]);
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const kategoriler = ['Tümü', 'Saç', 'Cilt', 'Tırnak', 'Makyaj', 'Paketler'];

  const filteredHizmetler = hizmetler.filter((h) => {
    if (selectedKategori === 'Tümü') return true;
    if (selectedKategori === 'Paketler') return h.isPaket;
    return h.kategori === selectedKategori;
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* ÜST BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A1A' }}>Hizmetler & Paket Kataloğu</h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
            Salon hizmetleri, seans paketleri ve fiyat listesi
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={fetchHizmetler}
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
            <Plus size={16} /> Yeni Hizmet / Paket
          </button>
        </div>
      </div>

      {/* KATEGORİ FİLTRELERİ */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        {kategoriler.map((kat) => (
          <button
            key={kat}
            onClick={() => setSelectedKategori(kat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedKategori === kat ? 'none' : '1px solid #EAEAEA',
              backgroundColor: selectedKategori === kat ? '#000000' : '#FFFFFF',
              color: selectedKategori === kat ? '#FFFFFF' : '#1A1A1A',
              fontSize: '13px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* HİZMET LİSTESİ */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', fontSize: '14px' }}>
          Hizmet kataloğu yükleniyor...
        </div>
      ) : errorMsg ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FF3B30', backgroundColor: '#FFF2F2', borderRadius: '12px' }}>
          ⚠️ {errorMsg}
        </div>
      ) : filteredHizmetler.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          Bu kategoride henüz hizmet tanımlanmadı.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredHizmetler.map((h) => (
            <div
              key={h.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #EAEAEA',
                boxShadow: '0 2px 6px rgba(0,0,0,0.01)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                    {h.ad}
                  </h3>
                  {h.isPaket && (
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        backgroundColor: '#E8F0FE',
                        color: '#1A73E8',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <PackageCheck size={10} /> {h.seansSayisi || 1} Seans Paket
                    </span>
                  )}
                </div>
                {h.aciklama && (
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '4px', margin: '4px 0 0 0' }}>
                    {h.aciklama}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '12px', color: '#8E8E93' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={12} /> {h.kategori}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {h.sureDk} Dk
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A', display: 'block' }}>
                  {h.fiyat.toLocaleString('tr-TR')} TL
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* YENİ HİZMET / PAKET MODAL */}
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
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Yeni Hizmet / Paket Ekle</h3>
            <form onSubmit={handleAddHizmet} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Hizmet Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Keratin Saç Bakımı"
                  value={formData.ad}
                  onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  >
                    <option value="Saç">Saç</option>
                    <option value="Cilt">Cilt</option>
                    <option value="Tırnak">Tırnak</option>
                    <option value="Makyaj">Makyaj</option>
                    <option value="Genel">Genel</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Süre (Dakika)</label>
                  <input
                    type="number"
                    value={formData.sureDk}
                    onChange={(e) => setFormData({ ...formData, sureDk: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Fiyat (TL)</label>
                  <input
                    type="number"
                    value={formData.fiyat}
                    onChange={(e) => setFormData({ ...formData, fiyat: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>İşlem Türü</label>
                  <select
                    value={formData.isPaket ? 'PAKET' : 'TEKIL'}
                    onChange={(e) => setFormData({ ...formData, isPaket: e.target.value === 'PAKET' })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  >
                    <option value="TEKIL">Tekil Hizmet</option>
                    <option value="PAKET">Çoklu Seans Paketi</option>
                  </select>
                </div>
              </div>

              {formData.isPaket && (
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Toplam Seans Sayısı</label>
                  <input
                    type="number"
                    value={formData.seansSayisi}
                    onChange={(e) => setFormData({ ...formData, seansSayisi: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Açıklama</label>
                <input
                  type="text"
                  placeholder="Hizmet detayları ve açıklaması"
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
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}