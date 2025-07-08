import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';

// Yup schema
const schema = yup.object({
  name: yup.string().required('Form name is required'),
  slug: yup
    .string()
    .required('Slug is required')
    .matches(/^[a-z0-9-]+$/, 'Slug must be lowercase and URL-friendly'),
  allowed_domains: yup.string().default('Allowed domain is required'),
  description: yup.string().default(''),
  limit_one_response: yup.boolean().default(false),
});

type FormInputs = yup.InferType<typeof schema>;

export default function CreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      limit_one_response: false,
    },
  });
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const nameValue = watch('name');
  const [showSuggestion, setShowSuggestion] = useState(false);

  // Set title
  useEffect(() => {
      document.title = `Create New Form | Yours Form`;
  }, []);

  // Slug auto suggestion
  const suggestedSlug = nameValue
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') || '';

  // Create form handler
  const onSubmit = async (data: FormInputs) => {
    try {
      const payload = {
        ...data,
        allowed_domains: [data.allowed_domains],
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/forms`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      const newSlug = res.data.form.slug;
      navigate(`/form/${newSlug}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create form');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Form</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 gap-4 bg-white p-6 rounded shadow">
        <div className="flex flex-col gap-4">
          {/* Name */}
          <TextField
            label="Form Name"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message || ' '}
          />

          {/* Slug + Suggestion */}
          <div className="relative">
            <TextField
              label="Slug (URL Path)"
              fullWidth
              {...register('slug')}
              error={!!errors.slug}
              helperText={errors.slug?.message || ' '}
              onFocus={() => setShowSuggestion(true)}
              onBlur={() => setTimeout(() => setShowSuggestion(false), 200)}
              InputLabelProps={{ shrink: true }}
            />

            {showSuggestion && suggestedSlug && (
              <div
                className="absolute z-10 top-14 bg-white border border-gray-300 shadow-sm rounded px-3 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setValue('slug', suggestedSlug);
                  setShowSuggestion(false);
                }}
              >
                Suggested slug: <span className="font-mono text-indigo-600">{suggestedSlug}</span>
              </div>
            )}
          </div>

          {/* Allowed Domains */}
          <TextField
            label="Allowed Domain"
            fullWidth
            placeholder="example: webtech.id"
            {...register('allowed_domains')}
            error={!!errors.allowed_domains}
            helperText={errors.allowed_domains?.message || ' '}
          />


          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message || ' '}
          />
        </div>

        {/* Limit Checkbox */}
        <FormControlLabel
          control={<Checkbox {...register('limit_one_response')} />}
          label="Limit to 1 response per user"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Form'}
        </Button>
      </form>
    </div>
  );
}
