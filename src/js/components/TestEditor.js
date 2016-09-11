import React, { Component } from 'react';
import { Editor, Raw } from 'slate';
import initialState from '../data/state.json';

const DEFAULT_NODE = 'paragraph';

const state = Raw.deserialize(initialState, { terse: true });

function CodeNode(props) {
  return <pre {...props.attributes}><code>{props.children}</code></pre>
}


const schema = {
    nodes: {
        'code-block': CodeNode
    }
};

export default class TestEditor extends Component {

    constructor() {
        super()
        this.state = { state, schema };
        this.onChange = this.onChange.bind(this);
        this.setBlock = this.setBlock.bind(this);
    }

    onChange(newState) {
        const {state} = this.state;
        this.setState({ state: newState });
    }

    setBlock(type, e) {
       console.log(type);
       console.log(e.target);
    }

    render() {
        const {state, schema} = this.state;
        return(
           <div>
                <button onMouseDown={this.setBlock.bind(null, 'code-block')}>CodeBlock</button>
               <Editor
                    placeholder={'Start typing...'}
                    state={state}
                    schema={schema}
                    onChange={this.onChange}
                />
           </div>
        );
    }

}