# Yours Form - Technical Interview Project

Yours Form adalah aplikasi form builder sederhana seperti Google Form, dibuat sebagai bagian dari technical interview test. Aplikasi ini memungkinkan user untuk membuat form, menambahkan pertanyaan, membatasi respons, membagikan link form, serta melihat hasil jawaban dari user lain.

## Fitur Utama

- **Authentication**: Login dengan validasi server menggunakan token.
- **Dashboard**: Menampilkan semua form milik user, dengan pencarian, sorting, dan pagination.
- **Create Form**: Membuat form baru lengkap dengan slug, deskripsi, limit response, dan allowed domains.
- **Preview Question**: Pertanyaan ditampilkan read-only di halaman detail.
- **Add & Remove Questions**: Tambah dan hapus pertanyaan pada form (short answer, paragraph, multiple choice, dll).
- **Copy Link**: Tombol salin URL fill form ke clipboard.
- **Submit Form**: User lain dapat mengisi form berdasarkan domain email yang diizinkan.
- **Response Viewer**: Pemilik form dapat melihat hasil jawaban berupa tabel.
- **Responsive UI**: Desain mobile-friendly menggunakan kombinasi TailwindCSS dan Material UI.
- **Validation UX**: Submit button hanya aktif jika semua required question terisi dan ada minimal 1 jawaban valid.

## Tech Stack

- **Frontend Framework**: [React 19](https://react.dev) + [Vite](https://vitejs.dev)
- **Type Checking**: TypeScript
- **Styling**: TailwindCSS + Material UI (MUI)
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form + Yup
- **Routing**: React Router DOM
- **Icon**: Material UI Icons

## Catatan Penting

- **Login API** tidak mengembalikan `user.id`, hanya `email`, `name`, dan `accessToken`.
- **JWT token** tidak mengandung ID user, hanya `sub` sebagai email.
- **Endpoint `/forms`** mengembalikan semua form dari seluruh user. Filtering tidak dapat dilakukan di frontend berdasarkan `creator_id` karena tidak ada data `user.id`.
- **Form response endpoint** (`/responses`) bersifat global dan tidak spesifik pada form tertentu, semua slug mendapat return JSON Payload yang sama. Filter tambahan dilakukan berdasarkan pertanyaan yang ada di dalam form (tidak menampilkan pertanyaan yang sudah dihapus).
- **Tidak tersedia endpoint untuk update pertanyaan**, hanya create dan delete.
- **Preview form detail tidak menampilkan nama author karena tidak tersedia endpoint untuk get user by ID**.
- **Beberapa endpoint mungkin bersifat static/testing sehingga hasilnya tidak sepenuhnya akurat terhadap slug tertentu**.

