import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import FileUploader from '../ui/FileUploader.jsx';
import ChallengeMap from '../Map/ChallengeMap.jsx';
import { CHALLENGE_CATEGORIES, JHARKHAND_DISTRICTS } from '../../utils/constants.js';
import { challengeService } from '../../services/challengeService.js';
import { uploadService } from '../../services/uploadService.js';

const STEPS = ['Basic Info', 'Location', 'Impact Details', 'Evidence', 'Review'];

const initialForm = {
  title: '',
  category: '',
  description: '',
  district: '',
  address: '',
  location: null,
  affectedPopulation: '',
  urgency: '',
  proposedSolution: '',
  attachments: [],
};

export default function ChallengeForm({ onSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.title.trim()) errs.title = 'Title is required';
      if (!form.category) errs.category = 'Category is required';
      if (!form.description.trim()) errs.description = 'Description is required';
    }
    if (step === 1) {
      if (!form.district) errs.district = 'District is required';
      if (!form.location) errs.location = 'Please select a location on the map';
    }
    if (step === 2) {
      if (!form.affectedPopulation) errs.affectedPopulation = 'Affected population is required';
      if (!form.urgency) errs.urgency = 'Urgency level is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleFileUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await uploadService.uploadFile(file, setUploadProgress);
      update('attachments', [...form.attachments, result.file || { name: file.name, url: result.url }]);
    } catch {
      update('attachments', [...form.attachments, { name: file.name, local: true }]);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = (_, index) => {
    update('attachments', form.attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const urgencyMap = { Critical: 'critical', High: 'high', Medium: 'medium', Low: 'low' };
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        affectedPopulation: Number(form.affectedPopulation),
        urgency: urgencyMap[form.urgency] || form.urgency?.toLowerCase() || 'medium',
        location: {
          district: form.district,
          address: form.address,
          coordinates: form.location
            ? { type: 'Point', coordinates: [form.location.lng, form.location.lat] }
            : undefined,
        },
        evidence: form.attachments
          .filter((a) => a.url)
          .map((a) => ({
            type: 'document',
            url: a.url,
            caption: a.name,
          })),
      };
      const result = await challengeService.create(payload);
      const challengeId = result.data?._id || result.challenge?._id || result._id;
      onSuccess?.(result);
      navigate(`/citizen/challenges/${challengeId}`);
    } catch (err) {
      setErrors({ submit: err.message || 'Unable to submit challenge. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                i <= step ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i <= step ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-primary-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <Card>
        {step === 0 && (
          <div className="space-y-4">
            <Input
              label="Challenge Title"
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              error={errors.title}
              placeholder="Brief title describing the problem"
            />
            <Select
              label="Category"
              required
              placeholder="Select category"
              options={CHALLENGE_CATEGORIES}
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              error={errors.category}
            />
            <Textarea
              label="Description"
              required
              rows={5}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              error={errors.description}
              placeholder="Describe the problem in detail, including how it affects the community..."
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Select
              label="District"
              required
              placeholder="Select district"
              options={JHARKHAND_DISTRICTS}
              value={form.district}
              onChange={(e) => update('district', e.target.value)}
              error={errors.district}
            />
            <Input
              label="Address / Landmark"
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="Village, block, or nearby landmark"
            />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Select Location on Map <span className="text-danger-500">*</span>
              </p>
              <ChallengeMap
                selectedLocation={form.location}
                onLocationSelect={(loc) => update('location', loc)}
                interactive
                height="350px"
              />
              {errors.location && <p className="mt-1 text-sm text-danger-500">{errors.location}</p>}
              {form.location && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {form.location.lat.toFixed(4)}, {form.location.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Input
              label="Affected Population"
              required
              type="number"
              min="1"
              value={form.affectedPopulation}
              onChange={(e) => update('affectedPopulation', e.target.value)}
              error={errors.affectedPopulation}
              placeholder="Estimated number of people affected"
            />
            <Select
              label="Urgency Level"
              required
              placeholder="Select urgency"
              options={['Critical', 'High', 'Medium', 'Low']}
              value={form.urgency}
              onChange={(e) => update('urgency', e.target.value)}
              error={errors.urgency}
            />
            <Textarea
              label="Proposed Solution (Optional)"
              rows={4}
              value={form.proposedSolution}
              onChange={(e) => update('proposedSolution', e.target.value)}
              placeholder="If you have ideas for solving this problem, share them here..."
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload photos, documents, or other evidence to support your challenge report.
            </p>
            <FileUploader
              label="Evidence & Attachments"
              multiple
              files={form.attachments}
              onUpload={handleFileUpload}
              onRemove={handleRemoveFile}
              uploading={uploading}
              progress={uploadProgress}
            />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700" role="alert">
                {errors.submit}
              </div>
            )}
            <h3 className="font-semibold text-gray-900">Review Your Submission</h3>
            <dl className="grid sm:grid-cols-2 gap-3 text-sm">
              <div><dt className="text-gray-500">Title</dt><dd className="font-medium">{form.title}</dd></div>
              <div><dt className="text-gray-500">Category</dt><dd className="font-medium">{form.category}</dd></div>
              <div><dt className="text-gray-500">District</dt><dd className="font-medium">{form.district}</dd></div>
              <div><dt className="text-gray-500">Urgency</dt><dd className="font-medium">{form.urgency}</dd></div>
              <div><dt className="text-gray-500">Affected Population</dt><dd className="font-medium">{form.affectedPopulation}</dd></div>
              <div><dt className="text-gray-500">Attachments</dt><dd className="font-medium">{form.attachments.length} file(s)</dd></div>
              <div className="sm:col-span-2"><dt className="text-gray-500">Description</dt><dd className="font-medium">{form.description}</dd></div>
            </dl>
            {form.location && (
              <ChallengeMap selectedLocation={form.location} height="200px" zoom={12} />
            )}
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={back} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Challenge'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
