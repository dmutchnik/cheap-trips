import type { Airport, Region, RegionAirport } from "@/lib/types";

export const airports: Airport[] = [
  { id: "mia", iataCode: "MIA", city: "Miami", name: "Miami International", country: "United States" },
  { id: "atl", iataCode: "ATL", city: "Atlanta", name: "Hartsfield-Jackson Atlanta", country: "United States" },
  { id: "jfk", iataCode: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States" },
  { id: "ewr", iataCode: "EWR", city: "Newark", name: "Newark Liberty International", country: "United States" },
  { id: "bos", iataCode: "BOS", city: "Boston", name: "Boston Logan International", country: "United States" },
  { id: "iad", iataCode: "IAD", city: "Washington, D.C.", name: "Washington Dulles International", country: "United States" },
  { id: "ord", iataCode: "ORD", city: "Chicago", name: "Chicago O'Hare International", country: "United States" },
  { id: "dfw", iataCode: "DFW", city: "Dallas", name: "Dallas/Fort Worth International", country: "United States" },
  { id: "iah", iataCode: "IAH", city: "Houston", name: "George Bush Intercontinental", country: "United States" },
  { id: "den", iataCode: "DEN", city: "Denver", name: "Denver International", country: "United States" },
  { id: "phx", iataCode: "PHX", city: "Phoenix", name: "Phoenix Sky Harbor International", country: "United States" },
  { id: "lax", iataCode: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States" },
  { id: "sfo", iataCode: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States" },
  { id: "sea", iataCode: "SEA", city: "Seattle", name: "Seattle-Tacoma International", country: "United States" },
  { id: "mco", iataCode: "MCO", city: "Orlando", name: "Orlando International", country: "United States" },
  { id: "bog", iataCode: "BOG", city: "Bogota", name: "El Dorado International", country: "Colombia" },
  { id: "med", iataCode: "MDE", city: "Medellin", name: "Jose Maria Cordova International", country: "Colombia" },
  { id: "lim", iataCode: "LIM", city: "Lima", name: "Jorge Chavez International", country: "Peru" },
  { id: "scl", iataCode: "SCL", city: "Santiago", name: "Arturo Merino Benitez", country: "Chile" },
  { id: "gig", iataCode: "GIG", city: "Rio de Janeiro", name: "Galeao International", country: "Brazil" },
  { id: "gru", iataCode: "GRU", city: "Sao Paulo", name: "Guarulhos International", country: "Brazil" },
  { id: "eze", iataCode: "EZE", city: "Buenos Aires", name: "Ministro Pistarini International", country: "Argentina" },
  { id: "sjo", iataCode: "SJO", city: "San Jose", name: "Juan Santamaria International", country: "Costa Rica" },
  { id: "lir", iataCode: "LIR", city: "Liberia", name: "Daniel Oduber Quiros International", country: "Costa Rica" },
  { id: "pty", iataCode: "PTY", city: "Panama City", name: "Tocumen International", country: "Panama" },
  { id: "gua", iataCode: "GUA", city: "Guatemala City", name: "La Aurora International", country: "Guatemala" },
  { id: "sal", iataCode: "SAL", city: "San Salvador", name: "El Salvador International", country: "El Salvador" },
  { id: "cun", iataCode: "CUN", city: "Cancun", name: "Cancun International", country: "Mexico" },
  { id: "pvr", iataCode: "PVR", city: "Puerto Vallarta", name: "Lic. Gustavo Diaz Ordaz International", country: "Mexico" },
  { id: "oax", iataCode: "OAX", city: "Oaxaca", name: "Xoxocotlan International", country: "Mexico" },
  { id: "puj", iataCode: "PUJ", city: "Punta Cana", name: "Punta Cana International", country: "Dominican Republic" },
  { id: "sdq", iataCode: "SDQ", city: "Santo Domingo", name: "Las Americas International", country: "Dominican Republic" },
  { id: "aua", iataCode: "AUA", city: "Oranjestad", name: "Queen Beatrix International", country: "Aruba" },
  { id: "nas", iataCode: "NAS", city: "Nassau", name: "Lynden Pindling International", country: "Bahamas" },
  { id: "sju", iataCode: "SJU", city: "San Juan", name: "Luis Munoz Marin International", country: "Puerto Rico" },
  { id: "lis", iataCode: "LIS", city: "Lisbon", name: "Humberto Delgado Airport", country: "Portugal" },
  { id: "mad", iataCode: "MAD", city: "Madrid", name: "Adolfo Suarez Madrid-Barajas", country: "Spain" },
  { id: "bcn", iataCode: "BCN", city: "Barcelona", name: "Josep Tarradellas Barcelona-El Prat", country: "Spain" },
  { id: "agp", iataCode: "AGP", city: "Malaga", name: "Malaga-Costa del Sol", country: "Spain" },
  { id: "rak", iataCode: "RAK", city: "Marrakesh", name: "Menara Airport", country: "Morocco" },
  { id: "cmn", iataCode: "CMN", city: "Casablanca", name: "Mohammed V International", country: "Morocco" },
  { id: "fco", iataCode: "FCO", city: "Rome", name: "Leonardo da Vinci Fiumicino", country: "Italy" },
  { id: "nap", iataCode: "NAP", city: "Naples", name: "Naples International", country: "Italy" },
  { id: "ath", iataCode: "ATH", city: "Athens", name: "Athens International", country: "Greece" },
  { id: "pmi", iataCode: "PMI", city: "Palma de Mallorca", name: "Palma de Mallorca Airport", country: "Spain" },
  { id: "dub", iataCode: "DUB", city: "Dublin", name: "Dublin Airport", country: "Ireland" },
  { id: "arn", iataCode: "ARN", city: "Stockholm", name: "Stockholm Arlanda", country: "Sweden" },
  { id: "cph", iataCode: "CPH", city: "Copenhagen", name: "Copenhagen Airport", country: "Denmark" },
  { id: "osl", iataCode: "OSL", city: "Oslo", name: "Oslo Gardermoen", country: "Norway" },
  { id: "zag", iataCode: "ZAG", city: "Zagreb", name: "Franjo Tudman Airport", country: "Croatia" },
  { id: "dbv", iataCode: "DBV", city: "Dubrovnik", name: "Dubrovnik Airport", country: "Croatia" },
  { id: "spu", iataCode: "SPU", city: "Split", name: "Split Airport", country: "Croatia" },
  { id: "hnd", iataCode: "HND", city: "Tokyo", name: "Haneda Airport", country: "Japan" },
  { id: "kix", iataCode: "KIX", city: "Osaka", name: "Kansai International", country: "Japan" },
  { id: "icn", iataCode: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea" },
  { id: "bkk", iataCode: "BKK", city: "Bangkok", name: "Suvarnabhumi Airport", country: "Thailand" },
  { id: "sgn", iataCode: "SGN", city: "Ho Chi Minh City", name: "Tan Son Nhat International", country: "Vietnam" },
  { id: "sin", iataCode: "SIN", city: "Singapore", name: "Singapore Changi", country: "Singapore" },
  { id: "kul", iataCode: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International", country: "Malaysia" },
  { id: "dps", iataCode: "DPS", city: "Denpasar", name: "Ngurah Rai International", country: "Indonesia" },
  { id: "syd", iataCode: "SYD", city: "Sydney", name: "Sydney Kingsford Smith", country: "Australia" },
  { id: "mel", iataCode: "MEL", city: "Melbourne", name: "Melbourne Airport", country: "Australia" },
  { id: "akl", iataCode: "AKL", city: "Auckland", name: "Auckland Airport", country: "New Zealand" },
];

export const regions: Region[] = [
  {
    id: "south-america",
    name: "South America",
    slug: "south-america",
    summary: "Big-city culture, mountain escapes, and shoulder-season beach deals.",
    group: "Latin America",
    spotlightCities: ["Bogota", "Lima", "Rio de Janeiro"],
  },
  {
    id: "central-america",
    name: "Central America",
    slug: "central-america",
    summary: "Fast warm-weather trips with strong value from East and Gulf Coast hubs.",
    group: "Latin America",
    spotlightCities: ["San Jose", "Panama City", "Guatemala City"],
  },
  {
    id: "andes-cities",
    name: "Andes Cities",
    slug: "andes-cities",
    summary: "High-altitude city breaks across Colombia, Peru, and Chile.",
    group: "Latin America",
    spotlightCities: ["Medellin", "Lima", "Santiago"],
  },
  {
    id: "caribbean-escapes",
    name: "Caribbean Escapes",
    slug: "caribbean-escapes",
    summary: "Warm-water weekenders, short-haul sun, and simple airport transfers.",
    group: "Caribbean",
    spotlightCities: ["Punta Cana", "San Juan", "Oranjestad"],
  },
  {
    id: "mexico-beach-cities",
    name: "Mexico Beach Cities",
    slug: "mexico-beach-cities",
    summary: "Surf towns, resort flights, and food-heavy coastal long weekends.",
    group: "Latin America",
    spotlightCities: ["Cancun", "Puerto Vallarta", "Oaxaca"],
  },
  {
    id: "iberia-morocco",
    name: "Iberia and Morocco",
    slug: "iberia-morocco",
    summary: "Atlantic and southern-Europe shoulder-season plays with strong city density.",
    group: "Europe",
    spotlightCities: ["Lisbon", "Madrid", "Marrakesh"],
  },
  {
    id: "mediterranean-weekenders",
    name: "Mediterranean Weekenders",
    slug: "mediterranean-weekenders",
    summary: "Low-friction city-and-coast combinations for five-to-seven day trips.",
    group: "Europe",
    spotlightCities: ["Rome", "Athens", "Palma"],
  },
  {
    id: "northern-europe",
    name: "Northern Europe",
    slug: "northern-europe",
    summary: "Cool-weather city breaks and summer shoulder fares across northern capitals.",
    group: "Europe",
    spotlightCities: ["Dublin", "Copenhagen", "Stockholm"],
  },
  {
    id: "balkans-adriatic",
    name: "Balkans and Adriatic",
    slug: "balkans-adriatic",
    summary: "Historic cores, ferry gateways, and good value on open-jaw style adventures.",
    group: "Europe",
    spotlightCities: ["Dubrovnik", "Split", "Zagreb"],
  },
  {
    id: "japan-korea",
    name: "Japan and Korea",
    slug: "japan-korea",
    summary: "Dense transit networks and premium-feeling urban itineraries.",
    group: "Asia-Pacific",
    spotlightCities: ["Tokyo", "Osaka", "Seoul"],
  },
  {
    id: "southeast-asia",
    name: "Southeast Asia",
    slug: "southeast-asia",
    summary: "Long-haul value regions with strong city, beach, and food combinations.",
    group: "Asia-Pacific",
    spotlightCities: ["Bangkok", "Singapore", "Denpasar"],
  },
  {
    id: "australia-new-zealand",
    name: "Australia and New Zealand",
    slug: "australia-new-zealand",
    summary: "Ambitious long-haul leisure trips with strong multi-neighborhood itineraries.",
    group: "Asia-Pacific",
    spotlightCities: ["Sydney", "Melbourne", "Auckland"],
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
  { regionId: "central-america", airportId: "lir" },
  { regionId: "central-america", airportId: "pty" },
  { regionId: "central-america", airportId: "gua" },
  { regionId: "central-america", airportId: "sal" },
  { regionId: "andes-cities", airportId: "bog" },
  { regionId: "andes-cities", airportId: "med" },
  { regionId: "andes-cities", airportId: "lim" },
  { regionId: "andes-cities", airportId: "scl" },
  { regionId: "caribbean-escapes", airportId: "puj" },
  { regionId: "caribbean-escapes", airportId: "sdq" },
  { regionId: "caribbean-escapes", airportId: "aua" },
  { regionId: "caribbean-escapes", airportId: "nas" },
  { regionId: "caribbean-escapes", airportId: "sju" },
  { regionId: "mexico-beach-cities", airportId: "cun" },
  { regionId: "mexico-beach-cities", airportId: "pvr" },
  { regionId: "mexico-beach-cities", airportId: "oax" },
  { regionId: "iberia-morocco", airportId: "lis" },
  { regionId: "iberia-morocco", airportId: "mad" },
  { regionId: "iberia-morocco", airportId: "bcn" },
  { regionId: "iberia-morocco", airportId: "agp" },
  { regionId: "iberia-morocco", airportId: "rak" },
  { regionId: "iberia-morocco", airportId: "cmn" },
  { regionId: "mediterranean-weekenders", airportId: "fco" },
  { regionId: "mediterranean-weekenders", airportId: "nap" },
  { regionId: "mediterranean-weekenders", airportId: "ath" },
  { regionId: "mediterranean-weekenders", airportId: "pmi" },
  { regionId: "mediterranean-weekenders", airportId: "bcn" },
  { regionId: "northern-europe", airportId: "dub" },
  { regionId: "northern-europe", airportId: "arn" },
  { regionId: "northern-europe", airportId: "cph" },
  { regionId: "northern-europe", airportId: "osl" },
  { regionId: "balkans-adriatic", airportId: "zag" },
  { regionId: "balkans-adriatic", airportId: "dbv" },
  { regionId: "balkans-adriatic", airportId: "spu" },
  { regionId: "japan-korea", airportId: "hnd" },
  { regionId: "japan-korea", airportId: "kix" },
  { regionId: "japan-korea", airportId: "icn" },
  { regionId: "southeast-asia", airportId: "bkk" },
  { regionId: "southeast-asia", airportId: "sgn" },
  { regionId: "southeast-asia", airportId: "sin" },
  { regionId: "southeast-asia", airportId: "kul" },
  { regionId: "southeast-asia", airportId: "dps" },
  { regionId: "australia-new-zealand", airportId: "syd" },
  { regionId: "australia-new-zealand", airportId: "mel" },
  { regionId: "australia-new-zealand", airportId: "akl" },
];

export function getAirportById(airportId: string) {
  return airports.find((airport) => airport.id === airportId);
}

export function getRegionById(regionId: string) {
  return regions.find((region) => region.id === regionId);
}

export function getRegionAirportIds(regionId: string) {
  return regionAirports
    .filter((item) => item.regionId === regionId)
    .map((item) => item.airportId);
}

export function getDestinationAirportCountForRegions(regionIds: string[]) {
  return new Set(
    regionAirports
      .filter((item) => regionIds.includes(item.regionId))
      .map((item) => item.airportId),
  ).size;
}

export function getRegionGroups() {
  return [...new Set(regions.map((region) => region.group))];
}

export function getCatalogStats() {
  const destinationAirportIds = new Set(regionAirports.map((item) => item.airportId));
  const originAirportCount = airports.filter((airport) => airport.country === "United States").length;

  return {
    totalRegions: regions.length,
    totalDestinationAirports: destinationAirportIds.size,
    totalOriginAirports: originAirportCount,
    totalCountries: new Set(
      [...destinationAirportIds].map((airportId) => getAirportById(airportId)?.country ?? ""),
    ).size,
  };
}
