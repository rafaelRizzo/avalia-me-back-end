import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    if (token !== process.env.SECRET_AUTH) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    next();
}