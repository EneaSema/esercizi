// src/utils/reducer.js (Crea un nuovo file)

// Stato Iniziale (uguale a quello attuale)
export const initialState = {
  displayValue: "0",
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false,
};

// Tipi di Azione
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATOR: "choose-operator",
  EVALUATE: "evaluate",
  CLEAR: "clear",
  MEMORY_RECALL: "memory-recall", // Per il tasto 'M'
};

// src/utils/reducer.js (Continuazione)
import { calculate } from "./calculate"; // Assicurati di importare calculate

function performCalculation(state, secondOperand) {
  if (state.firstOperand === null || state.operator === null) return state;

  const result = calculate(state.firstOperand, state.operator, secondOperand);

  // Gestione errore (rimane una stringa)
  if (typeof result === "string") {
    return { ...initialState, displayValue: result };
  }

  // Logica di formattazione (Intero vs. Decimale)
  let finalResult = Number(result.toFixed(10));
  const newDisplayValue = Number.isInteger(finalResult)
    ? String(finalResult)
    : finalResult.toLocaleString("en-US", { maximumFractionDigits: 10 });

  // Aggiorna localStorage
  localStorage.setItem("calculatorMemory", String(result));

  return {
    // Il risultato diventa il nuovo firstOperand, pronto per il prossimo calcolo
    firstOperand: finalResult,
    displayValue: newDisplayValue,
    operator: null,
    waitingForSecondOperand: false,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      const digit = action.payload.digit;

      // Logica del Punto Decimale e del Secondo Operando
      if (digit === "." && state.displayValue.includes(".")) return state;

      if (state.waitingForSecondOperand) {
        return {
          ...state,
          displayValue: digit === "." ? "0." : digit,
          waitingForSecondOperand: false,
        };
      }
      return {
        ...state,
        displayValue:
          state.displayValue === "0" && digit !== "."
            ? digit
            : state.displayValue + digit,
      };

    case ACTIONS.CHOOSE_OPERATOR:
      const newOperator = action.payload.operator;
      const currentInputValue = parseFloat(state.displayValue);

      // CASO 1: Primo operatore (5 + )
      if (state.firstOperand === null) {
        return {
          ...state,
          operator: newOperator,
          firstOperand: currentInputValue,
          waitingForSecondOperand: true,
        };
      }

      // CASO 2: Calcolo concatenato (5 + 3 + )
      if (state.operator) {
        const newStateAfterCalc = performCalculation(state, currentInputValue);

        // Se il risultato del calcolo intermedio è un errore, ritorniamo l'errore
        if (
          typeof newStateAfterCalc.displayValue === "string" &&
          newStateAfterCalc.displayValue === "Error"
        ) {
          return initialState; // O ritorniamo lo stato di errore completo
        }

        return {
          ...newStateAfterCalc, // Contiene il risultato (8) in .firstOperand e .displayValue
          operator: newOperator, // Salviamo il nuovo operatore (+)
          waitingForSecondOperand: true, // Aspettiamo il prossimo numero (2)
        };
      }

      // CASO 3: firstOperand esiste ma l'operatore no (raro)
      return {
        ...state,
        operator: newOperator,
        waitingForSecondOperand: true,
      };
      if (state.firstOperand === null) {
        // Salviamo il primo numero e l'operatore
        return {
          ...state,
          operator: action.payload.operator,
          firstOperand: parseFloat(state.displayValue),
          waitingForSecondOperand: true,
        };
      }
      // Se c'è già un operatore, eseguiamo prima il calcolo intermedio
      if (state.operator) {
        const secondOperand = parseFloat(state.displayValue);
        const newState = performCalculation(state, secondOperand);

        return {
          ...newState,
          operator: action.payload.operator,
          waitingForSecondOperand: true,
          // Il risultato è già in newState.firstOperand
        };
      }
      return state; // Nel caso in cui l'operatore fosse nullo, ma firstOperand no (caso raro)

    case ACTIONS.EVALUATE:
      const secondOperand = parseFloat(state.displayValue);
      // Esegui il calcolo finale e formatta
      return performCalculation(state, secondOperand);

    case ACTIONS.CLEAR:
      return initialState;

    case ACTIONS.MEMORY_RECALL:
      const memory = localStorage.getItem("calculatorMemory");
      if (!memory) return state;
      return {
        ...state,
        displayValue: memory,
        waitingForSecondOperand: false,
      };

    default:
      return state;
  }
}
