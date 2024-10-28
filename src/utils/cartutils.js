import { v4 as uuidv4 } from 'uuid';

export const generateUniqueCode = () => {
    const code = uuidv4();
    return code;
};

export const calcularTotal = (products) => {
    return products.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
};
