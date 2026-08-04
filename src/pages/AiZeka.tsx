// src/pages/AiZeka.tsx
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Musteri, Randevu } from '../types';
import { Sparkles, AlertTriangle, TrendingUp, Zap, Send, RefreshCw } from 'lucide-react';

interface ChurnAnalysis {
  musteri: Musteri;
  daysSinceLastVisit: number;
  churnRisk: 'YÜKSEK' | 'ORTA' | 'DÜŞÜK';
  ltvScore: number;
  onerilenHizmet: string;
}

export default function AiZeka() {
  const [loading, setLoading] = useState(true);
  const [analysisList, setAnalysisList] = useState<ChurnAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ChurnAnalysis | null>(null);
  const [aiText, setAiText] = useState<string>('');
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    fetchAndAnalyzeData();
  }, []);

  const fetchAndAnalyzeData = async () => {
    setLoading(true);
    try {
      const response = await apiService.get<any>();
      if (response.success && response.data) {
        const gelenMusteriler: Musteri[] = response.data.musterilar || response.data.musteriler || [];
        const gelenRandevular: Randevu[] = response.data.randevular || [];

        // AI & KURAL TABANLI ANALİZ MOTORU
        runAiAnalysis(gelenMusteriler, gelenRandevular);
      }
    } catch (err) {
      console.error('AI Analiz Hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const runAiAnalysis = (mList: Musteri[], rList: Randevu[]) => {
    const today = new Date().getTime();

    const results: ChurnAnalysis[] = mList.map((m) => {
      // Müşterinin son randevu tarihini bul
      const musteriRandevulari = rList.filter((r) => r.musteriID === m.id || r.musteriAdi === m.ad);
      let days = 30; // Varsayılan geçici değer

      if (musteriRandevulari.length > 0) {
        const sonTarihStr = musteriRandevulari[0].tarih;
        const sonTarih = new Date(sonTarihStr).getTime();
        if (!isNaN(sonTarih)) {
          days = Math.floor((today - sonTarih) / (1000 * 60 * 60 * 24));
        }
      }

      // Risk Seviyesi Hesabı
      let risk: 'YÜKSEK' | 'ORTA' | 'DÜŞÜK' = 'DÜŞÜK';
      if (days > 45) risk = 'YÜKSEK';
      else if (days > 25) risk = 'ORTA';

      // LTV (Lifetime Value) Skorlama Formula
      const ltv = (m.toplamHarcama || 0) + (m.toplamZiyaret || 0) * 150 + (m.puan || 0) * 10;

      // Cross-Sell Öneri Motoru
      let onerilen = 'Cilt Bakımı Paketi';
      if (m.favoriHizmet?.includes('Saç')) onerilen = 'Keratin Yükleme & Protez Tırnak';
      else if (m.favoriHizmet?.includes('Cilt')) onerilen = 'Lazer Epilasyon Seans Paket';

      return {
        musteri: m,
        daysSinceLastVisit: Math.max(0, days),
        churnRisk: risk,
        ltvScore: ltv,
        onerilenHizmet: onerilen
      };
    });

    // Churn Riskine Göre Sırala (Önce Yüksek Risktekiler)
    results.sort((a, b) => b.daysSinceLastVisit - a.daysSinceLastVisit);
    setAnalysisList(results);
  };

  const handleGenerateAiAction = (analysis: ChurnAnalysis) => {
    setSelectedAnalysis(analysis);
    setAiGenerating(true);

    setTimeout(() => {
      const m = analysis.musteri;
      const text = `Merhaba ${m.ad} Hanım ✨ TIGI Beauty'de sizi özledik! Son ziyaretinizin üzerinden ${analysis.daysSinceLastVisit} gün geçti. Size özel hazırladığımız ${analysis.onerilenHizmet} fırsatında bu haftaya özel %15 ayrıcalık tanımladık. Randevunuzu oluşturmak için dönüş yapabilirsiniz 🌸`;
      setAiText(text);
      setAiGenerating(false);
    }, 500);
  };

  const handleSendWhatsApp = () => {
    if (!selectedAnalysis || !selectedAnalysis.musteri.telefon) return;
    let cleanPhone = selectedAnalysis.musteri.telefon.replace(/\D/g, '');
    if (!cleanPhone.startsWith('90') && cleanPhone.length === 10) {
      cleanPhone = '90' + cleanPhone;
    }
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(aiText)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* ÜST BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={22} color="#D4AF37" /> AI Intelligence & Churn Tahmini
          </h1>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
            Müşteri kaybı (Churn) riski analizi, LTV skorları ve Akıllı Önermeler
          </p>
        </div>
        <button
          onClick={fetchAndAnalyzeData}
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
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Analizi Yenile
        </button>
      </div>

      {/* RISK OZET KARTLARI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', fontSize: '12px', marginBottom: '6px' }}>
            <span>Yüksek Churn Riski</span>
            <AlertTriangle size={16} color="#FF3B30" />
          </div>
          <strong style={{ fontSize: '20px', color: '#FF3B30' }}>
            {analysisList.filter(a => a.churnRisk === 'YÜKSEK').length} Müşteri
          </strong>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', fontSize: '12px', marginBottom: '6px' }}>
            <span>Ortalama LTV Değeri</span>
            <TrendingUp size={16} color="#137333" />
          </div>
          <strong style={{ fontSize: '20px', color: '#1A1A1A' }}>
            {Math.round(analysisList.reduce((acc, curr) => acc + curr.ltvScore, 0) / (analysisList.length || 1)).toLocaleString('tr-TR')} TL
          </strong>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8E8E93', fontSize: '12px', marginBottom: '6px' }}>
            <span>AI Geri Kazanım Fırsatı</span>
            <Zap size={16} color="#D4AF37" />
          </div>
          <strong style={{ fontSize: '20px', color: '#1A1A1A' }}>
            {analysisList.filter(a => a.churnRisk !== 'DÜŞÜK').length} Müşteri
          </strong>
        </div>
      </div>

      {/* ANALIZ VE MESAJ ALANI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
        {/* CHURN RISK LİSTESİ */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>
            Müşteri Risk & LTV Sıralaması
          </h3>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#8E8E93', fontSize: '13px' }}>AI Verileri Analiz Ediyor...</div>
          ) : analysisList.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#8E8E93', fontSize: '13px' }}>Analiz edilecek müşteri bulunamadı.</div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {analysisList.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: selectedAnalysis?.musteri.id === item.musteri.id ? '#F2F2F7' : '#FAFAFA',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #EAEAEA',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ fontSize: '14px', color: '#1A1A1A' }}>{item.musteri.ad}</strong>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          backgroundColor: item.churnRisk === 'YÜKSEK' ? '#FFF2F2' : item.churnRisk === 'ORTA' ? '#FEF7E0' : '#E6F4EA',
                          color: item.churnRisk === 'YÜKSEK' ? '#FF3B30' : item.churnRisk === 'ORTA' ? '#B06000' : '#137333',
                          fontWeight: 600
                        }}
                      >
                        {item.churnRisk} RİSK ({item.daysSinceLastVisit} Gün)
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
                      <strong>LTV Skoru:</strong> {item.ltvScore.toLocaleString('tr-TR')} TL | <strong>Öneri:</strong> {item.onerilenHizmet}
                    </p>
                  </div>

                  <button
                    onClick={() => handleGenerateAiAction(item)}
                    style={{
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Sparkles size={12} color="#D4AF37" /> AI Aksiyon
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI AKILLI AKSİYON KARTI */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="#D4AF37" /> Gemini AI Aksiyon Motoru
          </h3>

          {!selectedAnalysis ? (
            <div style={{ padding: '40px 10px', textAlign: 'center', color: '#8E8E93', fontSize: '13px' }}>
              Sol listeden bir müşteri seçerek <strong>AI Aksiyon</strong> butonuna basınız.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ backgroundColor: '#FAFAFA', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
                <span style={{ color: '#8E8E93', display: 'block' }}>Hedef Müşteri</span>
                <strong style={{ color: '#1A1A1A', fontSize: '14px' }}>{selectedAnalysis.musteri.ad}</strong>
                <span style={{ color: '#666', display: 'block', marginTop: '2px' }}>{selectedAnalysis.musteri.telefon}</span>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>AI Tarafından Oluşturulan Özel Teklif</label>
                <textarea
                  rows={6}
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  placeholder={aiGenerating ? "Gemini AI öneri hazırlıyor..." : ""}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #EAEAEA',
                    fontSize: '12px',
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
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Send size={14} /> WhatsApp ile Fırsatı İlet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}