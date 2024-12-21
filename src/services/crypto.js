import bcrypt from 'bcrypt';

/**
 * Encripta a palavra-passe utilizando bcrypt.
 * @param {string} password - A palavra-passe a ser encriptada
 * @returns {string} - Hash da palavra-passe
 */
export const hashPassword = (password) => {
    // Usando 12 rounds como padrão para manter compatibilidade com Python
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
};

/**
 * Verifica se uma palavra-passe corresponde ao hash armazenado.
 * @param {string} password - A palavra-passe a verificar
 * @param {string} hash - O hash armazenado
 * @returns {boolean} - true se a palavra-passe corresponde ao hash, false caso contrário
 */
export const matchPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};
