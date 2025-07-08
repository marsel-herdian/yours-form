import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { FormDetail, Question } from '../types';
import Questionare from '../components/Questionare';

export default function SubmitForm() {
    const { slug } = useParams();
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();
    const [form, setForm] = useState<FormDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

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
            } catch (err: any) {
                if (err.response?.status === 403) {
                    navigate('/forbidden');
                } else {
                    setError('Failed to load form');
                }
            } finally {
                setLoading(false);
            }
        };

        if (slug && user?.accessToken) fetchForm();
    }, [slug, user]);

    // Set dynamic title
    useEffect(() => {
        if (form?.name) {
            document.title = `${form.name} | Yours Form`;
        }
    }, [form?.name]);

    // Change answer input handler
    const handleChangeAnswer = (questionId: number, value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    // Check if answer is valid
    const isAnswerValid = (q: Question) => {
        if (!q.is_required) return true;
        const val = answers[q.id];
        return typeof val === 'string' && val.trim() !== '';
    };

    // Check if all required answers are filled
    const allRequiredFilled = form?.questions.every(isAnswerValid);

    // Submit form handler
    const handleSubmit = async () => {
        if (!form) return;

        const payload = {
            answers: Object.entries(answers).map(([id, value]) => ({
                question_id: Number(id),
                value,
            })),
        };

        setSubmitting(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/forms/${form.slug}/responses`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${user?.accessToken}`,
                    },
                }
            );

            alert('Form submitted successfully!');
            navigate('/');
        } catch (err: any) {
            if (err.response?.status === 403) {
                navigate('/forbidden');
            } else if (err.response?.data?.message === 'You can not submit form twice') {
                alert('You already submitted this form.');
                navigate('/');
            } else {
                alert('Failed to submit form.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Check if at least one answer is filled
    const atLeastOneAnswered = form?.questions.some(q => {
        const val = answers[q.id];
        return typeof val === 'string' && val.trim() !== '';
    });

    // Render placeholder 
    if (loading) return <div className="text-center py-10">Loading form...</div>;
    if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
    if (!form) return <div className="text-center py-10 text-red-500">Form not found</div>;

    return (
        <div className="max-w-3xl mx-auto my-8 py-10 space-y-6 bg-white p-6 rounded-2xl shadow ">
            {/* Form Details */}
            <div className="space-y-1 mx-2">
                <h1 className="text-3xl font-bold">{form.name}</h1>
                {form.description?.length > 0 ? <p className="text-gray-600">Description: {form.description}</p> : <p className="text-gray-600">No description provided.</p>}
                <p className="text-sm text-gray-500">
                    <span className="font-semibold">Author:</span> {form.creator_id}
                </p>
                <p className='text-sm font-bold text-gray-700'>Responding as : <span className="font-semibold">{user?.name} ({user?.email})</span></p>
            </div>

            {/* Form Questions */}
            <div className="space-y-4">
                <Questionare
                    questions={form.questions}
                    answers={answers}
                    onAnswerChange={handleChangeAnswer}
                    preview={false}
                />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={!allRequiredFilled || !form || form.questions.length === 0 || !form.questions.every(isAnswerValid) || !atLeastOneAnswered || submitting}
                    className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    );
}
