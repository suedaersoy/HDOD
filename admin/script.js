// API Base URL
const API_BASE_URL = 'https://localhost:7076/api';

// Global değişkenler
let doktorlar = [];
let hastalar = [];
let mesajlar = [];

// Sayfa yüklendiğinde çalışacak fonksiyonlar
$(document).ready(function() {
    setupEventListeners();
    loadDashboard();
    loadDoktorlar();
    loadHastalar();
    loadMesajlar();
    setupAdminMesajEventListeners();
});

// Event listener'ları ayarla
function setupEventListeners() {
    // Tab değiştirme
    $('.list-group-item').on('click', function(e) {
        e.preventDefault();
        const tab = $(this).data('tab');
        switchTab(tab);
    });
}

// Admin mesaj event listener'ları
function setupAdminMesajEventListeners() {
    // Doktor seçimi değiştiğinde hastaları yükle
    $('#adminDoktorSelect').on('change', function() {
        const doktorId = $(this).val();
        if (doktorId) {
            loadHastalarByDoktor(doktorId);
        } else {
            $('#adminHastaSelect').html('<option value="">Önce doktor seçiniz...</option>');
        }
    });
}

// Tab değiştir
function switchTab(tabName) {
    // Aktif tab'ı değiştir
    $('.list-group-item').removeClass('active');
    $(`.list-group-item[data-tab="${tabName}"]`).addClass('active');
    
    // Tab içeriğini göster
    $('.tab-content').removeClass('active');
    $(`#${tabName}`).addClass('active');
}

// Dashboard yükle
async function loadDashboard() {
    try {
        // İstatistikleri yükle
        await Promise.all([
            loadDoktorSayisi(),
            loadHastaSayisi(),
            loadMesajSayisi(),
            loadAktifGorusmeSayisi()
        ]);
        
        // Son aktiviteleri yükle
        await loadSonAktiviteler();
        await loadSonMesajlar();
        
    } catch (error) {
        console.error('Dashboard yüklenirken hata:', error);
        showError('Dashboard yüklenirken hata oluştu: ' + error.message);
    }
}

// Doktor sayısını yükle
async function loadDoktorSayisi() {
    try {
        const response = await fetch(`${API_BASE_URL}/Doktorlar`);
        if (response.ok) {
            const data = await response.json();
            $('#doktorSayisi').text(data.length);
        }
    } catch (error) {
        console.error('Doktor sayısı yüklenirken hata:', error);
    }
}

// Hasta sayısını yükle
async function loadHastaSayisi() {
    try {
        const response = await fetch(`${API_BASE_URL}/Hastalar`);
        if (response.ok) {
            const data = await response.json();
            $('#hastaSayisi').text(data.length);
        }
    } catch (error) {
        console.error('Hasta sayısı yüklenirken hata:', error);
    }
}

// Mesaj sayısını yükle
async function loadMesajSayisi() {
    try {
        const response = await fetch(`${API_BASE_URL}/Mesajlar`);
        if (response.ok) {
            const data = await response.json();
            $('#mesajSayisi').text(data.length);
        }
    } catch (error) {
        console.error('Mesaj sayısı yüklenirken hata:', error);
    }
}

// Aktif görüşme sayısını yükle
async function loadAktifGorusmeSayisi() {
    try {
        const response = await fetch(`${API_BASE_URL}/Mesajlar`);
        if (response.ok) {
            const data = await response.json();
            // Son 24 saatte mesaj gönderen hasta-doktor çiftlerini say
            const son24Saat = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const aktifGorusmeler = new Set();
            
            data.forEach(mesaj => {
                const mesajTarihi = new Date(mesaj.gonderimTarihi);
                if (mesajTarihi > son24Saat) {
                    aktifGorusmeler.add(`${mesaj.hastaId}-${mesaj.doktorId}`);
                }
            });
            
            $('#aktifGorusmeSayisi').text(aktifGorusmeler.size);
        }
    } catch (error) {
        console.error('Aktif görüşme sayısı yüklenirken hata:', error);
    }
}

