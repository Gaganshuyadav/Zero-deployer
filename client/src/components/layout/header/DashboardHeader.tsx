import { useContext, useEffect, useState } from "react";
import { Search } from "../../common-components/search/Search";
import { DarkLightSwitch } from "../buttons/DarkLight";
import DashboardButtonsNavbar from "@/components/layout/navbar/DashBoardHeaderOptions";
import DashboardButtonsMain from "@/components/layout/navbar/DashBoardHeaderMain";
// import { DarkLightSwitch } from "./buttons/darkLight";

export default function Header(){

    console.log(document.documentElement.classList);

    return(
        <header className="sticky flex flex-col items-start top-0 z-50 border-b bg-white/80 backdrop-blur">
            {/* first section  */}
            <div className="flex items-center justify-between w-[100%]">
                <DashboardButtonsMain/>
            </div>

            {/* second section */}
            <div className="bg-background text-foreground w-[100%]">
                <div className="">
                    <DashboardButtonsNavbar/>
                </div>

                {/* <DarkLightSwitch/> */}
            </div>
        </header>
    )
}