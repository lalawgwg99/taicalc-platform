import { registerAdapter } from './index';

// Helper to generate chart data for Compound Interest
// Input: { initialCapital, monthlyContribution, returnRate, years }
// Output: { totalAssets, totalPrincipal, totalInterest }
registerAdapter('capital.growth', (input, output) => {
    const years = Number(input.years) || 10;
    const initial = Number(input.initialCapital) || 0;
    const monthly = Number(input.monthlyContribution) || 0;
    const rate = Number(input.returnRate) || 5;

    const chartData = [];
    let currentAttributes = initial;
    let totalPrincipal = initial;

    for (let i = 0; i <= years; i++) {
        chartData.push({
            name: `第 ${i} 年`,
            value: Math.round(currentAttributes),
            principal: Math.round(totalPrincipal),
        });

        // Calculate next year
        for (let m = 0; m < 12; m++) {
            currentAttributes = currentAttributes * (1 + rate / 100 / 12) + monthly;
            totalPrincipal += monthly;
        }
    }

    // Ensure output has standardized fields if API didn't return them perfectly
    // (Though API usually does calculation, we can enhance it here for UI)

    return {
        ...output,
        chartData
        // KPIs can be derived here if needed, but we trust API output for values usually
    };
});

// Mortgage Adapter
registerAdapter('mortgage.calculate', (input, output) => {
    // API output likely has `amortizationSchedule`. We map it to `chartData`
    // Assuming output.amortizationSchedule is array of { period, balance, interest, principal }

    const schedule = output.amortizationSchedule || [];
    // Downsample for chart (too many points for 30 years * 12 months)
    const chartData = schedule.filter((_: any, i: number) => i % 12 === 0).map((row: any) => ({
        name: `第 ${Math.floor(row.period / 12)} 年`,
        value: row.balance, // Remaining Balance
    }));

    // Add year 0
    if (chartData.length > 0 && chartData[0].name !== '第 0 年') {
        chartData.unshift({ name: '第 0 年', value: Number(input.loanAmount) });
    }

    return {
        ...output,
        chartData
    };
});

// Tax Adapter
registerAdapter('tax.calculate', (input, output) => {
    // Stacked breakdown
    // Output: { payTax, taxRate, netIncome, ... }

    const chartData = [
        { name: '免稅額', value: output.exemptions || 0 }, // Hypothetical fields
        { name: '扣除額', value: output.deductions || 0 },
        { name: '應稅所得', value: output.taxableIncome || 0 },
        { name: '應納稅額', value: output.payTax || 0 },
    ];

    return {
        ...output,
        chartData
    };
});

// Salary Adapter
registerAdapter('salary.analyze', (input, output) => {
    // Pie Chart: Take home vs Tax vs Insurance
    const chartData = [
        { name: '實領薪資', value: output.takeHomeAnnual || 0 },
        { name: '勞健保', value: output.insuranceAnnual || 0 },
        { name: '所得稅', value: output.taxAnnual || 0 },
    ];

    return {
        ...output,
        chartData
    };
});
