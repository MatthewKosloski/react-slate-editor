import React, {Component} from 'react';
import { Editor, Raw, Plain, Html, Void } from 'slate';
import initialState from '../states/blank.json';

const schema = {
  nodes: {
    image: (props) => {
      const { node, state } = props
      const src = node.data.get('src')
      return (
        <img src={src} {...props.attributes} />
      )
    }
  }
}

export default class TestEditor extends Component {

	constructor() {
		super();
		this.state = {
			state: Raw.deserialize(initialState, { terse: true })
		};
		this.onChange = this.onChange.bind(this);
		this.insertImage = this.insertImage.bind(this);
		this.onClickImage = this.onClickImage.bind(this);
	}

	onChange(state) {
		this.setState({state});
	}

	insertImage(state, src) {
		return state
			.transform()
			.insertBlock({
				type: 'image',
				isVoid: true,
				data: { src }
			})
			.apply()
	}

	onClickImage(e) {
		e.preventDefault()
		const src = window.prompt('Enter the URL of the image:')
		if (!src) return
		let { state } = this.state
		state = this.insertImage(state, src)
		this.onChange(state)
	}

	render() {
		return(
			<div>
				<button onClick={this.onClickImage}>Add Image</button>
				<Editor
					schema={schema}
					state={this.state.state}
					onChange={this.onChange}
		    	/>
			</div>
		);
	}
}