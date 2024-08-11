import axios from "axios";

const licenseServer = process.env.CRYPTO_LICENSE_SERVER || 'https://api.cryptolens.io';
const accessToken = process.env.CRYPTO_ACCESS_TOKEN || '';

type Product = {
    id: number;
    name: string;
    creationDate: string;
    description: string;
    password: string;
    isPublic: boolean;
    keyAlgorithm: string;
    featureDefinitions: {
        [key: string]: {
            name: string;
            type: number;
        } | boolean;
    },
    dataObjects: []
}

export async function getProducts(): Promise<Product[]> {
    const productsRequest = await axios.get(`${licenseServer}/api/product/GetProducts?token=${accessToken}`);
    return productsRequest.data['products'];
}

export async function createKey(product: number, customer: string, isTrial: boolean): Promise<string> {
    const keyRequest = await axios.post(`${licenseServer}/api/key/CreateKey?token=${accessToken}`, {
        productId: product,
        Period: isTrial ? 1 : 365 * 3, // Default lifetime is 3 years
        Notes: JSON.stringify({customer})
    });
    return keyRequest.data['key'];
}

export async function burnKey(product: number, key: string): Promise<boolean> {
    const burnRequest = await axios.post(`${licenseServer}/api/key/BlockKey?token=${accessToken}`, {
        productId: product,
        Key: key
    });
    return burnRequest.data['result'] === 0 && burnRequest.data['message'] === 'Changed';
}