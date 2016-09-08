import React, { Component } from 'react';
import { Editor, Raw } from 'slate';
import keycode from 'keycode';
import initialState from '../data/state.json';
import Toolbar from './Toolbar';
import DropdownOptions from '../constants/DropdownOptions';

const DEFAULT_NODE = 'paragraph';

function MarkHotkey(options) {
    const { type, key } = options;

    return {
        onKeyDown(event, data, state) {
            if (!event.metaKey || keycode(event.which) != key) return;

            return state
                .transform()
                .toggleMark(type)
                .apply();
        }
    }
}

const plugins = [
    MarkHotkey({ key: 'b', type: 'bold' }),
    MarkHotkey({ key: '`', type: 'code' }),
    MarkHotkey({ key: 'i', type: 'italic' }),
    MarkHotkey({ key: 'd', type: 'strikethrough' }),
    MarkHotkey({ key: 'u', type: 'underline' })
];

const state = Raw.deserialize(initialState, { terse: true });

const schema = {
    nodes: {
        'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
        'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
        'heading-three': props => <h3 {...props.attributes}>{props.children}</h3>,
        'heading-four': props => <h4 {...props.attributes}>{props.children}</h4>,
    },
    marks: {
        bold: props => <strong>{props.children}</strong>, 
        code: props => <code>{props.children}</code>,
        italic: props => <em>{props.children}</em>,
        strikethrough: props => <del>{props.children}</del>,
        underline: props => <u>{props.children}</u>,
    }
};


export default class TextEditor extends Component {

    constructor() {
        super()
        this.state = { state, schema };
        this.onChange = this.onChange.bind(this);
        this.hasMark = this.hasMark.bind(this);
        this.hasBlock = this.hasBlock.bind(this);
        this.renderEditor = this.renderEditor.bind(this);
        this.focus = this.focus.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.setMark = this.setMark.bind(this);
    }

    onChange(newState) {
        const {state} = this.state;
        this.setState({ state: newState });
    }

    hasMark(type) {
        const { state } = this.state;
        return state.marks.some(mark => mark.type == type);
    }

    setMark(e, type){
        e.preventDefault();
        let { state } = this.state;

        state = state
            .transform()
            .toggleMark(type)
            .apply();

        this.setState({ state });
    }

    hasBlock(type) {
        const { state } = this.state;
        return state.blocks.some(node => node.type == type);
    }

    handleDropdownChange(val) {
        let {state} = this.state;
        let transform = state.transform();
        const isActive = this.hasBlock(val);
        transform = transform.setBlock(isActive ? DEFAULT_NODE : val);
        state = transform.apply();
        this.setState({state});
    }

    renderToolbar() {
        return(
            <Toolbar 
                onDropdownChange={this.handleDropdownChange}
                activeBlock={DropdownOptions.filter((option) => this.hasBlock(option.value))}
                hasMark={this.hasMark}
                setMark={this.setMark}
            />
        );
    }

    focus() {
        this.refs.editor.focus();
    }

    renderEditor() {
        const { state, schema } = this.state;
        return(
            <div className="text-editor__editor" onClick={this.focus}>
                <Editor
                    placeholder={'Start typing...'}
                    state={state}
                    schema={schema}
                    onChange={this.onChange}
                    plugins={plugins}
                    ref="editor"
                />
            </div>
        );
    }

    render() {
        return(
            <div className="text-editor">
                {this.renderToolbar()}
                {this.renderEditor()}
            </div>
        );
    }

}