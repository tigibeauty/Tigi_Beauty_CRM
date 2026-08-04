// src/types/index.ts

export type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'RECEPTION' | 'STAFF';
export type RiskSeviyesi = '🟢 Normal' | '🟡 Hassas' | '🟠 Alerjik';
export type RandevuDurumu = 'Bekliyor' | 'Onaylandı' | 'Geldi' | 'Tamamlandı' | 'İptal' | 'Gelmedi';
export type OdemeDurumu = 'Ödeme Yok' | 'Depozito' | 'Kısmi Ödeme' | 'Tam Ödendi' | 'İade';
export type IslemTuru = 'Hizmet Ödemesi' | 'Depozito' | 'Ön Ödeme' | 'İade' | 'Müşteri Bakiyesi' | 'Paket Satışı' | 'Paket Kullanımı' | 'Masraf/Gider';
export type OdemeYontemi = 'Nakit' | 'Kredi Kartı' | 'Havale/EFT' | 'Bakiye/Paket';

export interface Sube {
  id: string;
  ad: string;
  sehir: string;
  telefon: string;
  adres: string;
  aktif: boolean;
}

export interface Musteri {
  id: string;
  subeID?: string;
  ad: string;
  telefon: string;
  email?: string;
  kaydolmaTarihi: string;
  musteriBakiyesi: number;
  paketBakiyesi: number;
  toplamZiyaret: number;
  toplamHarcama: number;
  favoriHizmet?: string;
  favoriPersonel?: string;
  puan: number;
  riskSeviyesi: RiskSeviyesi;
  dogumGunu?: string;
  tercih?: string;
  referralKaynagi?: string;
  notlar?: string;
}

export interface Randevu {
  id: string;
  subeID?: string;
  musteriID: string;
  musteriAdi: string;
  tarih: string;
  saat: string;
  hizmet: string;
  personel: string;
  sureDk: number;
  randevuDurumu: RandevuDurumu;
  hizmetUcreti: number;
  odemeDurumu: OdemeDurumu;
  depozito: number;
  onOdeme: number;
  odenenTutar: number;
  kalanTutar: number;
  mesajDurum: string;
  sonKontrolZamani?: string;
  iptalNedeni?: string;
  not?: string;
}

export interface Odeme {
  id: string;
  subeID?: string;
  randevuID?: string;
  musteriID: string;
  musteriAdi: string;
  tarih: string;
  islemTuru: IslemTuru;
  tutar: number;
  odemeYontemi: OdemeYontemi;
  personel: string;
  aciklama?: string;
}

export interface Urun {
  id: string;
  subeID?: string;
  ad: string;
  stokMiktari: number;
  birim: string;
  kritikSeviye: number;
  maliyet: number;
  tedarikci: string;
}

export interface Personel {
  id: string;
  subeID?: string;
  ad: string;
  rol: Role;
  uzmanlik: string;
  primYuzdesi: number;
  telefon: string;
  calismaGunleri: string;
  aktif: boolean;
  toplamHizmetSayisi?: number;
  toplamCiro?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T | null;
  error?: {
    code?: string;
    message: string;
  } | null;
  message?: string;
}