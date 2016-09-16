import React, { Component } from 'react';

export default class Modal extends Component {
	render() {
		const { title, description, placeholder, isOpen, onClose} = this.props;
		return(
			<div className="modal" data-open={isOpen}>
				<div className="modal__inner">
					<div className="modal__top">
						<span onClick={onClose}>format_close</span>
						<h1>{title}</h1>
						<p>{description}</p>
					</div>
					<div className="modal__bottom">
						<form>
							<input type="text" placeholder={placeholder}/>
						</form>
					</div>
				</div>
			</div>
		);
	}
}