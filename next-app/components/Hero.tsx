'use client';

export default function Hero() {
  return (
    <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-gradient-to-br from-primary-orange-light via-primary-orange to-primary-pink px-5 pb-[120px] pt-[100px] text-center text-white">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-[600px] w-[600px] rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-20%] right-[-5%] h-[500px] w-[500px] rounded-full bg-white/8 blur-3xl" />
      
      <div className="relative z-10 w-full max-w-[1000px]">
        {/* Hero Title */}
        <h1 className="mb-[50px] text-[72px] font-bold leading-[1.2] drop-shadow-[0_4px_20px_rgba(0,0,0,0.1)] max-md:text-5xl max-sm:text-4xl">
          Ищите работу рядом с домом!
        </h1>
        
        {/* Search Bar */}
        <div className="mx-auto mb-[30px] flex max-w-[800px] items-center gap-3 rounded-[60px] bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.15)] max-md:flex-col max-md:rounded-3xl">
          <div className="flex flex-1 items-center gap-3 px-5 max-md:w-full">
            <svg className="h-6 w-6 text-text-light" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Профессия, должность или компания"
              className="flex-1 border-none bg-transparent py-4 text-lg text-text outline-none placeholder:text-text-muted max-md:py-3 max-md:text-base"
            />
          </div>
          
          <button className="rounded-[50px] bg-primary-purple-dark px-10 py-4 text-lg font-semibold text-white shadow-[0_4px_15px_rgba(124,58,237,0.3)] transition-all hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)] max-md:w-full">
            Найти
          </button>
          
          <button 
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary-purple-dark shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] max-md:hidden"
            aria-label="Location"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" />
            </svg>
          </button>
        </div>
        
        {/* Location Badges */}
        <div className="mb-10 flex justify-center gap-3 max-sm:flex-col max-sm:items-center">
          <button className="rounded-full border-2 border-white/30 bg-white/20 px-5 py-2 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/30">
            <span className="text-base font-medium">Сынково I</span>
            <span className="ml-2 text-sm opacity-80">(5)</span>
          </button>
          <button className="rounded-full border-2 border-white/30 bg-white/20 px-5 py-2 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/30">
            <span className="text-base font-medium">Коледино</span>
            <span className="ml-2 text-sm opacity-80">(9)</span>
          </button>
        </div>
        
        {/* Subtitle */}
        <p className="mb-10 text-xl leading-relaxed opacity-95 max-sm:text-lg">
          Портал для тех, кто строит<br />
          промышленность завтрашнего дня
        </p>
        
        {/* Scroll Down Button */}
        <button 
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/30"
          aria-label="Scroll down"
          onClick={() => {
            const nextSection = document.querySelector('section:nth-of-type(2)');
            nextSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
}

