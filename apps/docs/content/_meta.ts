import type { MetaRecord } from 'nextra';

/**
 * type MetaRecordValue =
 *  | TitleSchema
 *  | PageItemSchema
 *  | SeparatorSchema
 *  | MenuSchema
 *
 * type MetaRecord = Record<string, MetaRecordValue>
 **/
const meta: MetaRecord = {
  index: {
    title: 'ddo-dnd',
    type: 'page',
  },
  'why-ddodnd': {
    title: 'Why ddo-dnd?',
  },
  docs: {
    title: 'Docs',
  },
  'getting-started': {
    title: 'Getting Started',
  },
  usage: {
    title: 'Usage',
  },
  api: {
    title: 'API',
  },
  advanced: {
    title: 'Advanced',
  },
};

export default meta;
