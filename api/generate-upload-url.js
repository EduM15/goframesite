import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Assegura que a inicialização ocorra apenas uma vez
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(JSON.parse(process.env.SERVICE_ACCOUNT_JSON)),
      // CORREÇÃO: Apontando para o bucket correto que você confirmou
      storageBucket: "goframesite.firebasestorage.app"
    });
  } catch (error) {
    console.error("Firebase Admin Initialization Error:", error);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileType, creatorId, eventId } = req.body;
    if (!fileName || !fileType || !creatorId || !eventId) {
      return res.status(400).json({ error: 'Informações faltando no pedido.' });
    }

    const bucket = getStorage().bucket();
    const filePath = `media/${creatorId}/${eventId}/${Date.now()}-${fileName}`;
    const file = bucket.file(filePath);

    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos de validade
      contentType: fileType,
    };

    const [url] = await file.getSignedUrl(options);

    res.status(200).json({ signedUrl: url, filePath: filePath });

  } catch (error) {
    console.error('Erro ao gerar URL assinada:', error.message);
    res.status(500).json({ error: 'Não foi possível gerar a URL de upload.' });
  }
}