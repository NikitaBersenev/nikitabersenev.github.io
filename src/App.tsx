import { Header } from "./components/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="linear-bg text-[#f7f8f8] min-h-screen flex flex-col font-sans selection:bg-indigo-500/30">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Nikita Bersenev — GitHub Pages</span>
          <span className="flex items-center gap-2">
            Built with React, Vite & Linear Design
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
