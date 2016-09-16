import DEFAULT_NODE from './DEFAULT_NODE';
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
} from './BLOCKS';

export default {
    p: DEFAULT_NODE,
    h1: HEADING_ONE,
    h2: HEADING_TWO,
    h3: HEADING_THREE,
    h4: HEADING_FOUR,
    ol: ORDERED_LIST,
    ul: UNORDERED_LIST,
    li: LIST_ITEM,
    blockquote: BLOCKQUOTE,
    pre: CODE_BLOCK,
    pre: PRE
};