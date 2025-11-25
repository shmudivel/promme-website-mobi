import Image from 'next/image';

export default function AboutPortalSection() {
  return (
    <section id="about" className="bg-gradient-to-b from-gray-50 to-gray-100 px-5 py-20">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-2">
          <span className="text-sm uppercase tracking-wider text-text-light">о портале</span>
          <span className="text-2xl font-bold text-primary-orange">PROMME</span>
        </div>
        
        {/* Content */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-text max-md:text-3xl">
            PROMME — не только поиск работы
          </h2>
          <p className="text-xl text-text-light max-md:text-lg">
            Портал полезен всем, кто связан или хочет связать<br className="max-md:hidden" />
            себя с промышленным сектором
          </p>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left side - Image card */}
          <div className="relative overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=1000&fit=crop"
                alt="Соискатели"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-6 left-6 rounded-full bg-white/90 px-6 py-3 text-lg font-semibold text-text backdrop-blur-sm">
                Соискатели
              </div>
            </div>
          </div>
          
          {/* Right side - Mission content */}
          <div className="flex flex-col justify-center gap-6 rounded-3xl bg-white p-10 shadow-lg max-md:p-6">
            <span className="inline-block w-fit rounded-full bg-gradient-to-r from-primary-orange to-primary-pink px-5 py-2 text-sm font-semibold text-white">
              Наша миссия
            </span>
            <h3 className="text-3xl font-bold leading-tight text-text max-md:text-2xl">
              Содействовать развитию промышленного сектора через популяризацию промышленных профессий
            </h3>
            <p className="text-lg leading-relaxed text-text-light">
              Поддержку профессионального роста сотрудников и создание эффективной платформы для взаимодействия между работодателями, специалистами и образовательными учреждениями.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

