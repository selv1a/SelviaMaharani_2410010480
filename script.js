const canvas = document.getElementById('scrubCanvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('cursor-follower');
const spots = document.querySelectorAll('.spot');
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('music-btn');

let isMusicPlaying = false;
let ticking = false; // Optimasi performa untuk HP

// 1. Inisialisasi Kanvas
function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Warna penutup awal (Cream)
    ctx.fillStyle = "#f4f1de"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Mode "Hapus"
    ctx.globalCompositeOperation = "destination-out";
}

// 2. Fungsi Paksa Musik Jalan
function startMusic() {
    if (!isMusicPlaying && bgm) {
        bgm.play().then(() => {
            isMusicPlaying = true;
            if(musicBtn) musicBtn.innerText = "🎵 AUDIO: ON";
        }).catch(err => {
            console.log("Menunggu interaksi...");
        });
    }
}

// --- FUNGSI GABUNGAN (LOGIKA UTAMA GERAKAN) ---
// Bagian ini menangani hapusan kanvas dan parallax baik di HP maupun Laptop
function handleMove(x, y) {
    startMusic();

    // Efek Parallax
    const moveX = (x - window.innerWidth / 2) * 0.05;
    const moveY = (y - window.innerHeight / 2) * 0.05;
    const painting = document.querySelector('.painting-img');
    
    if (painting) {
        painting.style.transform = `translate(${-moveX}px, ${-moveY}px) scale(1.05)`;
    }

    // Gerakan kursor (Hanya tampil di Laptop layar lebar)
    if (cursor && window.innerWidth > 768) {
        cursor.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    // Proses menghapus kanvas
    ctx.beginPath();
    ctx.arc(x, y, 100, 0, Math.PI * 2);
    ctx.fill();

    // Munculkan ikon saat terkena hapusan
    spots.forEach(spot => {
        const rect = spot.getBoundingClientRect();
        const dist = Math.hypot(x - (rect.left + 40), y - (rect.top + 40));
        if (dist < 140) spot.classList.add('reveal');
    });
}

// 3. Event Listeners Gerakan (Laptop & HP)
window.addEventListener('mousemove', (e) => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleMove(e.clientX, e.clientY);
            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleMove(touch.clientX, touch.clientY);
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// 4. Navigasi Masuk ke Icon
function enterRoom(id) {
    const portal = document.getElementById('interior-portal');
    
    portal.classList.remove('room-rose', 'room-emerald', 'room-royal');
    if(id === 'profile') portal.classList.add('room-rose');
    if(id === 'karya') portal.classList.add('room-emerald');
    if(id === 'hubungi') portal.classList.add('room-royal');

    document.querySelectorAll('.room').forEach(r => r.classList.add('hidden'));
    const target = document.getElementById(`info-${id}`);
    if(target) target.classList.remove('hidden');
    
    portal.classList.add('active');
    
    if(isMusicPlaying) bgm.play();
}

// 5. Navigasi Keluar
function exitRoom() {
    document.getElementById('interior-portal').classList.remove('active');
}

// 6. Ganti Tema (Day/Night)
function toggleTheme() {
    document.body.classList.toggle('theme-day');
    document.body.classList.toggle('theme-night');
    
    const isNight = document.body.classList.contains('theme-night');
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = isNight ? "#010413" : "#f4f1de";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(tempCanvas, 0, 0);
}

// 7. Kontrol Musik Manual
function toggleMusic() {
    if (bgm.paused) {
        bgm.play();
        isMusicPlaying = true;
        musicBtn.innerText = "🎵 AUDIO: ON";
    } else {
        bgm.pause();
        isMusicPlaying = false;
        musicBtn.innerText = "🎵 AUDIO: OFF";
    }
}

// Inisialisasi
window.onload = init;
window.onresize = init;

// 8. Logika Form Kontak (Sudah diperbaiki namanya)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            // Mengambil nama asli dari input
            const namaInput = form.querySelector('input[type="text"]').value;
            
            const btn = document.querySelector('.send-btn');
            btn.innerText = "MENGIRIM...";
            btn.style.opacity = "0.7";

            setTimeout(() => {
                // Menggunakan nama yang diketik, bukan "Sophia" lagi
                alert(`Terima kasih, ${namaInput}! Pesan kamu telah terkirim.`);
                
                btn.innerText = "KIRIM PESAN";
                btn.style.opacity = "1";
                form.reset(); 
            }, 1500);
        });
    }
});