# User Service Project

## Proje Hakkında

Bu proje, **Node.js** ve **Nest.js** framework'ü kullanarak geliştirilmiş bir servis uygulamasıdır. Uygulama, çeşitli verileri kabul eden ve sunan bir API sağlar. Proje içerisinde **Lodash** kütüphanesi kullanılmakta, **MySQL** veritabanı tercih edilmiştir. ORM kullanılmadan **query builder** yöntemi ile veri yönetimi yapılmıştır.

Bu servis, kullanıcıların verilerini saklamak ve yönetmek için 4 farklı API endpoint’i sunar.

### Veritabanı Yapısı
Veritabanı olarak **MySQL** kullanılmaktadır. Aşağıdaki özelliklere sahip **User** tablosu oluşturulmuş ve başlangıç verisi (mock data) ile doldurulmuştur:

- **id** (Auto Increment, Primary Key)
- **name**
- **surname**
- **email** (Unique)
- **password**
- **phone**
- **age**
- **country**
- **district**
- **role**
- **createdAt**
- **updatedAt**

## API Endpoint'leri

1. **GET /users**  
   Tüm kullanıcıların bilgilerini döndürür.  
   - **Pagination** desteği vardır ve `page` ve `pageSize` query parametreleri ile sayfalama yapılabilir.
   - **Search** özelliği ile kullanıcı adları veya soyadları üzerinden arama yapılabilir.
   
2. **GET /users/<id>**  
   Verilen **id**'ye sahip kullanıcının bilgilerini döndürür.

3. **POST /users/save**  
   Yeni bir kullanıcı ekler.  
   - Kullanıcı şifresi **encrypt** edilerek veritabanına kaydedilir.

4. **POST /users/update**  
   Mevcut bir kullanıcının bilgilerini günceller.  
   - Kullanıcı bilgileri güncellendikten sonra veritabanındaki ilgili kayıt güncellenir.

## Frontend

Frontend tarafı, kullanıcıların backend API ile etkileşime girebileceği bir arayüz sunar. Aşağıdaki teknolojiler kullanılmıştır:

- **React**: Frontend framework olarak React kullanılmaktadır.
- **Ant Design UI Components**: UI bileşenleri için Ant Design kullanılmıştır.
- **Tasarım**: Tasarım tamamen özgürdür. Ancak, kullanılan tasarım ile kullanıcı dostu bir deneyim sunulmuştur.

### Frontend Özellikleri

1. **Veri Listeleme**: Backend API'den alınan kullanıcı verilerini bir tablo içinde listeler.
2. **Arama**: Kullanıcılar, tablo içinde yer alan verilere göre arama yapabilirler.
3. **Düzenleme**: Tablo içinde her bir kayıt için düzenleme yapılabilir.
4. **Yeni Kayıt ve Güncelleme**: Kullanıcılar, yeni bir kayıt ekleyebilir veya mevcut bir kaydın bilgilerini güncelleyebilirler. Bu işlemler **Popup/Modal** kullanılarak yapılır.

## Projeyi Çalıştırmak İçin

Aşağıdaki adımları takip ederek projeyi çalıştırabilirsiniz:

1. **.env_sample Dosyasını Güncelleme**  
   Hem frontend hem de backend için `.env_sample` dosyasını `.env` olarak kopyalayın ve gerekli ortam değişkenlerini yapılandırın.

2. **Bağımlılıkları Yükleme**  
   Hem frontend hem de backend dizinlerinde şu komutu çalıştırarak gerekli bağımlılıkları yükleyin:
   ```bash
   npm install

3. **Projeyi Başlatma**  
   Hem frontend hem de backend dizinlerinde şu komutu çalıştırarak projeyi başlatın:
   ```bash
   npm start