/**
 * Imports of non-standard files
 */
declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.png' {
  const content: any
  export default content
}
declare module '*.jpg' {
  const content: any
  export default content
}

declare module '*.ico' {
  const content: any
  export default content
}

declare module '*.json' {
  const content: any
  export default content
}

declare module 'react-multiselect-checkboxes' {
  const ReactMultiSelectCheckboxes: any
  export default ReactMultiSelectCheckboxes
}
declare module 'react-slideshow-image' {
  const content: any
  export default content
}

/**
 * Extra properties on Window
 */

declare interface Window {
  INITIAL_STATE: any, // Used by Redux in src/store/createStore.ts
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any // Used by Redux DevTools
}