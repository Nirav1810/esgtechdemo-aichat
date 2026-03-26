import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

const FISCAL_YEAR = "FY 2025-26";

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

mongoose.connect(MONGODB_URI).then(() => console.log('Connected to MongoDB'));

const summarySchema = new mongoose.Schema({
  fiscal_year: String,
  total_emissions: Number,
  scope_1: { value: Number, status: String },
  scope_2: { value: Number, status: String },
  scope_3: { value: Number, status: String },
  breakdown: {
    scope_1_percentage: Number,
    scope_2_percentage: Number,
    scope_3_percentage: Number
  },
  top_emitters: [String]
}, { timestamps: true });

const monthlySchema = new mongoose.Schema({
  fiscal_year: String,
  scope: Number,
  month: String,
  stationary: Number,
  mobile: Number,
  fugitive: Number,
  renewable: Number,
  imported: Number,
  electricity: Number
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  fiscal_year: String,
  scope: Number,
  category: String,
  value: Number,
  color: String
}, { timestamps: true });

const recordSchema = new mongoose.Schema({
  fiscal_year: String,
  scope: Number,
  category: String,
  subcategory: String,
  date: String,
  entryPeriod: String,
  siteName: String,
  unitOfMeasure: String,
  consumption: Number,
  source: String,
  emissionFactor: Number,
  nameOfCountry: String,
  heatSource: String,
  fuelType: String,
  commuteType: String,
  vehicleType: String,
  foodType: String,
  typeOfGoods: String,
  loop: String,
  generation: Number,
  flightType: String,
  passengerClass: String,
  transportMode: String,
  hotelCountry: String,
  roomNights: Number
}, { timestamps: true });

const EmissionSummary = mongoose.models.EmissionSummary || mongoose.model('EmissionSummary', summarySchema);
const EmissionMonthly = mongoose.models.EmissionMonthly || mongoose.model('EmissionMonthly', monthlySchema);
const EmissionCategory = mongoose.models.EmissionCategory || mongoose.model('EmissionCategory', categorySchema);
const EmissionRecord = mongoose.models.EmissionRecord || mongoose.model('EmissionRecord', recordSchema);

const staticSummary = {
  fiscal_year: "FY 2025-26",
  total_emissions: 87725.26,
  scope_1: { value: 35533.1, status: "Data available" },
  scope_2: { value: 6352.18, status: "Data available" },
  scope_3: { value: 45839.982416, status: "Data available" },
  breakdown: {
    scope_1_percentage: 40.50,
    scope_2_percentage: 7.24,
    scope_3_percentage: 52.26
  },
  top_emitters: [
    "Scope 3 - Purchased Goods (52.25%)",
    "Scope 1 - Stationary Combustion (40.50%)",
    "Scope 2 - Imported Electricity (7.24%)"
  ]
};

const scope1Monthly = [
  { month: "Apr", stationary: 8526.23, mobile: 0, fugitive: 1300.0 },
  { month: "May", stationary: 1750.93, mobile: 0, fugitive: 0 },
  { month: "Jun", stationary: 54.34, mobile: 0, fugitive: 0 },
  { month: "Jul", stationary: 533.51, mobile: 0, fugitive: 0 },
  { month: "Aug", stationary: 595.14, mobile: 0, fugitive: 0 },
  { month: "Sep", stationary: 349.96, mobile: 0, fugitive: 0 },
  { month: "Oct", stationary: 0.23, mobile: 0, fugitive: 0 },
  { month: "Nov", stationary: 2570.23, mobile: 0, fugitive: 14.22 },
  { month: "Dec", stationary: 0, mobile: 0, fugitive: 30.82 },
  { month: "Jan", stationary: 15296.19, mobile: 0, fugitive: 4464.03 },
  { month: "Feb", stationary: 0, mobile: 0, fugitive: 29.76 },
  { month: "Mar", stationary: 0, mobile: 0, fugitive: 0 }
];

