const fs = require('fs');

try {
  const content = fs.readFileSync('code.html', 'utf-8');

  // Extract home-view and trust section roughly
  let mainStart = content.indexOf('<div id="home-view"');
  let mainEnd = content.indexOf('<div id="category-view"');
  let homeContent = content.substring(mainStart, mainEnd);

  // Replace class= with className=
  homeContent = homeContent.replace(/class=/g, 'className=');

  // Replace <!-- --> with {/* */}
  homeContent = homeContent.replace(/<!--(.*?)-->/g, '{/* $1 */}');

  // Any inline styles (just in case)
  homeContent = homeContent.replace(/style="([^"]*)"/g, (match, p1) => {
    // Basic hack for style="animation: livePulse..."
    if (p1.includes('animation:')) {
      return `style={{ animation: '${p1.replace('animation:', '').replace(';', '').trim()}' }}`;
    }
    // hack for font-variation-settings
    if (p1.includes('font-variation-settings:')) {
      return `style={{ fontVariationSettings: '${p1.replace('font-variation-settings:', '').replace(';', '').trim()}' }}`;
    }
    return match;
  });

  // Fix unclosed tags
  homeContent = homeContent.replace(/<input([^>]*?[^\/])>/g, '<input$1/>');
  homeContent = homeContent.replace(/<br>/g, '<br/>');
  homeContent = homeContent.replace(/<hr>/g, '<hr/>');

  // Also replace 'for' with 'htmlFor' for labels if any
  homeContent = homeContent.replace(/for=/g, 'htmlFor=');

  const jsx = `import Head from 'next/head';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen font-['Inter']">
      <Head>
        <title>The Digital Diplomat | USA Immigration News</title>
      </Head>

      <Header />

      <main className="mt-4 px-4 md:px-0">
        <div className="max-w-[1100px] mx-auto">
          <div className="w-full">
            ${homeContent}
          </div>
        </div>
      </main>
      <footer className="py-12 bg-[#F9FAFB] text-slate-600">
        <div className="w-full px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div>
        <span className="text-2xl font-extrabold tracking-tighter headline-font block mb-6 text-slate-900"><img alt="The Digital Diplomat Logo" className="w-auto object-contain mb-6 h-14" src="/Logo.png"/></span>
        <p className="text-sm leading-relaxed text-slate-600">The premier destination for accurate, real-time news and analysis regarding US immigration policy and global mobility.</p>
        </div>
        <div>
        <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-slate-900">RESOURCES</h4>
        <ul className="space-y-3 text-sm">
        <li><a className="hover:text-primary transition-colors" href="#/category/visa-guides/faqs">Visa Fee Calculator</a></li>
        <li><a className="hover:text-primary transition-colors" href="#/category/processing-times">USCIS Processing Times</a></li>
        <li><a className="hover:text-primary transition-colors" href="#/category/visa-bulletin">Visa Bulletin Archive</a></li>
        <li><a className="hover:text-primary transition-colors" href="#/category/visa-news/h1b-visa">H1B Lottery Data</a></li>
        </ul>
        </div>
        <div>
        <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-slate-900">COMPANY</h4>
        <ul className="space-y-3 text-sm">
        <li><a className="hover:text-primary transition-colors" href="#/home">About Us</a></li>
        <li><a className="hover:text-primary transition-colors" href="#/home">Editorial Guidelines</a></li>
        <li><a className="hover:text-primary transition-colors" href="#/home">Contact</a></li>
        <li><a className="hover:text-primary transition-colors" href="#/home">Advertising</a></li>
        </ul>
        </div>
        <div>
        <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-slate-900">CONNECT</h4>
        <div className="flex gap-4 mb-6">
        <a className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary transition-colors bg-slate-200" href="#"><span className="material-symbols-outlined text-sm text-slate-600">alternate_email</span></a>
        <a className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary transition-colors bg-slate-200" href="#"><span className="material-symbols-outlined text-sm text-slate-600">share</span></a>
        </div></div></div></div>
        <div className="border-t border-slate-100 dark:border-slate-900 py-8 px-8 text-center text-slate-400 text-xs">
                © 2024 The Digital Diplomat. All rights reserved.
            </div>
      </footer>
    </div>
  );
}
`;

  fs.writeFileSync('pages/index.js', jsx);
  console.log('Successfully created pages/index.js');
} catch (error) {
  console.error("Error migrating:", error);
}
