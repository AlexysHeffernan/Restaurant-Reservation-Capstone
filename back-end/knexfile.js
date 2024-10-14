/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgresql://restaurant_reservation_system_user:Oqw1tzztbhw57kqbQMkPM3SIbOTRSaRo@dpg-crs5d2jtq21c73dc7si0-a.oregon-postgres.render.com/restaurant_reservation_system?ssl=true",
  DATABASE_URL_DEVELOPMENT = "postgresql://restaurant_reservation_system_user:Oqw1tzztbhw57kqbQMkPM3SIbOTRSaRo@dpg-crs5d2jtq21c73dc7si0-a.oregon-postgres.render.com/restaurant_reservation_system?ssl=true",
  DATABASE_URL_TEST = "postgresql://restaurant_reservation_system_user:Oqw1tzztbhw57kqbQMkPM3SIbOTRSaRo@dpg-crs5d2jtq21c73dc7si0-a.oregon-postgres.render.com/restaurant_reservation_system?ssl=true",
  DATABASE_URL_PREVIEW = "postgresql://restaurant_reservation_system_user:Oqw1tzztbhw57kqbQMkPM3SIbOTRSaRo@dpg-crs5d2jtq21c73dc7si0-a.oregon-postgres.render.com/restaurant_reservation_system?ssl=true",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
