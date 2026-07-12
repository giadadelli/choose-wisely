/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
  rules: {
    // Il design system (SCRUM-6) usa BEM (es. .btn--primary, .chip--selected)
    // per le varianti dei componenti — il pattern kebab-case di default non
    // ammette i separatori doppi di BEM.
    'selector-class-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
    // Breakpoint mobile-first documentati in tokens.css usano min-width
    // tradizionale (supporto browser piu' ampio della range syntax moderna).
    'media-feature-range-notation': 'prefix',
  },
}
