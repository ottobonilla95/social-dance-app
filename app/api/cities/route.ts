import mongoose from "mongoose";
import City from "@/src/data/models/city";
import Country from "@/src/data/models/country";
import data from "./cities.json";

const majorCities = [
  {
    name: "New York",
    countryName: "United States",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: "London",
    countryName: "United Kingdom",
    latitude: 51.5074,
    longitude: -0.1278,
  },
  {
    name: "Tokyo",
    countryName: "Japan",
    latitude: 35.6895,
    longitude: 139.6917,
  },
];

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");

    // Major cities list
    const majorCities = [
      {
        name: "New York",
        countryName: "United States",
        latitude: 40.7128,
        longitude: -74.006,
      },
      {
        name: "Los Angeles",
        countryName: "United States",
        latitude: 34.0522,
        longitude: -118.2437,
      },
      {
        name: "London",
        countryName: "United Kingdom",
        latitude: 51.5074,
        longitude: -0.1278,
      },
      {
        name: "Paris",
        countryName: "France",
        latitude: 48.8566,
        longitude: 2.3522,
      },
      {
        name: "Tokyo",
        countryName: "Japan",
        latitude: 35.6895,
        longitude: 139.6917,
      },
      {
        name: "Beijing",
        countryName: "China",
        latitude: 39.9042,
        longitude: 116.4074,
      },
      {
        name: "Sydney",
        countryName: "Australia",
        latitude: -33.8688,
        longitude: 151.2093,
      },
      {
        name: "Mumbai",
        countryName: "India",
        latitude: 19.076,
        longitude: 72.8777,
      },
      {
        name: "São Paulo",
        countryName: "Brazil",
        latitude: -23.5505,
        longitude: -46.6333,
      },
      {
        name: "Johannesburg",
        countryName: "South Africa",
        latitude: -26.2041,
        longitude: 28.0473,
      },
    ];

    // Fetch capitals for less significant countries
    const randomCapitals = data.map((country: any) => ({
      name: country.capital?.[0] || "Unknown",
      countryName: country.name.common,
      latitude: country.latlng?.[0] || 0,
      longitude: country.latlng?.[1] || 0,
    }));

    // Combine lists
    const allCitiesToAdd = [...majorCities, ...randomCapitals];

    const citiesToAdd = await Promise.all(
      allCitiesToAdd.map(async (city) => {
        const country = await Country.findOne({ name: city.countryName });
        if (!country) {
          console.warn(
            `Country ${city.countryName} not found. Skipping city ${city.name}.`
          );
          return null; // Skip cities without a valid country
        }
        return {
          name: city.name,
          countryId: country._id,
          latitude: city.latitude,
          longitude: city.longitude,
        };
      })
    );

    // Filter out any null results (cities without a valid country)
    const validCitiesToAdd = citiesToAdd.filter((city) => city !== null);

    const addedCities = await City.insertMany(validCitiesToAdd);
    return new Response(JSON.stringify({ addedCities }), { status: 200 });
  } catch (error) {
    console.error("Error populating cities:", error);
    return new Response(JSON.stringify({ error: "Error populating cities." }), {
      status: 500,
    });
  }
}
