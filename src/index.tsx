import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';

import Main from './components/main/main'
import Navbar from './components/nav/navbar'
import Catalog from './components/catalog/catalog'
import Footer from './components/footer/footer'

ReactDOM.render(
<div>
<Navbar />
<Main />
<Catalog />
<Footer />
</div>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
