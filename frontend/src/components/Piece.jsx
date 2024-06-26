// import React from 'react'

// const Piece = () => {
//   return (
//     <div>
//       <div key={`(${indexi},${indexj})`} id={`(${indexi},${indexj})`} style={{
//                                 display: 'flex',
//                                 width: '4.5rem',
//                                 height: '4.5rem',
//                                 backgroundColor: (indexi + indexj) % 2 === 0 ? '#EEEED2' : '#769656',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 transitionDuration: '.5s',
//                             }}
//                                 onClick={(event) => handleMove(event, cell, indexi, indexj, 'w')}
//                             >
//                                 {cell ? (
//                                     <img
//                                         className='piece'
//                                         style={{
//                                             height: '3.8rem',
//                                             width: '4rem',
//                                         }}
//                                         src={`pieces/${cell.type}_${cell.color}.png`}
//                                         draggable="true"
//                                         onDragStart={(e) => handleDrag(e, cell, indexi, indexj)}
//                                         onDragOver={(e) => e.preventDefault()}
//                                         onDrop={(e) => handleDrop(e, cell, indexi, indexj, 'w')}
//                                     />
//                                 ) : (
//                                     <div
//                                         className='piece'
//                                         onClick={(e) => console.log(e.target)}
//                                         onDragOver={(e) => e.preventDefault()}
//                                         onDrop={(e) => handleDrop(e, cell, indexi, indexj)}
//                                     ></div>
//                                 )}
//                             </div>
//     </div>
//   )
// }

// export default Piece
// <div key={`(${indexi},${indexj})`} id={`(${indexi},${indexj})`} style={{
//                                 display: 'flex',
//                                 width: '4.5rem',
//                                 height: '4.5rem',
//                                 backgroundColor: (indexi + indexj) % 2 === 0 ? '#EEEED2' : '#769656',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 transitionDuration: '.5s',
//                             }}
//                                 onClick={(event) => handleMove(event, cell, indexi, indexj, 'w')}
//                             >
//                                 {cell ? (
//                                     <img
//                                         className='piece'
//                                         style={{
//                                             height: '3.8rem',
//                                             width: '4rem',
//                                         }}
//                                         src={`pieces/${cell.type}_${cell.color}.png`}
//                                         draggable="true"
//                                         onDragStart={(e) => handleDrag(e, cell, indexi, indexj)}
//                                         onDragOver={(e) => e.preventDefault()}
//                                         onDrop={(e) => handleDrop(e, cell, indexi, indexj, 'w')}
//                                     />
//                                 ) : (
//                                     <div
//                                         className='piece'
//                                         onClick={(e) => console.log(e.target)}
//                                         onDragOver={(e) => e.preventDefault()}
//                                         onDrop={(e) => handleDrop(e, cell, indexi, indexj)}
//                                     ></div>
//                                 )}
//                             </div>