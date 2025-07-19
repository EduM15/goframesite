import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.SERVICE_ACCOUNT_JSON)),
  });
}

export default async function handler(req, res) {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email é necessário.' });
    }

    // Procura o usuário pelo email
    const user = await getAuth().getUserByEmail(email);
    
    // Define o privilégio personalizado { admin: true } para este usuário
    await getAuth().setCustomUserClaims(user.uid, { admin: true });

    return res.status(200).json({ message: `Privilégio de admin concedido para ${email} com sucesso.` });

  } catch (error) {
    console.error('Erro ao definir privilégio de admin:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}