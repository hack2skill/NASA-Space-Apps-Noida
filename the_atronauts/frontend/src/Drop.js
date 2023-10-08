import { useEffect, useState } from "react";

function Drop({left}) {
  const [top, setTop] = useState(50);

  setInterval(() => {
    setTop(top+1);
  }, 1000);

  return (
    <div
      className={`absolute w-2 h-4 bg-gray-700 rounded-full top-[${top}px] left-[${left}px]`}
    ></div>
  );
}

export default Drop;
