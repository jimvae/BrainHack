import React from 'react';

const Rank = ( {name, entries}) => {
    return (
        <div>
            <div className='f3'>
                <span className='name, blue'>{name}</span>, your current entry count is...
            </div>
            <div className='entry f1'>
                {entries}
            </div>
        </div>
    )
}

export default Rank;