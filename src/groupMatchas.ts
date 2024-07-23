import { Matcha } from './getAvailableMatchas';

export const groupMatchas = (matchas: Matcha[]) => {
  return matchas.reduce((acc, matcha) => {
    if (!acc[matcha.type]) {
      acc[matcha.type] = [];
    }
    acc[matcha.type].push(matcha);
    return acc;
  }, {} as Record<string, Matcha[]>);
};
