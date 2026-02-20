"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import AISidebar from "../components/AISidebar";
import { Download, ChevronDown, Filter } from "lucide-react";

// Types
interface TableRow {
  id: string;
  date: string;
  entryPeriod: string;
  siteName: string;
  type?: string;
  unitOfMeasure: string;
  consumption?: number;
  source?: string;
  emissionFactor?: number;
  nameOfCountry?: string;
  heatSource?: string;
  fuelType?: string;
  commuteType?: string;
  vehicleType?: string;
  foodType?: string;
  typeOfGoods?: string;
  loop?: string;
  generation?: number;
  flightType?: string;
  passengerClass?: string;
  transportMode?: string;
  hotelCountry?: string;
  roomNights?: number;
}

interface TableSection {
  title: string;
  totalEmissions: number;
  columns: { key: string; label: string }[];
  data: TableRow[];
}

// Year options
const yearOptions = ["FY 2025-26"];

// Scope 1 - Stationary Combustion (27 records) - Total: 29746.194006 TCO2Eq
const scope1StationaryData: TableRow[] = [
  { id: "1", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Liquid fuels - Waste oils", unitOfMeasure: "tonnes", consumption: 1000, source: "Defra v 1.0", emissionFactor: 3219.379158 },
  { id: "2", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Solid fuels - Coal (domestic)", unitOfMeasure: "tonnes", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2904.952336 },
  { id: "3", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Solid fuels - Coal (industrial)", unitOfMeasure: "tonnes", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2399.43994 },
  { id: "4", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2.512064 },
  { id: "5", date: "12 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Pvt. Ltd.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 697030, source: "Defra v 1.0", emissionFactor: 2.512064 },
  { id: "6", date: "7 - June - 2025", entryPeriod: "June - 2025", siteName: "Growlity Inc.", type: "Biomass - Wood pellets", unitOfMeasure: "tonnes", consumption: 1000, source: "Defra v 1.0", emissionFactor: 54.33654 },
  { id: "7", date: "9 - July - 2025", entryPeriod: "July - 2025", siteName: "Growlity Pvt. Ltd.", type: "Solid fuels - Coal (industrial)", unitOfMeasure: "tonnes", consumption: 222.349, source: "Defra v 1.0", emissionFactor: 2399.43994 },
  { id: "8", date: "21 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Pvt. Ltd.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 9429, source: "Defra v 1.0", emissionFactor: 2.04542 },
  { id: "9", date: "23 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Butane", unitOfMeasure: "litres", consumption: 115, source: "Defra v 1.0", emissionFactor: 1.74533 },
  { id: "10", date: "26 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 112790, source: "Defra v 1.0", emissionFactor: 2.04542 },
  { id: "11", date: "26 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 168646, source: "Defra v 1.0", emissionFactor: 2.04542 },
  { id: "12", date: "9 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2.04542 },
  { id: "13", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Solid fuels - Coal (industrial)", unitOfMeasure: "tonnes", consumption: 145, source: "Defra v 1.0", emissionFactor: 2399.43994 },
  { id: "14", date: "13 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - CNG", unitOfMeasure: "kWh (Net CV)", consumption: 23, source: "Defra v 1.0", emissionFactor: 0.202671 },
  { id: "15", date: "4 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "tonnes", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2568.16441 },
  { id: "16", date: "4 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 1000, source: "Defra v 1.0", emissionFactor: 2.04542 },
  { id: "17", date: "7 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", type: "Gaseous fuels - CNG", unitOfMeasure: "litres", consumption: 42, source: "Defra v 1.0", emissionFactor: 0.448447 },
  { id: "18", date: "19 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 1500, source: "Defra v 1.0", emissionFactor: 2.512064 },
  { id: "19", date: "19 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Solid fuels - Coal (industrial)", unitOfMeasure: "tonnes", consumption: 15, source: "Defra v 1.0", emissionFactor: 2399.43994 },
  { id: "20", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 25, source: "Defra v 1.0", emissionFactor: 2.512064 },
  { id: "21", date: "22 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Solid fuels - Coal (industrial)", unitOfMeasure: "tonnes", consumption: 6041.9, source: "Defra v 1.0", emissionFactor: 2395.28994 },
  { id: "22", date: "22 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 48185.3, source: "Defra v 1.0", emissionFactor: 2.57082 },
  { id: "23", date: "22 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 223662.36, source: "Defra v 1.0", emissionFactor: 2.06672 },
  { id: "24", date: "22 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Gaseous fuels - Natural gas", unitOfMeasure: "cubic metres", consumption: 115139, source: "Defra v 1.0", emissionFactor: 2.06672 },
  { id: "25", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Liquid fuels - Diesel (average biofuel blend)", unitOfMeasure: "litres", consumption: 454, source: "Defra v 1.0", emissionFactor: 2.57082 },
  { id: "26", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Gaseous fuels - CNG", unitOfMeasure: "tonnes", consumption: 10, source: "Defra v 1.0", emissionFactor: 2575.46441 },
  { id: "27", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Liquid fuels - Petrol (100% mineral petrol)", unitOfMeasure: "litres", consumption: 1200, source: "Defra v 1.0", emissionFactor: 2.33984 },
];

// Scope 1 - Mobile Combustion (11 records) - Total: 1.890615 TCO2Eq
const scope1MobileData: TableRow[] = [
  { id: "1", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Diesel - Medium car", unitOfMeasure: "km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.167156 },
  { id: "2", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Diesel - Medium car", unitOfMeasure: "km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.167156 },
  { id: "3", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "CNG - Average car", unitOfMeasure: "km", consumption: 1452, source: "Defra v 1.0", emissionFactor: 0.175044 },
  { id: "4", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Petrol - Average car", unitOfMeasure: "km", consumption: 1424, source: "Defra v 1.0", emissionFactor: 0.16323 },
  { id: "5", date: "27 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", type: "CNG - Vans - Average (up to 3.5 tonnes)", unitOfMeasure: "km", consumption: 52, source: "Defra v 1.0", emissionFactor: 0.2512 },
  { id: "6", date: "27 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", type: "CNG - Vans - Average (up to 3.5 tonnes)", unitOfMeasure: "km", consumption: 541, source: "Defra v 1.0", emissionFactor: 0.2512 },
  { id: "7", date: "19 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Diesel - Medium car", unitOfMeasure: "km", consumption: 1500, source: "Defra v 1.0", emissionFactor: 0.167156 },
  { id: "8", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Diesel - Vans - Class II (1.305 to 1.74 tonnes)", unitOfMeasure: "km", consumption: 215, source: "Defra v 1.0", emissionFactor: 0.18832 },
  { id: "9", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Diesel - Average car", unitOfMeasure: "km", consumption: 247, source: "Defra v 1.0", emissionFactor: 0.17304 },
  { id: "10", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Petrol - Medium car", unitOfMeasure: "km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.17474 },
  { id: "11", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Petrol - Vans - Average (up to 3.5 tonnes)", unitOfMeasure: "miles", consumption: 1200, source: "Defra v 1.0", emissionFactor: 0.34336 },
];

// Scope 1 - Fugitive Emissions (7 records) - Total: 5785.018 TCO2Eq
const scope1FugitiveData: TableRow[] = [
  { id: "1", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Refrigerants - HFC-134a", unitOfMeasure: "kg", consumption: 1000, source: "Defra v 1.0", emissionFactor: 1300 },
  { id: "2", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Refrigerants - HFC-32", unitOfMeasure: "kg", consumption: 5, source: "Defra v 1.0", emissionFactor: 677 },
  { id: "3", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Refrigerants - HFC-32", unitOfMeasure: "kg", consumption: 5, source: "Defra v 1.0", emissionFactor: 677 },
  { id: "4", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Refrigerants - HFC-32", unitOfMeasure: "kg", consumption: 21, source: "Defra v 1.0", emissionFactor: 677 },
  { id: "5", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Refrigerants - HFC-32", unitOfMeasure: "kg", consumption: 3, source: "Defra v 1.0", emissionFactor: 677 },
  { id: "6", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Refrigerants - HFC-41", unitOfMeasure: "kg", consumption: 2000, source: "Defra v 1.0", emissionFactor: 116 },
  { id: "7", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Refrigerants - HFE-43-10pccc124 (H-Galden1040x)", unitOfMeasure: "kg", consumption: 1500, source: "Defra v 1.0", emissionFactor: 2820 },
];

// Scope 2 - Purchased Electricity (24 records) - Total: 6351.960378 TCO2Eq
const scope2ElectricityData: TableRow[] = [
  { id: "1", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 1000, source: "CaDI 2025", emissionFactor: 0.727 },
  { id: "2", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 1000, source: "CaDI 2025", emissionFactor: 0.727 },
  { id: "3", date: "17 - February - 2026", entryPeriod: "April - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 137, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { id: "4", date: "9 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 1000, source: "CaDI 2025", emissionFactor: 0.727 },
  { id: "5", date: "27 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 10000, source: "CaDI 2025", emissionFactor: 0.727 },
  { id: "6", date: "29 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 245360.12, source: "CaDI 2025", emissionFactor: 0.727 },
  { id: "7", date: "17 - February - 2026", entryPeriod: "May - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 178, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { id: "8", date: "17 - February - 2026", entryPeriod: "June - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 257, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { id: "9", date: "17 - February - 2026", entryPeriod: "July - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 306, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { id: "10", date: "4 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Pvt. Ltd.", nameOfCountry: "Country - Bangladesh", unitOfMeasure: "kWh", consumption: 7677, source: "CaDI 2025", emissionFactor: 0.41 },
  { id: "11", date: "17 - February - 2026", entryPeriod: "August - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 336, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { id: "12", date: "13 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 117437, source: "CaDI 2025", emissionFactor: 0.727 },
  { id: "13", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 150, source: "CaDI 2025", emissionFactor: 0.727 },
  { id: "14", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 7854000, source: "CaDI 2025", emissionFactor: 0.727 },
  { id: "15", date: "17 - February - 2026", entryPeriod: "September - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 321, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { id: "16", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 4821, source: "CaDI 2025", emissionFactor: 0.49 },
  { id: "17", date: "17 - February - 2026", entryPeriod: "October - 2025", siteName: "Growlity Hong Kong", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 294, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { id: "18", date: "17 - February - 2026", entryPeriod: "October - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 294, source: "CaDI 2025", emissionFactor: 0.66307 },
  { id: "19", date: "17 - February - 2026", entryPeriod: "October - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - China", unitOfMeasure: "kWh", consumption: 294, source: "ecoinvent version 3.12", emissionFactor: 0.85 },
  { id: "20", date: "10 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - United States of America", unitOfMeasure: "kWh", consumption: 1396825, source: "CaDI 2025", emissionFactor: 0.246 },
  { id: "21", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 2457, source: "CaDI 2025", emissionFactor: 0.727 },
  { id: "22", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 3248, source: "CEA FY2025-26", emissionFactor: 0.71 },
  { id: "23", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 3000, source: "ecoinvent version 3.12", emissionFactor: 1.35 },
  { id: "24", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", nameOfCountry: "Country - India", unitOfMeasure: "kWh", consumption: 10000, source: "CaDI 2025", emissionFactor: 0.95182 },
];

// Scope 2 - Purchased Heat and Steam (2 records) - Total: 0.217324 TCO2Eq
const scope2HeatSteamData: TableRow[] = [
  { id: "1", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", heatSource: "District Cooling - China", unitOfMeasure: "Ton of Refrigeration", consumption: 4, source: "Defra v 1.0", emissionFactor: 0.437 },
  { id: "2", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", heatSource: "Heat and Steam - District", unitOfMeasure: "kWh", consumption: 1200, source: "Defra v 1.0", emissionFactor: 0.179647 },
];

// Scope 2 - Renewable Electricity Generation (2 records) - Total: 0 TCO2Eq
const scope2RenewableData: TableRow[] = [
  { id: "1", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", nameOfCountry: "Country - India", unitOfMeasure: "kWh", generation: 3214, source: "Defra v 1.0", emissionFactor: 0 },
  { id: "2", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", nameOfCountry: "Country - India", unitOfMeasure: "kWh", generation: 1100, source: "Defra v 1.0", emissionFactor: 0 },
];

// Scope 3 - Employee Commute (16 records) - Total: 3.713639 TCO2Eq
const scope3CommuteData: TableRow[] = [
  { id: "1", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", fuelType: "-", vehicleType: "Medium", unitOfMeasure: "km", consumption: 1000 },
  { id: "2", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", commuteType: "Bus", fuelType: "-", vehicleType: "Average local bus", unitOfMeasure: "passenger.km", consumption: 1000 },
  { id: "3", date: "8 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", commuteType: "Cars (by size)", fuelType: "Diesel", vehicleType: "Average car", unitOfMeasure: "km", consumption: 1000 },
  { id: "4", date: "8 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", commuteType: "Cars (by size)", fuelType: "Petrol", vehicleType: "Average car", unitOfMeasure: "km", consumption: 1000 },
  { id: "5", date: "8 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", fuelType: "-", vehicleType: "Average", unitOfMeasure: "km", consumption: 1000 },
  { id: "6", date: "8 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", commuteType: "Bus", fuelType: "-", vehicleType: "Average local bus", unitOfMeasure: "passenger.km", consumption: 1000 },
  { id: "7", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", fuelType: "-", vehicleType: "Average", unitOfMeasure: "km", consumption: 10262 },
  { id: "8", date: "6 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", fuelType: "-", vehicleType: "Medium", unitOfMeasure: "km", consumption: 4583 },
  { id: "9", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", commuteType: "Rail", fuelType: "-", vehicleType: "National rail", unitOfMeasure: "passenger.km", consumption: 145 },
  { id: "10", date: "4 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", fuelType: "-", vehicleType: "Medium", unitOfMeasure: "km", consumption: 222 },
  { id: "11", date: "4 - November - 2025", entryPeriod: "November - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", fuelType: "-", vehicleType: "Average", unitOfMeasure: "km", consumption: 5000 },
  { id: "12", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", commuteType: "Motorbike", fuelType: "-", vehicleType: "Average", unitOfMeasure: "km", consumption: 245 },
  { id: "13", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", commuteType: "Bus", fuelType: "-", vehicleType: "Average local bus", unitOfMeasure: "passenger.km", consumption: 449 },
  { id: "14", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", commuteType: "Motorbike", fuelType: "-", vehicleType: "Medium", unitOfMeasure: "km", consumption: 1400 },
  { id: "15", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", commuteType: "Cars (by size)", fuelType: "Petrol", vehicleType: "Medium car", unitOfMeasure: "km", consumption: 2000 },
  { id: "16", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", commuteType: "Motorbike", fuelType: "-", vehicleType: "Medium", unitOfMeasure: "km", consumption: 1556 },
];

// Scope 3 - Food Consumption (6 records) - Total: 5.07625 TCO2Eq
const scope3FoodData: TableRow[] = [
  { id: "1", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", foodType: "1 average meal", unitOfMeasure: "meal", consumption: 1000, source: "UNFCCC", emissionFactor: 4.7 },
  { id: "2", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", foodType: "Meal, vegetarian", unitOfMeasure: "meal", consumption: 50, source: "UNFCCC", emissionFactor: 2.85 },
  { id: "3", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", foodType: "Meal, vegetarian", unitOfMeasure: "meal", consumption: 23, source: "UNFCCC", emissionFactor: 2.85 },
  { id: "4", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", foodType: "1 standard breakfast", unitOfMeasure: "breakfast", consumption: 30, source: "UNFCCC", emissionFactor: 0.84 },
  { id: "5", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", foodType: "1 average meal", unitOfMeasure: "meal", consumption: 30, source: "UNFCCC", emissionFactor: 4.7 },
  { id: "6", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", foodType: "Non-alcoholic beverage", unitOfMeasure: "litre", consumption: 10, source: "UNFCCC", emissionFactor: 0.2 },
];

// Scope 3 - Purchased Goods (8 records) - Total: 44952.301031 TCO2Eq
const scope3GoodsData: TableRow[] = [
  { id: "1", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", typeOfGoods: "Plastic - Plastics: HDPE (incl. forming)", loop: "-", unitOfMeasure: "tonnes", consumption: 45, source: "Defra v 1.0", emissionFactor: 3086.39038 },
  { id: "2", date: "6 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", typeOfGoods: "Chemicals - Other chemical", loop: "-", unitOfMeasure: "kg", consumption: 114.25, source: "Defra v 1.0", emissionFactor: 3 },
  { id: "3", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", typeOfGoods: "Plastic - Plastics: average plastics", loop: "-", unitOfMeasure: "tonnes", consumption: 14, source: "Defra v 1.0", emissionFactor: 3164.78049 },
  { id: "4", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", typeOfGoods: "Other - Clothing", loop: "-", unitOfMeasure: "tonnes", consumption: 2000, source: "Defra v 1.0", emissionFactor: 22310 },
  { id: "5", date: "23 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", typeOfGoods: "Construction - Mineral oil", loop: "Primary material production", unitOfMeasure: "tonnes", consumption: 2.77, source: "Defra v 1.0", emissionFactor: 1401 },
  { id: "6", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", typeOfGoods: "Plastic - Plastics: average plastic film", loop: "Primary material production", unitOfMeasure: "tonnes", consumption: 32, source: "Defra v 1.0", emissionFactor: 2916.50513 },
  { id: "7", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", typeOfGoods: "Electrical items - Electrical items - IT", loop: "Primary material production", unitOfMeasure: "tonnes", consumption: 2, source: "Defra v 1.0", emissionFactor: 24865.47556 },
  { id: "8", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", typeOfGoods: "Metal - Metal: steel cans", loop: "Closed-loop source", unitOfMeasure: "tonnes", consumption: 1, source: "Defra v 1.0", emissionFactor: 1823.90131 },
];

// Scope 3 - Transmission & Distribution Loss (14 records) - Total: 181.32087 TCO2Eq
const scope3TransmissionData: TableRow[] = [
  { id: "1", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "2", date: "23 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "3", date: "9 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "4", date: "27 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 10000, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "5", date: "29 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 245360.12, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "6", date: "4 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Pvt. Ltd.", nameOfCountry: "Bangladesh", unitOfMeasure: "kWh", consumption: 7677, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "7", date: "13 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 117437, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "8", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 150, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "9", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 7854000, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "10", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", nameOfCountry: "China", unitOfMeasure: "kWh", consumption: 4821, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "11", date: "10 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", nameOfCountry: "United States of America", unitOfMeasure: "kWh", consumption: 1396825, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "12", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 2457, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "13", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 2000, source: "Defra v 1.0", emissionFactor: 0.0188 },
  { id: "14", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", nameOfCountry: "India", unitOfMeasure: "kWh", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.0188 },
];

// Scope 3 - Upstream Activities (24 records) - Total: 107.237389 TCO2Eq
const scope3UpstreamData: TableRow[] = [
  { id: "1", date: "11 - June - 2025", entryPeriod: "June - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel", unitOfMeasure: "miles", consumption: 1000, source: "Defra v 1.0", emissionFactor: 1.40489 },
  { id: "2", date: "4 - July - 2025", entryPeriod: "July - 2025", siteName: "Growlity Pvt. Ltd.", type: "Cargo ship - Bulk carrier - Average", unitOfMeasure: "tonne.km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.00353 },
  { id: "3", date: "31 - July - 2025", entryPeriod: "July - 2025", siteName: "Growlity Inc.", type: "Vans - Diesel - Class I (up to 1.305 tonnes)", unitOfMeasure: "miles", consumption: 565, source: "Defra v 1.0", emissionFactor: 0.24716 },
  { id: "4", date: "31 - July - 2025", entryPeriod: "July - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>7.5 tonnes-17 tonnes)", unitOfMeasure: "miles", consumption: 14521, source: "Defra v 1.0", emissionFactor: 0.95749 },
  { id: "5", date: "31 - July - 2025", entryPeriod: "July - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>7.5 tonnes-17 tonnes)", unitOfMeasure: "miles", consumption: 15000, source: "Defra v 1.0", emissionFactor: 0.95749 },
  { id: "6", date: "1 - August - 2025", entryPeriod: "July - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>7.5 tonnes-17 tonnes)", unitOfMeasure: "miles", consumption: 5645, source: "Defra v 1.0", emissionFactor: 0.95749 },
  { id: "7", date: "30 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>17 tonnes)", unitOfMeasure: "miles", consumption: 1452, source: "Defra v 1.0", emissionFactor: 1.57231 },
  { id: "8", date: "30 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>7.5 tonnes-17 tonnes)", unitOfMeasure: "miles", consumption: 484, source: "Defra v 1.0", emissionFactor: 0.95749 },
  { id: "9", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Cargo ship - General cargo - Average", unitOfMeasure: "tonne.km", consumption: 4520, source: "Defra v 1.0", emissionFactor: 0.01321 },
  { id: "10", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>17 tonnes)", unitOfMeasure: "km", consumption: 45242, source: "Defra v 1.0", emissionFactor: 0.97698 },
  { id: "11", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Vans - Diesel - Average (up to 3.5 tonnes)", unitOfMeasure: "km", consumption: 1455, source: "Defra v 1.0", emissionFactor: 0.25023 },
  { id: "12", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>3.5 - 7.5 tonnes)", unitOfMeasure: "tonne.km", consumption: 154, source: "Defra v 1.0", emissionFactor: 0.50546 },
  { id: "13", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>3.5 - 7.5 tonnes)", unitOfMeasure: "km", consumption: 154, source: "Defra v 1.0", emissionFactor: 0.48733 },
  { id: "14", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>3.5 - 7.5 tonnes)", unitOfMeasure: "tonne.km", consumption: 324, source: "Defra v 1.0", emissionFactor: 0.24776 },
  { id: "15", date: "10 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Cargo ship - General cargo - Average", unitOfMeasure: "tonne.km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.01321 },
  { id: "16", date: "10 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>17 tonnes)", unitOfMeasure: "tonne.km", consumption: 150, source: "Defra v 1.0", emissionFactor: 0.12436 },
  { id: "17", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "HGV - All Diesel - Rigid (>7.5 tonnes-17 tonnes)", unitOfMeasure: "tonne.km", consumption: 1500, source: "Defra v 1.0", emissionFactor: 0.14849 },
  { id: "18", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Vans - Diesel - Class I (up to 1.305 tonnes)", unitOfMeasure: "km", consumption: 150, source: "Defra v 1.0", emissionFactor: 0.15738 },
  { id: "19", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Vans - Petrol - Class III (1.74 to 3.5 tonnes)", unitOfMeasure: "km", consumption: 200, source: "Defra v 1.0", emissionFactor: 0.33845 },
  { id: "20", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Vans - CNG - Average (up to 3.5 tonnes)", unitOfMeasure: "km", consumption: 180, source: "Defra v 1.0", emissionFactor: 0.25113 },
  { id: "21", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Vans - Battery Electric Vehicle - Class II (1.305 to 1.74 tonnes)", unitOfMeasure: "km", consumption: 120, source: "Defra v 1.0", emissionFactor: 0.05777 },
  { id: "22", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "HGV - All Diesel - Rigid (>3.5 - 7.5 tonnes)", unitOfMeasure: "km", consumption: 300, source: "Defra v 1.0", emissionFactor: 0.54068 },
  { id: "23", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "HGV - All Diesel - Rigid (>17 tonnes)", unitOfMeasure: "km", consumption: 500, source: "Defra v 1.0", emissionFactor: 1.10905 },
  { id: "24", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Rail - Electric - Freight train", unitOfMeasure: "tonne.km", consumption: 800, source: "Defra v 1.0", emissionFactor: 0.02779 },
];

// Scope 3 - Downstream Activities (10 records) - Total: 206.723297 TCO2Eq
const scope3DownstreamData: TableRow[] = [
  { id: "1", date: "31 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Articulated (>3.5 - 33t)", unitOfMeasure: "km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.76642 },
  { id: "2", date: "30 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Inc.", type: "Vans - Petrol - Class II (1.305 to 1.74 tonnes)", unitOfMeasure: "miles", consumption: 1452, source: "Defra v 1.0", emissionFactor: 0.34936 },
  { id: "3", date: "30 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Inc.", type: "Vans - Diesel - Class I (up to 1.305 tonnes)", unitOfMeasure: "miles", consumption: 488, source: "Defra v 1.0", emissionFactor: 0.24716 },
  { id: "4", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>17 tonnes)", unitOfMeasure: "km", consumption: 45212, source: "Defra v 1.0", emissionFactor: 0.97698 },
  { id: "5", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - All HGVs", unitOfMeasure: "km", consumption: 1425, source: "Defra v 1.0", emissionFactor: 0.87296 },
  { id: "6", date: "27 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - All rigids", unitOfMeasure: "km", consumption: 500, source: "Defra v 1.0", emissionFactor: 0.82657 },
  { id: "7", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>3.5 - 7.5 tonnes)", unitOfMeasure: "km", consumption: 154, source: "Defra v 1.0", emissionFactor: 0.48733 },
  { id: "8", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Freight flights - International, to/from non-UK - With RF", unitOfMeasure: "tonne.km", consumption: 3254, source: "Defra v 1.0", emissionFactor: 1.09904 },
  { id: "9", date: "10 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "HGV - All Diesel - Rigid (>3.5 - 7.5 tonnes)", unitOfMeasure: "km", consumption: 5200, source: "Defra v 1.0", emissionFactor: 0.48733 },
  { id: "10", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "HGV - All Diesel - Rigid (>7.5 tonnes-17 tonnes)", unitOfMeasure: "tonne.km", consumption: 2500, source: "Defra v 1.0", emissionFactor: 0.38023 },
];

// Scope 3 - Waste Disposal (13 records) - Total: 4.606446 TCO2Eq
const scope3WasteData: TableRow[] = [
  { id: "1", date: "17 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Construction - Average construction", unitOfMeasure: "tonnes", consumption: 0.08, source: "Defra v 1.0", emissionFactor: 0.98485 },
  { id: "2", date: "29 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", type: "Metal - Metal: steel cans", unitOfMeasure: "tonnes", consumption: 237.384, source: "Defra v 1.0", emissionFactor: 6.41061 },
  { id: "3", date: "29 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", type: "Plastic - Plastics: HDPE (incl. forming)", unitOfMeasure: "tonnes", consumption: 127.958, source: "Defra v 1.0", emissionFactor: 6.41061 },
  { id: "4", date: "29 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", type: "Plastic - Plastics: PP (incl. forming)", unitOfMeasure: "tonnes", consumption: 2, source: "Defra v 1.0", emissionFactor: 6.41061 },
  { id: "5", date: "29 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", type: "Metal - Metal: mixed cans", unitOfMeasure: "tonnes", consumption: 0.819, source: "Defra v 1.0", emissionFactor: 6.41061 },
  { id: "6", date: "29 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", type: "Plastic - Plastics: PET (incl. forming)", unitOfMeasure: "tonnes", consumption: 28.915, source: "Defra v 1.0", emissionFactor: 6.41061 },
  { id: "7", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Plastic - Plastics: HDPE (incl. forming)", unitOfMeasure: "tonnes", consumption: 15, source: "Defra v 1.0", emissionFactor: 6.41061 },
  { id: "8", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Construction - Metals", unitOfMeasure: "tonnes", consumption: 54, source: "Defra v 1.0", emissionFactor: 0.98485 },
  { id: "9", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Other - Clothing", unitOfMeasure: "tonnes", consumption: 214, source: "Defra v 1.0", emissionFactor: 6.41061 },
  { id: "10", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Plastic - Plastics: HDPE (incl. forming)", unitOfMeasure: "tonnes", consumption: 34, source: "Defra v 1.0", emissionFactor: 4.68568 },
  { id: "11", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Refuse - Commercial and industrial waste", unitOfMeasure: "tonnes", consumption: 47, source: "Defra v 1.0", emissionFactor: 4.68568 },
  { id: "12", date: "10 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Plastic - Plastics: HDPE (incl. forming)", unitOfMeasure: "tonnes", consumption: 15, source: "Defra v 1.0", emissionFactor: 4.68568 },
  { id: "13", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Metal - Metal: steel cans", unitOfMeasure: "tonnes", consumption: 10, source: "Defra v 1.0", emissionFactor: 8.98311 },
];

// Scope 3 - Water Supply (12 records) - Total: 93.849879 TCO2Eq
const scope3WaterSupplyData: TableRow[] = [
  { id: "1", date: "16 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 16473, source: "Defra v 1.0", emissionFactor: 0.15311 },
  { id: "2", date: "16 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 17678, source: "Defra v 1.0", emissionFactor: 0.15311 },
  { id: "3", date: "16 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 39889, source: "Defra v 1.0", emissionFactor: 0.15311 },
  { id: "4", date: "16 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 6552, source: "Defra v 1.0", emissionFactor: 0.15311 },
  { id: "5", date: "22 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 383299, source: "Defra v 1.0", emissionFactor: 0.15311 },
  { id: "6", date: "22 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.15311 },
  { id: "7", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 145, source: "Defra v 1.0", emissionFactor: 0.15311 },
  { id: "8", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 15, source: "Defra v 1.0", emissionFactor: 0.15311 },
  { id: "9", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 214, source: "Defra v 1.0", emissionFactor: 0.15311 },
  { id: "10", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 3214, source: "Defra v 1.0", emissionFactor: 0.1913 },
  { id: "11", date: "10 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Water Supply", unitOfMeasure: "Cubic metres", consumption: 14993, source: "Defra v 1.0", emissionFactor: 0.1913 },
  { id: "12", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Water Supply", unitOfMeasure: "Million litres", consumption: 100, source: "Defra v 1.0", emissionFactor: 191.30156 },
];

// Scope 3 - Water Treatment (19 records) - Total: 165.871319 TCO2Eq
const scope3WaterTreatmentData: TableRow[] = [
  { id: "1", date: "17 - April - 2025", entryPeriod: "April - 2025", siteName: "Growlity Pvt. Ltd.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 1, source: "Defra v 1.0", emissionFactor: 185.7412 },
  { id: "2", date: "8 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Pvt. Ltd.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 4.079, source: "Defra v 1.0", emissionFactor: 185.7412 },
  { id: "3", date: "8 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Pvt. Ltd.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 43.758, source: "Defra v 1.0", emissionFactor: 185.7412 },
  { id: "4", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 0.5, source: "Defra v 1.0", emissionFactor: 185.7412 },
  { id: "5", date: "4 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 3.82, source: "Defra v 1.0", emissionFactor: 185.7412 },
  { id: "6", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 15, source: "Defra v 1.0", emissionFactor: 185.7412 },
  { id: "7", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 0.24, source: "Defra v 1.0", emissionFactor: 185.7412 },
  { id: "8", date: "30 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 445, source: "Defra v 1.0", emissionFactor: 170.87549 },
  { id: "9", date: "30 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 55, source: "Defra v 1.0", emissionFactor: 170.87549 },
  { id: "10", date: "31 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Water Treatment", unitOfMeasure: "cubic metres", consumption: 4554, source: "Defra v 1.0", emissionFactor: 0.17088 },
  { id: "11", date: "31 - January - 2026", entryPeriod: "January - 2026", siteName: "Growlity Inc.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 55, source: "Defra v 1.0", emissionFactor: 170.87549 },
  { id: "12", date: "2 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 222, source: "Defra v 1.0", emissionFactor: 170.87549 },
  { id: "13", date: "2 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Pvt. Ltd.", type: "Water Treatment", unitOfMeasure: "cubic metres", consumption: 54, source: "Defra v 1.0", emissionFactor: 0.17088 },
  { id: "14", date: "2 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Pvt. Ltd.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 58, source: "Defra v 1.0", emissionFactor: 170.87549 },
  { id: "15", date: "6 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Pvt. Ltd.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 0.254, source: "Defra v 1.0", emissionFactor: 170.87549 },
  { id: "16", date: "10 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Water Treatment", unitOfMeasure: "cubic metres", consumption: 1500, source: "Defra v 1.0", emissionFactor: 0.17088 },
  { id: "17", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 1, source: "Defra v 1.0", emissionFactor: 170.87549 },
  { id: "18", date: "2 - February - 2026", entryPeriod: "March - 2026", siteName: "Growlity Pvt. Ltd.", type: "Water Treatment", unitOfMeasure: "cubic metres", consumption: 5, source: "Defra v 1.0", emissionFactor: 0.17088 },
  { id: "19", date: "2 - February - 2026", entryPeriod: "March - 2026", siteName: "Growlity Pvt. Ltd.", type: "Water Treatment", unitOfMeasure: "million litres", consumption: 54, source: "Defra v 1.0", emissionFactor: 170.87549 },
];

// Scope 3 - Business Travel (Air) (7 records) - Total: 85.780954 TCO2Eq
const scope3TravelAirData: TableRow[] = [
  { id: "1", date: "9 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", type: "Flights - Domestic, to/from UK", unitOfMeasure: "passenger_km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.27257 },
  { id: "2", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Flights - International, to/from non-UK - Business class", unitOfMeasure: "passenger_km", consumption: 4521, source: "Defra v 1.0", emissionFactor: 0.39044 },
  { id: "3", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Flights - International, to/from non-UK - Business class", unitOfMeasure: "passenger_km", consumption: 1400, source: "Defra v 1.0", emissionFactor: 0.39044 },
  { id: "4", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Flights - International, to/from non-UK - Business class", unitOfMeasure: "passenger_km", consumption: 2657, source: "Defra v 1.0", emissionFactor: 0.39044 },
  { id: "5", date: "10 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Flights - International, to/from non-UK - Business class", unitOfMeasure: "passenger_km", consumption: 6570, source: "Defra v 1.0", emissionFactor: 0.31656 },
  { id: "6", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Flights - International, to/from non-UK - Average passenger", unitOfMeasure: "passenger_km", consumption: 7200, source: "Defra v 1.0", emissionFactor: 0.14253 },
  { id: "7", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Flights - International, to/from non-UK - Premium economy class", unitOfMeasure: "passenger_km", consumption: 12487, source: "Defra v 1.0", emissionFactor: 0.17465 },
];

// Scope 3 - Business Travel (Sea) (1 record) - Total: 11.8335 TCO2Eq
const scope3TravelSeaData: TableRow[] = [
  { id: "1", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Ferry - Average (all passenger)", unitOfMeasure: "passenger.km", consumption: 3500, source: "Defra v 1.0", emissionFactor: 0.1127 },
];

// Scope 3 - Business Travel (Land) (6 records) - Total: 1.231542 TCO2Eq
const scope3TravelLandData: TableRow[] = [
  { id: "1", date: "9 - May - 2025", entryPeriod: "May - 2025", siteName: "Growlity Inc.", type: "Rail - National rail", unitOfMeasure: "passenger.km", consumption: 1000, source: "Defra v 1.0", emissionFactor: 0.035463 },
  { id: "2", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", type: "Rail - National rail", unitOfMeasure: "passenger.km", consumption: 500, source: "Defra v 1.0", emissionFactor: 0.035463 },
  { id: "3", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", type: "Bus - Average local bus", unitOfMeasure: "passenger.km", consumption: 145, source: "Defra v 1.0", emissionFactor: 0.10846 },
  { id: "4", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", type: "Rail - National rail", unitOfMeasure: "passenger.km", consumption: 457, source: "Defra v 1.0", emissionFactor: 0.035463 },
  { id: "5", date: "10 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", type: "Rail - National rail", unitOfMeasure: "passenger.km", consumption: 550, source: "Defra v 1.0", emissionFactor: 0.03546 },
  { id: "6", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", type: "Diesel - Average car", unitOfMeasure: "km", consumption: 6000, source: "Defra v 1.0", emissionFactor: 0.17304 },
];

// Scope 3 - Hotel Stay (9 records) - Total: 20.4363 TCO2Eq
const scope3HotelData: TableRow[] = [
  { id: "1", date: "28 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Pvt. Ltd.", nameOfCountry: "India", unitOfMeasure: "room nights", consumption: 30, source: "Defra v 1.0", emissionFactor: 58.9 },
  { id: "2", date: "28 - August - 2025", entryPeriod: "August - 2025", siteName: "Growlity Pvt. Ltd.", nameOfCountry: "India", unitOfMeasure: "room nights", consumption: 150, source: "Defra v 1.0", emissionFactor: 58.9 },
  { id: "3", date: "25 - September - 2025", entryPeriod: "September - 2025", siteName: "Growlity Inc.", nameOfCountry: "China", unitOfMeasure: "room nights", consumption: 4, source: "Defra v 1.0", emissionFactor: 53.5 },
  { id: "4", date: "16 - October - 2025", entryPeriod: "October - 2025", siteName: "Growlity Inc.", nameOfCountry: "Egypt", unitOfMeasure: "room nights", consumption: 4, source: "Defra v 1.0", emissionFactor: 44.2 },
  { id: "5", date: "30 - December - 2025", entryPeriod: "December - 2025", siteName: "Growlity Inc.", nameOfCountry: "Colombia", unitOfMeasure: "room nights", consumption: 2, source: "Defra v 1.0", emissionFactor: 14.7 },
  { id: "6", date: "9 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", nameOfCountry: "Canada", unitOfMeasure: "room nights", consumption: 2, source: "Defra v 1.0", emissionFactor: 7.4 },
  { id: "7", date: "10 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc.", nameOfCountry: "Germany", unitOfMeasure: "room nights", consumption: 4, source: "Defra v 1.0", emissionFactor: 13.2 },
  { id: "8", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", nameOfCountry: "UK (London)", unitOfMeasure: "room nights", consumption: 3, source: "Defra v 1.0", emissionFactor: 11.5 },
  { id: "9", date: "13 - February - 2026", entryPeriod: "February - 2026", siteName: "Growlity Inc", nameOfCountry: "United States", unitOfMeasure: "room nights", consumption: 4, source: "Defra v 1.0", emissionFactor: 16.1 },
];

// Summary card component
const SummaryCard = ({
  title,
  value,
  unit = "TCO2Eq",
  isTotal = false,
}: {
  title: string;
  value: number;
  unit?: string;
  isTotal?: boolean;
}) => (
  <div
    className={`rounded-xl p-6 ${
      isTotal
        ? "bg-gradient-to-br from-[#3e6b3e] to-[#2d522d] text-white"
        : "bg-white border border-gray-200"
    }`}
  >
    <h3
      className={`text-sm font-medium mb-2 ${
        isTotal ? "text-emerald-100" : "text-gray-600"
      }`}
    >
      {title}
    </h3>
    <div className="flex items-baseline gap-1">
      <span
        className={`text-3xl font-bold ${
          isTotal ? "text-white" : "text-gray-900"
        }`}
      >
        {value.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
      </span>
      <span
        className={`text-sm ${isTotal ? "text-emerald-200" : "text-gray-500"}`}
      >
        {unit}
      </span>
    </div>
  </div>
);

// Table component
const DataTable = ({
  title,
  totalEmissions,
  columns,
  data,
}: TableSection) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getCellValue = (row: TableRow, key: string): string => {
    const value = row[key as keyof TableRow];
    if (value === undefined || value === null) return "-";
    if (typeof value === "number") return value.toLocaleString('en-US');
    return String(value);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
      <div
        className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            Total GHG Emissions: {totalEmissions.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} TCO2Eq
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isExpanded ? "" : "-rotate-90"
          }`}
        />
      </div>

      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <Filter className="w-3 h-3" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                    >
                      {getCellValue(row, col.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Build context data for AI
const buildGHGContext = () => {
  return JSON.stringify({
    summary: {
      fiscalYear: "2025-26",
      totalEmissions: 87725.262736,
      scope1: { total: 35533.102619, categories: ["Stationary Combustion", "Mobile Combustion", "Fugitive Emissions"] },
      scope2: { total: 6352.177702, categories: ["Purchased Electricity", "Purchased Heat and Steam", "Renewable Electricity Generation"] },
      scope3: { total: 46350.18387, categories: ["Employee Commute", "Food Consumption", "Purchased Goods", "Transmission & Distribution Loss", "Upstream Activities", "Downstream Activities", "Waste Disposal", "Water Supply", "Water Treatment", "Business Travel (Air)", "Business Travel (Sea)", "Business Travel (Land)", "Hotel Stay"] },
    },
    detailedData: {
      stationaryCombustion: {
        totalEmissions: 29746.194006,
        recordCount: 27,
        description: "Direct emissions from stationary fuel combustion (natural gas, diesel, coal)",
        topSources: ["Solid fuels - Coal", "Liquid fuels - Diesel", "Gaseous fuels - Natural Gas"],
      },
      mobileCombustion: {
        totalEmissions: 1.890615,
        recordCount: 11,
        description: "Emissions from company vehicles and transportation",
        topSources: ["Diesel - Medium car", "Petrol - Average car", "CNG - Average car"],
      },
      fugitiveEmissions: {
        totalEmissions: 5785.018,
        recordCount: 7,
        description: "Emissions from refrigerants and industrial gases",
        topSources: ["Refrigerants - HFC-134a", "Refrigerants - HFC-32", "Refrigerants - HFE-43-10pccc124"],
      },
      purchasedElectricity: {
        totalEmissions: 6351.960378,
        recordCount: 24,
        description: "Emissions from purchased electricity",
        sites: ["Growlity Inc (India)", "Growlity Hong Kong (China)", "Growlity Pvt. Ltd. (Bangladesh)"],
      },
      purchasedHeatSteam: {
        totalEmissions: 0.217324,
        recordCount: 2,
        description: "Emissions from purchased heat and steam",
        sources: ["District Cooling", "Heat and Steam"],
      },
      renewableElectricity: {
        totalEmissions: 0,
        recordCount: 2,
        description: "Avoided emissions from renewable electricity generation",
        generation: 4314,
      },
      employeeCommute: {
        totalEmissions: 3.713639,
        recordCount: 16,
        description: "Emissions from employee commuting",
        transportModes: ["Motorbike", "Bus", "Cars (by size)", "Rail"],
      },
      foodConsumption: {
        totalEmissions: 5.07625,
        recordCount: 6,
        description: "Emissions from food and beverages consumed",
        categories: ["Average meal", "Vegetarian meal", "Breakfast", "Non-alcoholic beverages"],
      },
      purchasedGoods: {
        totalEmissions: 44952.301031,
        recordCount: 8,
        description: "Emissions from purchased goods and services",
        categories: ["Plastics", "Chemicals", "Clothing", "Construction materials", "Electrical items", "Metal"],
      },
      transmissionDistributionLoss: {
        totalEmissions: 181.32087,
        recordCount: 14,
        description: "Emissions from electricity transmission and distribution losses",
        location: "India",
      },
      upstreamActivities: {
        totalEmissions: 107.237389,
        recordCount: 24,
        description: "Upstream transportation and distribution emissions",
        transportModes: ["HGV - All Diesel", "Cargo ship", "Vans", "Rail"],
      },
      downstreamActivities: {
        totalEmissions: 206.723297,
        recordCount: 10,
        description: "Downstream transportation and distribution emissions",
        transportModes: ["HGV - All Diesel", "Vans", "Freight flights"],
      },
      wasteDisposal: {
        totalEmissions: 4.606446,
        recordCount: 13,
        description: "Emissions from waste disposal activities",
        categories: ["Construction", "Metal", "Plastic", "Refuse"],
      },
      waterSupply: {
        totalEmissions: 93.849879,
        recordCount: 12,
        description: "Emissions from water supply",
        sources: ["Water Supply"],
      },
      waterTreatment: {
        totalEmissions: 165.871319,
        recordCount: 19,
        description: "Emissions from water treatment processes",
        sources: ["Water Treatment"],
      },
      businessTravelAir: {
        totalEmissions: 85.780954,
        recordCount: 7,
        description: "Emissions from business air travel",
        classes: ["Average passenger", "Business class", "Premium economy class"],
      },
      businessTravelSea: {
        totalEmissions: 11.8335,
        recordCount: 1,
        description: "Emissions from business sea travel (ferry)",
        transportModes: ["Ferry"],
      },
      businessTravelLand: {
        totalEmissions: 1.231542,
        recordCount: 6,
        description: "Emissions from business land travel",
        transportModes: ["Rail - National rail", "Bus - Average local bus", "Diesel - Average car"],
      },
      hotelStay: {
        totalEmissions: 20.4363,
        recordCount: 9,
        description: "Emissions from hotel stays during business travel",
        countries: ["India", "China", "Egypt", "Colombia", "Canada", "Germany", "UK (London)", "United States"],
      },
    },
    insights: {
      highestScope: "Scope 3 (Purchased Goods) at 51.3% of total emissions",
      highestSingleSource: "Purchased Goods at 44,952.30 TCO2Eq",
      scope1Breakdown: "Stationary Combustion dominates Scope 1 (83.7%)",
      renewableImpact: "Renewable generation avoided emissions entirely",
      scope3Breakdown: "13 categories including Upstream, Downstream, Waste, Water, Travel, and Hotels",
      topEmitters: ["Purchased Goods (44,952.30)", "Stationary Combustion (29,746.19)", "Fugitive Emissions (5,785.02)", "Purchased Electricity (6,351.96)"],
    },
  }, null, 2);
};

export default function GHGReportPage() {
  const [selectedYear, setSelectedYear] = useState("FY 2025-26");
  const [baselineYear, setBaselineYear] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fromDate, setFromDate] = useState("Apr - 2025");
  const [toDate, setToDate] = useState("Mar - 2026");
  const [selectedSite, setSelectedSite] = useState("All Sites");
  const [exportType, setExportType] = useState("Select Export Type");
  const [contextData, setContextData] = useState<string>("");

  useEffect(() => {
    setContextData(buildGHGContext());
  }, []);

  // Summary values based on the Scope 1,2,3.txt file
  const totalEmissions = 87725.262736;
  const scope1Value = 35533.102621; // 29746.194006 + 1.890615 + 5785.018
  const scope2Value = 6352.177702; // 6351.960378 + 0.217324 + 0
  const scope3Value = 46350.18387; // Previous + 107.237389 + 206.723297 + 4.606446 + 93.849879 + 165.871319 + 85.780954 + 11.8335 + 1.231542 + 20.4363

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "mr-[400px]" : ""
        }`}
      >
      <Header
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        baselineYear={baselineYear}
        setBaselineYear={setBaselineYear}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        yearOptions={yearOptions}
        activePage="ghg-reports"
        onAskAIClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="max-w-[1600px] mx-auto px-6 py-8 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span className="text-emerald-600">Dashboard</span>
          <span>/</span>
          <span>Reports</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Report for All Sites - Financial Year 2025
          </h1>
          <p className="text-gray-500 mt-1">Management period: Apr 2025 - Mar 2026</p>
        </div>

        {/* Scope Emission Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope Emission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total GHG Emissions"
              value={totalEmissions}
              isTotal={true}
            />
            <SummaryCard title="Scope 1" value={scope1Value} />
            <SummaryCard title="Scope 2" value={scope2Value} />
            <SummaryCard title="Scope 3" value={scope3Value} />
          </div>
        </div>

        {/* Report Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Report</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                Reporting Year
              </label>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                  CY
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                  FY
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                From
              </label>
              <select
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Apr - 2025</option>
                <option>May - 2025</option>
                <option>Jun - 2025</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                To
              </label>
              <select
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Mar - 2026</option>
                <option>Feb - 2026</option>
                <option>Jan - 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                Sites
              </label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>All Sites</option>
                <option>Growlity Inc</option>
                <option>Growlity Hong Kong</option>
                <option>Growlity Pvt. Ltd.</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                Export Type
              </label>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Select Export Type</option>
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scope 1 Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope 1</h2>
          
          <DataTable
            title="Stationary Combustion"
            totalEmissions={29746.194006}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope1StationaryData}
          />

          <DataTable
            title="Mobile Combustion"
            totalEmissions={1.890615}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope1MobileData}
          />

          <DataTable
            title="Fugitive Emissions"
            totalEmissions={5785.018}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope1FugitiveData}
          />
        </div>

        {/* Scope 2 Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope 2</h2>
          
          <DataTable
            title="Purchased Electricity"
            totalEmissions={6351.960378}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "nameOfCountry", label: "Name of Country" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope2ElectricityData}
          />

          <DataTable
            title="Purchased Heat and Steam"
            totalEmissions={0.217324}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "heatSource", label: "Heat Source" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope2HeatSteamData}
          />

          <DataTable
            title="Renewable Electricity Generation - Avoided Emission"
            totalEmissions={0}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "nameOfCountry", label: "Name of Country" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "generation", label: "Generation" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope2RenewableData}
          />
        </div>

        {/* Scope 3 Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scope 3</h2>
          
          <DataTable
            title="Employee Commute"
            totalEmissions={3.713639}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "commuteType", label: "Commute Type" },
              { key: "fuelType", label: "Fuel Type" },
              { key: "vehicleType", label: "Vehicle Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
            ]}
            data={scope3CommuteData}
          />

          <DataTable
            title="Food Consumption"
            totalEmissions={5.07625}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "foodType", label: "Food Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3FoodData}
          />

          <DataTable
            title="Purchased Goods"
            totalEmissions={44952.301031}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "typeOfGoods", label: "Type of Goods" },
              { key: "loop", label: "Loop" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3GoodsData}
          />

          <DataTable
            title="Transmission & Distribution Loss"
            totalEmissions={181.32087}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "nameOfCountry", label: "Name of Country" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3TransmissionData}
          />

          <DataTable
            title="Upstream Activities"
            totalEmissions={107.237389}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3UpstreamData}
          />

          <DataTable
            title="Downstream Activities"
            totalEmissions={206.723297}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3DownstreamData}
          />

          <DataTable
            title="Waste Disposal"
            totalEmissions={4.606446}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3WasteData}
          />

          <DataTable
            title="Water Supply"
            totalEmissions={93.849879}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3WaterSupplyData}
          />

          <DataTable
            title="Water Treatment"
            totalEmissions={165.871319}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3WaterTreatmentData}
          />

          <DataTable
            title="Business Travel (Air)"
            totalEmissions={85.780954}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3TravelAirData}
          />

          <DataTable
            title="Business Travel (Sea)"
            totalEmissions={11.8335}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3TravelSeaData}
          />

          <DataTable
            title="Business Travel (Land)"
            totalEmissions={1.231542}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "type", label: "Type" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Consumption" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3TravelLandData}
          />

          <DataTable
            title="Hotel Stay"
            totalEmissions={20.4363}
            columns={[
              { key: "date", label: "Date" },
              { key: "entryPeriod", label: "Entry Period" },
              { key: "siteName", label: "Site Name" },
              { key: "nameOfCountry", label: "Country" },
              { key: "unitOfMeasure", label: "Unit of Measure" },
              { key: "consumption", label: "Room Nights" },
              { key: "source", label: "Source" },
              { key: "emissionFactor", label: "Emission Factor" },
            ]}
            data={scope3HotelData}
          />
        </div>
        </div>
      </main>

      {/* AI Sidebar */}
      <div className="fixed right-0 top-0 h-full z-50">
        <AISidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          contextData={contextData}
          pageType="ghg-report"
          title="AI Companion"
        />
      </div>
    </div>
  );
}
