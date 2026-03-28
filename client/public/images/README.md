# Background Image Guide

## Dosya Adı
background-pattern.png

## Önerilen Görsel Türleri

1. **Teknoloji Desenleri:**
   - Circuit board patterns
   - Hexagonal grids
   - Wireframe patterns
   - Digital/matrix style

2. **Geometrik Desenler:**
   - Grid patterns
   - Dot patterns
   - Line patterns
   - Abstract shapes

3. **Önerilen Siteler:**
   - freepik.com
   - unsplash.com
   - pexels.com
   - pixabay.com

## Arama Terimleri
- "technology background pattern png"
- "circuit board pattern transparent"
- "hexagon pattern background"
- "wireframe background"
- "digital grid pattern"

## CSS Ayarları

Opacity ayarı için App.css dosyasında `.app::before` içindeki `opacity` değerini değiştirin:

- Çok hafif: `opacity: 0.03`
- Hafif (varsayılan): `opacity: 0.05`
- Orta: `opacity: 0.08`
- Belirgin: `opacity: 0.12`

## Background Size Alternatifleri

```css
background-size: cover; /* Tüm ekranı kaplar (varsayılan) */
background-size: contain; /* Oranını koruyarak sığdırır */
background-size: 50%; /* Tekrar eden desen için */
```

## Tekrar Eden Desen İçin

Eğer küçük bir desen görseli kullanıyorsanız:

```css
background-repeat: repeat; /* Tekrar eder */
background-size: 400px; /* Desen boyutu */
```
