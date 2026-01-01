export interface SalaryInput {
    monthlySalary: number;
    bonusMonths?: number;
}

export interface SalaryResult {
    monthly: {
        gross: number;
        laborInsurance: number;
        healthInsurance: number;
        net: number;
    };
    yearly: {
        gross: number;
        totalLaborInsurance: number;
        totalHealthInsurance: number;
        net: number;
    };
}

export function calculateSalary(input: SalaryInput): SalaryResult {
    const { monthlySalary, bonusMonths = 1 } = input;

    // 2025 Estimates
    const laborInsuranceRate = 0.12 * 0.2; // Self contribution 20%
    const healthInsuranceRate = 0.0517 * 0.3; // Self contribution 30%

    const laborInsurance = Math.round(monthlySalary * laborInsuranceRate);
    const healthInsurance = Math.round(monthlySalary * healthInsuranceRate);
    const netMonthly = monthlySalary - laborInsurance - healthInsurance;

    const yearlyGross = monthlySalary * (12 + (bonusMonths || 0));
    const yearlyNet = netMonthly * 12 + (monthlySalary * (bonusMonths || 0)); // Bonus usually not deducted for labor/health strictly in simple calc, or simplified here

    return {
        monthly: {
            gross: monthlySalary,
            laborInsurance,
            healthInsurance,
            net: netMonthly
        },
        yearly: {
            gross: yearlyGross,
            totalLaborInsurance: laborInsurance * 12,
            totalHealthInsurance: healthInsurance * 12,
            net: yearlyNet
        }
    };
}
