import React from 'react';
import { createRoot, ReactDOM } from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './components/store';

// const querySnapshot = await db.collectionGroup('Line Managers').where('isEmployeeHead', '==', 'false').get();
// querySnapshot.forEach((doc) => {
//   console.log(doc.id, ' => ', doc.data());
// });
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <Provider store={store}>
      <App />
    </Provider>

  </React.StrictMode>
);

// createRoot(document.getElementById('root')).render(<App />);

// 

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// reportWebVitals();
