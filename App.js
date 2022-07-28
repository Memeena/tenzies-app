import React from "react";
import Die from "./components/Die/Die";
import "./App.css";
import { nanoid } from "nanoid";

import Confetti from "react-confetti";
// import { setSelectionRange } from "@testing-library/user-event/dist/utils";
// import { useStopWatch } from "react-timer-hook";
// import matchers from "@testing-library/jest-dom/matchers";

function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rollCount, setRollCount] = React.useState(0);
  const [time, setTime] = React.useState({ min: 0, sec: 0 });
  const [isActive, setIsActive] = React.useState(true);
  const [storedTime, setStoredTime] = React.useState(
    () => JSON.parse(localStorage.getItem("storedTime")) || { min: 0, sec: 0 }
  );

  //Implementing Reset function for Timer
  function reset() {
    const resetTime = {
      min: 0,
      sec: 0,
    };
    setTime(resetTime);
    setIsActive(!isActive);
  }

  React.useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => {
          let newMin = prev.sec < 59 ? prev.min : prev.min + 1;
          let newSec = prev.sec < 59 ? prev.sec + 1 : 0;
          return {
            min: newMin,
            sec: newSec,
          };
        });
      }, 1000);
    } else if (!isActive && time.sec !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time.sec]);

  React.useEffect(() => {
    const result =
      dice.every((die) => die.isHeld === true) &&
      dice.every((die) => die.value === dice[0].value);
    if (result) {
      //Comparing the time taken for that particular game with the local storage time and storing the new time if it is the best time.
      if (time.min < storedTime.min || (!storedTime.min && !storedTime.sec)) {
        localStorage.setItem("storedTime", JSON.stringify(time));
        setStoredTime(time);
      } else if (time.min === storedTime.min) {
        if (time.sec < storedTime.sec) {
          localStorage.setItem("storedTime", JSON.stringify(time));
          setStoredTime(time);
        }
      }
      setTenzies(true);
      reset();
    }
  }, [dice]);

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push({
        id: nanoid(),
        value: Math.trunc(Math.random() * 6) + 1,
        isHeld: false,
      });
    }

    return newDice;
  }

  function rollDice(event) {
    if (event.target.innerText === "New Game") {
      //Resetting the variables for New Game
      setDice(allNewDice);
      setRollCount(0);
      reset();
      setTenzies(false);
    } else {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld
            ? die
            : {
                id: nanoid(),
                value: Math.trunc(Math.random() * 6) + 1,
                isHeld: false,
              };
        })
      );
      setRollCount((prevCount) => prevCount + 1);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        if (die.id === id) {
          return { ...die, isHeld: !die.isHeld };
        } else {
          return die;
        }
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      isHeld={die.isHeld}
      value={die.value}
      key={die.id}
      // id={die.id}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <div className="app">
      <main className="main">
        {tenzies && <Confetti></Confetti>}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice-container">{diceElements}</div>
        <div className="buttons">
          <button className="button" onClick={(event) => rollDice(event)}>
            {tenzies ? "New Game" : "Roll"}
          </button>
        </div>

        {/* Extra Credit Idea #2 - Implementing Roll Count */}
        <p className="rollCount">Rolls: {rollCount}</p>

        {/* Extra Credit Idea #3 - Implementing Timer */}
        <p className="time">
          Time: {time.min}:{time.sec}
        </p>
        {/* Extra Credit Idea #4 - Storing Best time in the local Storage */}
        <p>
          Best time: {storedTime.min}:{storedTime.sec}
        </p>
      </main>
    </div>
  );
}

export default App;
