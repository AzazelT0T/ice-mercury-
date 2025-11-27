import { AppSettings, Container, ContainerStatus } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  tempMin: 2.0,
  tempMax: 8.0,
  humidityMax: 60.0,
  consecutiveViolationsTrigger: 3, // Requires 3 seconds of violation
  primaryColor: 'cyan', 
  darkMode: false,
};

export const THEME_COLORS = [
  { name: 'Medical Blue', value: 'cyan' },
  { name: 'Emerald Safe', value: 'emerald' },
  { name: 'Violet Pharma', value: 'violet' },
  { name: 'Slate Professional', value: 'slate' },
];

export const INITIAL_CONTAINERS: Container[] = [
  {
    id: 'BX-1001',
    name: 'Pfizer-BioNTech Alpha',
    batchNumber: 'BATCH-8821',
    drugName: 'Comirnaty Variant',
    imageUrl: 'https://picsum.photos/id/1/200/200',
    status: ContainerStatus.STABLE,
    targetTemperature: 5.0,
    isCoolingActive: false,
    history: [],
    currentReading: { temperature: 5.0, humidity: 45, shockDetected: false, timestamp: Date.now() }
  },
  {
    id: 'BX-1002',
    name: 'Moderna Spikevax Delta',
    batchNumber: 'BATCH-9932',
    drugName: 'Spikevax',
    imageUrl: 'https://picsum.photos/id/2/200/200',
    status: ContainerStatus.STABLE,
    targetTemperature: 4.2,
    isCoolingActive: false,
    history: [],
    currentReading: { temperature: 4.2, humidity: 50, shockDetected: false, timestamp: Date.now() }
  },
  {
    id: 'BX-1003',
    name: 'Insulin Glargine Transport',
    batchNumber: 'BATCH-7711',
    drugName: 'Lantus Solostar',
    imageUrl: 'https://picsum.photos/id/3/200/200',
    status: ContainerStatus.STABLE,
    targetTemperature: 6.5,
    isCoolingActive: false,
    history: [],
    currentReading: { temperature: 6.5, humidity: 40, shockDetected: false, timestamp: Date.now() }
  },
    {
    id: 'BX-1004',
    name: 'Flu Vaccine Quadrivalent',
    batchNumber: 'BATCH-3321',
    drugName: 'Fluarix',
    imageUrl: 'https://picsum.photos/id/4/200/200',
    status: ContainerStatus.STABLE,
    targetTemperature: 3.0,
    isCoolingActive: false,
    history: [],
    currentReading: { temperature: 3.0, humidity: 35, shockDetected: false, timestamp: Date.now() }
  }
];