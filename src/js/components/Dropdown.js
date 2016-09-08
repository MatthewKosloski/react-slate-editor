import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Dropdown extends Component {

	constructor(props) {
		super(props);
		this.mounted = true;
		this.defaultItem = props.options[0].name;
		this.state = { activeItem: this.defaultItem, isOpen: false };
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.activeBlock !== this.state.activeItem) {
			this.setState({activeItem: nextProps.activeBlock});
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

	handleChange(value) {
		const {options} = this.props;
		this.props.onChange(value);
		this.setState({
			activeItem: options[options.findIndex((i) => i.value === value)].name,
			isOpen: false
		});
	}

	toggleDropdown(e) {
		e.preventDefault();
		this.setState({isOpen: !this.state.isOpen});
	}

	render() {
		const {options} = this.props;
		const {activeItem, isOpen} = this.state;
		let rootClassName = 'text-editor__dropdown';
		if(isOpen) rootClassName += ' is-open';
		return(
			<div className={rootClassName}>
				<div onMouseDown={this.toggleDropdown}>{activeItem}</div>
				<ul>
					{options.map((option, i) => {
						const {name, value} = option;
						return(
							<li 
								key={i} 
								value={value}
								onClick={this.handleChange.bind(null, value)}
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