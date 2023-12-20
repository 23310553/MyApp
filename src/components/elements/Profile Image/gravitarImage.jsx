import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { SHA256 } from 'crypto-js';

const GravatarComponent = () => {
  const [gravatarUrl, setGravatarUrl] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const email = user.email;
        const hashedEmail = SHA256(email.toLowerCase().trim()).toString();
        const url = `https://gravatar.com/avatar/${hashedEmail}.jpg`;
        setGravatarUrl(url);
      } else {
        // User is signed out
        setGravatarUrl(null);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {gravatarUrl ? (
        <img src={gravatarUrl} alt="Gravatar" />
      ) : (
        <img src="https://gravatar.com/avatar/d=mp.jpg" alt="Gravatar" /> // Inputs default image if email has none assigned to it
      )}
    </div>
  );
};

export default GravatarComponent;