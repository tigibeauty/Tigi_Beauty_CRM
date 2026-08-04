// src/services/api.ts
import type { ApiResponse } from '../types';

const API_URL = import.meta.env.DEV
  ? '/api'
  : 'https://script.google.com/macros/s/AKfycbzWPv5FDw4JFwvy1zVn29QxlZuiQdmoXl_xc6jPFuenB4ZUkSLgLYxaUaaBsXe3OgpKDA/exec';

// PERFORMANS İÇİN BELLEK İÇİ CACHE (IN-MEMORY CACHE)
let globalDataCache: any = null;
let lastFetchTime: number = 0;
const CACHE_TTL_MS = 300000; // 5 Dakika Caching

export const apiService = {
  async post<T>(action: string, payload: any = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}?action=${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, ...payload }),
      });

      if (!response.ok) {
        throw new Error(`API Hatası: ${response.statusText}`);
      }

      // Kayıt işleminden sonra cache'i temizle ki yeni veri çekilsin
      globalDataCache = null;
      lastFetchTime = 0;

      const result = await response.json();
      return result as ApiResponse<T>;
    } catch (error: any) {
      console.error('API İletişim Hatası:', error);
      return {
        success: false,
        data: null,
        error: {
          code: 'FETCH_ERROR',
          message: error.message || 'Veritabanına bağlanılamadı.',
        },
      };
    }
  },

  async get<T>(forceRefresh: boolean = false): Promise<ApiResponse<T>> {
    const now = Date.now();

    // Eğer cache geçerliyse ve zorla yenileme istenmediyse CACHE'DEN DÖN (ANINDA HIZ)
    if (!forceRefresh && globalDataCache && (now - lastFetchTime < CACHE_TTL_MS)) {
      return {
        success: true,
        data: globalDataCache as T,
        error: null
      };
    }

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`API Hatası: ${response.statusText}`);
      }
      const result = await response.json();

      // Önbelleği Güncelle
      globalDataCache = result;
      lastFetchTime = Date.now();

      return {
        success: true,
        data: result as T,
        error: null
      };
    } catch (error: any) {
      console.error('API GET Hatası:', error);

      // Ağ hatası olsa bile eldeki eski cache varsa onu döndür
      if (globalDataCache) {
        return {
          success: true,
          data: globalDataCache as T,
          error: null
        };
      }

      return {
        success: false,
        data: null,
        error: {
          code: 'GET_ERROR',
          message: error.message || 'Veri çekilemedi.',
        },
      };
    }
  },

  // Manuel Cache Temizleme
  clearCache() {
    globalDataCache = null;
    lastFetchTime = 0;
  }
};