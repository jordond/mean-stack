'use strict';

/**
 * Default User Settings
 * To be used to render HTML forms
 *
 * REQUIRED:
 * name: String
 * type: String
 * options: Array (Required if type is `radio/select`)
 *
 * OPTIONAL:
 * default: String/Boolean/etc
 * placeholder: String
 * required: Boolean
 *
 * Value will be saved to `value: type`
 */

module.exports = [{
  name: 'setting1',
  type: 'text',
  placeholder: 'setting1',
  default: 'setting1'
}, {
  name: 'setting2',
  type: 'radio',
  options: ['yes', 'no'],
  default: 'no',
  required: true
}, {
  name: 'setting3',
  type: 'select',
  options: ['one', 'two', 'three'],
  default: 'two',
  required: true
}];
