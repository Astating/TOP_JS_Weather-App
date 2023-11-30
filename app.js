const PUBLIC_API_KEY = "9e58ea82677b4ac1a78115241233011";
const WEATHER_API_URL = "https://api.weatherapi.com/v1/current.json";

const fetchWeatherByLocation = async (location) =>
  fetch(
    WEATHER_API_URL +
    "?" +
    new URLSearchParams({ q: location, key: PUBLIC_API_KEY }),
  )
    .then((res) => res.json())
    .then(selectWeatherFields);

const selectWeatherFields = ({ location, current }) => ({
  name: location.name,
  country: location.country,
  temperature: { celsius: current.temp_c, fahrenheit: current.temp_f },
  description: current.condition.text,
  icon: current.condition.icon,
});

const DOM = {
  body: document.querySelector("body"),
  form: document.querySelector("form"),
  output: document.querySelector("output"),

  name: document.querySelector("#name"),
  country: document.querySelector("#country"),

  temperature: document.querySelector("#temperature"),

  icon: document.querySelector("#icon"),
  description: document.querySelector("#description"),

  alt: document.querySelector("#photo-alt"),
  photographer: document.querySelector("#photographer"),

  displayWeatherData: (data, tempSign) =>
    Object.entries(data).map(([key, value]) => {
      if (key === "icon") {
        DOM.icon.setAttribute("src", value);
      } else {
        DOM[key].textContent =
          key === "temperature"
            ? value[tempSign].toLocaleString("en-US", {
              style: "unit",
              unit: tempSign,
            })
            : value;
      }
    }),

  displayBackgroundImageAndInfo: ({ alt, photographer, original }) => {
    DOM.body.style.backgroundImage = `url(${original})`;

    DOM.alt.textContent = alt;
    DOM.photographer.textContent = photographer;

    console.log(DOM.photographer.textContent);
  },
};

DOM.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = new FormData(event.target);

  const weatherData = await fetchWeatherByLocation(input.get("location"));

  DOM.displayWeatherData(weatherData, input.get("tempSign"));
  DOM.displayBackgroundImageAndInfo(
    await fetchBackgroundImgByNameAndCountry(
      weatherData.name,
      weatherData.country,
    ),
  );
});

const PEXEL_API_KEY =
  "de6BMyIYYWK8p6CBnC5QBHPmm5h1h01LiNQA3ZG4LPtu3sDS4VZXXrHj";

const fetchBackgroundImgByNameAndCountry = async (name, country) => {
  const data = await fetch(
    `https://api.pexels.com/v1/search?query="${name} ${country}"`,
    {
      headers: { Authorization: PEXEL_API_KEY },
    },
  ).then((res) => {
    return res.json();
  });

  const {
    alt,
    photographer,
    src: { original },
  } = data.photos.at(Math.floor(Math.random() * data.photos.length));

  console.log({ alt, photographer, original });

  return { alt, photographer, original };
};

window.onload = () => DOM.form.requestSubmit();
