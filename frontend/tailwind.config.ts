import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./context/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        signal: {
          blue: "#069061",
          cyan: "#0082D0",
          ink: "#1B1B1B",
          mist: "#F7F7F7"
        },
        scalar: {
          ink: "#1B1B1B",
          slate: "#757575",
          pewter: "#8E8E8E",
          paper: "#FFFFFF",
          line: "#E3E3DF",
          wash: "#F6F6F4",
          green: "#069061",
          blue: "#0082D0",
          orange: "#FF5800",
          purple: "#5203D1"
        }
      }
    }
  },
  plugins: []
};

export default config;
