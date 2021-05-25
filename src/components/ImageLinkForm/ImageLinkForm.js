import React from 'react';
import './ImageLinkForm.css'
import search from './search.png';
const ImageLinkForm = ( { onInputChange, onButtonSubmit }) => {
    return (
        <div>
            <p className='f3 motto'>
                {'BrainHack will detect faces in your pictures. Give it a try!'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-100 center search-field' type='text' placeholder='Enter your image link' onChange={onInputChange}/>
                    <button 
                        className='grow f4 pa2 link ph3 pv2 dib white search-button' 
                        onClick={onButtonSubmit}>
                            <img src={search}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;