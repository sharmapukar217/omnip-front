type NavStyle = "default" | "inverted";
export const useNavStyle = () => useState<NavStyle>("nav-style");

// export const navStyle = computed<typeof navStyleFromCooke.value>({
//   get: () => navStyleFromCooke.value || "inverted",
//   set(newValue) {
//     navStyleFromCooke.value = newValue;
//   }
// });

// export const navStyle = useState("nav-style", )
