
import './App.css';
import Chatbot from './Chatbot';
import Page from "../src/components/Page"
import Quiz from "../src/components/Quiz/Quiz"
import Sim from './Sim';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Page/></>,
    },
    {
      path: "/sim",
      element: <><Sim/></>,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
