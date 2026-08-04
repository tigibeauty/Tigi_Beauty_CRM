// src/pages/Personel.tsx
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Personel as PersonelType, Role } from '../types';
import { UserCheck, Percent, Phone, Calendar, Plus, RefreshCw, Edit3 } from 'lucide-react';

export default function Personel() {
  const [personelList, setPersonelList] = useState<PersonelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPersonel, setEditingPersonel] = useState<PersonelType | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PersonelType>>({
    ad: '',
    rol: 'STAFF' as Role,
    uzmanlik: 'Saç & Fön',
    primYuzdesi: 10,
    telefon: '',
    calismaGunleri: 'Pzt, Sal, Çar, Per, Cum, Cmt',
    aktif: true
  });

  useEffect(() => {
    fetchPersonel();
  }, []);

  const fetchPersonel = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await apiService.get<any>();
      if (response.success && response.data) {
        const gelenPersonel = response.data.personeller || response.data.personel;
        if (Array.isArray(gelenPersonel) && gelenPersonel.length > 0) {
          setPersonelList(gelenPersonel);
        } else {
          // Varsayılan TIGI Beauty Uzman Kadrosu
          setPersonelList([
            {
              id: 'P1',
              ad: 'Abdullah',
              rol: 'ADMIN',
              uzmanlik: 'Kıdemli Saç & Microblading Uzmanı',
              primYuzdesi: 15,
              telefon: '+90 532 000 0001',
              calismaGunleri: 'Pzt, Sal, Çar, Per, Cum, Cmt',
              aktif: true,
              toplamHizmetSayisi: 142,
              toplamCiro: 85400
            },
            {
              id: 'P2',
              ad: 'Aynure',
              rol: 'MANAGER',
              uzmanlik: 'Cilt Bakımı & Protez Tırnak Specialist',
              primYuzdesi: 12,
              telefon: '+90 532 000 0002',
              calismaGunleri: 'Pzt, Sal, Çar, Per, Cum, Cmt',
              aktif: true,
              toplamHizmetSayisi: 118,
              toplamCiro: 62300
            }
          ]);
        }
      } else if (response.error) {
        setErrorMsg(response.error.message);
      }
    } catch (err) {
      setErrorMsg('Personel verileri yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (personel?: PersonelType) => {
    if (personel) {
      setEditingPersonel(personel);
      setFormData(personel);
    } else {
      setEditingPersonel(null);
      setFormData({
        ad: '',
        rol: 'STAFF' as Role,
        uzmanlik: 'Saç & Fön',
        primYuzdesi: 10,
        telefon: '',
        calismaGunleri: 'Pzt, Sal, Çar, Per, Cum, Cmt',
        aktif: true
      });
    }
    setShowModal(true);
  };

  const handleSavePersonel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ad || !formData.telefon) {
      alert('Lütfen isim ve telefon alanlarını doldurunuz.');
      return;
    }

    if (editingPersonel) {
      // DÜZENLEME (UPDATE)
      const guncelPersonel: PersonelType = {
        ...editingPersonel,
        ad: formData.ad || editingPersonel.ad,
        rol: (formData.rol as Role) || editingPersonel.rol,
        uzmanlik: formData.uzmanlik || editingPersonel.uzmanlik,
        primYuzdesi: Number(formData.primYuzdesi),
        telefon: formData.telefon || editingPersonel.telefon,
        calismaGunleri: formData.calismaGunleri || editingPersonel.calismaGunleri,
        aktif: formData.aktif !== undefined ? formData.aktif : editingPersonel.aktif
      };

      try {
        setLoading(true);
        await apiService.post('guncellePersonel', guncelPersonel);
        setPersonelList(personelList.map((p) => (p.id === guncelPersonel.id ? guncelPersonel : p)));
        setShowModal(false);
      } catch (error) {
        setPersonelList(personelList.map((p) => (p.id === guncelPersonel.id ? guncelPersonel : p)));
        setShowModal(false);
      } finally {
        setLoading(false);
      }
    } else {
      // YENİ EKLEME (CREATE)
      const yeniPersonel: PersonelType = {
        id: 'P' + Math.floor(Math.random() * 10000),
        ad: formData.ad || '',
        rol: (formData.rol as Role) || 'STAFF',
        uzmanlik: formData.uzmanlik || 'Genel',
        primYuzdesi: Number(formData.primYuzdesi) || 0,
        telefon: formData.telefon || '',
        calismaGunleri: formData.calismaGunleri || 'Hafta İçi',
        aktif: formData.aktif !== undefined ? formData.aktif : true,
        toplamHizmetSayisi: 0,
        toplamCiro: 0
      };

      try {
        setLoading(true);
        await apiService.post('yeniPersonel', yeniPersonel);
        setPersonelList([...personelList, yeniPersonel]);
        setShowModal(false);
      } catch (error) {
        setPersonelList([...personelList, yeniPersonel]);
        setShowModal(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* ÜST BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A1A' }}>Personel & Performans</h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
            Salon uzmanları, prim oranları ve hakediş takibi
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={fetchPersonel}
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
            onClick={() => handleOpenModal()}
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
            <Plus size={16} /> Yeni Personel Ekle
          </button>
        </div>
      </div>

      {/* PERSONEL LİSTESİ */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', fontSize: '14px' }}>
          Personel verileri yükleniyor...
        </div>
      ) : errorMsg ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#FF3B30', backgroundColor: '#FFF2F2', borderRadius: '12px' }}>
          ⚠️ {errorMsg}
        </div>
      ) : personelList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8E8E93', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          Henüz kayıtlı personel bulunamadı.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {personelList.map((p) => {
            const tahminiPrim = ((p.toplamCiro || 0) * (p.primYuzdesi || 0)) / 100;
            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #EAEAEA',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                        {p.ad}
                      </h3>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: '#F2F2F7',
                          color: '#1A1A1A',
                          fontWeight: 500
                        }}
                      >
                        {p.rol}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#666', marginTop: '4px', margin: '4px 0 0 0' }}>
                      {p.uzmanlik}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '12px', color: '#8E8E93' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={12} /> {p.telefon}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {p.calismaGunleri}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenModal(p)}
                      style={{
                        backgroundColor: '#F2F2F7',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#1A1A1A'
                      }}
                    >
                      <Edit3 size={13} /> Düzenle
                    </button>

                    <span
                      style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        backgroundColor: p.aktif ? '#E6F4EA' : '#FCE8E6',
                        color: p.aktif ? '#137333' : '#C5221F',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <UserCheck size={12} />
                      {p.aktif ? 'Aktif Uzman' : 'Pasif'}
                    </span>
                  </div>
                </div>

                {/* PERFORMANS VE PRİM KARTI */}
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
                    <span style={{ color: '#8E8E93', display: 'block' }}>Tamamlanan Hizmet</span>
                    <strong style={{ color: '#1A1A1A', fontSize: '13px' }}>{p.toplamHizmetSayisi || 0} Adet</strong>
                  </div>
                  <div>
                    <span style={{ color: '#8E8E93', display: 'block' }}>Prim Oranı</span>
                    <strong style={{ color: '#1A1A1A', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Percent size={12} /> %{p.primYuzdesi || 0}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#8E8E93', display: 'block' }}>Tahmini Hakediş Prim</span>
                    <strong style={{ color: '#137333', fontSize: '13px' }}>
                      {tahminiPrim.toLocaleString('tr-TR')} TL
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* YENİ / DÜZENLEME MODAL */}
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
              {editingPersonel ? `${editingPersonel.ad} - Bilgileri / Primi Güncelle` : 'Yeni Uzman / Personel Ekle'}
            </h3>
            <form onSubmit={handleSavePersonel} style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Personel Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Aynure"
                  value={formData.ad}
                  onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Sistem Rolü</label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value as Role })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  >
                    <option value="STAFF">Uzman (STAFF)</option>
                    <option value="MANAGER">Yönetici (MANAGER)</option>
                    <option value="RECEPTION">Resepsiyon (RECEPTION)</option>
                    <option value="ADMIN">Admin (ADMIN)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                    Prim Yüzdesi (%) (İstediğiniz an değiştirin)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.primYuzdesi}
                    onChange={(e) => setFormData({ ...formData, primYuzdesi: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA', fontWeight: 600, color: '#0066CC' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Uzmanlık Alanı</label>
                <input
                  type="text"
                  placeholder="Örn: Cilt Bakımı & Protez Tırnak"
                  value={formData.uzmanlik}
                  onChange={(e) => setFormData({ ...formData, uzmanlik: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Telefon</label>
                <input
                  type="tel"
                  placeholder="+90 5XX XXX XX XX"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Çalışma Günleri</label>
                <input
                  type="text"
                  placeholder="Pzt, Sal, Çar, Per, Cum, Cmt"
                  value={formData.calismaGunleri}
                  onChange={(e) => setFormData({ ...formData, calismaGunleri: e.target.value })}
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
                  {editingPersonel ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}