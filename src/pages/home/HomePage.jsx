import axios from "axios";
import { useEffect, useState } from "react";

export const HomePage = () => {
  const [weather, setWeather] = useState(null);

  const getRes = async () => {
    const res = await axios.get(import.meta.env.VITE_API_URL + "/current.json", {
      params: {
        key: import.meta.env.VITE_API_KEY,
        q: "Liberec",
        lang: "cs"
      }
    });
    return res.data.current;
  }

  useEffect(() => {
    const data = getRes();
    console.log(data);
    setWeather(data);
  }, []);

  return (
    <>
      {weather ?
        <div>
          <h3>{weather?.condition?.text}</h3>
          <img src={"https:" + weather?.condition?.icon} alt="" />
        </div> :
        <h1>Načítání</h1>
      }
    </>
  )
}
