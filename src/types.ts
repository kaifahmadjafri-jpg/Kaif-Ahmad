export interface SolarSystemConfig {
  name: string;
  monthlyBill: number;
  availableSpace: number; // in sq ft
  location: string;
}

export interface CalculationResults {
  recommendedCapacity: number; // in kW
  estimatedPanels: number;
  requiredArea: number; // in sq ft
  estimatedCost: number; // in USD or local currency
  monthlySavings: number;
  roiYears: number;
  carbonOffset: number; // in tons/year
}
