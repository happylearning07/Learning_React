import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { removeFromPastes } from '../redux/pasteSlice';
import toast from 'react-hot-toast';

const Paste = () => {

  const pastes = useSelector((state)=>state.paste.pastes);
  const [searchTerm,setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const filteredData = pastes.filter(
    (paste)=>paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleDelete(pasteId){
    dispatch(removeFromPastes(pasteId));
  }

  const shareText = async (textToShare) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share Text',
          text: textToShare,
        });
        console.log('Text shared successfully');
        toast.success('Shared successfully');
      } catch (error) {
        console.error('Error sharing text:', error);
        toast.error('Share cancelled or failed');
      }
    } else {
      // Fallback for browsers without Web Share API:
      // copy to clipboard and notify user (better UX than simple alert)
      try {
        await navigator.clipboard.writeText(textToShare);
        toast.success('Text copied to clipboard (paste it to share)');
        // Optionally open mail client:
        // const mailBody = encodeURIComponent(textToShare);
        // window.location.href = `mailto:?subject=${encodeURIComponent('Shared Note')}&body=${mailBody}`;
      } catch (err) {
        // If clipboard fails, show a simple alert as last resort
        console.warn('Clipboard write failed, falling back to alert', err);
        alert('Web Share API not supported and copying failed. You can manually select and copy the text:\n\n' + textToShare);
      }
    }
  };


  return (
    <div>
      <input
        className='p-2 rounded-2xl min-w-[600px] mt-5'
        type='search'
        placeholder='search here'
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
      
      />

      <div className='flex flex-col gap-5 mt-5'>
        {
          filteredData.length > 0 && filteredData.map(
            (paste)=>{
              return (
                <div className='border' key={paste?._id}>
                  <div>
                    {paste.title}
                  </div>
                  <div>
                    {paste.content}
                  </div>
                  <div className='flex flex-row gap-4 place-content-evenly'>
                    <button>
                      <a href={`/?pasteId=${paste?._id}`}>
                        Edit
                      </a>
                    </button>
                    <button>
                      <a href={`/pastes/${paste?._id}`}>
                        View
                      </a>
                    </button>
                    <button onClick={()=>handleDelete(paste?._id)}>
                      Delete
                    </button>
                    <button onClick={()=>{navigator.clipboard.writeText(paste?.content)
                      toast.success("copied to clipboard")
                    }}>
                      Copy
                    </button>
                    <button onClick={() => shareText(`${paste.title ? paste.title + '\n\n' : ''}${paste.content || ''}`)}>
                      Share
                    </button>
                  </div>
                  <div>
                      {paste.createdAt}
                  </div>
                </div>
              ) 
            }
          )
        }

      </div>
    </div>
  )
}

export default Paste