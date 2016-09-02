import React, { Component } from 'react';
import { Editor, Raw } from 'slate';

const initialState = Raw.deserialize({
    nodes: [
        {
            kind: 'block',
            type: 'paragraph',
            nodes: [
                {
                    kind: 'text',
                    text: 'Lorem ipsum dolor sit amet.'
                }
            ]
        }
    ]
}, { terse: true })

export default class TextEditor extends Component {

    constructor() {
        super()
        this.state = {
            state: initialState
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(state) {
        this.setState({state});
    }

    handleKeyDown(e, data, state) {
        if (e.which != 55 || !e.shiftKey) return;
        return state.transform().insertText('and').apply();
    }

    render() {
        const {state} = this.state;
        return (
            <div className="text-editor">
                <Editor
                    state={state}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                />
            </div>
        )
    }

}