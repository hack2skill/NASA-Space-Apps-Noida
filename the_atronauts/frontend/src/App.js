import landscape from "./images/landscape.png";
import clouds from "./images/clouds.png";
import sun from "./images/sun.png";
import Drop from "./Drop";

const App = () => {
  return (
    <div className="w-[99vw] h-[98vh] flex bg-green-200 m-1 p-5 border-2 border-green-700">
      <div className=" relative">
        <img className="w-[98%] h-[100%] rounded-md" src={landscape} />
        <img
          src={clouds}
          className="absolute w-[400px] h-[150px] top-5 left-10"
        />
        <img src={sun} className="absolute w-[150px] top-5 right-[290px] " />
        <div className="absolute w-[200px] h-[450px] top-[150px] left-[60px]">
        <div className="relative w-[200px] h-[450px]">
          <Drop left={10}/>
          <Drop left={20}/>
          <Drop left={30}/>
          <Drop left={40}/>
          <Drop left={50}/>
          <Drop left={60}/>
          <Drop left={70}/>
          <Drop left={80}/>
          <Drop left={90}/>
        </div>
        </div>
      </div>
      <div className="w-[40%] border-2 rounded-md p-4 border-blue-700">
        <div>buttons</div>
        <div>
          <div>Graph 1</div>
          <div>Graph 2</div>
        </div>
      </div>
    </div>
  );
};

export default App;
