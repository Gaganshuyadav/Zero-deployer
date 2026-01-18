import type { ComponentType } from "react";


const AppLayout = () => {

    return (WrappedComponent: ComponentType) => {

        return (props) => {

            return (
                <div className="min-h-screen bg-slate-50 text-slate-900">
                    {/* Header */}
                    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
                        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                            <h1 className="text-lg font-semibold">ChitChat</h1>
                            <nav className="flex gap-4 text-sm text-slate-600">
                                <button className="hover:text-slate-900">Home</button>
                                <button className="hover:text-slate-900">Chats</button>
                                <button className="hover:text-slate-900">Profile</button>
                            </nav>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="mx-auto max-w-7xl px-6 py-8">
                        <WrappedComponent {...props} />
                    </main>

                    {/* Footer */}
                    <footer className="border-t bg-white">
                        <div className="mx-auto max-w-7xl px-6 py-4 text-center text-sm text-slate-500">
                            © {new Date().getFullYear()} Vercel. All rights reserved.
                        </div>
                    </footer>
                </div>
            )
        }
    }
}

export default AppLayout;
