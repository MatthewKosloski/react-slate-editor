import React, {Component} from 'react';
import {render} from 'react-dom';
import TextEditor from './components/TextEditor';

const app = (
	<div className="container">
		<TextEditor />
	</div>
);

render(app, document.getElementById('app'));