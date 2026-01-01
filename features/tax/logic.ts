export interface TaxInput {
    income: number;
    isMarried?: boolean;
    spouseIncome?: number;
    children?: number; // children under 5 or over 70? simplified for now
}

export function calculateTax(input: TaxInput): number {
    // Simple progressive tax for 2025 (Simplified)
    // Exemptions: 446,000 (Single) 

    let totalIncome = input.income + (input.spouseIncome || 0);
    let exemptions = 446000;

    if (input.isMarried) exemptions += 446000; // Mock doubling for spouse
    if (input.children) exemptions += input.children * 132000; // Education/Child deduction

    let taxable = Math.max(0, totalIncome - exemptions);

    // Rate brackets (Simplified)
    let tax = 0;
    if (taxable <= 590000) {
        tax = taxable * 0.05;
    } else if (taxable <= 1330000) {
        tax = taxable * 0.12 - 41300;
    } else {
        tax = taxable * 0.20 - 147700; // Higher brackets omitted for brevity
    }

    return Math.round(tax);
}
