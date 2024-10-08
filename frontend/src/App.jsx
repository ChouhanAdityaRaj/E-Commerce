import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useEffect } from "react";
import { apiHandler } from "./utils";
import userService from "./services/user";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";

function App() {
  
  const dispatch = useDispatch()

  useEffect(() => {
    
    (async () => {
      const [response, error] = await apiHandler(userService.currentUser());
      
      if(response){
        dispatch(login(response.data));
      }

      if(error){
        dispatch(logout());
      }
    })()
  }, [])
  
  return (
      <RouterProvider router={router}/>
  )
}

export default App
