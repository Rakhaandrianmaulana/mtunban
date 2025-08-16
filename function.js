// Menunggu hingga seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {
    // Kunci API Gemini Anda
    const API_KEY = 'AIzaSyAxZqnLwUFTlU5nfpwNlkGiFHXzEWo0jb4'; 
    // URL API diperbarui sesuai permintaan Anda
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    // Mengambil elemen-elemen dari DOM
    const phoneNumberInput = document.getElementById('phoneNumber');
    const methodButtons = document.querySelectorAll('.method-btn');
    const resultContainer = document.getElementById('resultContainer');
    const placeholderText = document.getElementById('placeholderText');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultContent = document.getElementById('resultContent');
    const generatedTextElement = document.getElementById('generatedText');
    const copyButton = document.getElementById('copyButton');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    /**
     * Fungsi untuk menampilkan pesan error.
     * @param {string} message - Pesan error yang akan ditampilkan.
     */
    const showError = (message) => {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
    };

    /**
     * Fungsi untuk menyembunyikan pesan error.
     */
    const hideError = () => {
        errorMessage.classList.add('hidden');
    };

    /**
     * Fungsi untuk memanggil Gemini API dan menghasilkan teks.
     * @param {string} method - Metode unbanned yang dipilih.
     * @param {string} phoneNumber - Nomor telepon pengguna.
     */
    const generateUnbanText = async (method, phoneNumber) => {
        // Menyiapkan UI untuk status loading
        placeholderText.classList.add('hidden');
        resultContent.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        hideError();

        // Membuat prompt yang akan dikirim ke AI dengan contoh-contoh yang lebih kaya
        const prompt = `
            Buatkan saya sebuah teks permohonan banding yang sopan, profesional, dan persuasif untuk membuka blokir akun WhatsApp.
            
            Kategori Permohonan: "${method}"
            Nomor Telepon yang Diblokir: ${phoneNumber}
            
            Sebagai referensi, berikut adalah beberapa contoh teks yang sangat bagus untuk kategori "Perma Batu/Hard". Gunakan gaya dan nada dari contoh-contoh ini saat membuat teks baru:

            --- CONTOH 1 (Bahasa Arab) ---
            اب ومؤسس شركة ميتا اسمح لي أن أطرح سؤال بخصوص مشكلة حظر حسابي واتساب لدي مشكلة في حسابي واتساب وهي مشكلة حظر حسابي واتساب نهائيا دون أي مخالفات أو سياسات قمت بانتهاكها. أتمنى فقط أن تتمكن من مساعدتي على الفور !! لقد أرسلت رسالة أطلب فيها إزالة الحجب على البريد الإلكتروني smb@support.whatsapp.com للرد فورًا على هذه الرسالة ورفع الحجب فورًا!! أتمنى أن يقدم لي واتساب أفضل علاج، شكرًا لك إذا كان بإمكان واتساب مساعدتك.

            --- CONTOH 2 (Bahasa Yunani) ---
            Γεια σας προγραμματιστές WhatsApp.
            Θέλω να υποβάλω ένα παράπονο σχετικά με τον αποκλεισμό λογαριασμού.
            Ο λογαριασμός μου στο WhatsApp μπλοκαρίστηκε ξαφνικά!!. Όταν τηλεφώνησα στον πατέρα μου που ήταν άρρωστος, ξαφνικά ακούστηκε μια ειδοποίηση "Το WhatsApp σας έχει αποκλειστεί, αλλάξτε τον αριθμό τηλεφώνου σας" εδώ πανικοβλήθηκα, παρόλο που δεν είχα κάνει τίποτα για να παραβιάσω τις διατάξεις του WhatsApp, αφού ο λογαριασμός μου στο WhatsApp ήταν αποκλεισμένος Δεν μπορούσα να καλέσω τον πατέρα μου Είμαι άρρωστος και ο λογαριασμός WhatsApp είναι ένας αριθμός για την αποθήκευση σημαντικών εγγράφων από το γραφείο μου. 
            Σας ζητώ να επιστρέψετε τον αριθμό WhatsApp μου αμέσως.
            Ο αριθμός μου WhatsApp είναι: ${phoneNumber}.
            Για άλλη μια φορά σας ζητώ να επιστρέψετε αμέσως τον αριθμό WhatsApp, γιατί αυτός ο αριθμός είναι πολύ σημαντικός για εμένα και το γραφείο μου. 
            Ευχαριστώ WhatsApp.

            --- CONTOH 3 (Bahasa Indonesia) ---
            Halo Pihak WhatsApp.
            Saya ingin mengajukan keluhan tentang pemblokiran akun.
            Akun WhatsApp saya telah di blokir permanen oleh pihak WhatsApp tanpa keterangan yang jelas! Pada saat itu saya sungguh tidak percaya karena hal tersebut, padahal saya tidak menggunakan aplikasi WhatsApp yang tidak resmi melainkan menggunakan aplikasi WhatsApp resmi. Padahal nomor tersebut nomor yang sangat penting! Nomor yang saya maksud adalah : ${phoneNumber}. Nomor tersebut adalah nomor untuk menghubungi keluarga pasien yang berada di luar kota dan juga digunakan untuk memberi informasi kepada keluarga pasien. Saya harap pihak WhatsApp segera untuk membuka pemblokiran akun WhatsApp saya.
            Terimakasih Pihak WhatsApp messenger telah membaca keluhan saya, saya ucapkan terimakasih
            Hormat saya

            ---
            
            Sekarang, berdasarkan kategori "${method}" dan contoh-contoh di atas, hasilkan teks permohonan banding yang baru. Pastikan formatnya rapi, mudah dibaca, dan langsung fokus pada permohonan banding. Jangan tambahkan kalimat pembuka atau penutup yang tidak perlu seperti "Tentu, ini drafnya". Berikan hanya teks permohonannya saja.
        `;

        try {
            // Melakukan panggilan ke API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Memeriksa apakah ada konten yang dihasilkan
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
                const textResult = data.candidates[0].content.parts[0].text;
                generatedTextElement.textContent = textResult.trim();
                resultContent.classList.remove('hidden');
            } else {
                throw new Error("Tidak ada konten yang dihasilkan oleh AI.");
            }

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            showError(`Gagal menghasilkan teks. Silakan coba lagi. Detail: ${error.message}`);
            resultContent.classList.add('hidden');
            placeholderText.classList.remove('hidden');
            placeholderText.textContent = "Terjadi kesalahan. Coba lagi.";
        } finally {
            // Sembunyikan indikator loading setelah selesai
            loadingIndicator.classList.add('hidden');
        }
    };

    // Menambahkan event listener untuk setiap tombol metode
    methodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const method = button.dataset.method;
            const phoneNumber = phoneNumberInput.value.trim();

            if (!phoneNumber) {
                showError("Nomor telepon tidak boleh kosong.");
                phoneNumberInput.focus();
                return;
            }
            
            // Memvalidasi format nomor (sederhana)
            if (!/^\d{10,15}$/.test(phoneNumber)) {
                showError("Format nomor telepon tidak valid. Gunakan format seperti 628123456789.");
                return;
            }

            generateUnbanText(method, phoneNumber);
        });
    });

    // Menambahkan event listener untuk tombol salin
    copyButton.addEventListener('click', () => {
        // Menggunakan API Clipboard modern jika tersedia, dengan fallback
        if (navigator.clipboard) {
            navigator.clipboard.writeText(generatedTextElement.textContent).then(() => {
                copyButton.textContent = 'Berhasil Disalin!';
                setTimeout(() => {
                    copyButton.textContent = 'Salin Teks';
                }, 2000);
            }).catch(err => {
                console.error('Gagal menyalin teks: ', err);
                showError("Gagal menyalin teks.");
            });
        } else {
            // Fallback untuk browser lama
            const textArea = document.createElement('textarea');
            textArea.value = generatedTextElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                copyButton.textContent = 'Berhasil Disalin!';
                setTimeout(() => {
                    copyButton.textContent = 'Salin Teks';
                }, 2000);
            } catch (err) {
                console.error('Gagal menyalin teks dengan metode fallback: ', err);
                showError("Browser Anda tidak mendukung fitur salin otomatis.");
            }
            document.body.removeChild(textArea);
        }
    });
});
