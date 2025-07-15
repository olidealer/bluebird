
import { XMLParser } from 'fast-xml-parser';

// Define a type for the parsed invoice structure for clarity
type ParsedInvoice = {
    provider: string;
    date: string;
    totalAmount: number;
    ivaAmount: number;
    ivaRate: number;
    description: string;
}

/**
 * Parses an XML string from a Costa Rican electronic invoice.
 * @param xmlString The XML content as a string.
 * @returns A structured object with invoice data or null if parsing fails.
 */
export const parseInvoiceXML = (xmlString: string): Omit<ParsedInvoice, 'category'> | null => {
    try {
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
        const jsonObj = parser.parse(xmlString);

        // Navigate through the JSON object to extract data
        // The exact path may vary slightly based on XML structure
        const key = Object.keys(jsonObj)[0]; // The root element key (e.g., FacturaElectronica)
        const root = jsonObj[key];

        const provider = root.Emisor?.Nombre;
        const date = root.FechaEmision;
        const totalAmount = parseFloat(root.ResumenFactura?.TotalComprobante);
        const ivaAmount = parseFloat(root.ResumenFactura?.TotalImpuesto);
        
        // Extract description from the first line item
        const lineDetail = Array.isArray(root.DetalleServicio?.LineaDetalle) 
            ? root.DetalleServicio.LineaDetalle[0] 
            : root.DetalleServicio?.LineaDetalle;
        const description = lineDetail?.Detalle || 'Sin descripción';

        // Extract tax rate from the first tax item
        const taxDetail = Array.isArray(lineDetail?.Impuesto) ? lineDetail.Impuesto[0] : lineDetail?.Impuesto;
        const ivaRate = taxDetail ? parseFloat(taxDetail.Tarifa) : 13; // Default to 13 if not found

        if (!provider || !date || isNaN(totalAmount)) {
            console.warn("XML missing essential fields", { provider, date, totalAmount });
            return null;
        }

        return {
            provider,
            date,
            totalAmount,
            ivaAmount: isNaN(ivaAmount) ? (totalAmount * (ivaRate / 100)) / (1 + (ivaRate / 100)) : ivaAmount,
            ivaRate,
            description,
        };
    } catch (error) {
        console.error("Failed to parse XML string:", error);
        return null;
    }
};
