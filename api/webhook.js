export default async function handler(req, res) {
  if (req.method === 'POST') {
    const payload = req.body;
    const message = payload.message || '';
    const isGroup = payload.isGroup;

    // Abaikan pesan jika dari grup WhatsApp atau pesan kosong
    if (isGroup || !message.trim()) {
      return res.status(200).json({ status: false, message: 'Ignored' });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey};

      // Kirim pesan ke API Gemini
      const geminiResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      });

      const data = await geminiResponse.json();
      const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak dapat memahami pertanyaan tersebut.';

      // Balas otomatis langsung ke pengguna via Wablas
      return res.status(200).json({
        status: true,
        data: {
          reply: aiReply
        }
      });
    } catch (err) {
      return res.status(200).json({
        status: true,
        data: {
          reply: 'Maaf, sistem asisten AI sedang mengalami gangguan sejenak.'
        }
      });
    }
  }

  // Akses uji coba via browser
  return res.status(200).send('Webhook Gemini Wablas siap!');
}
