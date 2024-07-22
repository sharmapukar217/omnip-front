import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import { appColors } from "./app/lib/appConfig";

/** convert camelCase to kebba-case  */
function toKebabCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** @type {import('tailwindcss').Config} */
export default {
  safelist: ["dark"],
  darkMode: ["class"],
  content: ["./web/**/*.{vue,ts}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" }
    },
    extend: {
      aria: {
        invalid: 'invalid="true"'
      },

      colors: () => ({
        ...Object.keys(appColors.light).reduce((obj, key) => {
          key = toKebabCase(key);
          obj[key] = `hsl(var(--${key}))`;
          return obj;
        }, {})
      }),
      borderRadius: {
        full: "100%",
        xl: `calc(var(--border-radius) + 4px)`,
        lg: `var(--border-radius)`,
        md: `calc(var(--border-radius) - 2px)`,
        sm: "calc(var(--border-radius) - 4px)"
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 }
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: "var(--radix-collapsible-content-height)" }
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: 0 }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-in-out",
        "accordion-up": "accordion-up 0.2s ease-in-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out"
      }
    },
    fontFamily: {
      sans: ["DM Sans", ...defaultTheme.fontFamily.sans]
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    iconsPlugin({
      collections: getIconCollections(["lucide", "bi", "heroicons", "line-md"])
    }),
    plugin(function ({ addBase }) {
      const cssObject = { ":root": {}, ".dark": {} };

      Object.entries(appColors).forEach(([theme, values]) => {
        const target = theme === "light" ? ":root" : ".dark";
        Object.entries(values).forEach(([key, value]) => {
          cssObject[target][`--${toKebabCase(key)}`] = value;
        });
      });

      addBase(cssObject);
    })
  ]
};
