import axios from "axios";
import { useEffect, useState } from "react";
import "./assets/style.scss";
import { IconLoader2, IconSearch } from "@tabler/icons-react";

const getData = async (setData, type, lat, lng, city, setLoading) => {
  setLoading(true);
  if (city) {
    window.localStorage.setItem("city", city);
  }
  await axios.get(import.meta.env.VITE_API_URL + "/" + type + ".json", {
    params: {
      key: import.meta.env.VITE_API_KEY,
      q: (!city || city === "") ? lat + "," + lng : city,
      lang: "cs",
    }
  })
    .then((res) => {
      setLoading(false);
      if (setData) return setData(res.data);
      return res.data;
    })
    .catch((err) => {
      setLoading(false);
      console.log(err);
      setData({ error: true });
    });
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

function App() {
  const [weather, setWeather] = useState(null);
  const [lastWeather, setLastWeather] = useState(null);
  const [citySearch, setCitySearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTab, setSearchTab] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        function(position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const city = window.localStorage.getItem("city");
          getData(setWeather, "current", lat, lng, city, setLoading);
        },
        function(error) {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (!weather?.error) {
      setLastWeather(weather);
      if (weather?.location.name !== lastWeather?.location.name) {
        setCitySearch(weather?.location.name);
      }
    }
  }, [weather])

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
      {loading ?
        <div className="card loading">
          <IconLoader2 size={48} stroke={1.5} />
        </div> :
        <>
          {(weather && !weather?.error) ?
            <div className="card">
              {searchTab &&
                <>
                  <div className="overlay" onClick={() => setSearchTab(false)}>
                  </div>
                  <div className="searchBar">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        getData(setWeather, "current", null, null, citySearch, setLoading);
                        setSearchTab(false)
                      }}
                    >
                      <input
                        type="text"
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        disabled={loading}
                        placeholder="Zadejte město"
                      />
                      <button
                        type="submit"
                        disabled={citySearch.length < 4}
                      >
                        <IconSearch size={24} stroke={1.5} />
                      </button>
                    </form>
                  </div>
                </>
              }
              <div className="card__topInfo">
                <div className="city" onClick={() => setSearchTab(true)}>
                  <p>
                    {weather?.location.name}
                  </p>
                  <IconSearch size={16} stroke={1.5} /></div>
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
      }
    </>
  )
}

export default App