// Son aktiviteleri yükle
async function loadSonAktiviteler() {
    try {
        const container = $('#sonAktiviteler');
        
        // Son mesajları al
        const response = await fetch(`${API_BASE_URL}/Mesajlar`);
        if (response.ok) {
            const data = await response.json();
            
            // Son 10 mesajı göster
            const sonMesajlar = data.slice(-10).reverse();
            
            if (sonMesajlar.length === 0) {
                container.html('<p class="text-muted">Henüz aktivite bulunmuyor.</p>');
                return;
            }
            
            let html = '';
            sonMesajlar.forEach(mesaj => {
                const tarih = new Date(mesaj.gonderimTarihi).toLocaleString('tr-TR');
                const gonderen = mesaj.hastaTarafindanGonderildi ? 'Hasta' : 'Doktor';
                html += `
                    <div class="activity-item">
                        <div class="d-flex justify-content-between">
                            <span><strong>${gonderen}</strong> mesaj gönderdi</span>
                            <small class="activity-time">${tarih}</small>
                        </div>
                    </div>
                `;
            });
            
            container.html(html);
        }
    } catch (error) {
        console.error('Son aktiviteler yüklenirken hata:', error);
        $('#sonAktiviteler').html('<p class="text-muted">Aktiviteler yüklenemedi.</p>');
    }
}

// Son mesajları yükle
async function loadSonMesajlar() {
    try {
        const container = $('#sonMesajlar');
        
        const response = await fetch(`${API_BASE_URL}/Mesajlar`);
        if (response.ok) {
            const data = await response.json();
            
            // Son 5 mesajı göster
            const sonMesajlar = data.slice(-5).reverse();
            
            if (sonMesajlar.length === 0) {
                container.html('<p class="text-muted">Henüz mesaj bulunmuyor.</p>');
                return;
            }
            
            let html = '';
            sonMesajlar.forEach(mesaj => {
                const tarih = new Date(mesaj.gonderimTarihi).toLocaleString('tr-TR');
                const icerik = mesaj.icerik.length > 50 ? mesaj.icerik.substring(0, 50) + '...' : mesaj.icerik;
                html += `
                    <div class="activity-item">
                        <div class="message-preview">${escapeHtml(icerik)}</div>
                        <small class="activity-time">${tarih}</small>
                    </div>
                `;
            });
            
            container.html(html);
        }
    } catch (error) {
        console.error('Son mesajlar yüklenirken hata:', error);
        $('#sonMesajlar').html('<p class="text-muted">Mesajlar yüklenemedi.</p>');
    }
}

// Doktorları yükle
async function loadDoktorlar() {
    try {
        const response = await fetch(`${API_BASE_URL}/Doktorlar`);
        if (response.ok) {
            doktorlar = await response.json();
            displayDoktorlar();
        }
    } catch (error) {
        console.error('Doktorlar yüklenirken hata:', error);
        showError('Doktorlar yüklenirken hata oluştu: ' + error.message);
    }
}

