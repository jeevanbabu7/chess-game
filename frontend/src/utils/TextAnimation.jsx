import React, { useEffect } from 'react';
import anime from 'animejs';

const AnimatedText = () => {
  useEffect(() => {
    // Wrap every letter in a span
    const textWrapper = document.querySelectorAll('.ml3');
    console.log(textWrapper);
    for(let i = 0;i<textWrapper.length;++i) {
        textWrapper[i].innerHTML = textWrapper[i].textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        anime.timeline({ loop: false })
            .add({
            targets: '.ml3 .letter',
            opacity: [0, 1],
            easing: "easeInOutQuad",
            duration: 1000,
            delay: (el, i) => 70 * (i + 1)
            });
    }
 
    // Clean up animation on unmount (optional)
    return () => {
      anime.remove('.ml3 .letter');
      anime.remove('.ml3');
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <>
        <div 
            className="ml3" 
            style={{
                fontSize: '4.5rem',
                fontWeight: 800,
                color: 'whitesmoke',
              
            }}
        >
        Chessly.com
        </div>

        <div 
            className="ml3" 
            style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'whitesmoke'
            }}
        >
        Free chess reviews.....
        </div>
    </>
    
  );
};

export default AnimatedText;
