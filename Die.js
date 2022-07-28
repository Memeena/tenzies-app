import React from "react";
import "./die.css";

const Pip = () => <span className="pip" />;

export default function Die(props) {
  const style = {
    backgroundColor: props.isHeld ? "#59E391" : "#fff",
  };

  //Extra credit Idea #1 - Implementing dice dots for value
  //-------------------------------------------------------

  let pips = Number.isInteger(props.value)
    ? Array(props.value)
        .fill(0)
        .map((_, i) => <Pip key={i} />)
    : null;
  return (
    <div className="face" style={style} onClick={props.holdDice}>
      {pips}
    </div>
  );
}
