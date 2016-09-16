import React, { Component } from 'react';
import Dropdown from './Dropdown';
import ToolbarButton from './ToolbarButton';
import DropdownSchema from '../constants/DROPDOWN_SCHEMA';

export default class Toolbar extends Component {

	constructor() {
		super();
		this.renderMarkButton = this.renderMarkButton.bind(this);
		this.renderBlockButton = this.renderBlockButton.bind(this);
	}

	renderMarkButton(type, icon) {
		const {hasMark, setMark} = this.props;
		const isActive = hasMark(type);
		return(
			<ToolbarButton onMouseDown={(e) => setMark(e, type)} isActive={isActive} icon={icon}/>
		);
	}

	renderBlockButton(type, icon) {
		const {hasBlock, setBlock, hasParent} = this.props;
		let isActive;
		if(type !== 'ordered-list' && type !== 'unordered-list' && type !== 'code-block') {
			isActive = hasBlock(type);
		} else {
			isActive = hasParent(type);
		}
		return(
			<ToolbarButton onMouseDown={(e) => setBlock(e, type)} isActive={isActive} icon={icon}/>
		);
	}

	render() {
		return(
			<div className="text-editor__toolbar">
                <div className="text-editor__toolbar-control dropdown-controller">
                	<Dropdown 
	                    onChange={(e, value) => this.props.onDropdownChange(e, value)}
	                    activeBlock={DropdownSchema.filter((option) => this.props.hasBlock(option.value))[0]}
	                    schema={DropdownSchema}
                	/>
                </div>
                <div className="text-editor__toolbar-control node-controller">
                	<div className="text-editor__toolbar-group mark-group">
                		{this.renderMarkButton('bold', 'format_bold')}
                		{this.renderMarkButton('italic', 'format_italic')}
                		{this.renderMarkButton('underline', 'format_underlined')}
                		{this.renderMarkButton('strikethrough', 'format_strikethrough')}
                	</div>
                	<div className="text-editor__toolbar-group block-group">
                		{this.renderBlockButton('ordered-list', 'format_list_numbered')}
                		{this.renderBlockButton('unordered-list', 'format_list_bulleted')}
                		{this.renderBlockButton('blockquote', 'format_quote')}
                		{this.renderBlockButton('code-block', 'code')}
                		{this.renderBlockButton('image', 'image')}
                		{this.renderBlockButton('link', 'link')}
                	</div>
                	<div className="text-editor__toolbar-group history-group">
                		{this.renderBlockButton('undo', 'undo')}
                		{this.renderBlockButton('redo', 'redo')}
                	</div>
                </div>
            </div>
		);
	}
}