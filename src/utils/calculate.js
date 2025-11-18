//  funzione calcolatrice 4 operazioni base

export const calculate = (num1, operator, num2) => {
  switch (operator) {
    case `+`:
      return num1 + num2;

    case `-`:
      return num1 > num2 ? num1 - num2 : "Errore";

    case `*`:
      return num1 * num2;

    case `/`:
      return num2 === 0 ? "Errore" : num1 / num2;

    default:
      return num2;
  }
};
