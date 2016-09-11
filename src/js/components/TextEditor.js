import React, { Component } from 'react';
import { Editor, Raw } from 'slate';
import keycode from 'keycode';
import initialState from '../states/blank.json';
import Toolbar from './Toolbar';
import {
    HEADING_ONE,
    HEADING_TWO,
    HEADING_THREE,
    HEADING_FOUR,
    ORDERED_LIST,
    UNORDERED_LIST,
    LIST_ITEM,
    BLOCKQUOTE,
    CODE_BLOCK,
    PRE
} from '../constants/nodes';

import {
    BOLD,
    ITALIC,
    STRIKETHROUGH,
    UNDERLINE
} from '../constants/marks';

const DEFAULT_NODE = 'paragraph';
const state = Raw.deserialize(initialState, { terse: true });
const schema = { nodes: {}, marks: {} };
const { nodes, marks } = schema;

nodes[HEADING_ONE] = props => <h1 {...props.attributes}>{props.children}</h1>;
nodes[HEADING_TWO] = props => <h2 {...props.attributes}>{props.children}</h2>;
nodes[HEADING_THREE] = props => <h3 {...props.attributes}>{props.children}</h3>;
nodes[HEADING_FOUR] = props => <h4 {...props.attributes}>{props.children}</h4>;
nodes[ORDERED_LIST] = props => <ol {...props.attributes}>{props.children}</ol>;
nodes[UNORDERED_LIST] = props => <ul {...props.attributes}>{props.children}</ul>;
nodes[LIST_ITEM] = props => <li {...props.attributes}>{props.children}</li>;
nodes[BLOCKQUOTE] = props => <blockquote {...props.attributes}>{props.children}</blockquote>;
nodes[CODE_BLOCK] = props => <pre className="text-editor__code-block" {...props.attributes}><code>{props.children}</code></pre>;
nodes[PRE] = props => <pre {...props.attributes}>{props.children}</pre>;

marks[BOLD] = props => <strong>{props.children}</strong>;
marks[ITALIC] = props => <em>{props.children}</em>;
marks[STRIKETHROUGH] = props => <del>{props.children}</del>;
marks[UNDERLINE] = props => <u>{props.children}</u>;

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
        this.setBlock = this.setBlock.bind(this);
        this.hasParent = this.hasParent.bind(this);
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

    hasParent(type) {
        const { state } = this.state;
        const { document } = state;
        return state.blocks.some((block) => !!document.getClosest(block, parent => parent.type == type));
    }

    setBlock(e, type){
        e.preventDefault();
        let { state } = this.state;
        let transform = state.transform();

        switch(type) {
            case UNORDERED_LIST:
            case ORDERED_LIST: {
                const isListItem = this.hasBlock(LIST_ITEM);
                // checks whether the current element is inside of parent (type)
                const parentIsList = this.hasParent(type);

                /* 
                    if: selected text is a current list item (li) within a list (ul or ol)
                    then: change it to a paragraph (DEFAULT_NODE) and remove it from parent
                    else: make selected text a list item (li) and put it in a list (ul or ol)
                */
                if (isListItem && parentIsList) {
                    transform = transform
                        .setBlock(DEFAULT_NODE)
                        .unwrapBlock(UNORDERED_LIST)
                        .unwrapBlock(ORDERED_LIST);
                } else {
                    transform = transform
                        .setBlock(LIST_ITEM)
                        .wrapBlock(type);
                }
                break;
            }
            case CODE_BLOCK: {
                const isPre = this.hasBlock(PRE);
                const parentisCodeBlock = this.hasParent(type);

                if(isPre && parentisCodeBlock) {
                    transform = transform
                        .setBlock(DEFAULT_NODE)
                        .unwrapBlock(CODE_BLOCK);
                } else {
                    transform = transform
                        .setBlock(PRE)
                        .wrapBlock(type);
                }
                break;
            }
            default: {
                const isActive = this.hasBlock(type);
                const isListItem = this.hasBlock(LIST_ITEM);
                transform = transform
                    .setBlock(isActive ? DEFAULT_NODE : type);
            }
        }

        state = transform.apply();
        this.setState({ state });
    }

    handleDropdownChange(e, type) {
        this.setBlock(e, type);
    }

    renderToolbar() {
        return(
            <div>
                <Toolbar 
                    onDropdownChange={this.handleDropdownChange}
                    hasMark={this.hasMark}
                    setMark={this.setMark}
                    hasBlock={this.hasBlock}
                    setBlock={this.setBlock}
                    hasParent={this.hasParent}
                />
            </div>
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