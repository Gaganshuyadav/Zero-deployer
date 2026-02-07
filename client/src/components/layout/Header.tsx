import { useContext, useEffect, useState } from "react";
import { Search } from "../common-components/search/Search";
import { DarkLightSwitch } from "./buttons/DarkLight";
// import { DarkLightSwitch } from "./buttons/darkLight";

export default function Header(){

    console.log(document.documentElement.classList);

    return(
        <header className="sticky flex items-center justify-between top-0 z-50 border-b bg-white/80 backdrop-blur">
            {/* first section  */}
            <div>
                {/* left */}

                {/* right */}
                <Search/>
            </div>
            {/* second section */}
            <div>
                <div className="bg-background text-foreground">Good News</div>
                
                {/* headers */}

                <DarkLightSwitch/>
            </div>
        </header>
    )
}