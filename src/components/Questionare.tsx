import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { Question } from '../types';

interface Props {
  questions: Question[];
  answers?: Record<number, string>;
  onAnswerChange?: (id: number, value: string) => void;
  isEditing?: boolean;
  onRemove?: (id: number) => void;
  onAdd?: () => void;
  preview?: boolean;
}

export default function Questionare({
  questions,
  answers = {},
  onAnswerChange,
  isEditing,
  onRemove,
  onAdd,
  preview,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Conditional rendering */}
      {/* No questions */}
      {questions.length === 0 && (
        <div className="text-center py-10 text-gray-400 italic">
          No questions added yet.
        </div>
      )}

      {/* Questions Rendered */}
      {questions.map((q, index) => (
        <div
          key={q.id}
          className="border border-gray-300 rounded px-4 py-3 mx-2 bg-white"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-1">
              {/* Question */}
              <p className="font-semibold">{index + 1}. {q.name}</p>
              <p className="text-sm text-gray-600">
                Type: <span className="italic">{q.choice_type}</span>
                {q.is_required ? <span className='text-red-500 mx-2'>• Required</span> : ''}
              </p>

              {/* Input area */}
              {preview || onAnswerChange ? (
                <div className="mt-2">
                  {/* Short answer */}
                  {q.choice_type === 'short answer' && (
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={answers[q.id] || ''}
                      onChange={(e) => onAnswerChange?.(q.id, e.target.value)}
                      disabled={preview}
                    />
                  )}

                  {/* Paragraph */}
                  {q.choice_type === 'paragraph' && (
                    <textarea
                      className="w-full border rounded px-3 py-2 text-sm"
                      rows={3}
                      value={answers[q.id] || ''}
                      onChange={(e) => onAnswerChange?.(q.id, e.target.value)}
                      disabled={preview}
                    />
                  )}

                  {/* Date */}
                  {q.choice_type === 'date' && (
                    <input
                      type="date"
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={answers[q.id] || ''}
                      onChange={(e) => onAnswerChange?.(q.id, e.target.value)}
                      disabled={preview}
                    />
                  )}

                  {/* Multiple Choice */}
                  {q.choice_type === 'multiple choice' && q.choices && (
                    <div className="flex flex-col gap-1">
                      {q.choices.split(',').map((opt, i) => (
                        <label key={i} className="text-sm">
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt.trim()}
                            checked={answers[q.id] === opt.trim()}
                            onChange={() => onAnswerChange?.(q.id, opt.trim())}
                            disabled={preview}
                            className="mr-2"
                          />
                          {opt.trim()}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Dropdown */}
                  {q.choice_type === 'dropdown' && q.choices && (
                    <select
                      className="w-full border rounded px-3 py-2 text-sm"
                      value={answers[q.id] || ''}
                      onChange={(e) => onAnswerChange?.(q.id, e.target.value)}
                      disabled={preview}
                    >
                      <option value="">-- Select --</option>
                      {q.choices.split(',').map((opt, i) => (
                        <option key={i} value={opt.trim()}>{opt.trim()}</option>
                      ))}
                    </select>
                  )}

                  {/* Checkboxes */}
                  {q.choice_type === 'checkboxes' && q.choices && (
                    <div className="flex flex-col gap-1">
                      {q.choices.split(',').map((opt, i) => {
                        const current = answers[q.id]?.split(',') || [];
                        const isChecked = current.includes(opt.trim());

                        const handleToggle = () => {
                          const updated = isChecked
                            ? current.filter((c) => c !== opt.trim())
                            : [...current, opt.trim()];
                          onAnswerChange?.(q.id, updated.join(','));
                        };

                        return (
                          <label key={i} className="text-sm">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={handleToggle}
                              disabled={preview}
                              className="mr-2"
                            />
                            {opt.trim()}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Remove button (editing mode) */}
            {isEditing && onRemove && (
              <button
                onClick={() => onRemove(q.id)}
                className="text-red-500 hover:text-red-700 text-sm "
              >
                <DeleteIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* New question button (editing mode) */}
      {isEditing && onAdd && (
        <div
          onClick={onAdd}
          className="cursor-pointer border border-dashed rounded px-4 py-3 shadow-sm bg-white hover:bg-indigo-500 hover:text-white transition-all duration-200 ease-in-out flex items-center gap-2 text-indigo-600 mx-2"
        >
          <AddCircleOutlineIcon fontSize="small" />
          <span className="font-medium">New Question</span>
        </div>
      )}
    </div>
  );
}
