import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import Questionare from '../components/Questionare';
import type { FormDetail, Question, QuestionFormInput } from '../types';
import AddQuestionModal from '../components/AddQuestionModal';
import ResponseTable from '../components/ResponseTable';
import { IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Loading from '../components/Loading';

export default function DetailForm() {
  const { slug } = useParams();
  const [form, setForm] = useState<FormDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'question' | 'response'>('question');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [copied, setCopied] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  // Fetch form data
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/forms/${slug}`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        setForm(res.data.form);
      } catch (err) {
        console.error('Failed to fetch form', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchForm();
  }, [slug]);

  // Fetch questions
  useEffect(() => {
    if (form) {
      setQuestions(form.questions);
    }
  }, [form]);

  // Set dynamic title
  useEffect(() => {
    if (form?.name) {
      document.title = `${form.name} | Yours Form`;
    }
  }, [form?.name]);

  // Remove question handler
  const handleRemove = async (id: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/forms/${form!.slug}/questions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete question');
    }
  };

  // Add question handler
  const handleAddQuestion = async (data: QuestionFormInput) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/forms/${form!.slug}/questions`,
        {
          name: data.name,
          choice_type: data.choice_type,
          is_required: data.is_required,
          choices: ['multiple choice', 'dropdown', 'checkboxes'].includes(data.choice_type)
            ? data.choices?.split(',').map((c) => c.trim())
            : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      const newQuestion = res.data.question;
      setQuestions((prev) => [...prev, newQuestion]);
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add question');
    }
  };

  // Render placeholder
  if (loading) return <Loading />;
  if (!form) return <div className="text-center py-10 text-red-500">Form not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      {/* Form Details */}
      <h1 className="text-3xl font-bold">{form.name}</h1>

      {/* Form Link */}
      <div className="space-y-2 ">
        <div className="flex items-center gap-2">
          <p>
            <span className="font-semibold">Form Link:</span>{' '}
            {`${window.location.origin}/submit/${form.slug}`}
          </p>
          <Tooltip title={copied ? 'Copied!' : 'Copy Link'} arrow>
            <IconButton
              size="medium"
              onClick={() => {
                const link = `${window.location.origin}/submit/${form.slug}`;
                navigator.clipboard.writeText(link);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              <ContentCopyIcon fontSize="small" className="text-gray-600 hover:text-indigo-500" />
            </IconButton>
          </Tooltip>
        </div>

        {/* Form Descriptions */}
        <p><span className="font-semibold">Description:</span> {form.description}</p>
        <p><span className="font-semibold">Limit Response:</span> {form.limit_one_response ? '1 response' : 'none'}</p>
        <p><span className="font-semibold">Allowed Domains:</span> {form.allowed_domains.join(', ')}</p>
      </div>

      <div className="mt-8">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('question')}
            className={`px-4 py-2 font-medium ${activeTab === 'question' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
              }`}
          >
            Questions
          </button>
          <button
            onClick={() => setActiveTab('response')}
            className={`px-4 py-2 font-medium ${activeTab === 'response' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
              }`}
          >
            Responses
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'question' && (
            <div className="space-y-4">
              {/* Form Questions */}
              <div className="max-h-[500px] overflow-y-auto rounded border mt-4 p-2 bg-gray-50">
                <Questionare
                  questions={questions}
                  isEditing={isEditing}
                  onRemove={handleRemove}
                  onAdd={() => setIsModalOpen(true)}
                  preview={true}
                />
              </div>

              {/* Edit Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded transition
                                bg-indigo-500 text-white hover:bg-indigo-600
                                disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                >
                  Edit
                </button>

                <button
                  className="px-4 py-2 rounded transition
                                bg-green-600 text-white hover:bg-green-700
                                disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
                  onClick={() => setIsEditing(false)}
                  disabled={!isEditing}
                >
                  Done
                </button>
              </div>


            </div>
          )}

          {/* Form Responses */}
          {activeTab === 'response' && (
            <ResponseTable formSlug={form.slug} questions={form.questions} />
          )}
        </div>
      </div>

      {/* Add Question Modal */}
      <AddQuestionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddQuestion}
      />

    </div>

  );
}
