import DangerousIcon from '@mui/icons-material/Dangerous';
import HomeIcon from '@mui/icons-material/Home';

export default function NoPage() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-8 text-red-500'>
      <DangerousIcon fontSize="large" className="text-red-500 scale-200" />
      <p className='text-2xl font-semibold text-gray-700'>404 Page Not Found</p>
      <button onClick={() => window.location.href = '/'} className='flex items-center gap-2 bg-indigo-500 px-2 py-1 rounded shadow hover:bg-indigo-600'>
        <HomeIcon fontSize="large" className="text-white" />
        <span className="font-semibold text-white">Back to Home</span>
      </button>
    </div>
  )
}