const scope2Monthly = [
  { month: "Apr", renewable: 0, imported: 0, electricity: 1.57 },
  { month: "May", renewable: 0, imported: 0, electricity: 186.53 },
  { month: "Jun", renewable: 0, imported: 0, electricity: 0.22 },
  { month: "Jul", renewable: 0, imported: 0, electricity: 0.26 },
  { month: "Aug", renewable: 0, imported: 0, electricity: 3.43 },
  { month: "Sep", renewable: 0, imported: 0, electricity: 5795.62 },
  { month: "Oct", renewable: 0, imported: 0, electricity: 3.06 },
  { month: "Nov", renewable: 0, imported: 0, electricity: 0 },
  { month: "Dec", renewable: 0, imported: 0, electricity: 345.41 },
  { month: "Jan", renewable: 0, imported: 0, electricity: 0 },
  { month: "Feb", renewable: 0, imported: 0, electricity: 15.87 },
  { month: "Mar", renewable: 0, imported: 0, electricity: 0 }
];

const scope3Categories = [
  { name: "Purchased Goods", value: 44952.301031, color: "#6366f1" },
  { name: "Downstream Activities", value: 206.723297, color: "#ef4444" },
  { name: "T&D Loss", value: 181.32087, color: "#10b981" },
  { name: "Water Treatment", value: 165.871319, color: "#84cc16" },
  { name: "Upstream Activities", value: 107.237389, color: "#8b5cf6" },
  { name: "Water Supply", value: 93.849879, color: "#06b6d4" },
  { name: "Air Travel", value: 85.780954, color: "#f97316" },
  { name: "Hotel Stay", value: 20.4363, color: "#ec4899" },
  { name: "Sea Travel", value: 11.8335, color: "#14b8a6" },
  { name: "Food Consumption", value: 5.07625, color: "#78716c" },
  { name: "Waste Disposal", value: 4.606446, color: "#f59e0b" },
  { name: "Employee Commute", value: 3.713639, color: "#64748b" },
  { name: "Land Travel", value: 1.231542, color: "#a3a3a3" }
];

