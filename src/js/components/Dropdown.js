import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Dropdown extends Component {

	constructor(props) {
		super(props);
		this.mounted = true;
		this.state = { activeItem: props.schema[0].name, isOpen: false };
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.activeBlock !== undefined && nextProps.activeBlock !== this.state.activeItem) {
			this.setState({activeItem: nextProps.activeBlock.name});
		}
	}

	componentDidMount() {
		document.addEventListener('click', this.handleDocumentClick, false);
	}

	componentWillUnmount() {
		this.mounted = false;
		document.removeEventListener('click', this.handleDocumentClick, false);
	}

	handleDocumentClick(event) {
		event.preventDefault();
		if (this.mounted) {
			if (!ReactDOM.findDOMNode(this).contains(event.target)) {
				this.setState({ isOpen: false });
			}
		}
	}

	handleChange(value, name, e) {
		const {schema} = this.props;
		this.props.onChange(e, value);
		this.setState({
			isOpen: false,
			activeItem: name
		});
	}

	toggleDropdown(e) {
		e.preventDefault();
		this.setState({isOpen: !this.state.isOpen});
	}

	render() {
		const {schema} = this.props;
		const {activeItem, isOpen} = this.state;
		let rootClassName = 'text-editor__dropdown';
		if(isOpen) rootClassName += ' is-open';
		return(
			<div className={rootClassName}>
				<div onMouseDown={this.toggleDropdown}>{activeItem}</div>
				<ul>
					{schema.map((option, i) => {
						const {name, value} = option;
						return(
							<li 
								key={i} 
								value={value}
								onMouseDown={this.handleChange.bind(null, value, name)}
								className={activeItem === name ? 'selected' : ''}>
								{name}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}