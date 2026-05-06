# 🚀 Panduan Teknis Membuat Database Realtime dan metode Authentication akun di Firebase untuk Aplikasi E-Katalog

Panduan ini ditujukan bagi administrator baru untuk memindahkan aplikasi ini ke akun Google/Firebase milik sendiri secara mandiri.

---

## TAHAP 1: Menyiapkan Firebase (Database & Auth)

1.  **Buat Proyek:** Buka [Firebase Console](https://console.firebase.google.com/), klik **"Add Project"**, dan beri nama (contoh: `Katalog-PLS`).
2.  **Daftarkan Aplikasi:** Klik ikon **Web (`</>`)**, beri nama aplikasi, lalu klik **"Register App"**.
3.  **Salin Konfigurasi:** Anda akan melihat kode `firebaseConfig`. Salin isi di dalam kurung kurawal `{ ... }`.
4.  **Aktifkan Database:**
    - Pilih menu **Build > Realtime Database**, klik **"Create Database"**.
    - Pilih lokasi (disarankan **Singapore**), pilih **"Start in test mode"**, lalu klik **Enable**.
5.  **Aktifkan Login Admin:**
    - Pilih menu **Build > Authentication**, klik **"Get Started"**.
    - Di tab **Sign-in method**, pilih **Email/Password**, aktifkan (**Enable**), lalu simpan.
    - Di tab **Users**, klik **"Add user"**, masukkan Email dan Password admin Anda.

---

## TAHAP 2: Menghubungkan Kode dengan Firebase Baru

1.  Buka folder aplikasi hasil *clone* tadi.
2.  Buka file: **`js/storage.js`**.
3.  Cari bagian `const firebaseConfig = { ... }` (biasanya di baris ke-5).
4.  Hapus kode lama dan tempelkan (*paste*) kode konfigurasi yang Anda salin dari Tahap 1 poin 3 tadi.
5.  Simpan file tersebut.

---

## TAHAP 3: Mengunci Keamanan Database (PENTING)

1.  Kembali ke Firebase Console, pilih **Realtime Database > Rules**.
2.  Ganti seluruh kode di sana dengan kode berikut ini agar data Anda tidak bisa dibobol orang asing:
    ```json
    {
      "rules": {
        "ekatalog_data": {
          ".read": true,
          ".write": "auth != null"
        }
      }
    }
    ```
3.  Klik **Publish**.

---

## TAHAP 4: Deploy (Mempublikasikan Website)

Klien bebas memilih cara deploy, namun berikut adalah saran cara tercepat dan **GRATIS**:

### Opsi A: Menggunakan Vercel (Rekomendasi - Paling Cepat)
1.  Buka [Vercel.com](https://vercel.com/) dan daftar menggunakan GitHub.
2.  Hubungkan (*Import*) folder aplikasi Anda.
3.  Klik **Deploy**. Selesai! Website Anda akan mendapatkan alamat seperti `katalog-pls.vercel.app`.

### Opsi B: Menggunakan GitHub Pages
1.  Unggah folder aplikasi Anda ke Repository GitHub.
2.  Buka **Settings > Pages**.
3.  Pilih **Branch: main**, lalu klik **Save**.
4.  Tunggu 1 menit, website Anda akan aktif di alamat GitHub Anda.

---

## TAHAP 5: Memasukkan Data Awal

1.  Buka alamat website yang sudah dideploy.
2.  Masuk ke halaman login (`url-anda.com/admin.html`).
3.  Login menggunakan Email & Password yang Anda buat di Tahap 1.
4.  Data akan otomatis terisi dengan data bawaan (*default*). Anda bisa mulai mengeditnya melalui panel admin.

---

*Selamat! Sekarang Anda memiliki kendali penuh atas data dan sistem E-Katalog PLS UNPATTI.*
