import ChallengeForm from '../../components/challenges/ChallengeForm.jsx';

export default function NewChallengePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Report a Challenge</h1>
      <p className="text-gray-600 mb-6">
        Help your community by reporting a societal problem. Fill in the details below.
      </p>
      <ChallengeForm />
    </div>
  );
}
