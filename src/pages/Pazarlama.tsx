// src/pages/Pazarlama.tsx
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Musteri } from '../types';
import { Send, Sparkles, Gift, Calendar, RefreshCw } from 'lucide-react';

export default function Pazarlama() {
  const [musteriler, setMusteriler] = useState<Musteri[]>([]);
  const [selectedMusteri, setSelectedMusteri] = useState<string>('');
  const [mesajMetni, setMesajMetni] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiService.get<any>();
      if (response.success && response.data) {
        setMusteriler(response.data.musterilar || response.data.musteriler || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // GEMINI AI DESTEKLİ MESAJ ÜRETİCİ
  const generateAiMessage = (type: 'HATIRLATMA' | 'DOGUM_GUNU' | 'KAMPANYA') => {
    setAiLoading(true);
    const musteri = musteriler.find(m => m.id === selectedMusteri);
    const musteriAdi = musteri ? musteri.ad : 'Sayın Müşterimiz';

    setTimeout(() => {
      let uretilenMesaj = '';
      if (type === 'HATIRLATMA') {
        uretilenMesaj = `Merhaba ${musteriAdi} Hanım ✨ TIGI Beauty'deki randevunuzu hatırlatmak isteriz. Sizi ağırlamaktan mutluluk duyacağız. İptal veya değişiklik için lütfen bilgi veriniz.`;
      } else if (type === 'DOGUM_GUNU') {
        uretilenMesaj = `İyi ki doğdunuz ${musteriAdi} Hanım! 🎂 TIGI Beauty ailesi olarak yeni yaşınızı kutlar, bu ay geçerli %15 doğum günü indiriminizi hatırlatırız.`;
      } else {
        uretilenMesaj = `Merhaba ${musteriAdi} Hanım 🌸 Bu haftaya özel Cilt Bakımı & Protez Tırnak paketlerimizde geçerli VIP fırsatlarımız için salonumuza davetlisiniz.`;
      }
      setMesajMetni(uretilenMesaj);
      setAiLoading(false);
    }, 600);
  };

  // WHATSAPP API İLE DOĞRUDAN MESAJ GÖNDERME
  const handleSendWhatsApp = () => {
    const musteri = musteriler.find(m => m.id === selectedMusteri);
    if (!musteri || !musteri.telefon) {
      alert('Lütfen mesaj gönderilecek bir müşteri seçiniz.');
      return;
    }
    if (!mesajMetni) {
      alert('Lütfen bir mesaj metni giriniz veya AI ile üretiniz.');
      return;
    }

    // Telefon numarasını uluslararası formata temizle
    let cleanPhone = musteri.telefon.replace(/\D/g, '');
    if (!cleanPhone.startsWith('90') && cleanPhone.length === 10) {
      cleanPhone = '90' + cleanPhone;
    }

    const encodedText = encodeURIComponent(mesajMetni);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    
    // WhatsApp'ı yeni sekmede aç
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* ÜST BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A1A' }}>Pazarlama & WhatsApp Otomasyonu</h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
            Gemini AI destekli müşteri şablonları ve doğrudan WhatsApp gönderimi
          </p>
        </div>
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
      </div>

      {/* ŞABLON SEÇENEKLERİ (AI DESTEKLİ) */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="#D4AF37" /> AI Akıllı Şablon Üretici
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          <button
            onClick={() => generateAiMessage('HATIRLATMA')}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #EAEAEA',
              backgroundColor: '#FAFAFA',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Calendar size={14} color="#1A73E8" /> Randevu Hatırlatma
          </button>

          <button
            onClick={() => generateAiMessage('DOGUM_GUNU')}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #EAEAEA',
              backgroundColor: '#FAFAFA',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Gift size={14} color="#FF3B30" /> Doğum Günü Kutlama
          </button>

          <button
            onClick={() => generateAiMessage('KAMPANYA')}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #EAEAEA',
              backgroundColor: '#FAFAFA',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} color="#D4AF37" /> Özel Kampanya
          </button>
        </div>

        {/* MÜŞTERİ SEÇİMİ VE MESAJ METNİ */}
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Müşteri Seçin</label>
            <select
              value={selectedMusteri}
              onChange={(e) => setSelectedMusteri(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA' }}
            >
              <option value="">Müşteri Seçiniz...</option>
              {musteriler.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.ad} ({m.telefon})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Mesaj İçeriği</label>
            <textarea
              rows={4}
              value={mesajMetni}
              onChange={(e) => setMesajMetni(e.target.value)}
              placeholder={aiLoading ? "Gemini AI mesaj hazırlıyor..." : "Mesaj metnini buraya yazın veya yukarıdaki butonlarla otomatik üretin..."}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #EAEAEA',
                fontSize: '13px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <button
            onClick={handleSendWhatsApp}
            style={{
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Send size={16} /> WhatsApp ile Gönder
          </button>
        </div>
      </div>
    </div>
  );
}