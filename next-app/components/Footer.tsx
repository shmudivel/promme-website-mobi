export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Large Background Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-5">
        <span className="text-[300px] font-bold leading-none max-lg:text-[200px] max-md:text-[150px]">
          PROMME
        </span>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-8 py-20 max-md:px-5 max-md:py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-16">
          {/* Left Section: Main Heading & CTA Button */}
          <div className="flex flex-col gap-6">
            <h2 className="text-5xl font-bold leading-tight max-md:text-4xl">
              Найти<br />специалиста
            </h2>
            <div>
              <button className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-3 font-semibold backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/50">
                Вход
              </button>
            </div>
          </div>

          {/* Center Section: Navigation Menu */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm uppercase tracking-wider text-white/60">(меню)</h3>
            <nav className="flex flex-col gap-3">
              <a href="#vacancies" className="text-lg transition-colors hover:text-primary-orange">
                Каталог вакансий
              </a>
              <a href="#map" className="text-lg transition-colors hover:text-primary-orange">
                Информация об индустриальных парках
              </a>
              <a href="#about" className="text-lg transition-colors hover:text-primary-orange">
                О компании
              </a>
              <a href="#help" className="text-lg transition-colors hover:text-primary-orange">
                Помощь
              </a>
              <a href="#news" className="text-lg transition-colors hover:text-primary-orange">
                Новости и статьи
              </a>
            </nav>
          </div>

          {/* Right Section: Contacts & Social Media */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm uppercase tracking-wider text-white/60">(контакты)</h3>
            <div className="flex flex-col gap-3">
              <a 
                href="mailto:promme@gmail.com" 
                className="text-xl font-semibold transition-colors hover:text-primary-orange"
              >
                promme@gmail.com
              </a>
              <a 
                href="tel:+78633092212" 
                className="text-xl font-semibold transition-colors hover:text-primary-orange"
              >
                8 (863) 309 22 12
              </a>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a 
                href="#" 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
                aria-label="Telegram"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
                aria-label="Odnoklassniki"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm5.5 5.29c-.39-.38-1.03-.37-1.41.02-.78.78-1.81 1.19-2.91 1.19-1.09 0-2.12-.41-2.9-1.19-.38-.39-1.02-.4-1.41-.02-.39.39-.4 1.03-.02 1.41 1.07 1.07 2.46 1.73 3.98 1.93l-2.17 2.17c-.39.39-.39 1.02 0 1.41.2.2.45.29.71.29.26 0 .51-.1.71-.29L12 19.41l1.88 1.88c.2.2.45.29.71.29.26 0 .51-.1.71-.29.39-.39.39-1.02 0-1.41l-2.17-2.17c1.52-.2 2.91-.86 3.98-1.93.38-.38.37-1.02-.02-1.41z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
                aria-label="VKontakte"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.79 11.99c.53.53 1.09 1.03 1.53 1.64.19.27.38.54.49.85.16.46-.11.96-.61.99l-2.01-.01c-.52.04-1.02-.19-1.43-.6-.33-.33-.63-.68-.95-1.01-.13-.13-.27-.26-.43-.35-.37-.2-.7-.12-.91.27-.21.4-.26.84-.29 1.28-.04.62-.26.78-.87.81-1.3.06-2.53-.13-3.66-.88-1-.66-1.77-1.54-2.46-2.51-1.35-1.9-2.38-3.98-3.29-6.12-.19-.45-.05-.69.44-.7.81-.02 1.62-.02 2.43 0 .34.01.56.21.68.52.41.98.9 1.92 1.5 2.8.16.23.32.47.55.63.25.18.45.12.58-.17.08-.18.11-.38.13-.58.05-.61.06-1.23-.02-1.84-.06-.41-.28-.68-.69-.76-.21-.04-.18-.12-.08-.24.18-.23.35-.37.69-.37h2.54c.4.08.49.26.54.66l.01 2.81c0 .14.07.57.32.66.21.07.34-.09.46-.23.56-.63 1-1.36 1.38-2.13.17-.33.31-.69.45-1.04.1-.25.27-.37.55-.36l2.23.01c.07 0 .14 0 .2.01.4.06.51.23.39.61-.18.58-.53 1.06-.87 1.55-.36.52-.75 1.02-1.11 1.54-.32.47-.3.71.08 1.1z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-6 max-md:flex-col max-md:gap-4 max-md:px-5">
          <div>
            <span className="text-sm text-white/60">PROMME © Все права защищены</span>
          </div>
          <div>
            <a href="#privacy" className="text-sm text-white/60 transition-colors hover:text-white">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

