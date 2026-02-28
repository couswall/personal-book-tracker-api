export const regularExps = {
    fullname: /^[áéíóÁÉÍÓÚa-zA-Z\s]+$/,
    username: /^[a-zA-Z0-9._]+$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*.,+-{}?¿¡])[A-Za-z\d!@#$%^&*.,+-{}?¿¡]{6,}$/,
};