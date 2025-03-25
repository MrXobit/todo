const jwt = require('jsonwebtoken');

const getUserFromToken = (req) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return { error: "Токен не знайдено" };
        }
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const { id, email, role, tasks } = decoded;
        
        return { id, email, role, tasks };
    } catch (e) {
        return { error: "Не вдалося авторизуватися" };
    }
}

module.exports = getUserFromToken;
