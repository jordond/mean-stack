/*global describe, beforeEach, it, expect, inject, module*/
'use strict';

describe('userForm', function () {
  var scope
    , element;

  beforeEach(module('home', 'home/user-form-directive.tpl.html'));

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = $compile(angular.element('<user-form></user-form>'))(scope);
  }));

  it('should have correct text', function () {
    scope.$apply();
    expect(element.isolateScope().userForm.name).toEqual('userForm');
  });
});
