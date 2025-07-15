
import { Invoice } from '../types';

const getTagValue = (xmlDoc: Document, tagName: string): string => {
    const element = xmlDoc.querySelector(tagName);
    return element?.textContent || '';
};

const getTagNumberValue = (xmlDoc: Document, tagName: string): number => {
    const value = getTagValue(xmlDoc, tagName);
    return parseFloat(value) || 0;
};

export const parseInvoiceXML = (xmlString: string): Omit<Invoice, 'id' | 'category'> | null => {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        
        const errorNode = xmlDoc.querySelector("parsererror");
        if (errorNode) {
            console.error("Error parsing XML:", errorNode.textContent);
            return null;
        }

        const provider = getTagValue(xmlDoc, 'Emisor > Nombre');
        const date = getTagValue(xmlDoc, 'FechaEmision');
        const totalAmount = getTagNumberValue(xmlDoc, 'ResumenFactura > TotalComprobante');
        const ivaAmount = getTagNumberValue(xmlDoc, 'ResumenFactura > TotalImpuesto');
        const description = getTagValue(xmlDoc, 'DetalleServicio > LineaDetalle > Detalle') || getTagValue(xmlDoc, 'DetalleServicio > LineaDetalle > Descripcion') || 'Sin descripción';
        
        // Find first tax rate, assuming one for simplicity in this version.
        // A real app might need to sum multiple tax lines.
        const ivaRate = getTagNumberValue(xmlDoc, 'Impuesto > Tarifa') / 100;
       
        if (!provider || !date || !totalAmount) {
            console.warn("XML missing essential fields", { provider, date, totalAmount });
            return null;
        }

        return {
            provider,
            date,
            totalAmount,
            ivaAmount: ivaAmount || (totalAmount * ivaRate / (1 + ivaRate)), // Calculate if not present
            ivaRate: ivaRate * 100, // Store as percentage
            description,
        };
    } catch (error) {
        console.error("Failed to parse XML string:", error);
        return null;
    }
};
