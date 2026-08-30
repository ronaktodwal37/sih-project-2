import { Link } from 'react-router-dom';
import { t } from '../../i18n/index.js';

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">{t('footer.about')}</h3>
            <p className="text-sm leading-relaxed">
              AI-powered platform connecting societal challenges with universities,
              industry and government for collaborative problem solving across Jharkhand.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">{t('footer.links')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/challenges" className="hover:text-white transition-colors">Challenges</Link></li>
              <li><Link to="/universities" className="hover:text-white transition-colors">Universities</Link></li>
              <li><Link to="/industry" className="hover:text-white transition-colors">Industry & CSR</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li>
              <li><Link to="/impact" className="hover:text-white transition-colors">Impact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-sm">
              <li>Department of Higher & Technical Education</li>
              <li>Government of Jharkhand</li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">{t('footer.help')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/accessibility" className="hover:text-white transition-colors">{t('footer.accessibility')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {t('portal.govt')} — {t('portal.department')}</p>
        </div>
      </div>
    </footer>
  );
}
