export default function MissionSection() {
  return (
    <section id="mission" className="bg-white px-5 py-20">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-2">
          <span className="text-sm uppercase tracking-wider text-text-light">наши цели</span>
          <span className="text-2xl font-bold text-primary-orange">PROMME</span>
        </div>
        
        {/* Content */}
        <div className="flex flex-col gap-8">
          {/* Mission Text */}
          <div className="relative">
            <h2 className="text-5xl font-bold leading-tight max-md:text-3xl">
              <span className="text-text-light">развиваем промышленные</span><br />
              <span className="text-text-light">профессии</span><br /><br />
              <span className="bg-gradient-to-r from-primary-orange-light via-primary-orange to-primary-pink bg-clip-text text-transparent">
                PROMME
              </span><br />
              <span className="text-text">объединяет</span><br />
              <span className="text-text">работодателей,</span><br />
              <span className="text-text">специалистов и</span><br />
              <span className="text-text-light">образовательные</span><br />
              <span className="text-blue-600">учреждения</span>
            </h2>
          </div>
          
          {/* View All Vacancies Button */}
          <div>
            <button className="group inline-flex items-center gap-3 rounded-full bg-primary-purple-dark px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <span>Смотреть все вакансии</span>
              <svg 
                className="h-6 w-6 transition-transform group-hover:translate-x-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

