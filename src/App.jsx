import Button from "./components/Button";
import { useState } from "react";
import { calculate } from "./utils/calculate.js";

export default function App() {
  const [startValue, setStartValue] = useState(`0`);
  const [firstValue, setFirstValue] = useState(null);
  const [selectOperator, setSelectOperator] = useState(null);
  const [waitingSecondValue, setWaitingSecondValue] = useState(false);

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const operators = [`+`, `-`, `*`, `/`];

  const handleNumberClick = (number) => {
    if (number === `.` && startValue.includes(`.`)) {
      return;
    }
    if (waitingSecondValue) {
      setStartValue(number === `.` ? `0.` : number);
      setWaitingSecondValue(false);
    } else {
      setStartValue(
        startValue === `0` && number !== `.` ? number : startValue + number
      );
    }
  };

  const handleClearClick = () => {
    setStartValue(`0`);
    setFirstValue(null);
    setSelectOperator(null);
    setWaitingSecondValue(false);
  };

  const handleOperatorClick = (nextOperator) => {
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
  };
  const handleEqualsClick = () => {
    if (selectOperator === null || firstValue === null) {
      return;
    }
    const secondValue = parseFloat(startValue);
    const result = calculate(firstValue, selectOperator, secondValue);

    if (typeof result === `string` || result === `Error`) {
      setStartValue(result);
    } else {
      setStartValue(String(Number(result).toFixed(2)));
    }

    setFirstValue(null);
    setSelectOperator(null);
    setWaitingSecondValue(false);
  };

  const handleButtonClick = (value) => {
    const val = String(value);

    if (val === `.` || (val >= `0` && val <= `9`)) {
      handleNumberClick(val);
    } else if (operators.includes(val)) {
      handleOperatorClick(val);
    } else if (val === `=`) {
      handleEqualsClick(val);
    } else if (val === `C`) {
      handleClearClick(val);
    }
  };

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
            </div>
            <div className="operatori">
              {operators.map((operator) => (
                <Button
                  key={operator}
                  label={operator}
                  onClick={handleButtonClick}
                />
              ))}
              <Button key="." label="." onClick={handleButtonClick} />
              <Button key="C" label="C" onClick={handleButtonClick} />
              <Button key="=" label="=" onClick={handleButtonClick} />
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
