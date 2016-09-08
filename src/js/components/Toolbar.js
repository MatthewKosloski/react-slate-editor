import React, { Component } from 'react';
import Dropdown from './Dropdown';
import DropdownOptions from '../constants/DropdownOptions';

export default class Toolbar extends Component {

	constructor() {
		super();
		this.handleDropdownChange = this.handleDropdownChange.bind(this);
		this.renderButton = this.renderButton.bind(this);
	}

	handleDropdownChange(value) {
		this.props.onDropdownChange(value);
	}

	renderButton(type, icon) {
		const isActive = this.props.hasMark(type);
		const onMouseDown = (e) => this.props.setMark(e, type);
		return(
			<li className="text-editor__button" onMouseDown={onMouseDown} data-active={isActive}>
				<span className="material-icons">{icon}</span>
			</li>
		);
	}

	render() {
		return(
			<div className="text-editor__toolbar">
                <div className="text-editor__toolbar-control dropdown-controller">
                	<Dropdown 
	                    onChange={this.handleDropdownChange}
	                    activeBlock={this.props.activeBlock[0].name}
	                    options={DropdownOptions}
                	/>
                </div>
                <div className="text-editor__toolbar-control bius-controller">
                	<ul>
                		{this.renderButton('bold', 'format_bold')}
                		{this.renderButton('italic', 'format_italic')}
                		{this.renderButton('underline', 'format_underlined')}
                		{this.renderButton('strikethrough', 'format_strikethrough')}
                	</ul>
                </div>
            </div>
		);
	}
}