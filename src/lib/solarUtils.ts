import { CalculationResults, SolarSystemConfig } from '../types';

export const calculateSolarSystem = (config: SolarSystemConfig): CalculationResults => {
  // Average electricity rate in India (approx ₹8 per kWh)
  const ratePerKWh = 8;
  const monthlyConsumption = config.monthlyBill / ratePerKWh;
  
  // 1 kW produces roughly 4 kWh per day = 120 kWh per month
  const productionPerKW = 120;
  
  const recommendedCapacity = Math.ceil((monthlyConsumption / productionPerKW) * 10) / 10;
  const estimatedPanels = Math.ceil(recommendedCapacity * 1000 / 400); // Assuming 400W panels
  const requiredArea = recommendedCapacity * 90; // 90 sq ft per kW
  
  const costPerKW = 80000; // Average cost in ₹ per kW in India
  const estimatedCost = recommendedCapacity * costPerKW;
  
  const monthlySavings = config.monthlyBill * 0.95; // Assuming 95% offset in local context
  const roiYears = estimatedCost / (monthlySavings * 12);
  
  const carbonOffset = (monthlyConsumption * 12 * 0.7) / 1000; // tons per year
  
  return {
    recommendedCapacity,
    estimatedPanels,
    requiredArea,
    estimatedCost,
    monthlySavings,
    roiYears,
    carbonOffset
  };
};
