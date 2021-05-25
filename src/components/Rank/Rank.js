import React from 'react';
import './Rank.css'
const Rank = ( {name, entries}) => {
    return (
        <div className='rank'>
            <div className='f2'>
                <span className='name blue'>{name}</span>, your current entry count is...
            </div>
            <div className='entry f1'>
                {entries}
            </div>
        </div>
    )
}

export default Rank;