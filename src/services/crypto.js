import { randomBytes, scryptSync } from 'crypto';

const encryptPassword = (password, salt) => {
    return scryptSync(password, salt, 32).toString('hex');
};

export const hashPassword = (password) => {
    // Any random string here (ideally should be at least 16 bytes)
    const salt = randomBytes(16).toString('hex');
    return encryptPassword(password, salt) + salt;
};

export const matchPassword = (password, hash) => {
    // extract salt from the hashed string
    // our hex password length is 32*2 = 64
    const salt = hash.slice(64);
    const originalPassHash = hash.slice(0, 64);
    const currentPassHash = encryptPassword(password, salt);
    return originalPassHash === currentPassHash;
};