// Doktorları göster
function displayDoktorlar() {
    const tbody = $('#doktorlarTable tbody');
    tbody.empty();
    
    if (doktorlar.length === 0) {
        tbody.append('<tr><td colspan="7" class="text-center">Doktor bulunamadı</td></tr>');
        return;
    }
    
    doktorlar.forEach(doktor => {
        const row = `
            <tr>
                <td>${doktor.id}</td>
                <td>${doktor.ad} ${doktor.soyad}</td>
                <td>${doktor.uzmanlikAlani}</td>
                <td>${doktor.email}</td>
                <td>${doktor.telefon}</td>
                <td>
                    <span class="badge ${doktor.aktif ? 'bg-success' : 'bg-danger'}">
                        ${doktor.aktif ? 'Aktif' : 'Pasif'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editDoktor(${doktor.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDoktor(${doktor.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
    
    // Admin doktor select'ini de güncelle
    updateAdminDoktorSelect();
}

// Hastaları yükle
async function loadHastalar() {
    try {
        const response = await fetch(`${API_BASE_URL}/Hastalar`);
        if (response.ok) {
            hastalar = await response.json();
            displayHastalar();
        }
    } catch (error) {
        console.error('Hastalar yüklenirken hata:', error);
        showError('Hastalar yüklenirken hata oluştu: ' + error.message);
    }
}

// Hastaları göster
function displayHastalar() {
    const tbody = $('#hastalarTable tbody');
    tbody.empty();
    
    if (hastalar.length === 0) {
        tbody.append('<tr><td colspan="8" class="text-center">Hasta bulunamadı</td></tr>');
        return;
    }
    
    hastalar.forEach(hasta => {
        const dogumTarihi = new Date(hasta.dogumTarihi).toLocaleDateString('tr-TR');
        const row = `
            <tr>
                <td>${hasta.id}</td>
                <td>${hasta.ad} ${hasta.soyad}</td>
                <td>${hasta.email}</td>
                <td>${hasta.telefon}</td>
                <td>${dogumTarihi}</td>
                <td>${hasta.cinsiyet || '-'}</td>
                <td>
                    <span class="badge ${hasta.aktif ? 'bg-success' : 'bg-danger'}">
                        ${hasta.aktif ? 'Aktif' : 'Pasif'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editHasta(${hasta.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteHasta(${hasta.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Mesajları yükle
async function loadMesajlar() {
    try {
        const response = await fetch(`${API_BASE_URL}/Mesajlar`);
        if (response.ok) {
            mesajlar = await response.json();
            displayMesajlar();
        }
    } catch (error) {
        console.error('Mesajlar yüklenirken hata:', error);
        showError('Mesajlar yüklenirken hata oluştu: ' + error.message);
    }
}

// Mesajları göster
function displayMesajlar() {
    const tbody = $('#mesajlarTable tbody');
    tbody.empty();
    
    if (mesajlar.length === 0) {
        tbody.append('<tr><td colspan="8" class="text-center">Mesaj bulunamadı</td></tr>');
        return;
    }
    
    // Mesajları tarihe göre sırala (en yeni önce)
    const sortedMesajlar = mesajlar.sort((a, b) => new Date(b.gonderimTarihi) - new Date(a.gonderimTarihi));
    
    sortedMesajlar.forEach(mesaj => {
        const tarih = new Date(mesaj.gonderimTarihi).toLocaleString('tr-TR');
        const icerik = mesaj.icerik.length > 50 ? mesaj.icerik.substring(0, 50) + '...' : mesaj.icerik;
        const gonderen = mesaj.hastaTarafindanGonderildi ? 'Hasta' : 'Doktor';
        
        const row = `
            <tr>
                <td>${mesaj.id}</td>
                <td>${mesaj.hasta ? `${mesaj.hasta.ad} ${mesaj.hasta.soyad}` : 'Bilinmiyor'}</td>
                <td>${mesaj.doktor ? `${mesaj.doktor.ad} ${mesaj.doktor.soyad}` : 'Bilinmiyor'}</td>
                <td>${escapeHtml(icerik)}</td>
                <td>${gonderen}</td>
                <td>${tarih}</td>
                <td>
                    <span class="badge ${mesaj.okundu ? 'bg-success' : 'bg-warning'}">
                        ${mesaj.okundu ? 'Okundu' : 'Okunmadı'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteMesaj(${mesaj.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Doktor modal'ını göster
function showDoktorModal(doktor = null) {
    if (doktor) {
        $('#doktorModalTitle').text('Doktor Düzenle');
        $('#doktorId').val(doktor.id);
        $('#doktorAd').val(doktor.ad);
        $('#doktorSoyad').val(doktor.soyad);
        $('#doktorUzmanlik').val(doktor.uzmanlikAlani);
        $('#doktorEmail').val(doktor.email);
        $('#doktorTelefon').val(doktor.telefon);
        $('#doktorAciklama').val(doktor.aciklama);
        $('#doktorAktif').prop('checked', doktor.aktif);
    } else {
        $('#doktorModalTitle').text('Yeni Doktor');
        $('#doktorForm')[0].reset();
        $('#doktorId').val('');
    }
    
    $('#doktorModal').modal('show');
}

// Hasta modal'ını göster
function showHastaModal(hasta = null) {
    if (hasta) {
        $('#hastaModalTitle').text('Hasta Düzenle');
        $('#hastaId').val(hasta.id);
        $('#hastaAd').val(hasta.ad);
        $('#hastaSoyad').val(hasta.soyad);
        $('#hastaEmail').val(hasta.email);
        $('#hastaTelefon').val(hasta.telefon);
        $('#hastaDogumTarihi').val(hasta.dogumTarihi.split('T')[0]);
        $('#hastaCinsiyet').val(hasta.cinsiyet);
        $('#hastaAdres').val(hasta.adres);
        $('#hastaAktif').prop('checked', hasta.aktif);
    } else {
        $('#hastaModalTitle').text('Yeni Hasta');
        $('#hastaForm')[0].reset();
        $('#hastaId').val('');
    }
    
    $('#hastaModal').modal('show');
}

// Doktor düzenle
function editDoktor(id) {
    const doktor = doktorlar.find(d => d.id === id);
    if (doktor) {
        showDoktorModal(doktor);
    }
}

// Hasta düzenle
function editHasta(id) {
    const hasta = hastalar.find(h => h.id === id);
    if (hasta) {
        showHastaModal(hasta);
    }
}

// Doktor kaydet
async function saveDoktor() {
    try {
        const doktorData = {
            id: $('#doktorId').val() || 0,
            ad: $('#doktorAd').val(),
            soyad: $('#doktorSoyad').val(),
            uzmanlikAlani: $('#doktorUzmanlik').val(),
            email: $('#doktorEmail').val(),
            telefon: $('#doktorTelefon').val(),
            aciklama: $('#doktorAciklama').val(),
            aktif: $('#doktorAktif').is(':checked')
        };
        
        const method = doktorData.id > 0 ? 'PUT' : 'POST';
        const url = doktorData.id > 0 ? `${API_BASE_URL}/Doktorlar/${doktorData.id}` : `${API_BASE_URL}/Doktorlar`;
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doktorData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Doktor kaydedilirken hata oluştu');
        }
        
        $('#doktorModal').modal('hide');
        showSuccess('Doktor başarıyla kaydedildi!');
        
        // Listeleri yenile
        await loadDoktorlar();
        await loadDashboard();
        
    } catch (error) {
        console.error('Doktor kaydedilirken hata:', error);
        showError('Doktor kaydedilirken hata oluştu: ' + error.message);
    }
}

// Hasta kaydet
async function saveHasta() {
    try {
        const hastaData = {
            id: $('#hastaId').val() || 0,
            ad: $('#hastaAd').val(),
            soyad: $('#hastaSoyad').val(),
            email: $('#hastaEmail').val(),
            telefon: $('#hastaTelefon').val(),
            dogumTarihi: $('#hastaDogumTarihi').val(),
            cinsiyet: $('#hastaCinsiyet').val(),
            adres: $('#hastaAdres').val(),
            aktif: $('#hastaAktif').is(':checked')
        };
        
        const method = hastaData.id > 0 ? 'PUT' : 'POST';
        const url = hastaData.id > 0 ? `${API_BASE_URL}/Hastalar/${hastaData.id}` : `${API_BASE_URL}/Hastalar`;
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hastaData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Hasta kaydedilirken hata oluştu');
        }
        
        $('#hastaModal').modal('hide');
        showSuccess('Hasta başarıyla kaydedildi!');
        
        // Listeleri yenile
        await loadHastalar();
        await loadDashboard();
        
    } catch (error) {
        console.error('Hasta kaydedilirken hata:', error);
        showError('Hasta kaydedilirken hata oluştu: ' + error.message);
    }
}

// Doktor sil
async function deleteDoktor(id) {
    if (!confirm('Bu doktoru silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/Doktorlar/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Doktor silinirken hata oluştu');
        }
        
        showSuccess('Doktor başarıyla silindi!');
        
        // Listeleri yenile
        await loadDoktorlar();
        await loadDashboard();
        
    } catch (error) {
        console.error('Doktor silinirken hata:', error);
        showError('Doktor silinirken hata oluştu: ' + error.message);
    }
}

// Hasta sil
async function deleteHasta(id) {
    if (!confirm('Bu hastayı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        showLoading('Hasta siliniyor...');
        
        const response = await fetch(`${API_BASE_URL}/Hastalar/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Hasta silinirken hata oluştu');
        }
        
        showSuccess('Hasta başarıyla silindi!');
        
        // Listeleri yenile
        await loadHastalar();
        await loadDashboard();
        
        hideLoading();
    } catch (error) {
        console.error('Hasta silinirken hata:', error);
        showError('Hasta silinirken hata oluştu: ' + error.message);
        hideLoading();
    }
}

// Mesaj sil
async function deleteMesaj(id) {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        showLoading('Mesaj siliniyor...');
        
        const response = await fetch(`${API_BASE_URL}/Mesajlar/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Mesaj silinirken hata oluştu');
        }
        
        showSuccess('Mesaj başarıyla silindi!');
        
        // Listeleri yenile
        await loadMesajlar();
        await loadDashboard();
        
        hideLoading();
    } catch (error) {
        console.error('Mesaj silinirken hata:', error);
        showError('Mesaj silinirken hata oluştu: ' + error.message);
        hideLoading();
    }
}

// Dashboard yenile
function refreshDashboard() {
    loadDashboard();
}

// Mesajları yenile
function refreshMesajlar() {
    loadMesajlar();
}

// Utility fonksiyonlar
function showLoading(message = 'Yükleniyor...') {
    $('#loadingText').text(message);
    $('#loadingModal').modal('show');
}

function hideLoading() {
    $('#loadingModal').modal('hide');
}

function showSuccess(message) {
    $('#successMessage').text(message);
    $('#successModal').modal('show');
}

function showError(message) {
    $('#errorMessage').text(message);
    $('#errorModal').modal('show');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Otomatik yenileme (5 dakikada bir)
setInterval(() => {
    if ($('#dashboard').hasClass('active')) {
        loadDashboard();
    }
}, 300000);

// ===== ADMIN MESAJ FONKSİYONLARI =====

// Admin doktor select'ini güncelle
function updateAdminDoktorSelect() {
    const select = $('#adminDoktorSelect');
    select.html('<option value="">Doktor seçiniz...</option>');
    
    doktorlar.forEach(doktor => {
        select.append(`<option value="${doktor.id}">${doktor.ad} ${doktor.soyad} - ${doktor.uzmanlikAlani}</option>`);
    });
}

// Doktora göre hastaları yükle
async function loadHastalarByDoktor(doktorId) {
    try {
        const response = await fetch(`${API_BASE_URL}/Mesajlar/doktor/${doktorId}`);
        if (response.ok) {
            const mesajlar = await response.json();
            
            // Bu doktorla mesajlaşan hastaları bul
            const hastaIds = [...new Set(mesajlar.map(m => m.hastaId))];
            const hastaSelect = $('#adminHastaSelect');
            hastaSelect.html('<option value="">Hasta seçiniz...</option>');
            
            hastaIds.forEach(hastaId => {
                const hasta = hastalar.find(h => h.id === hastaId);
                if (hasta) {
                    hastaSelect.append(`<option value="${hasta.id}">${hasta.ad} ${hasta.soyad}</option>`);
                }
            });
        }
    } catch (error) {
        console.error('Hastalar yüklenirken hata:', error);
        showError('Hastalar yüklenirken hata oluştu: ' + error.message);
    }
}

// Konuşmayı yükle
async function loadKonusma() {
    const doktorId = $('#adminDoktorSelect').val();
    const hastaId = $('#adminHastaSelect').val();
    
    if (!doktorId || !hastaId) {
        showError('Lütfen doktor ve hasta seçiniz.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/Mesajlar/konusma/${hastaId}/${doktorId}`);
        if (response.ok) {
            const konusma = await response.json();
            displayKonusma(konusma, doktorId, hastaId);
        }
    } catch (error) {
        console.error('Konuşma yüklenirken hata:', error);
        showError('Konuşma yüklenirken hata oluştu: ' + error.message);
    }
}

// Konuşmayı göster
function displayKonusma(mesajlar, doktorId, hastaId) {
    const container = $('#konusmaMesajlari');
    const doktor = doktorlar.find(d => d.id == doktorId);
    const hasta = hastalar.find(h => h.id == hastaId);
    
    if (!doktor || !hasta) {
        showError('Doktor veya hasta bilgisi bulunamadı.');
        return;
    }
    
    // Konuşma bilgisini güncelle
    $('#konusmaBilgi').text(`${doktor.ad} ${doktor.soyad} ↔ ${hasta.ad} ${hasta.soyad}`);
    
    if (mesajlar.length === 0) {
        container.html('<p class="text-muted text-center">Henüz mesaj bulunmuyor.</p>');
    } else {
        let html = '';
        mesajlar.forEach(mesaj => {
            const tarih = new Date(mesaj.gonderimTarihi).toLocaleString('tr-TR');
            const gonderen = mesaj.hastaTarafindanGonderildi ? 'Hasta' : 'Doktor';
            const alignClass = mesaj.hastaTarafindanGonderildi ? 'text-start' : 'text-end';
            const bgClass = mesaj.hastaTarafindanGonderildi ? 'bg-light' : 'bg-primary text-white';
            
            html += `
                <div class="mb-2 ${alignClass}">
                    <div class="d-inline-block p-2 rounded ${bgClass}" style="max-width: 70%;">
                        <div class="small text-muted mb-1">${gonderen} - ${tarih}</div>
                        <div>${escapeHtml(mesaj.icerik)}</div>
                    </div>
                </div>
            `;
        });
        container.html(html);
    }
    
    // Konuşma alanını göster
    $('#konusmaAlani').removeClass('d-none');
    
    // Scroll'u en alta getir
    container.scrollTop(container[0].scrollHeight);
}

// Admin mesaj gönder
async function sendAdminMesaj() {
    const doktorId = $('#adminDoktorSelect').val();
    const hastaId = $('#adminHastaSelect').val();
    const icerik = $('#adminMesajIcerik').val().trim();
    
    if (!doktorId || !hastaId) {
        showError('Lütfen doktor ve hasta seçiniz.');
        return;
    }
    
    if (!icerik) {
        showError('Lütfen mesaj içeriği yazınız.');
        return;
    }
    
    try {
        const mesajData = {
            hastaId: parseInt(hastaId),
            doktorId: parseInt(doktorId),
            icerik: icerik,
            hastaTarafindanGonderildi: false // Admin doktor adına gönderiyor
        };
        
        const response = await fetch(`${API_BASE_URL}/Mesajlar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mesajData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Mesaj gönderilirken hata oluştu');
        }
        
        // Mesaj alanını temizle
        $('#adminMesajIcerik').val('');
        
        // Konuşmayı yenile
        await loadKonusma();
        
        // Tüm mesajları yenile
        await loadMesajlar();
        
        showSuccess('Mesaj başarıyla gönderildi!');
        
    } catch (error) {
        console.error('Mesaj gönderilirken hata:', error);
        showError('Mesaj gönderilirken hata oluştu: ' + error.message);
    }
}
