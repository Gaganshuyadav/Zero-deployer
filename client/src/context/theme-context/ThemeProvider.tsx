import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";


export function ThemeProvider({ children}:{ children: ReactNode}){

    const [ theme, setTheme] = useState<Theme>("light");

    useEffect(()=>{

        const lastSavedInVercel = localStorage.getItem("zero-deployer-theme") || null as (Theme | null);
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = lastSavedInVercel || ( systemDark ? "dark" : "light");

        setTheme(initial as Theme);
        document.documentElement.classList.add(initial);

    },[]);

    

    const toggleTheme = ()=>{
        const newTheme = theme==="light" ? "dark" : "light";
        setTheme((t)=>newTheme);
        localStorage.setItem("zero-deployer-theme", newTheme);
        document.documentElement.className="";
        document.documentElement.classList.add(newTheme);
    }

    return(
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            { children}
        </ThemeContext.Provider>
    )
}


// import { createContext, useContext, useEffect, useState } from "react";

// type Theme = "light" | "dark";

// const ThemeContext = createContext({
//   theme: "light" as Theme,
//   toggle: () => {},
// });

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [theme, setTheme] = useState<Theme>("light");

//   useEffect(() => {
//     const saved = localStorage.getItem("theme") as Theme | null;
//     const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

//     const initial = saved ?? (systemDark ? "dark" : "light");
//     setTheme(initial);
//     document.documentElement.setAttribute("data-theme", initial);
//   }, []);

//   const toggle = () => {
//     const next = theme === "light" ? "dark" : "light";
//     setTheme(next);
//     localStorage.setItem("theme", next);
//     document.documentElement.setAttribute("data-theme", next);
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggle }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export const useTheme = () => useContext(ThemeContext);







