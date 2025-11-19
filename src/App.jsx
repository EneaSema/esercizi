// IMPORT

import Button from "./components/Button";
import { useEffect, useState, useCallback } from "react";
import { calculate } from "./utils/calculate.js";

export default function App() {
  // STATI
  const [startValue, setStartValue] = useState(`0`);
  const [firstValue, setFirstValue] = useState(null);
  const [selectOperator, setSelectOperator] = useState(null);
  const [waitingSecondValue, setWaitingSecondValue] = useState(false);

  // Array con le Variabili
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const operators = [`+`, `-`, `*`, `/`];
  //   Funzioni handle per gestire  le varie dinamiche:

  //  funzione per Memoria
  const handleMemoryClick = () => {
    const memory = localStorage.getItem(`calculatorMemory`);
    if (memory) {
      setStartValue(memory);
      setWaitingSecondValue(false);
    }
  };
  //   funzione di pulizia della calcolatrice, azzera tutto
  const handleClearClick = useCallback(() => {
    setStartValue(`0`);
    setFirstValue(null);
    setSelectOperator(null);
    setWaitingSecondValue(false);
  }, []);

  //  gestione con i numeri:
  const handleNumberClick = useCallback(
    (number) => {
      //  controllo del numero passato
      if (number === `.` && startValue.includes(`.`)) {
        return;
      }
      // controllo se l'attesa del secondo numero è vera,
      //  in questo caso assegno vado a settare il valore inziale con 0. oppure il numero in base al valore del numero,
      // poi  setto a falso lo stato di attesa
      if (waitingSecondValue) {
        setStartValue(number === `.` ? `0.` : number);
        setWaitingSecondValue(false);
      } else {
        setStartValue(
          startValue === `0` && number !== `.` ? number : startValue + number
        );
      }
    },
    [startValue, waitingSecondValue]
  );

  //  funzione per l'esecuzione del calcolo
  const handleEqualsClick = useCallback(() => {
    if (selectOperator === null || firstValue === null) {
      return;
    }
    const secondValue = parseFloat(startValue);
    const result = calculate(firstValue, selectOperator, secondValue);

    if (typeof result === `string` || result === `Error`) {
      setStartValue(result);
    } else {
      let finalResult = result;
      if (typeof finalResult === `number`) {
        finalResult = Number(finalResult.toFixed(10));
      }
      if (Number.isInteger(finalResult)) {
        setStartValue(finalResult);
      } else {
        setStartValue(finalResult);
      }
      localStorage.setItem(`calculatorMemory`, String(result));
      setFirstValue(null);
      setSelectOperator(null);
      setWaitingSecondValue(false);
    }
  }, [startValue, firstValue, selectOperator]);

  //  funzione in merito al salvataggio del primo numero
  const handleOperatorClick = useCallback(
    (nextOperator) => {
      const inputValue = parseFloat(startValue);
      if (firstValue === null) {
        setFirstValue(inputValue);
      } else if (selectOperator) {
        const result = calculate(firstValue, selectOperator, inputValue);
        if (typeof result === `string` && result === `Error`) {
          setStartValue(result);
          setFirstValue(null);
          setSelectOperator(null);
          setWaitingSecondValue(false);
          return;
        }
        setStartValue(String(result));
        setFirstValue(result);
      }
      setWaitingSecondValue(true);
      setSelectOperator(nextOperator);
    },
    [startValue, firstValue, selectOperator]
  );

  //  centrallizoo le precedenti funzioni qui, in base al valore del bottone cliccato
  const handleButtonClick = useCallback(
    (value) => {
      const val = String(value);

      if (val === `.` || (val >= `0` && val <= `9`)) {
        handleNumberClick(val);
      } else if (operators.includes(val)) {
        handleOperatorClick(val);
      } else if (val === `=`) {
        handleEqualsClick();
      } else if (val === `C`) {
        handleClearClick();
      } else if (val === `M`) {
        handleMemoryClick();
      }
    },
    [
      selectOperator,
      handleClearClick,
      handleEqualsClick,
      handleMemoryClick,
      handleNumberClick,
      handleOperatorClick,
    ]
  );

  useEffect(() => {}, []);

  return (
    <>
      <header>
        <h1>Calcolatrice</h1>
      </header>
      <main>
        <div className="container">
          <div className="display">{startValue}</div>
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
