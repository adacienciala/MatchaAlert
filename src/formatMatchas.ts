import { Matcha } from './getAvailableMatchas';

export const formatMatchas = (matchas: Record<string, Matcha[]>) => {
  const availableMatchasString = Object.entries(matchas)
    .map(([type, links]) => {
      const linksFormatted = (links ?? [])
        .map(({ title }) => `- ${title}`)
        .join('\n');
      return `${type}:\n${linksFormatted}`;
    })
    .join('\n\n');

  return availableMatchasString;
};
