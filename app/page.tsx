import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Especialista from '@/components/Especialista'
import Metodologia from '@/components/Metodologia'
import Galeria from '@/components/Galeria'
import Agendamento from '@/components/Agendamento'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Especialista />
        <Metodologia />
        <Galeria />
        <Agendamento />
      </main>
      <Footer />
    </>
  )
}
