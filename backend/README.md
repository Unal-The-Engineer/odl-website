# MOOC Backend

FastAPI tabanlı MOOC (Massive Open Online Course) backend sistemi.

## Kurulum

1. Sanal ortam oluşturun:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# veya
venv\Scripts\activate  # Windows
```

2. Bağımlılıkları yükleyin:
```bash
pip install -r requirements.txt
```

3. Frontend'i build edin:
```bash
cd ../frontend
npm install
npm run build
```

## Çalıştırma

```bash
python main.py
```

veya

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Session Management
- `POST /api/session/start` - Yeni kullanıcı oturumu başlat
- `GET /api/session/{session_id}` - Oturum bilgilerini getir
- `GET /api/session/{session_id}/modules` - Kullanıcının modül ilerlemesini getir

### Module Management
- `GET /api/module/{module_id}/content` - Modül içeriğini getir
- `POST /api/session/{session_id}/module/{module_id}/complete` - Modülü tamamla

### Quiz
- `POST /api/session/{session_id}/quiz/submit` - Quiz cevaplarını gönder

### Frontend
- `GET /` - Frontend uygulamasını serve et
- `GET /{path:path}` - Tüm frontend route'larını handle et

## Yapı

- `main.py` - Ana FastAPI uygulaması
- `requirements.txt` - Python bağımlılıkları
- In-memory session storage (veritabanı yok)
- Frontend static file serving

## Özellikler

- ✅ Session-based kullanıcı yönetimi
- ✅ Modül kilitleme/açma sistemi
- ✅ Quiz sistem placeholder
- ✅ Video/Comic content placeholder
- ✅ Frontend entegrasyonu
- ✅ CORS desteği
- ✅ Memory-based storage

## TODO (İçerik Entegrasyonu)

- [ ] Gerçek video dosyalarını entegre et
- [ ] Gerçek quiz sorularını entegre et
- [ ] Gerçek karikatür görsellerini entegre et
- [ ] Media file serving 