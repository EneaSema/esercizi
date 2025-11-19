import React from "react";

function Button({ label, onClick }) {
  const value = String(label);
  return (
    <>
      <button onClick={() => onClick(label)}>{label}</button>
    </>
  );
}

export default React.memo(Button);
