import { useNavigate } from "react-router-dom";
import React, { useEffect,useState } from "react";
import { displayStorage} from "../utils/storage";
import { ALL_STORAGES, CUR_ITEM_LIST, CUR_USER } from "../config/localStorage"
import { checkUserLogin } from "../utils/users"
import { getWindowDimensions } from "../utils/display";



function Home() {

  const allStorageDataStr = localStorage.getItem(ALL_STORAGES)
  const allStorageData = JSON.parse(allStorageDataStr)
  localStorage.setItem(CUR_ITEM_LIST, JSON.stringify([]))
  const currentUserStr = localStorage.getItem(CUR_USER)
  const navigate = useNavigate();

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions);
  const {width, height} = windowDimensions;

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    checkUserLogin(currentUserStr, navigate)
  }, [currentUserStr, navigate])

  return (
    <div className="container w-90" style={{  padding: 32, height: height-70, width:width }}>
      <div className="row row-cols-auto" style = {{animation: "moveToRight 1s",margin:"auto"}}>
        {displayStorage(allStorageDataStr, allStorageData, navigate)}
      </div>
    </div>

  )
}
export default Home;