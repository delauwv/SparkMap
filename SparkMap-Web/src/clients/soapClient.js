import axios from "axios";
import { XMLParser } from "fast-xml-parser";

async function sendSOAPRequest(method, params) {
    const packet = `<?xml version="1.0" encoding="utf-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="sparkmap.soap">
        <soapenv:Body>
            <tns:${method}>
                ${Object.entries(params).map(([key, value]) => `<tns:${key}>${value}</tns:${key}>`).join('')}
            </tns:${method}>
        </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post("https://sparkmap.onrender.com", packet, {
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": method
            }
        });

        const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });
        const parsedData = parser.parse(response.data);

        const result = parsedData?.Envelope?.Body?.[`${method}Response`]?.[`${method}Result`];

        if (result) {
            return result;
        } else {
            console.error(`Erreur SOAP (${method}): Résultat introuvable`);
            return null;
        }
    } catch (error) {
        console.error(`Erreur de requête SOAP (${method}):`, error);
        return null;
    }
}

export { sendSOAPRequest };