const scope1StationaryRecords = [
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Liquid fuels - Waste oils", unitOfMeasure: "tonnes", consumption: 1000, source: "Defra v 1.0", emissionFactor: 3219.379158 },
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Solid fuels - Coal (domestic)", unitOfMeasure: "tonnes", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2904.952336 },
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Solid fuels - Coal (industrial)", unitOfMeasure: "tonnes", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2399.43994 },
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2.512064 },
  { date: "12 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Pvt. Ltd.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 697030, source: "Defra v 1.0", emissionFactor: 2.512064 },
  { date: "7 - June - 2025", entryPeriod: "June - 2025", siteName: "Growlity Inc.", type: "Biomass - Wood pellets", unitOfMeasure: "tonnes", consumption: 1000, source: "Defra v 1.0", emissionFactor: 54.33654 },
  { date: "9 - July - 2025", entryPeriod: "July - 2025", siteName: "Growlity Pvt. Ltd.", type: "Solid fuels - Coal (industrial)", unitOfMeasure: "tonnes", consumption: 222.349, source: "Defra v 1.0", emissionFactor: 2399.43994 },
  { date: "21 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Pvt. Ltd.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 9429, source: "Defra v 1.0", emissionFactor: 2.04542 },
  { date: "23 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Butane", unitOfMeasure: "litres", consumption: 115, source: "Defra v 1.0", emissionFactor: 1.74533 },
  { date: "26 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 112790, source: "Defra v 1.0", emissionFactor: 2.04542 },
  { date: "26 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 168646, source: "Defra v 1.0", emissionFactor: 2.04542 },
  { date: "9 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2.04542 },
  { date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Solid fuels - Coal (industrial)", unitOfMeasure: "tonnes", consumption: 145, source: "Defra v 1.0", emissionFactor: 2399.43994 },
  { date: "13 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - CNG", unitOfMeasure: "kWh (Net CV)", consumption: 23, source: "Defra v 1.0", emissionFactor: 0.202671 },
  { date: "4 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "tonnes", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2568.16441 },
  { date: "4 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2.04542 },
  { date: "7 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - CNG", unitOfMeasure: "litres", consumption: 42, source: "Defra v 1.0", emissionFactor: 0.448447 },
  { date: "19 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 1500, source: "Defra v 1.0", emissionFactor: 2.512064 },
  { date: "19 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Solid fuels - Coal (industrial)", unitOfMeasure: "tonnes", consumption: 15, source: "Defra v 1.0", emissionFactor: 2399.43994 },
  { date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 25, source: "Defra v 1.0", emissionFactor: 2.512064 },
  { date: "22 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Solid fuels - Coal (industrial)", unitOfMeasure: "tonnes", consumption: 6041.9, source: "Defra v 1.0", emissionFactor: 2395.28994 },
  { date: "22 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 48185.3, source: "Defra v 1.0", emissionFactor: 2.57082 },
  { date: "22 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 223662.36, source: "Defra v 1.0", emissionFactor: 2.06672 },
  { date: "22 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 115139, source: "Defra v 1.0", emissionFactor: 2.06672 },
  { date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 454, source: "Defra v 1.0", emissionFactor: 2.57082 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Gaseous fuels - CNG", unitOfMeasure: "tonnes", consumption: 10, source: "Defra v 1.0", emissionFactor: 2575.46441 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Liquid fuels - Petrol (100% mineral petrol)", unitOfMeasure: "litres", consumption: 1200, source: "Defra v 1.0", emissionFactor: 2.33984 }
];

const scope1MobileRecords = [
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Diesel - Medium car", unitOfMeasure: "km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.167156 },
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Diesel - Medium car", unitOfMeasure: "km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.167156 },
  { date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "CNG - Average car", unitOfMeasure: "km", consumption: 1452, source: "Defra v 1.0", emissionFactor: 0.175044 },
  { date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Petrol - Average car", unitOfMeasure: "km", consumption: 1424, source: "Defra v 1.0", emissionFactor: 0.16323 },
  { date: "27 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", type: "CNG - Vans - Average (up to 3.5 tonnes)", unitOfMeasure: "km", consumption: 52, source: "Defra v 1.0", emissionFactor: 0.2512 },
  { date: "27 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", type: "CNG - Vans - Average (up to 3.5 tonnes)", unitOfMeasure: "km", consumption: 541, source: "Defra v 1.0", emissionFactor: 0.2512 },
  { date: "19 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Diesel - Medium car", unitOfMeasure: "km", consumption: 1500, source: "Defra v 1.0", emissionFactor: 0.167156 },
  { date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Diesel - Vans - Class II (1.305 to 1.74 tonnes)", unitOfMeasure: "km", consumption: 215, source: "Defra v 1.0", emissionFactor: 0.18832 },
  { date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Diesel - Average car", unitOfMeasure: "km", consumption: 247, source: "Defra v 1.0", emissionFactor: 0.17304 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Petrol - Medium car", unitOfMeasure: "km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.17474 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Petrol - Vans - Average (up to 3.5 tonnes)", unitOfMeasure: "miles", consumption: 1200, source: "Defra v 1.0", emissionFactor: 0.34336 }
];

const scope1FugitiveRecords = [
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Refrigerants - HFC-134a", unitOfMeasure: "kg", consumption: 1000, source: "Defra v 1.0", emissionFactor: 1300 },
  { date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Refrigerants - HFC-32", unitOfMeasure: "kg", consumption: 5, source: "Defra v 1.0", emissionFactor: 677 },
  { date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Refrigerants - HFC-32", unitOfMeasure: "kg", consumption: 5, source: "Defra v 1.0", emissionFactor: 677 },
  { date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Refrigerants - HFC-32", unitOfMeasure: "kg", consumption: 21, source: "Defra v 1.0", emissionFactor: 677 },
  { date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Refrigerants - HFC-32", unitOfMeasure: "kg", consumption: 3, source: "Defra v 1.0", emissionFactor: 677 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Refrigerants - HFC-41", unitOfMeasure: "kg", consumption: 2000, source: "Defra v 1.0", emissionFactor: 116 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Refrigerants - HFE-43-10pccc124 (H-Galden1040x)", unitOfMeasure: "kg", consumption: 1500, source: "Defra v 1.0", emissionFactor: 2820 }
];

const scope2ElectricityRecords = [
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 1000, source: "CaDI 2025", emissionFactor: 0.727 },
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 1000, source: "CaDI 2025", emissionFactor: 0.727 },
  { date: "17 - February - 2026", entryPeriod: "April - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 137, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { date: "9 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 1000, source: "CaDI 2025", emissionFactor: 0.727 },
  { date: "27 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 10000, source: "CaDI 2025", emissionFactor: 0.727 },
  { date: "29 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 245360.12, source: "CaDI 2025", emissionFactor: 0.727 },
  { date: "17 - February - 2026", entryPeriod: "May - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 178, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { date: "17 - February - 2026", entryPeriod: "June - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 257, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { date: "17 - February - 2026", entryPeriod: "July - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 306, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { date: "4 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Pvt. Ltd.", nameOfCountry: "Country - Bangladesh", unitOfMeasure: "kWh", consumption: 7677, source: "CaDI 2025", emissionFactor: 0.41 },
  { date: "17 - February - 2026", entryPeriod: "August - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 336, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { date: "13 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 117437, source: "CaDI 2025", emissionFactor: 0.727 },
  { date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 150, source: "CaDI 2025", emissionFactor: 0.727 },
  { date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 7854000, source: "CaDI 2025", emissionFactor: 0.727 },
  { date: "17 - February - 2026", entryPeriod: "September - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 321, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 4821, source: "CaDI 2025", emissionFactor: 0.49 },
  { date: "17 - February - 2026", entryPeriod: "October - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 294, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { date: "17 - February - 2026", entryPeriod: "October - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 294, source: "CaDI 2025", emissionFactor: 0.66307 },
  { date: "17 - February - 2026", entryPeriod: "October - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 294, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { date: "10 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - United States of America", unitOfMeasure: "kWh", consumption: 1396825, source: "CaDI 2025", emissionFactor: 0.246 },
  { date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 2457, source: "CaDI 2025", emissionFactor: 0.727 },
  { date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 3248, source: "CEA FY2025-26", emissionFactor: 0.71 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 3000, source: "ecoinvent version 3.12", emissionFactor: 1.35 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 10000, source: "CaDI 2025", emissionFactor: 0.95182 }
];

const scope3Records = [
  // Employee Commute
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", vehicleType: "Medium", unitOfMeasure: "km", consumption: 1000 },
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", commuteType: "Bus", vehicleType: "Average local bus", unitOfMeasure: "passenger.km", consumption: 1000 },
  { date: "8 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", commuteType: "Cars (by size)", fuelType: "Diesel", vehicleType: "Average car", unitOfMeasure: "km", consumption: 1000 },
  { date: "8 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", commuteType: "Cars (by size)", fuelType: "Petrol", vehicleType: "Average car", unitOfMeasure: "km", consumption: 1000 },
  { date: "8 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", vehicleType: "Average", unitOfMeasure: "km", consumption: 1000 },
  { date: "8 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", commuteType: "Bus", vehicleType: "Average local bus", unitOfMeasure: "passenger.km", consumption: 1000 },
  { date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", vehicleType: "Average", unitOfMeasure: "km", consumption: 10262 },
  { date: "6 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", vehicleType: "Medium", unitOfMeasure: "km", consumption: 4583 },
  { date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", commuteType: "Rail", vehicleType: "National rail", unitOfMeasure: "passenger.km", consumption: 145 },
  { date: "4 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", vehicleType: "Medium", unitOfMeasure: "km", consumption: 222 },
  { date: "4 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", vehicleType: "Average", unitOfMeasure: "km", consumption: 5000 },
  { date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", vehicleType: "Average", unitOfMeasure: "km", consumption: 245 },
  { date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", commuteType: "Bus", vehicleType: "Average local bus", unitOfMeasure: "passenger.km", consumption: 449 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", commuteType: "Motorbike", vehicleType: "Medium", unitOfMeasure: "km", consumption: 1400 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", commuteType: "Cars (by size)", fuelType: "Petrol", vehicleType: "Medium car", unitOfMeasure: "km", consumption: 2000 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", commuteType: "Motorbike", vehicleType: "Medium", unitOfMeasure: "km", consumption: 1556 },
  // Food Consumption
  { date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", foodType: "1 average meal", unitOfMeasure: "meal", consumption: 1000, source: "UNFCCC", emissionFactor: 4.7 },
  { date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", foodType: "Meal, vegetarian", unitOfMeasure: "meal", consumption: 50, source: "UNFCCC", emissionFactor: 2.85 },
  { date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", foodType: "Meal, vegetarian", unitOfMeasure: "meal", consumption: 23, source: "UNFCCC", emissionFactor: 2.85 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", foodType: "1 standard breakfast", unitOfMeasure: "breakfast", consumption: 30, source: "UNFCCC", emissionFactor: 0.84 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", foodType: "1 average meal", unitOfMeasure: "meal", consumption: 30, source: "UNFCCC", emissionFactor: 4.7 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", foodType: "Non-alcoholic beverage", unitOfMeasure: "litre", consumption: 10, source: "UNFCCC", emissionFactor: 0.2 },
  // Purchased Goods
  { date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", typeOfGoods: "Plastic - Plastics: HDPE (incl. forming)", loop: "-", unitOfMeasure: "tonnes", consumption: 45, source: "Defra v 1.0", emissionFactor: 3086.39038 },
  { date: "6 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", typeOfGoods: "Chemicals - Other chemical", loop: "-", unitOfMeasure: "kg", consumption: 114.25, source: "Defra v 1.0", emissionFactor: 3 },
  { date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", typeOfGoods: "Plastic - Plastics: average plastics", loop: "-", unitOfMeasure: "tonnes", consumption: 14, source: "Defra v 1.0", emissionFactor: 3164.78049 },
  { date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", typeOfGoods: "Other - Clothing", loop: "-", unitOfMeasure: "tonnes", consumption: 2000, source: "Defra v 1.0", emissionFactor: 22310 },
  { date: "23 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", typeOfGoods: "Construction - Mineral oil", loop: "Primary material production", unitOfMeasure: "tonnes", consumption: 2.77, source: "Defra v 1.0", emissionFactor: 1401 },
  { date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", typeOfGoods: "Plastic - Plastics: average plastic film", loop: "Primary material production", unitOfMeasure: "tonnes", consumption: 32, source: "Defra v 1.0", emissionFactor: 2916.50513 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", typeOfGoods: "Electrical items - Electrical items - IT", loop: "Primary material production", unitOfMeasure: "tonnes", consumption: 2, source: "Defra v 1.0", emissionFactor: 24865.47556 },
  { date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", typeOfGoods: "Metal - Metal: steel cans", loop: "Closed-loop source", unitOfMeasure: "tonnes", consumption: 1, source: "Defra v 1.0", emissionFactor: 1823.90131 }
];

async function migrate() {
  console.log('Starting migration...');

  try {
    // Clear existing data
    await EmissionSummary.deleteMany({ fiscal_year: FISCAL_YEAR });
    await EmissionMonthly.deleteMany({ fiscal_year: FISCAL_YEAR });
    await EmissionCategory.deleteMany({ fiscal_year: FISCAL_YEAR });
    await EmissionRecord.deleteMany({ fiscal_year: FISCAL_YEAR });
    console.log('Cleared existing data');

    // Insert summary
    await EmissionSummary.create(staticSummary);
    console.log('Inserted summary');

    // Insert monthly data
    const monthlyRecords1 = scope1Monthly.map(m => ({ fiscal_year: FISCAL_YEAR, scope: 1, ...m }));
    const monthlyRecords2 = scope2Monthly.map(m => ({ fiscal_year: FISCAL_YEAR, scope: 2, ...m }));
    await EmissionMonthly.insertMany([...monthlyRecords1, ...monthlyRecords2]);
    console.log('Inserted monthly data');

    // Insert categories
    const categoryRecords = scope3Categories.map(c => ({
      fiscal_year: FISCAL_YEAR,
      scope: 3,
      category: c.name,
      value: c.value,
      color: c.color
    }));
    await EmissionCategory.insertMany(categoryRecords);
    console.log('Inserted categories');

    // Insert detailed records
    const allRecords = [
      ...scope1StationaryRecords.map(r => ({ fiscal_year: FISCAL_YEAR, scope: 1, category: "Stationary Combustion", subcategory: r.type, ...r })),
      ...scope1MobileRecords.map(r => ({ fiscal_year: FISCAL_YEAR, scope: 1, category: "Mobile Combustion", subcategory: r.type, ...r })),
      ...scope1FugitiveRecords.map(r => ({ fiscal_year: FISCAL_YEAR, scope: 1, category: "Fugitive Emissions", subcategory: r.type, ...r })),
      ...scope2ElectricityRecords.map(r => ({ fiscal_year: FISCAL_YEAR, scope: 2, category: "Purchased Electricity", ...r })),
      ...scope3Records.map(r => ({ 
        fiscal_year: FISCAL_YEAR, 
        scope: 3, 
        category: r.commuteType ? "Employee Commute" : r.foodType ? "Food Consumption" : "Purchased Goods",
        ...r 
      }))
    ];
    await EmissionRecord.insertMany(allRecords);
    console.log('Inserted records');

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
