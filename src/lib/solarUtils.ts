import { CalculationResults, SolarSystemConfig } from '../types';

export const calculateSolarSystem = (config: SolarSystemConfig): CalculationResults => {
  // Ensure inputs are numbers and handle edge cases
  const bill = Number(config?.monthlyBill) || 0;
  const space = Number(config?.availableSpace) || 0;

  // Average electricity rate in India (approx ₹8 per kWh)
  const ratePerKWh = 8;
  const monthlyConsumption = bill / ratePerKWh;
  
  // 1 kW produces roughly 4 kWh per day = 120 kWh per month
  const productionPerKW = 120;
  
  // Recommended capacity based on consumption
  const recommendedCapacity = bill > 0 ? Math.ceil((monthlyConsumption / productionPerKW) * 10) / 10 : 0;
  
  // Estimated panels (Assuming 400W panels)
  const estimatedPanels = recommendedCapacity > 0 ? Math.ceil(recommendedCapacity * 1000 / 400) : 0;
  
  // Required area (90 sq ft per kW)
  const requiredArea = recommendedCapacity * 90;
  
  // Average cost in ₹ per kW in India
  const costPerKW = 80000; 
  const estimatedCost = recommendedCapacity * costPerKW;
  
  // Monthly savings (Assuming 95% offset)
  const monthlySavings = bill * 0.95;
  
  // ROI in years (Avoid division by zero)
  const roiYears = (estimatedCost > 0 && monthlySavings > 0) 
    ? estimatedCost / (monthlySavings * 12) 
    : 0;
  
  // Carbon offset in tons per year
  const carbonOffset = bill > 0 ? (monthlyConsumption * 12 * 0.7) / 1000 : 0;
  
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
