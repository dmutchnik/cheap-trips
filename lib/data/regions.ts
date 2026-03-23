import type { Airport, Region, RegionAirport } from "@/lib/types";

export const airports: Airport[] = [
  { id: "mia", iataCode: "MIA", city: "Miami", name: "Miami International", country: "United States" },
  { id: "atl", iataCode: "ATL", city: "Atlanta", name: "Hartsfield-Jackson Atlanta", country: "United States" },
  { id: "jfk", iataCode: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States" },
  { id: "lax", iataCode: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States" },
  { id: "bog", iataCode: "BOG", city: "Bogota", name: "El Dorado International", country: "Colombia" },
  { id: "med", iataCode: "MDE", city: "Medellin", name: "Jose Maria Cordova International", country: "Colombia" },
  { id: "lim", iataCode: "LIM", city: "Lima", name: "Jorge Chavez International", country: "Peru" },
  { id: "scl", iataCode: "SCL", city: "Santiago", name: "Arturo Merino Benitez", country: "Chile" },
  { id: "gig", iataCode: "GIG", city: "Rio de Janeiro", name: "Galeao International", country: "Brazil" },
  { id: "gru", iataCode: "GRU", city: "Sao Paulo", name: "Guarulhos International", country: "Brazil" },
  { id: "eze", iataCode: "EZE", city: "Buenos Aires", name: "Ministro Pistarini International", country: "Argentina" },
  { id: "sjo", iataCode: "SJO", city: "San Jose", name: "Juan Santamaria International", country: "Costa Rica" },
  { id: "lib", iataCode: "LIR", city: "Liberia", name: "Daniel Oduber Quiros International", country: "Costa Rica" },
  { id: "pty", iataCode: "PTY", city: "Panama City", name: "Tocumen International", country: "Panama" },
  { id: "gua", iataCode: "GUA", city: "Guatemala City", name: "La Aurora International", country: "Guatemala" },
  { id: "sal", iataCode: "SAL", city: "San Salvador", name: "El Salvador International", country: "El Salvador" },
];

export const regions: Region[] = [
  {
    id: "south-america",
    name: "South America",
    slug: "south-america",
    summary: "Big-city culture, mountain escapes, and shoulder-season beach deals.",
  },
  {
    id: "central-america",
    name: "Central America",
    slug: "central-america",
    summary: "Fast warm-weather trips with strong value from East and Gulf Coast hubs.",
  },
  {
    id: "andes-cities",
    name: "Andes Cities",
    slug: "andes-cities",
    summary: "High-altitude city breaks across Colombia, Peru, and Chile.",
  },
];

export const regionAirports: RegionAirport[] = [
  { regionId: "south-america", airportId: "bog" },
  { regionId: "south-america", airportId: "med" },
  { regionId: "south-america", airportId: "lim" },
  { regionId: "south-america", airportId: "scl" },
  { regionId: "south-america", airportId: "gig" },
  { regionId: "south-america", airportId: "gru" },
  { regionId: "south-america", airportId: "eze" },
  { regionId: "central-america", airportId: "sjo" },
  { regionId: "central-america", airportId: "lib" },
  { regionId: "central-america", airportId: "pty" },
  { regionId: "central-america", airportId: "gua" },
  { regionId: "central-america", airportId: "sal" },
  { regionId: "andes-cities", airportId: "bog" },
  { regionId: "andes-cities", airportId: "med" },
  { regionId: "andes-cities", airportId: "lim" },
  { regionId: "andes-cities", airportId: "scl" },
];

export function getAirportById(airportId: string) {
  return airports.find((airport) => airport.id === airportId);
}
