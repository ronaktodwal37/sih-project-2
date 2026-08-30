import { Link } from 'react-router-dom';
import { ArrowRight, Search, Users, Building2, Factory, Target, CheckCircle } from 'lucide-react';
import { t } from '../i18n/index.js';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';

const stats = [
  { label: 'Challenges Submitted', value: '24+' },
  { label: 'Challenges Validated', value: '18+' },
  { label: 'Active Projects', value: '12+' },
  { label: 'Universities', value: '10+' },
  { label: 'Industry Partners', value: '10+' },
  { label: 'Citizens Impacted', value: '50,000+' },
];

const steps = [
  { step: 1, title: 'Citizen Submits Problem', desc: 'Community members report local challenges with evidence and location details.' },
  { step: 2, title: 'AI Analyzes & Categorizes', desc: 'AI classifies, summarizes, extracts skills and identifies potential root causes.' },
  { step: 3, title: 'Experts Validate', desc: 'Government officials review, validate and prioritize challenges for action.' },
  { step: 4, title: 'Partners Matched', desc: 'Universities and industry partners are matched based on explainable scoring.' },
  { step: 5, title: 'Project Developed', desc: 'Multidisciplinary teams work through research, prototype and pilot phases.' },
  { step: 6, title: 'Impact Measured', desc: 'Solutions are deployed and measurable social impact is tracked.' },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const reportLink = isAuthenticated ? '/citizen/challenges/new' : '/register';
  return (
    <div>
      <section className="bg-gradient-to-b from-primary-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-3xl">
            <Badge color="accent" className="mb-4">{t('common.demoData')}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-800 leading-tight mb-4">
              {t('portal.tagline')}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('portal.subtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={reportLink}>
                <Button size="lg">
                  Report a Challenge <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/challenges">
                <Button variant="secondary" size="lg">
                  <Search className="w-4 h-4" /> Explore Challenges
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-2xl font-bold text-primary-500">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">* {t('common.demoData')}</p>
      </section>

      <section className="bg-gray-50 border-y border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s) => (
              <Card key={s.step}>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card title="For Citizens" className="text-center">
            <Users className="w-10 h-10 text-primary-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">Report local challenges and track progress from submission to solution deployment.</p>
            <Link to="/register"><Button variant="outline" size="sm">Register as Citizen</Button></Link>
          </Card>
          <Card title="For Universities" className="text-center">
            <Building2 className="w-10 h-10 text-primary-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">Accept challenges, form teams and develop research-driven solutions.</p>
            <Link to="/universities"><Button variant="outline" size="sm">View Universities</Button></Link>
          </Card>
          <Card title="For Industry" className="text-center">
            <Factory className="w-10 h-10 text-primary-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">Offer mentorship, funding and technology support for pilot implementation.</p>
            <Link to="/industry"><Button variant="outline" size="sm">Industry Partners</Button></Link>
          </Card>
        </div>
      </section>

      <section className="bg-primary-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Target className="w-12 h-12 mx-auto mb-4 text-accent-500" />
          <h2 className="text-2xl font-bold mb-3">Our Differentiator</h2>
          <p className="max-w-2xl mx-auto text-primary-100 leading-relaxed">
            We don&apos;t just collect problems. We intelligently connect every validated problem with the
            universities, students, researchers, industry and resources that can help solve it — and track
            whether the solution actually creates measurable impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
            {['AI-assisted analysis', 'Explainable matching', 'Project lifecycle', 'Impact tracking'].map((item) => (
              <span key={item} className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-accent-500" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
