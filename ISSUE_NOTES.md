# CRM Personel Veri Akışı Notları

## Durum
- `Personel.tsx` sayfası çalışıyor ancak veri çekme gecikmeli.
- Sayfa hata vermiyor; daha çok backend/Apps Script yanıtı yavaş olduğu için veri geç geliyor.
- `apiService.get()` şu anda ana `https://script.google.com/macros/s/.../exec` köküne istek atıyor.
- Doğrudan bu URL'ye bakıldığında `personeller` alanı gelmiyor, dolayısıyla frontend personel verisini dolu şekilde alamıyor.

## Bulunanler
- `Musteriler` sayfası için doğru çalışan script URL'si: `https://script.google.com/macros/s/AKfycbwuvIpjC7ajwxmgJ034TD6NhXoX9Kn6H2pyuSUSYQnuq9gy1Aok7NhqPNv5P5g8fEZq/exec`
- `Personel` veri çekimi hâlâ genel API kökünden yapılıyor ve bu kök yanıtı sadece `musterilar`, `randevular`, `loglar` döndürüyor.
- Eğer `personeller` alanı eklenirse veya daha spesifik bir endpoint kullanılırsa hızlanma sağlanabilir.

## Önerilen adımlar
1. Apps Script tarafında `personeller` dizisini doğrudan JSON olarak döndür.
2. Mümkünse `action=personeller` gibi ayrık bir endpoint ekle.
3. Frontend'de sadece gerekli alanları çek: `ad`, `primYuzdesi`, `toplamCiro`, `toplamHizmetSayisi`.
4. Kullanıcı deneyimini iyileştirmek için `loading` spinner veya skeleton ekle.
5. Backend response zamanını azaltmak için hesaplamaları optimize et.

## Önemli dosyalar
- `src/pages/Personel.tsx`
- `src/services/api.ts`
- `vite.config.ts`

## Not
- Bu not, sistem kapatılsa bile proje içinde saklanacak.
- Sonra buradan hızlıca durumu tekrar gözden geçirebilirsin.
