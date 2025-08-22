# Hasta - Doktor Online Danışma Sistemi

Bu proje, hastaların doktorlarla online olarak danışma yapabilecekleri bir web uygulamasıdır. Proje 3 ana bileşenden oluşmaktadır:

## 🏗️ Proje Yapısı

```
HDOD/
├── api/                    # .NET Core Web API
│   └── HastaDoktorAPI/
│       ├── Controllers/    # API Controller'ları
│       ├── Models/         # Entity modelleri
│       ├── Data/           # Entity Framework DbContext
│       └── Services/       # Business logic servisleri
├── web/                    # Hasta arayüzü (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
└── admin/                  # Admin paneli (HTML/CSS/JS)
    ├── index.html
    ├── style.css
    └── script.js
```

## 🚀 Özellikler

### API (.NET Core)

- **Entity Framework Core** ile PostgreSQL veritabanı entegrasyonu
- **RESTful API** endpoints
- **CRUD** işlemleri (Create, Read, Update, Delete)
- **CORS** desteği
- **Seed data** ile örnek veriler

### Web Arayüzü (Hasta)

- **Responsive** tasarım (Bootstrap 5)
- **Login olmadan** doktor seçimi
- **Hasta kayıt** formu
- **Mesajlaşma** sistemi
- **Refresh** tabanlı mesaj güncelleme
- **Modern UI/UX** tasarım

### Admin Paneli

- **Dashboard** ile istatistikler
- **Doktor yönetimi** (CRUD)
- **Hasta yönetimi** (CRUD)
- **Mesaj yönetimi**
- **Gerçek zamanlı** veri görüntüleme

## 🛠️ Teknolojiler

### Backend

- **.NET Core 9.0**
- **Entity Framework Core**
- **PostgreSQL**
- **ASP.NET Core Web API**

### Frontend

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Bootstrap 5**
- **jQuery**
- **Font Awesome**

## 📋 Gereksinimler

### Sistem Gereksinimleri

- **.NET 9.0 SDK**
- **PostgreSQL** veritabanı
- **Web tarayıcısı** (Chrome, Firefox, Safari, Edge)

### Veritabanı Kurulumu

1. PostgreSQL'i yükleyin
2. Yeni bir veritabanı oluşturun: `hastadoktor_db`
3. Kullanıcı adı ve şifre ayarlayın

## 🔧 Kurulum

### 1. API Kurulumu

```bash
# API klasörüne geçin
cd api/HastaDoktorAPI

# Bağımlılıkları yükleyin
dotnet restore

# Veritabanı bağlantı stringini güncelleyin
# appsettings.json dosyasında:
# "DefaultConnection": "Host=localhost;Database=hastadoktor_db;Username=your_username;Password=your_password"

# Veritabanını oluşturun
dotnet ef database update

# API'yi çalıştırın
dotnet run
```

### 2. Web Arayüzü

```bash
# Web klasörüne geçin
cd web

# index.html dosyasını web tarayıcısında açın
# Veya bir web sunucusu kullanın:
python -m http.server 8000
# http://localhost:8000 adresinden erişin
```

### 3. Admin Paneli

```bash
# Admin klasörüne geçin
cd admin

# index.html dosyasını web tarayıcısında açın
# Veya bir web sunucusu kullanın:
python -m http.server 8001
# http://localhost:8001 adresinden erişin
```

## 📖 API Endpoints

### Doktorlar

- `GET /api/Doktorlar` - Tüm doktorları listele
- `GET /api/Doktorlar/{id}` - Doktor detayı
- `POST /api/Doktorlar` - Yeni doktor ekle
- `PUT /api/Doktorlar/{id}` - Doktor güncelle
- `DELETE /api/Doktorlar/{id}` - Doktor sil

### Hastalar

- `GET /api/Hastalar` - Tüm hastaları listele
- `GET /api/Hastalar/{id}` - Hasta detayı
- `POST /api/Hastalar` - Yeni hasta ekle
- `PUT /api/Hastalar/{id}` - Hasta güncelle
- `DELETE /api/Hastalar/{id}` - Hasta sil

### Mesajlar

- `GET /api/Mesajlar` - Tüm mesajları listele
- `GET /api/Mesajlar/{id}` - Mesaj detayı
- `GET /api/Mesajlar/konusma/{hastaId}/{doktorId}` - Konuşma geçmişi
- `POST /api/Mesajlar` - Yeni mesaj gönder
- `PUT /api/Mesajlar/{id}/okundu` - Mesajı okundu olarak işaretle
- `DELETE /api/Mesajlar/{id}` - Mesaj sil

## 🎯 Kullanım Senaryoları

### Hasta Kullanımı

1. Web arayüzünü açın
2. Hasta bilgilerini doldurun ve kaydedin
3. Doktor listesinden bir doktor seçin
4. Doktorla mesajlaşmaya başlayın
5. Mesajlarınızı gönderin ve yanıtları bekleyin

### Admin Kullanımı

1. Admin panelini açın
2. Dashboard'da genel istatistikleri görün
3. Doktorlar sekmesinden doktor yönetimi yapın
4. Hastalar sekmesinden hasta yönetimi yapın
5. Mesajlar sekmesinden mesaj yönetimi yapın

## 🔒 Güvenlik

- **CORS** politikaları yapılandırılmış
- **Input validation** tüm formlarda mevcut
- **SQL injection** koruması (Entity Framework)
- **XSS** koruması (HTML escaping)

## 🚀 Geliştirme

### Yeni Özellik Ekleme

1. API'de yeni endpoint'ler ekleyin
2. Model sınıflarını güncelleyin
3. Frontend'de yeni UI bileşenleri ekleyin
4. JavaScript fonksiyonlarını güncelleyin

### Veritabanı Değişiklikleri

```bash
# Yeni migration oluşturun
dotnet ef migrations add MigrationName

# Veritabanını güncelleyin
dotnet ef database update
```

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir. Developer: Süeda ERSOY

**Not:** Bu proje bitirme ödevi kapsamında geliştirilmiştir ve eğitim amaçlıdır.
