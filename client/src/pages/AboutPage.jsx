export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">About the Portal</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        The Jharkhand Societal Innovation Portal is an AI-powered collaboration platform developed
        for the Government of Jharkhand, Department of Higher & Technical Education, under Smart India
        Hackathon Problem Statement 26043.
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        The platform transforms community-identified societal challenges into validated innovation
        projects by connecting citizens, universities, students, faculty, industry partners, CSR
        organizations and government departments.
      </p>
      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Key Features</h2>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Multi-step citizen challenge submission with geolocation</li>
        <li>AI-assisted classification with rule-based fallback</li>
        <li>Deterministic priority scoring with explanations</li>
        <li>Explainable university and industry matching</li>
        <li>Full project lifecycle management with milestones</li>
        <li>Government analytics dashboard with district mapping</li>
        <li>Impact measurement with verification</li>
      </ul>
    </div>
  );
}
