import jwt from 'jsonwebtoken';

class JWTManager {
    constructor(secret = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRES) {
        this.secret = secret;
        this.expiresIn = expiresIn;
    }

    criarToken(payload) {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }

    validarToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        reject(new Error('JWT expirado')); // Agora será rejeitado com "JWT expirado"
                    } else {
                        reject(new Error('JWT inválido'));
                    }
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    decodificarToken(token) {
        return jwt.decode(token);
    }
}

export default new JWTManager();
