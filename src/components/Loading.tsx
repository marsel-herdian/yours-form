import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <CircularProgress color="primary" size={48} />
        <p className="text-gray-600 text-sm"></p>
      </div>
    </div>
  );
}
