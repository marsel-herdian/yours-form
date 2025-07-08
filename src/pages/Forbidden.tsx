import BlockIcon from '@mui/icons-material/Block';
import HomeIcon from '@mui/icons-material/Home';

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8">
      <BlockIcon fontSize="large" className="text-red-500 scale-200" />
      <p className='text-2xl font-semibold text-gray-700'>Sorry, you are not allowed to fill this form</p>
      <button onClick={() => window.location.href = '/'} className='flex items-center gap-2 bg-indigo-500 px-2 py-1 rounded shadow hover:bg-indigo-600'>
        <HomeIcon fontSize="large" className="text-white" />
        <span className="font-semibold text-white">Back to Home</span>
      </button>
    </div>
  )
}
