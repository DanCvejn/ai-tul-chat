import axios from "axios";
import { useEffect, useState } from "react";

const getData = async (setData, type, lat, lng) => {
  const res = await axios.get(import.meta.env.VITE_API_URL + "/" + type + ".json", {
    params: {
      key: import.meta.env.VITE_API_KEY,
      q: lat + "," + lng,
      lang: "cs",
    }
  });
  if (setData) return setData(res.data);
  return res.data;
}

const images = [
  {
    name: "Slunečno, Místy blízký déšť, Jasno",
    options: true,
    imgOptions: {
      day: "/day/clear-day.svg",
      night: "/night/clear-night.svg"
    },
  },
  {
    name: "Opar",
    options: true,
    imgOptions: {
      day: "/day/haze-day.svg",
      night: "/night/haze-night.svg",
    }
  },
  {
    name: "Mlha",
    options: true,
    imgOptions: {
      day: "/day/fog-day.svg",
      night: "/night/fog-night.svg",
    }
  },
  {
    name: "Déšť",
    img: "/rain.svg",
    options: false,
  },
  {
    name: "Bouřka",
    img: "/thunderstorms.svg",
    options: false,
  },
  {
    name: "Sněžení",
    img: "/snow.svg",
    options: false,
  },
  {
    name: "Mlha",
    options: true,
    imgOptions: {
      day: "/day/clear-day.svg",
      night: "/night/clear-night.svg",
    }
  },
  {
    name: "Zataženo",
    img: "/cloudy.svg",
    options: false,
  },
  {
    name: "Oblačno",
    options: true,
    imgOptions: {
      day: "/day/overcast-day.svg",
      night: "/night/overcast-night.svg",
    }
  },
  {
    name: "Částečně oblačno",
    options: true,
    imgOptions: {
      day: "/day/partly-cloudy-day.svg",
      night: "/night/partly-cloudy-night.svg",
    }
  },
];

const windDirections = {
  "N": "Sever",
  "NE": "Severo-východ",
  "E": "Východ",
  "SE": "Jiho-východ",
  "S": "Jih",
  "SW": "Jiho-západ",
  "W": "Západ",
  "NW": "Severo-západ",
}

export const HomePage = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        function(position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          getData(setWeather, "current", lat, lng);
        },
        function(error) {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const getImage = () => {
    let selected = images.find(image => { return image.name.includes(weather?.current.condition.text) });
    let source = "/img";
    if (selected.options) {
      if (weather?.current.is_day === 1) source += selected.imgOptions.day;
      else source += selected.imgOptions.night;
    } else source += selected.img;
    return source;
  }

  const getDirection = () => {
    const keys = Object.keys(windDirections);
    const selectedKey = keys.find(key => { return weather?.current.wind_dir.includes(key) });
    return windDirections[selectedKey];
  }

  return (
    <>
      {weather ?
        <div className="card">
          <div className="card__topInfo">
            <p className="city">{weather?.location.name}</p>
            <p className="time">{weather?.location.localtime.split(" ")[1]}</p>
          </div>
          <div className="card__mainInfo">
            <img
              src={getImage()}
              alt=""
            />
            <h3>{weather?.current.condition.text}</h3>
          </div>
          <div className="card__bottomInfo">
            <div>
              <div className="line">
                <img src="./img/humidity.svg" alt="Rychlost větru" />
                <p>{weather?.current.humidity}%</p>
              </div>
              <div className="line">
                <img src="./img/wind.svg" alt="Rychlost větru" />
                <p>{weather?.current.wind_kph} km/h</p>
              </div>
              <div className="line">
                <img src="./img/compass.svg" alt="Rychlost větru" />
                <p>{getDirection()}</p>
              </div>
            </div>
            <div>
              <p className="temperature">
                {weather?.current.temp_c}
              </p>
              <p className="feelslike">
                Pocitová: {weather?.current.feelslike_c} °C
              </p>
            </div>
          </div>
        </div> :
        <div className="card not-available">
          <img src="./img/not-available.svg" alt="načítání" />
        </div>
      }
    </>
  )
}
