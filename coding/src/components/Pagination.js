import React from 'react'
import '../App.css';

const Pagination = ({currentPage, postsPerPage, totalPosts, paginate}) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts/postsPerPage); i++) {

        pageNumbers.push(i)

    }

    return (
        <nav>
            <ul className="pagination">

                <li  className="page-item">
                    <a onClick={() =>  paginate("back")} className='page-link'>
                        <span aria-hidden="true">«</span>
                    </a>
                </li>
                {pageNumbers.map(number => (

                    <li key={number} className={(currentPage === number ? 'active ' : '')} >
                        <a onClick={() =>  paginate(number)} className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
                
                <li  className="page-item">
                    <a onClick={() =>  paginate("forward")} className='page-link'>
                        <span aria-hidden="true">»</span>
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination