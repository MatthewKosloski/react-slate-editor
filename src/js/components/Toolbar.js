import React, { Component } from 'react';
import Dropdown from './Dropdown';
import DropdownSchema from '../constants/DropdownSchema';

const ToolbarButton = ({onMouseDown, isActive, icon}) => {
	return(
		<div className="text-editor__button" onMouseDown={onMouseDown} data-active={isActive}>
			<span className="material-icons">{icon}</span>
		</div>
	);
};

export default class Toolbar extends Component {

	constructor() {
		super();
		this.handleDropdownChange = this.handleDropdownChange.bind(this);
		this.renderMarkButton = this.renderMarkButton.bind(this);
		this.renderBlockButton = this.renderBlockButton.bind(this);
	}

	handleDropdownChange(e, value) {
		this.props.onDropdownChange(e, value);
	}

	renderMarkButton(type, icon) {
		const {hasMark, setMark} = this.props;
		const isActive = hasMark(type);
		const onMouseDown = (e) => setMark(e, type);
		return(
			<ToolbarButton 
				onMouseDown={onMouseDown}
				isActive={isActive}
				icon={icon}
			/>
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
		const onMouseDown = (e) => setBlock(e, type);
		return(
			<ToolbarButton 
				onMouseDown={onMouseDown}
				isActive={isActive}
				icon={icon}
			/>
		);
	}

	render() {
		return(
			<div className="text-editor__toolbar">
                <div className="text-editor__toolbar-control dropdown-controller">
                	<Dropdown 
	                    onChange={this.handleDropdownChange}
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