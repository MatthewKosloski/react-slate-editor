import React, { Component } from 'react';
import { Editor, Raw, Plain, Html, Void } from 'slate';
import keycode from 'keycode';
import initialState from '../states/blank.json';
import Toolbar from './Toolbar';
import Modal from './Modal';
import DEFAULT_NODE from '../constants/DEFAULT_NODE';
import BLOCK_TAGS from '../constants/BLOCK_TAGS';
import MARK_TAGS from '../constants/MARK_TAGS';
import { BOLD, ITALIC, STRIKETHROUGH, UNDERLINE } from '../constants/MARKS';
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
    PRE,
    IMAGE
} from '../constants/BLOCKS';

function createElement(tag, props, className, isSelfClosing) {
    const Tag = tag;
    const cls = className || '';
    if(isSelfClosing) {
        return <Tag className={cls} {...props.attributes} />
    } else {
        return <Tag className={cls} {...props.attributes}>{props.children}</Tag>
    }
}

function ImageNode(props) {
    const { node, state } = props;
    const src = node.data.get('src');
    return (
        <img src={src} {...props.attributes} />
    );
}

const rules = [
    {
        deserialize(el, next) {
            const type = BLOCK_TAGS[el.tagName];
            if (!type) return;
            return {
                kind: 'block',
                type: type,
                nodes: next(el.children)
            }
        },
        serialize(object, children) {
            if (object.kind !== 'block') return;
            if(object.type === IMAGE) {
                return <img src={object.data.get('src')} alt="caption_goes_here"/>;
            } else {
                switch (object.type) {
                    case DEFAULT_NODE: return <p>{children}</p>
                    case HEADING_ONE: return <h1>{children}</h1>
                    case HEADING_TWO: return <h2>{children}</h2>
                    case HEADING_THREE: return <h3>{children}</h3>
                    case HEADING_FOUR: return <h4>{children}</h4>
                    case ORDERED_LIST: return <ol>{children}</ol>
                    case UNORDERED_LIST: return <ul>{children}</ul>
                    case LIST_ITEM: return <li>{children}</li>
                    case BLOCKQUOTE: return <blockquote>{children}</blockquote>
                    case CODE_BLOCK:
                    case PRE:
                    return <pre>{children}</pre>
                }
            }
        }
    },
    {
        deserialize(el, next) {
            const type = MARK_TAGS[el.tagName];
            if (!type) return;
            return {
                kind: 'mark',
                type: type,
                nodes: next(el.children)
            }
        },
        serialize(object, children) {
            if (object.kind != 'mark') return;
            switch (object.type) {
                case BOLD: return <strong>{children}</strong>
                case ITALIC: return <em>{children}</em>
                case UNDERLINE: return <u>{children}</u>
                case STRIKETHROUGH: return <del>{children}</del>
            }
        }
    }
];

const html = new Html({ rules });
const state = Raw.deserialize(initialState, { terse: true });
const schema = { nodes: {}, marks: {} };
const { nodes, marks } = schema;

nodes[HEADING_ONE] = props => createElement('h1', props, null, false);
nodes[HEADING_TWO] = props => createElement('h2', props, null, false);
nodes[HEADING_THREE] = props => createElement('h3', props, null, false);
nodes[HEADING_FOUR] = props => createElement('h4', props, null, false);
nodes[ORDERED_LIST] = props => createElement('ol', props, null, false);
nodes[UNORDERED_LIST] = props => createElement('ul', props, null, false);
nodes[LIST_ITEM] = props => createElement('li', props, null, false);
nodes[BLOCKQUOTE] = props => createElement('blockquote', props, null, false);
nodes[PRE] = props => createElement('pre', props, null, false);
nodes[CODE_BLOCK] = props => createElement('pre', props, 'text-editor__code-block', false);
nodes[IMAGE] = ImageNode;

marks[BOLD] = props => createElement('strong', props, null, false);
marks[ITALIC] = props => createElement('em', props, null, false);;
marks[STRIKETHROUGH] = props => createElement('del', props, null, false);;
marks[UNDERLINE] = props => createElement('u', props, null, false);;

export default class TextEditor extends Component {

    constructor() {
        super()
        this.state = { 
            state, 
            schema,
            modalIsOpen: true
        };
        this.hasMark = this.hasMark.bind(this);
        this.hasBlock = this.hasBlock.bind(this);
        this.renderEditor = this.renderEditor.bind(this);
        this.onDropdownChange = this.onDropdownChange.bind(this);
        this.setMark = this.setMark.bind(this);
        this.setBlock = this.setBlock.bind(this);
        this.hasParent = this.hasParent.bind(this);
        this.onDocumentChange = this.onDocumentChange.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(state) {
        this.setState({ state });
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
        this.onChange(state);
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
        this.onChange(state);
    }

    onDropdownChange(e, type) {
        this.setBlock(e, type);
    }

    onDocumentChange(document, state) {
        const serializedHtml = html.serialize(state);
        this.props.onDocumentChange(serializedHtml);
    }

    renderToolbar() {
        return(
            <Toolbar 
                onDropdownChange={this.onDropdownChange}
                hasMark={this.hasMark}
                setMark={this.setMark}
                hasBlock={this.hasBlock}
                setBlock={this.setBlock}
                hasParent={this.hasParent}
                renderModal={this.renderModal}
            />
        );
    }

    renderEditor() {
        const { state, schema } = this.state;
        return(
            <div className="text-editor__editor" onClick={() => this.refs.editor.focus()}>
                <Editor
                    placeholder="Start typing..."
                    state={state}
                    schema={schema}
                    onChange={this.onChange}
                    onDocumentChange={(document, state) => this.onDocumentChange(document, state)}
                    ref="editor"
                />
            </div>
        );
    }

    renderModal(title, description, placeholder) {
        const { modalIsOpen } = this.props;
        if(!modalIsOpen) return;
        return (
            <Modal
                title={title}
                onClose={() => {this.setState({modalIsOpen: false})}}
                description={description}
                placeholder={placeholder}
                isOpen={modalIsOpen}
            />
        );
    }

    insertImage(state, src) {
        return state
            .transform()
            .insertBlock({
                type: IMAGE,
                isVoid: true,
                data: { src }
            }).apply();
    }

    addImage(e) {
        e.preventDefault()
        const src = window.prompt('Enter the URL of the image:');
        if (!src) return;
        let { state } = this.state;
        state = this.insertImage(state, src);
        this.onChange(state);
    }

    render() {
        return(
            <div className="text-editor">
                <button onClick={this.addImage.bind(this)}>Add Image</button>
                {this.renderModal()}
                {this.renderToolbar()}
                {this.renderEditor()}
            </div>
        );
    }

}