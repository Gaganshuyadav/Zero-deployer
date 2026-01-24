import { Search } from "../common-components/search/Search";

export default function Header(){

    return(
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
            {/* first section  */}
            <div>
                {/* left */}

                {/* right */}
                <Search/>
            </div>
            {/* second section */}
            <div>

                {/* headers */}

            </div>
        </header>
    )
}