import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Question, ResponseData } from '../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

interface Props {
  formSlug: string;
  questions: Question[];
}

export default function ResponseTable({ formSlug, questions }: Props) {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  // Fetch form responses
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/forms/${formSlug}/responses`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        const rawResponses: ResponseData[] = res.data.responses;
        const validQuestionKeys = questions.map((q) => q.name);

        const cleaned = rawResponses.filter((r) => {
          if (validQuestionKeys.length === 0) return false;

          return validQuestionKeys.some((key) => {
            const val = r.answers[key];
            return typeof val === 'string' && val.trim() !== '' && val.toLowerCase() !== 'null';
          });
        });

        setResponses(cleaned);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to fetch responses');
      }
    };

    // authentication
    if (user?.accessToken) fetchResponses();
  }, [formSlug, user]);

  return (
    <div className="space-y-4 mt-4">
      {/* Responses count */}
      <p className="text-sm text-gray-600">
        Total Responses: <span className="font-bold">{responses.length}</span>
      </p>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full bg-white text-sm">
          {/* Table header */}
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Email</th>
              {questions.map((q) => (
                <th key={q.id} className="text-left px-4 py-2">{q.name}</th>
              ))}
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {responses.length > 0 ? (
              responses.map((res, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(res.date).toLocaleString()}</td>
                  <td className="px-4 py-2">{res.user.name}</td>
                  <td className="px-4 py-2">{res.user.email}</td>
                  {questions.map((q) => (
                    <td key={q.id} className="px-4 py-2 align-top">
                      {res.answers[q.name]
                        ? res.answers[q.name].includes(',')
                          ? (
                            <ul className="list-disc list-inside text-xs text-gray-800 space-y-1">
                              {res.answers[q.name].split(',').map((item, idx) => (
                                <li key={idx}>{item.trim()}</li>
                              ))}
                            </ul>
                          )
                          : res.answers[q.name]
                        : '-'}
                    </td>

                  ))}
                </tr>
              ))
            ) : (
              // No responses fetched
              <tr>
                <td colSpan={questions.length + 3} className="text-center py-6 text-gray-500 italic">
                  No responses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
