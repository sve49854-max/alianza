import { useState } from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import InnerPage from "./pages/InnerPage"
import "./App.css"

export default function App() {
  const [page, setPage] = useState("inicio")

  function navigate(next) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="app">
      <Header page={page} onNavigate={navigate} />
      {page === "inicio" ? (
        <main>
          <Hero onEnter={() => navigate("inicio")} />
          <Contact onNavigate={navigate} />
        </main>
      ) : (
        <main>
          <InnerPage id={page} />
        </main>
      )}
      <Footer onNavigate={navigate} />
    </div>
  )
}
