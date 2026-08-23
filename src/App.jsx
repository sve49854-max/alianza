import { useState } from "react"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Ecosystem from "./components/Ecosystem"
import WhatWeDo from "./components/WhatWeDo"
import Online from "./components/Online"
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
          <Hero />
          <Ecosystem onNavigate={navigate} />
          <WhatWeDo />
          <Online />
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
