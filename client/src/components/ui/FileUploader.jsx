import { useRef, useState } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import Button from './Button.jsx';
import ProgressBar from './ProgressBar.jsx';

export default function FileUploader({
  accept = 'image/*,.pdf,.doc,.docx',
  multiple = false,
  maxSize = 10 * 1024 * 1024,
  onUpload,
  onRemove,
  files = [],
  uploading = false,
  progress = 0,
  label = 'Upload files',
  className = '',
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (fileList) => {
    setError('');
    const selected = Array.from(fileList);
    const oversized = selected.find((f) => f.size > maxSize);
    if (oversized) {
      setError(`File "${oversized.name}" exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit.`);
      return;
    }
    onUpload?.(multiple ? selected : selected[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const getIcon = (name) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(name)) return Image;
    return FileText;
  };

  return (
    <div className={className}>
      {label && <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or
        </p>
        <Button variant="outline" size="sm" type="button" onClick={() => inputRef.current?.click()}>
          Browse Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
        />
        <p className="text-xs text-gray-400 mt-2">Max file size: {Math.round(maxSize / 1024 / 1024)}MB</p>
      </div>

      {error && <p className="text-sm text-danger-500 mt-2" role="alert">{error}</p>}
      {uploading && <ProgressBar value={progress} className="mt-3" label="Uploading..." />}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, i) => {
            const name = file.name || file.filename || `File ${i + 1}`;
            const Icon = getIcon(name);
            return (
              <li key={file._id || i} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                <Icon className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-sm text-gray-700 truncate flex-1">{name}</span>
                {onRemove && (
                  <button type="button" onClick={() => onRemove(file, i)} className="p-1 hover:bg-gray-200 rounded" aria-label="Remove file">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
