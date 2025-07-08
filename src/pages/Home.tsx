import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { FormData } from '../types';

export default function Home() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'slug' | null>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const perPage = 8;
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  // Fetch all data forms 
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/forms`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        setForms(res.data.forms);
      } catch (err) {
        console.error('Error fetching forms:', err);
      }
    };

    if (user?.accessToken) fetchForms();
  }, [user]);

  // Set title
  useEffect(() => {
    document.title = `Home | Yours Form`;
  }, []);

  // Navigate to create form
  const handleCreateForm = () => {
    navigate('/form/create');
  };

  // Filter, Sort, Paginate
  const filteredAndSortedForms = useMemo(() => {
    let filtered = forms.filter((form) =>
      [form.name, form.slug, form.description]
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    if (sortBy) {
      filtered = filtered.sort((a, b) => {
        const valA = a[sortBy]!.toLowerCase();
        const valB = b[sortBy]!.toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered.slice((page - 1) * perPage, page * perPage);
  }, [forms, searchQuery, sortBy, sortOrder, page]);

  const totalPages = Math.ceil(
    forms.filter((f) =>
      [f.name, f.slug, f.description].join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    ).length / perPage
  );
  const visiblePages = 3;
  const start = Math.max(1, page - Math.floor(visiblePages / 2));
  const end = Math.min(totalPages, start + visiblePages - 1);

  const toggleSort = (column: 'name' | 'slug') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (

    <div className="flex flex-col gap-6 w-11/12 md:w-10/12 mx-auto">

      {/* Header */}
      <div className="flex justify-end items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="px-3 py-2 border border-gray-300 rounded w-64 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 transition"
          />

          <button
            onClick={handleCreateForm}
            className="flex bg-white text-gray-800 font-semibold py-2 px-4 border border-transparent hover:border-indigo-400 rounded shadow transition duration-300 ease-in-out"
          >
            <AddIcon fontSize="medium" className="inline mr-2" />
            New Form
          </button>
        </div>

      </div>

      {/* Sortable Headings  */}
      <div className="grid grid-cols-4 font-semibold text-gray-600 text-sm px-4">
        <button
          onClick={() => toggleSort('name')}
          className={`flex items-center gap-1 text-left ${sortBy === 'name' ? 'text-indigo-600 font-bold' : ''
            }`}
        >
          Name
          {sortBy === 'name' && (
            sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
          )}
        </button>

        <button
          onClick={() => toggleSort('slug')}
          className={`flex items-center gap-1 text-left ${sortBy === 'slug' ? 'text-indigo-600 font-bold' : ''
            }`}
        >
          Slug
          {sortBy === 'slug' && (
            sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
          )}
        </button>

        <span>Description</span>
        <span>Response Limitation</span>
      </div>

      {/* Form rows */}
      <div className="flex flex-col gap-2">
        {filteredAndSortedForms.length > 0 ? (
          filteredAndSortedForms.map((form) => (
            <div
              key={form.id}
              onClick={() => navigate(`/form/${form.slug}`)}
              className="grid grid-cols-4 bg-white px-4 py-3 rounded-md shadow hover:bg-indigo-100 transition cursor-pointer"
            >
              <span>{form.name}</span>
              <span className="text-indigo-600 font-mono">{form.slug}</span>
              <span>{form.description}</span>
              <span>{form.limit_one_response ? 'once' : 'none'}</span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-6">
            No matching forms found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">

          {/* Prev */}
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className={`w-8 h-8 rounded-full text-sm font-bold ${page === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            ‹
          </button>

          {/* Page Numbers */}
          {Array.from({ length: end - start + 1 }).map((_, i) => {
            const pageNum = start + i;

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-8 h-8 rounded-full text-sm font-semibold ${page === pageNum
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next */}
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className={`w-8 h-8 rounded-full text-sm font-bold ${page === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            ›
          </button>
        </div>
      )}

    </div>
  );
}
