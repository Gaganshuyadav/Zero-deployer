import type { ComponentType } from "react";
import Header from "./Header";


const AppLayout = () => {

    return (WrappedComponent: ComponentType) => {

        return (props:any) => {

            return (
                <div className="min-h-screen bg-slate-50 text-slate-900">
                    {/* Header */}
                    <Header/>

                    {/* Main Content */}
                    <main className="mx-auto max-w-7xl px-6 py-8">
                        <WrappedComponent {...props} />
                    </main>

                    {/* Footer */}
                    <footer className="border-t bg-white">
                        <div className="mx-auto max-w-7xl px-6 py-4 text-center text-sm text-slate-500">
                            © {new Date().getFullYear()} Zero-Deployer. All rights reserved.
                        </div>
                    </footer>
                </div>
            )
        }
    }
}

export default AppLayout;
