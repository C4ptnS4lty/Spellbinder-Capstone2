function isWithinColorIdentity(cardColors, commanderColors) {
  if (!cardColors || cardColors.length === 0) return true;
  return cardColors.every(color => commanderColors.includes(color));
}

export function validateDeckLegality(commanderData, cardDetails) {
  const legalityReasons = [];
  let legal = true;

  const commanderColorIdentity = commanderData.color_identity || [];
  const expectedCardCount = 99;

  if (!cardDetails || cardDetails.length !== expectedCardCount + 1) {
    legalityReasons.push(`Commander deck must contain exactly 100 cards.`);
    legal = false;
  }

  for (const card of cardDetails.slice(1)) {
    if (!isWithinColorIdentity(card.color_identity, commanderColorIdentity) &&
        card.type_line && !card.type_line.includes('Basic Land')) {
      legalityReasons.push(`Card "${card.name}" violates the commander's color identity.`);
      legal = false;
    }
  }

  const cardNames = {};
  for (const card of cardDetails.slice(1)) {
    if (card.type_line && !card.type_line.includes('Basic Land')) {
      if (cardNames[card.name]) {
        legalityReasons.push(`Deck contains duplicate card name: "${card.name}".`);
        legal = false;
        break;
      }
      cardNames[card.name] = true;
    }
  }

  for (const card of cardDetails) {
    if (card.legalities && card.legalities.commander !== 'legal') {
      legalityReasons.push(`Card "${card.name}" is not legal in Commander.`);
      legal = false;
    }
  }

  return { legal, legalityReasons };
}
