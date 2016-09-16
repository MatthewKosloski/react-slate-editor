import React, {Component} from 'react';
import {render} from 'react-dom';
import TextEditor from './components/TextEditor';
import Preview from './components/Preview';

const renderPreview = (serializedHtml) => {
	render(<Preview value={serializedHtml} />, document.getElementById('output'));
};

render(<TextEditor onDocumentChange={renderPreview}/>, document.getElementById('app'));

renderPreview();