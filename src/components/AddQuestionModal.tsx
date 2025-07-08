import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import type { AddQuestionModalProps } from '../types';

// define choice types
const choiceTypes = [
  'short answer',
  'paragraph',
  'date',
  'multiple choice',
  'dropdown',
  'checkboxes',
];

// Yup schema
const schema = yup.object({
  name: yup.string().required('Question name is required'),
  choice_type: yup.string().oneOf(choiceTypes).required('Choice type is required'),
  is_required: yup.boolean().default(false),
  choices: yup
    .string()
    .default('')
    .when('choice_type', {
      is: (val: string) =>
        ['multiple choice', 'dropdown', 'checkboxes'].includes(val),
      then: (schema) => schema.required('Choices required'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

type QuestionFormInput = yup.InferType<typeof schema>;

export default function AddQuestionModal({
  open,
  onClose,
  onSave,
}: AddQuestionModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<QuestionFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      choice_type: '',
      is_required: false,
      choices: '',
    },
  });
  const choiceType = watch('choice_type');

  // Clear form when modal is closed
  useEffect(() => {
    if (!open) reset(); 
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className='text-center'>Add New Question</DialogTitle>
      <DialogContent className="flex flex-col gap-4">

        {/* Question Name */}
        <TextField
          label="Question Name"
          fullWidth
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message || " "}
        />

        {/* Choice Type */}
        <TextField
          label="Choice Type"
          select
          fullWidth
          {...register('choice_type')}
          error={!!errors.choice_type}
          helperText={errors.choice_type?.message || " "}
        >
          {choiceTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>


        {/* Options */}
        {['multiple choice', 'dropdown', 'checkboxes'].includes(choiceType) && (
          <TextField
            label="options (comma separated)"
            fullWidth
            {...register('choices')}
            error={!!errors.choices}
            helperText={errors.choices?.message || 'e.g. Option A, Option B'}
          />
        )}

        {/* Required Checkbox */}
        <FormControlLabel
          control={<Controller name="is_required" control={control} render={({ field }) => (
            <Checkbox {...field} checked={field.value} />
          )} />}
          label="Required"
        />

      </DialogContent>

      {/* Buttons */}
      <DialogActions className="px-6 pb-4">
        <Button onClick={onClose} >Cancel</Button>
        <Button onClick={handleSubmit(onSave)} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
