import React, { useState } from "react";
import Options from "./Option";

function Question({ index, question, selectedOption, onOptionChange, onSubmit }) {
  const [qno,setqno] = useState(1);
  const handleSubmit = () =>{
    setqno(qno+1)
  }

  return (
    <div className="">
      <h3>Question No.{qno}</h3>
      <h5 className="mt-2">{question.question}</h5>
      <form onSubmit={onSubmit} className="mt-2 mb-2">
        <Options
          options={question.options}
          selectedOption={selectedOption}
          onOptionChange={onOptionChange}
        />
        <button type="submit" className="btn btn-primary mt-2" onClick={handleSubmit}>
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default Question;
