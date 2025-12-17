import { Participant, HOURS_PER_DAY, DAYS_PER_YEAR } from './types';

export const calculateRatePerSecond = (salary: number): number => {
  // Salary / Days / Hours / Seconds in an hour
  return salary / DAYS_PER_YEAR / HOURS_PER_DAY / 3600;
};

export const parseCSVData = (csvText: string): Participant[] => {
  const lines = csvText.trim().split('\n');
  const participants: Participant[] = [];

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    // Détection intelligente du séparateur
    // 1. Tabulation (Copier-coller Excel direct)
    // 2. Point-virgule (CSV Français)
    // 3. Virgule (CSV Standard)
    let parts: string[] = [];
    
    if (line.includes('\t')) {
      parts = line.split('\t');
    } else if (line.includes(';')) {
      parts = line.split(';');
    } else {
      parts = line.split(',');
    }

    parts = parts.map(s => s.trim());
    
    // On s'attend à au moins 3 colonnes : Nom, Titre, Salaire
    if (parts.length >= 3) {
      const name = parts[0];
      const title = parts[1];
      let salaryStr = parts[2];

      // Nettoyage du salaire pour supporter le format français (ex: "50 000,00 €") ou US
      // 1. Enlever les espaces insécables ou normaux et symboles monétaires
      salaryStr = salaryStr.replace(/[\s€$]/g, '');
      // 2. Remplacer la virgule décimale par un point (convention FR)
      salaryStr = salaryStr.replace(',', '.');
      // 3. Garder uniquement chiffres et point
      salaryStr = salaryStr.replace(/[^0-9.]/g, '');

      const salary = parseFloat(salaryStr);

      if (!isNaN(salary) && salary > 0) {
        participants.push({
          id: crypto.randomUUID(),
          name,
          title,
          annualSalary: salary,
          ratePerSecond: calculateRatePerSecond(salary)
        });
      }
    }
  });

  return participants;
};

export const formatCurrency = (amount: number): string => {
  // Utilisation de fr-CA (Français Canada) pour avoir le format "$ 1 200,50" ou "1 200,50 $"
  // C'est le plus adapté pour afficher du Dollar dans une interface en français.
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol', // Affiche "$" au lieu de "$US"
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');
  
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

export const getWittyRemark = (cost: number): string => {
  if (cost < 10) return "C'est parti mon kiki...";
  if (cost < 50) return "Le compteur tourne...";
  if (cost < 100) return "Ça commence à chiffrer.";
  if (cost < 500) return "Productivité ou papotage ?";
  if (cost < 1000) return "Aïe, le budget formation y passe.";
  if (cost < 5000) return "Il va falloir vendre un rein.";
  return "Appelez le banquier !";
};