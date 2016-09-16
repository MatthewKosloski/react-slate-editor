import React, { Component } from 'react';

export default class Preview extends Component {
	render() {
		const {value} = this.props;
		return(
			<textarea value={value} readOnly></textarea>
		);
	}
}