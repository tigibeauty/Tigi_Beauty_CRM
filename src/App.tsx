/**
 * TIGI Beauty CRM - React Web App
 *
 * Özellikler:
 * - Login (Abdullah, Aynure, Admin)
 * - Müşteri Yönetimi
 * - Randevu Takvimi & Listesi
 * - Mesaj Şablon Editörü
 * - Mesaj Logları
 * - Analytics
 *
 * Deploy: Firebase Hosting veya Vercel
 */

import React, { useState, useEffect, useContext, createContext } from "react";
import "./styles.css";

// YENİ EKLENECEK KISIM =======================================================
export interface Randevu {
  id: string;
  musteriID: string;
  musteriAdi: string;
  tarih: string;
  saat: string;
  hizmet: string;
  personel: string;
  status: string;
  mesajDurum: string;
}

export interface Log {
  zamanı: string;
  musteriAdi: string;
  telefon: string;
  sablon: string;
  status: string;
  hata?: string;
}
// ============================================================================

// ============================================================================
// 🔐 CONTEXT: Auth & State Management
// ============================================================================

const AppContext = createContext<any>(null);

function AppProvider({ children }: { children: any }) {
  const [user, setUser] = useState(null);
  const [musterilar, setMusterilar] = useState([]);
  const [randevular, setRandevular] = useState([]);
  const [hizmetler, setHizmetler] = useState([]);
  const [sablonlar, setSablonlar] = useState([]);
  const [loglar, setLoglar] = useState([]);
  const [loading, setLoading] = useState(false);

  // Google Sheets API'ye bağlan (setup gerekli)
  useEffect(() => {
    if (user) {
      // TODO: Google Sheets API'den veri çek
      console.log("Loading data for user:", user);
      loadDataFromSheets();
    }
  }, [user]);

  const loadDataFromSheets = async () => {
    setLoading(true);
    try {
      // DİKKAT: Aşağıdaki tırnak işaretlerinin içine az önce kopyaladığınız linki yapıştırın!
      const WEB_APP_URL =
        "https://script.google.com/macros/s/AKfycbwuvIpjC7ajwxmgJ034TD6NhXoX9Kn6H2pyuSUSYQnuq9gy1Aok7NhqPNv5P5g8fEZq/exec";

      const response = await fetch(WEB_APP_URL);
      const data = await response.json();

      setMusterilar(data.musterilar || []);
      setRandevular(data.randevular || []);
      setLoglar(data.loglar || []);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
    setLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        musterilar,
        setMusterilar,
        randevular,
        setRandevular,
        hizmetler,
        setHizmetler,
        sablonlar,
        setSablonlar,
        loglar,
        setLoglar,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

// ============================================================================
// 🔑 LOGIN COMPONENT
// ============================================================================

function LoginPage() {
  const { setUser } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const personel = {
    Abdullah: { sifre: "Abdullah123!", rol: "Uzman" },
    Aynure: { sifre: "Aynure123!", rol: "Uzman" },
    admin: { sifre: "Admin123!", rol: "Admin" },
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    const user_data = personel[username.toLowerCase() as keyof typeof personel];

    if (user_data && user_data.sifre === password) {
      setUser({
        username: username.toLowerCase(),
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
        rol: user_data.rol,
      });
      setError("");
    } else {
      setError("Hatalı kullanıcı adı veya şifre");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>TIGI Beauty CRM</h1>
          <p>Müşteri & Randevu Yönetimi</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              placeholder="Abdullah, Aynure veya Admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <input
              type="password"
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-message">❌ {error}</div>}

          <button type="submit" className="btn-primary">
            Giriş Yap
          </button>
        </form>

        <div className="login-help">
          <p>
            <strong>Test Hesapları:</strong>
          </p>
          <ul>
            <li>Abdullah / Abdullah123!</li>
            <li>Aynure / Aynure123!</li>
            <li>Admin / Admin123!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 🏠 DASHBOARD / ANA SAYFA
// ============================================================================

function Dashboard() {
  const { user, musterilar, randevular, loglar } = useApp();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="app-header">
        <div className="header-left">
          <h1>TIGI Beauty CRM</h1>
        </div>
        <div className="header-right">
          <span className="user-badge">
            👤 {user.displayName} ({user.rol})
          </span>
          <button onClick={() => location.reload()} className="btn-logout">
            Çıkış
          </button>
        </div>
      </header>

      {/* NAV TABS */}
      <nav className="app-nav">
        <button
          className={`nav-item ${selectedTab === "dashboard" ? "active" : ""}`}
          onClick={() => setSelectedTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-item ${selectedTab === "musterilar" ? "active" : ""}`}
          onClick={() => setSelectedTab("musterilar")}
        >
          👥 Müşteriler
        </button>
        <button
          className={`nav-item ${selectedTab === "randevular" ? "active" : ""}`}
          onClick={() => setSelectedTab("randevular")}
        >
          📅 Randevular
        </button>
        <button
          className={`nav-item ${selectedTab === "mesajlar" ? "active" : ""}`}
          onClick={() => setSelectedTab("mesajlar")}
        >
          💬 Mesajlar
        </button>
        <button
          className={`nav-item ${selectedTab === "loglar" ? "active" : ""}`}
          onClick={() => setSelectedTab("loglar")}
        >
          📋 Loglar
        </button>
        {user.rol === "Admin" && (
          <button
            className={`nav-item ${selectedTab === "ayarlar" ? "active" : ""}`}
            onClick={() => setSelectedTab("ayarlar")}
          >
            ⚙️ Ayarlar
          </button>
        )}
      </nav>

      {/* CONTENT */}
      <main className="app-content">
        {selectedTab === "dashboard" && <DashboardView />}
        {selectedTab === "musterilar" && <MusterilarView />}
        {selectedTab === "randevular" && <RandevularView />}
        {selectedTab === "mesajlar" && <MessagesView />}
        {selectedTab === "loglar" && <LoglarView />}
        {selectedTab === "ayarlar" && user.rol === "Admin" && <AyarlarView />}
      </main>
    </div>
  );
}

// ============================================================================
// 📊 DASHBOARD VIEW
// ============================================================================

function DashboardView() {
  const { musterilar, randevular, loglar } = useApp();

  const bugununRandevulari = randevular.filter((r: Randevu) => {
    const tarih = new Date(r.tarih);
    const bugun = new Date();
    return tarih.toDateString() === bugun.toDateString();
  });

  const mesajBasarisiOrani =
    loglar.length > 0
      ? Math.round(
          (loglar.filter((l: Log) => l.status === "Başarılı").length /
            loglar.length) *
            100
        )
      : 0;

  return (
    <div className="dashboard-view">
      <h2>Hoş Geldiniz! 👋</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{musterilar.length}</div>
            <div className="stat-label">Toplam Müşteri</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{bugununRandevulari.length}</div>
            <div className="stat-label">Bugünün Randevuları</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-value">{loglar.length}</div>
            <div className="stat-label">Gönderilen Mesajlar</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <div className="stat-value">{mesajBasarisiOrani}%</div>
            <div className="stat-label">Mesaj Başarı Oranı</div>
          </div>
        </div>
      </div>

      <div className="upcoming-section">
        <h3>🗓️ Yaklaşan Randevular</h3>
        {bugununRandevulari.length > 0 ? (
          <table className="simple-table">
            <thead>
              <tr>
                <th>Saat</th>
                <th>Müşteri</th>
                <th>Hizmet</th>
                <th>Personel</th>
              </tr>
            </thead>
            <tbody>
              {bugununRandevulari.map((r: Randevu, idx: number) => (
                <tr key={idx}>
                  <td>{r.saat}</td>
                  <td>{r.musteriAdi}</td>
                  <td>{r.hizmet}</td>
                  <td>{r.personel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">Bugün randevu yok</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 👥 MÜŞTERİLER VIEW
// ============================================================================

function MusterilarView() {
  const { musterilar, setMusterilar } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingID, setEditingID] = useState(null);
  const [formData, setFormData] = useState({
    ad: "",
    telefon: "",
    email: "",
    hizmetGecmisi: "",
    riskSeviyesi: "🟢 Normal",
  });

  const handleAddMusteri = async () => {
    if (formData.ad && formData.telefon) {
      const newMusteri = {
        id: "M" + Math.floor(Math.random() * 10000),
        ...formData,
        kaydolmaTarihi: new Date().toLocaleDateString("tr-TR"),
      };

      // 1. Ekrana hemen ekle (Hızlı görünmesi için)
      setMusterilar([...musterilar, newMusteri]);
      setFormData({
        ad: "",
        telefon: "",
        email: "",
        hizmetGecmisi: "",
        riskSeviyesi: "🟢 Normal",
      });
      setShowModal(false);

      // 2. Arka planda Google Sheets'e gönder
      try {
        // DİKKAT: Buraya da YENİ kopyaladığınız linki yapıştırın!
        // Linkin sonuna ?action=yeniMusteri eklemeyi UNUTMAYIN.
        const WEB_APP_URL =
          "https://script.google.com/macros/s/AKfycbwuvIpjC7ajwxmgJ034TD6NhXoX9Kn6H2pyuSUSYQnuq9gy1Aok7NhqPNv5P5g8fEZq/exec" +
          "?action=yeniMusteri";

        await fetch(WEB_APP_URL, {
          method: "POST",
          body: JSON.stringify(newMusteri),
        });
        console.log("Müşteri başarıyla Sheets'e kaydedildi!");
      } catch (error) {
        console.error("Müşteri kaydedilemedi:", error);
      }
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>👥 Müşteri Yönetimi</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Yeni Müşteri Ekle
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Yeni Müşteri Ekle</h3>
            <div className="form-group">
              <label>Ad</label>
              <input
                type="text"
                value={formData.ad}
                onChange={(e) =>
                  setFormData({ ...formData, ad: e.target.value })
                }
                placeholder="Müşteri adı"
              />
            </div>
            <div className="form-group">
              <label>Telefon</label>
              <input
                type="tel"
                value={formData.telefon}
                onChange={(e) =>
                  setFormData({ ...formData, telefon: e.target.value })
                }
                placeholder="+90 5XX XXX XXXX"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <label>Risk Seviyesi</label>
              <select
                value={formData.riskSeviyesi}
                onChange={(e) =>
                  setFormData({ ...formData, riskSeviyesi: e.target.value })
                }
              >
                <option>🟢 Normal</option>
                <option>🟡 Hassas</option>
                <option>🟠 Alerjik</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button onClick={handleAddMusteri} className="btn-primary">
                Ekle
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Telefon</th>
            <th>Email</th>
            <th>Risk Seviyesi</th>
            <th>Kaydolma</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {musterilar.map((m: any) => (
            <tr key={m.id}>
              <td>{m.ad}</td>
              <td>{m.telefon}</td>
              <td>{m.email || "-"}</td>
              <td>{m.riskSeviyesi}</td>
              <td>{m.kaydolmaTarihi}</td>
              <td>
                <button className="btn-small">Düzenle</button>
                <button className="btn-small btn-danger">Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {musterilar.length === 0 && (
        <p className="empty-message">Henüz müşteri yok</p>
      )}
    </div>
  );
}

// ============================================================================
// 📅 RANDEVULAR VIEW
// ============================================================================

function RandevularView() {
  const { randevular, setRandevular, musterilar, hizmetler } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    musteriID: "",
    tarih: "",
    saat: "",
    hizmet: "",
    personel: "",
    status: "Yapılacak",
  });

  const handleAddRandevu = async () => {
    if (formData.musteriID && formData.tarih && formData.saat) {
      const musteri = musterilar.find((m: any) => m.id === formData.musteriID);
      const newRandevu = {
        id: "R" + Math.floor(Math.random() * 10000),
        musteriAdi: musteri?.ad || "Bilinmiyor",
        ...formData,
        mesajDurum: "Bekleniyor",
      };

      setRandevular([...randevular, newRandevu]);
      setFormData({
        musteriID: "",
        tarih: "",
        saat: "",
        hizmet: "",
        personel: "",
        status: "Yapılacak",
      });
      setShowModal(false);

      try {
        // DİKKAT: Yeni kopyaladığınız linki buraya yapıştırın. Sonunda ?action=yeniRandevu OLACAK.
        const WEB_APP_URL =
          "https://script.google.com/macros/s/AKfycbwuvIpjC7ajwxmgJ034TD6NhXoX9Kn6H2pyuSUSYQnuq9gy1Aok7NhqPNv5P5g8fEZq/exec" +
          "?action=yeniRandevu";

        await fetch(WEB_APP_URL, {
          method: "POST",
          body: JSON.stringify(newRandevu),
        });
      } catch (error) {
        console.error("Randevu kaydedilemedi:", error);
      }
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>📅 Randevu Yönetimi</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Yeni Randevu Ekle
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Yeni Randevu Ekle</h3>
            <div className="form-group">
              <label>Müşteri</label>
              <select
                value={formData.musteriID}
                onChange={(e) =>
                  setFormData({ ...formData, musteriID: e.target.value })
                }
              >
                <option value="">Seç...</option>
                {musterilar.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.ad}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tarih</label>
              <input
                type="date"
                value={formData.tarih}
                onChange={(e) =>
                  setFormData({ ...formData, tarih: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Saat</label>
              <input
                type="time"
                value={formData.saat}
                onChange={(e) =>
                  setFormData({ ...formData, saat: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Hizmet</label>
              <input
                type="text"
                value={formData.hizmet}
                onChange={(e) =>
                  setFormData({ ...formData, hizmet: e.target.value })
                }
                placeholder="Kaş Tasarımı, Tırnak vb."
              />
            </div>
            <div className="form-group">
              <label>Personel</label>
              <select
                value={formData.personel}
                onChange={(e) =>
                  setFormData({ ...formData, personel: e.target.value })
                }
              >
                <option value="">Seç...</option>
                <option>Abdullah</option>
                <option>Aynure</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button onClick={handleAddRandevu} className="btn-primary">
                Ekle
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Müşteri</th>
            <th>Hizmet</th>
            <th>Personel</th>
            <th>Status</th>
            <th>Mesaj</th>
          </tr>
        </thead>
        <tbody>
          {randevular.map((r: Randevu) => (
            <tr key={r.id}>
              <td>{r.tarih}</td>
              <td>{r.saat}</td>
              <td>{r.musteriAdi}</td>
              <td>{r.hizmet}</td>
              <td>{r.personel}</td>
              <td>
                <span className={`badge status-${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </td>
              <td>{r.mesajDurum}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {randevular.length === 0 && (
        <p className="empty-message">Henüz randevu yok</p>
      )}
    </div>
  );
}

// ============================================================================
// 💬 MESAJLAR VIEW
// ============================================================================

function MessagesView() {
  const { sablonlar, setSablonlar } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingID, setEditingID] = useState(null);

  return (
    <div className="view-container">
      <h2>💬 Mesaj Şablonları</h2>

      <div className="templates-list">
        {sablonlar.length === 0 ? (
          <div className="empty-state">
            <p>Henüz şablon yok. Hazır şablonlar:</p>
            <div className="default-templates">
              <div className="template-card">
                <h4>Hatırlatıcı Mesaj</h4>
                <p>
                  Merhaba {"{{AD}}"}, yarın saat {"{{SAAT}}"}'de {"{{HİZMET}}"}{" "}
                  randevunuz bulunmaktadır.
                </p>
                <small>Tetik: 1.5 saat öncesi</small>
              </div>
              <div className="template-card">
                <h4>Teşekkür Mesajı</h4>
                <p>
                  Sana sunduğumuz hizmetden memnun musun? Değerlendirmen:{" "}
                  {"{{GOOGLEFORM}}"}
                </p>
                <small>Tetik: 2 saat sonrası</small>
              </div>
            </div>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Şablon Adı</th>
                <th>İçerik</th>
                <th>Tetik</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {sablonlar.map((s: any) => (
                <tr key={s.id}>
                  <td>{s.ad}</td>
                  <td>{s.icerik}</td>
                  <td>{s.tetik}</td>
                  <td>
                    <button className="btn-small">Düzenle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 📋 LOGLAR VIEW
// ============================================================================

function LoglarView() {
  const { loglar } = useApp();

  return (
    <div className="view-container">
      <h2>📋 Mesaj Logları</h2>

      <table className="data-table">
        <thead>
          <tr>
            <th>Zaman</th>
            <th>Müşteri</th>
            <th>Telefon</th>
            <th>Şablon</th>
            <th>Status</th>
            <th>Hata</th>
          </tr>
        </thead>
        <tbody>
          {loglar.map((l: Log, idx: number) => (
            <tr key={idx}>
              <td>{l.zamanı}</td>
              <td>{l.musteriAdi}</td>
              <td>{l.telefon}</td>
              <td>{l.sablon}</td>
              <td>
                <span
                  className={`badge ${
                    l.status === "Başarılı" ? "success" : "error"
                  }`}
                >
                  {l.status}
                </span>
              </td>
              <td>{l.hata || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {loglar.length === 0 && (
        <p className="empty-message">Henüz log kaydı yok</p>
      )}
    </div>
  );
}

// ============================================================================
// ⚙️ AYARLAR VIEW
// ============================================================================

function AyarlarView() {
  const [settings, setSettings] = useState({
    twiliAccSID: "",
    twilioAuthToken: "",
    googleFormUrl: "",
  });

  const handleSave = () => {
    console.log("Ayarlar kaydedildi:", settings);
    alert("✓ Ayarlar kaydedildi");
  };

  return (
    <div className="view-container">
      <h2>⚙️ Sistem Ayarları</h2>

      <div className="settings-form">
        <div className="form-group">
          <label>Twilio Account SID</label>
          <input
            type="password"
            value={settings.twiliAccSID}
            onChange={(e) =>
              setSettings({ ...settings, twiliAccSID: e.target.value })
            }
            placeholder="AC..."
          />
        </div>

        <div className="form-group">
          <label>Twilio Auth Token</label>
          <input
            type="password"
            value={settings.twilioAuthToken}
            onChange={(e) =>
              setSettings({ ...settings, twilioAuthToken: e.target.value })
            }
            placeholder="Token"
          />
        </div>

        <div className="form-group">
          <label>Google Form URL (Feedback)</label>
          <input
            type="url"
            value={settings.googleFormUrl}
            onChange={(e) =>
              setSettings({ ...settings, googleFormUrl: e.target.value })
            }
            placeholder="https://forms.gle/..."
          />
        </div>

        <button onClick={handleSave} className="btn-primary">
          💾 Kaydet
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 🎨 MAIN APP
// ============================================================================

export default function App() {
  return (
    <AppProvider>
      <AppContainer />
    </AppProvider>
  );
}

function AppContainer() {
  const { user } = useApp();

  return user ? <Dashboard /> : <LoginPage />;
}
