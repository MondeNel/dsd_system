import { INDICATORS, SERVICE_OPTIONS } from '../constants';

/**
 * Parse a natural language sentence and return a prefill object
 * that matches the form structure.
 */
export function parseRequest(text) {
  const lower = text.toLowerCase();

  // 1. Find indicator
  let indicator = '';
  for (const ind of INDICATORS) {
    if (lower.includes(ind.toLowerCase())) {
      indicator = ind;
      break;
    }
  }

  // 2. Extract numbers for male / female
  // Patterns like "5 males", "3 females", "males: 5", "male 5"
  const maleMatch = lower.match(/(\d+)\s*(?:males|men|boys)/) || lower.match(/(?:males|men|boys)[:\s]*(\d+)/);
  const femaleMatch = lower.match(/(\d+)\s*(?:females|women|girls)/) || lower.match(/(?:females|women|girls)[:\s]*(\d+)/);
  const male = maleMatch ? parseInt(maleMatch[1], 10) : 0;
  const female = femaleMatch ? parseInt(femaleMatch[1], 10) : 0;

  // 3. Age group extraction
  const ageMatches = {
    age0_18: 0,
    age19_35: 0,
    age36_59: 0,
    age60plus: 0,
  };

  // Try patterns like "3 children", "2 youth", "1 elderly", "4 adults 19-35", etc.
  const age0 = lower.match(/(\d+)\s*(?:children|kids|0.?18|under\s*19)/);
  const age19 = lower.match(/(\d+)\s*(?:youth|young adults|19.?35)/);
  const age36 = lower.match(/(\d+)\s*(?:adults|middle|36.?59)/);
  const age60 = lower.match(/(\d+)\s*(?:elderly|seniors|60\+|over\s*59)/);

  if (age0) ageMatches.age0_18 = parseInt(age0[1], 10);
  if (age19) ageMatches.age19_35 = parseInt(age19[1], 10);
  if (age36) ageMatches.age36_59 = parseInt(age36[1], 10);
  if (age60) ageMatches.age60plus = parseInt(age60[1], 10);

  // If no explicit age groups but we have total participants, distribute proportionally
  const totalFromGender = male + female;
  if (Object.values(ageMatches).every((v) => v === 0) && totalFromGender > 0) {
    ageMatches.age0_18 = Math.round(totalFromGender * 0.2);
    ageMatches.age19_35 = Math.round(totalFromGender * 0.5);
    ageMatches.age36_59 = Math.round(totalFromGender * 0.2);
    ageMatches.age60plus = totalFromGender - ageMatches.age0_18 - ageMatches.age19_35 - ageMatches.age36_59;
  }

  // 4. Services
  const services = {};
  for (const svc of SERVICE_OPTIONS) {
    const svcLower = svc.toLowerCase();
    if (lower.includes(svcLower)) {
      // Check for a number next to the service like "2 marriage counselling"
      const beforeNum = lower.match(new RegExp(`(\\d+)\\s*${svcLower}`));
      const afterNum = lower.match(new RegExp(`${svcLower}\\s*(\\d+)`));
      const val = beforeNum ? parseInt(beforeNum[1], 10) : afterNum ? parseInt(afterNum[1], 10) : 1;
      services[svc] = val;
    } else {
      services[svc] = 0;
    }
  }

  // 5. Reporting month (try "April 2026" or "next month" etc.)
  let reportingMonth = 'April 2026'; // default
  const monthMatch = lower.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}/i);
  if (monthMatch) reportingMonth = monthMatch[0].replace(/^./, (c) => c.toUpperCase());

  return {
    indicator,
    male,
    female,
    ...ageMatches,
    services,
    reportingMonth,
  };
}