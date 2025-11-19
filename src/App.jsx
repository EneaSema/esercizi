// IMPORT

import Button from "./components/Button";
import { useReducer } from "react";
import { reducer, initialState, ACTIONS } from "./utils/reducer";

export default function App() {
  // Sostituiamo tutti gli useState con un unico useReducer
  const [state, dispatch] = useReducer(reducer, initialState);

  const { displayValue } = state; // Estraiamo solo il displayValue per il rendering

  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];
  const operators = ["/", "*", "-", "+"];

  // La logica si semplifica drasticamente!

  const handleButtonClick = (value) => {
    const val = String(value);

    // 1. Numeri e Punto
    if (val === "." || (val >= "0" && val <= "9")) {
      dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: val } });
    }
    // 2. Operatori
    else if (operators.includes(val)) {
      dispatch({ type: ACTIONS.CHOOSE_OPERATOR, payload: { operator: val } });
    }
    // 3. Uguale
    else if (val === "=") {
      dispatch({ type: ACTIONS.EVALUATE });
    }
    // 4. Clear
    else if (val === "C") {
      dispatch({ type: ACTIONS.CLEAR });
    }
    // 5. Memoria
    else if (val === "M") {
      dispatch({ type: ACTIONS.MEMORY_RECALL });
    }
  };

  return (
    <>
      <header>
        <h1>Calcolatrice</h1>
      </header>
      <main>
        <div className="container">
          <div className="display">{displayValue}</div>
          <div className="tasti">
            <div className="numeri">
              {numbers.map((number) => (
                <Button
                  key={number}
                  label={number}
                  onClick={handleButtonClick}
                />
              ))}
              {/* Bottone 0, . e = */}
              <Button key="." label="." onClick={handleButtonClick} />
              <Button key="C" label="C" onClick={handleButtonClick} />{" "}
              {/* Spostato qui per la griglia */}
              <Button key="M" label="M" onClick={handleButtonClick} />{" "}
              {/* Spostato qui per la griglia */}
            </div>
                       {" "}
            <div className="operatori">
                           {" "}
              {operators.map((operator) => (
                <Button
                  key={operator}
                  label={operator}
                  onClick={handleButtonClick}
                />
              ))}
              <Button key="=" label="=" onClick={handleButtonClick} />{" "}
              {/* UGUALE sposta qui se vuoi una colonna intera di operatori */} 
            </div>
          </div>
        </div>
      </main>
      <footer>
        <h6>Create by Enea Sema</h6>
      </footer>
    </>
  );
}
