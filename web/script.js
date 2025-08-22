// API Base URL
const API_BASE_URL = 'https://localhost:7076/api';

// Global değişkenler
let currentHasta = null;
let currentDoktor = null;
let doktorlar = [];
let mesajlar = [];

// Sayfa yüklendiğinde çalışacak fonksiyonlar
$(document).ready(function() {
    setupEventListeners();
});

// Event listener'ları ayarla
function setupEventListeners() {
    // Hasta formu submit
    $('#hastaForm').on('submit', handleHastaSubmit);
    
    // Doktor seçimi
    $('#doktorSelect').on('change', handleDoktorSelect);
    
    // Doktor seç butonu
    $('#doktorSecBtn').on('click', handleDoktorSec);
    
    // Mesaj gönder
    $('#mesajGonderBtn').on('click', sendMessage);
    
    // Enter tuşu ile mesaj gönder
    $('#mesajIcerik').on('keypress', function(e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Yeni görüşme butonu
    $('#yeniGorusmeBtn').on('click', resetToInitialState);
}

// Doktorları yükle
async function loadDoktorlar() {
    try {
        const response = await fetch(`${API_BASE_URL}/Doktorlar`);
        
        if (!response.ok) {
            throw new Error('Doktorlar yüklenirken hata oluştu');
        }
        
        doktorlar = await response.json();
        populateDoktorSelect();
        
        // Loading göstergesini kaldır ve doktor listesini göster
        document.getElementById('doktorYukleniyor').style.display = 'none';
        document.getElementById('doktorListesi').classList.remove('d-none');
        
    } catch (error) {
        console.error('Doktorlar yüklenirken hata:', error);
        alert('Doktorlar yüklenirken hata oluştu: ' + error.message);
    }
}

// Doktor select'i doldur
function populateDoktorSelect() {
    const select = $('#doktorSelect');
    select.empty();
    select.append('<option value="">Doktor seçiniz...</option>');
    
    doktorlar.forEach(doktor => {
        select.append(`<option value="${doktor.id}">${doktor.ad} ${doktor.soyad} - ${doktor.uzmanlikAlani}</option>`);
    });
}

// Doktor seçimi değiştiğinde
function handleDoktorSelect() {
    const selectedId = parseInt($('#doktorSelect').val());
    
    if (selectedId) {
        const doktor = doktorlar.find(d => d.id === selectedId);
        if (doktor) {
            showDoktorDetails(doktor);
        }
    } else {
        $('#doktorDetay').addClass('d-none');
    }
}

// Doktor detaylarını göster
function showDoktorDetails(doktor) {
    $('#doktorAdSoyad').text(`${doktor.ad} ${doktor.soyad}`);
    $('#doktorUzmanlik').text(doktor.uzmanlikAlani);
    $('#doktorTelefon').text(doktor.telefon);
    $('#doktorAciklama').text(doktor.aciklama || 'Açıklama bulunmuyor');
    
    $('#doktorDetay').removeClass('d-none');
}

// Hasta formu submit
async function handleHastaSubmit(e) {
    e.preventDefault();
    
    if (!currentHasta) {
        await createHasta();
    }
}

// Hasta oluştur
async function createHasta() {
    try {
        const hastaData = {
            ad: $('#hastaAd').val(),
            soyad: $('#hastaSoyad').val(),
            email: $('#hastaEmail').val(),
            telefon: $('#hastaTelefon').val(),
            dogumTarihi: $('#hastaDogumTarihi').val(),
            cinsiyet: $('#hastaCinsiyet').val(),
            adres: $('#hastaAdres').val()
        };
        
        const response = await fetch(`${API_BASE_URL}/Hastalar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hastaData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Hasta kaydedilirken hata oluştu');
        }
        
        currentHasta = await response.json();
        
        // Form alanlarını devre dışı bırak
        $('#hastaForm input, #hastaForm select, #hastaForm textarea').prop('disabled', true);
        $('#hastaForm button').prop('disabled', true);
        
        // Doktor seçim alanını göster ve doktorları yükle
        $('#doktorSecimAlani').removeClass('d-none');
        await loadDoktorlar();
        
    } catch (error) {
        console.error('Hasta oluşturulurken hata:', error);
        alert('Hasta kaydedilirken hata oluştu: ' + error.message);
    }
}

// Doktor seç
async function handleDoktorSec() {
    if (!currentHasta) {
        showError('Önce hasta bilgilerini kaydetmelisiniz!');
        return;
    }
    
    const selectedId = parseInt($('#doktorSelect').val());
    if (!selectedId) {
        showError('Lütfen bir doktor seçiniz!');
        return;
    }
    
    currentDoktor = doktorlar.find(d => d.id === selectedId);
    
    // Mesajlaşma alanını göster
    $('#mesajDoktorAdi').text(`${currentDoktor.ad} ${currentDoktor.soyad}`);
    $('#mesajlasmaAlani').removeClass('d-none');
    
    // Mesajları yükle
    await loadMesajlar();
    
    // Sayfayı mesajlaşma alanına kaydır
    $('#mesajlasmaAlani')[0].scrollIntoView({ behavior: 'smooth' });
}

// Mesajları yükle
async function loadMesajlar() {
    try {
        const response = await fetch(`${API_BASE_URL}/Mesajlar/konusma/${currentHasta.id}/${currentDoktor.id}`);
        if (!response.ok) {
            throw new Error('Mesajlar yüklenirken hata oluştu');
        }
        
        mesajlar = await response.json();
        displayMesajlar();
        
    } catch (error) {
        console.error('Mesajlar yüklenirken hata:', error);
        showError('Mesajlar yüklenirken hata oluştu: ' + error.message);
    }
}

// Mesajları göster
function displayMesajlar() {
    const container = $('#mesajlar');
    container.empty();
    
    if (mesajlar.length === 0) {
        container.append('<p class="text-muted text-center">Henüz mesaj bulunmuyor. İlk mesajınızı gönderin!</p>');
        return;
    }
    
    mesajlar.forEach(mesaj => {
        const mesajHtml = createMesajHtml(mesaj);
        container.append(mesajHtml);
    });
    
    // En son mesaja scroll
    container.scrollTop(container[0].scrollHeight);
}

// Mesaj HTML'i oluştur
function createMesajHtml(mesaj) {
    const isHastaMessage = mesaj.hastaTarafindanGonderildi;
    const senderName = isHastaMessage ? 
        `${currentHasta.ad} ${currentHasta.soyad}` : 
        `${currentDoktor.ad} ${currentDoktor.soyad}`;
    
    const time = new Date(mesaj.gonderimTarihi).toLocaleString('tr-TR');
    
    return `
        <div class="mesaj ${isHastaMessage ? 'mesaj-hasta' : 'mesaj-doktor'} fade-in">
            <div class="mesaj-icerik">${escapeHtml(mesaj.icerik)}</div>
            <div class="mesaj-zaman">
                <small>${senderName} - ${time}</small>
            </div>
        </div>
    `;
}

// Mesaj gönder
async function sendMessage() {
    const icerik = $('#mesajIcerik').val().trim();
    
    if (!icerik) {
        showError('Lütfen bir mesaj yazın!');
        return;
    }
    
    if (!currentHasta || !currentDoktor) {
        showError('Hasta veya doktor bilgisi eksik!');
        return;
    }
    
    try {
        const mesajData = {
            hastaId: currentHasta.id,
            doktorId: currentDoktor.id,
            icerik: icerik,
            hastaTarafindanGonderildi: true
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
        
        const newMesaj = await response.json();
        mesajlar.push(newMesaj);
        
        // Mesaj alanını temizle
        $('#mesajIcerik').val('');
        
        // Mesajları yeniden göster
        displayMesajlar();
        
    } catch (error) {
        console.error('Mesaj gönderilirken hata:', error);
        showError('Mesaj gönderilirken hata oluştu: ' + error.message);
    }
}

// Mesajları yenile (refresh)
async function refreshMesajlar() {
    if (currentHasta && currentDoktor) {
        await loadMesajlar();
    }
}

// Sayfayı başlangıç durumuna sıfırla
function resetToInitialState() {
    currentHasta = null;
    currentDoktor = null;
    mesajlar = [];
    
    // Form alanlarını temizle ve aktif et
    $('#hastaForm')[0].reset();
    $('#hastaForm input, #hastaForm select, #hastaForm textarea').prop('disabled', false);
    $('#hastaForm button').prop('disabled', false);
    
    // Doktor seçimini sıfırla
    $('#doktorSelect').val('');
    $('#doktorDetay').addClass('d-none');
    $('#doktorSecimAlani').addClass('d-none');
    
    // Mesajlaşma alanını gizle
    $('#mesajlasmaAlani').addClass('d-none');
    
    // Sayfayı başa kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

// Otomatik mesaj yenileme (30 saniyede bir)
setInterval(refreshMesajlar, 30000);

// Sayfa yenilendiğinde mesajları yenile
$(window).on('focus', refreshMesajlar);
