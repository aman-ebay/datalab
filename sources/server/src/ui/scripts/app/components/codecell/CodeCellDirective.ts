/*
 * Copyright 2014 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */


/**
 * Directive for creating a single code cell
 */
/// <reference path="../../../../../../../../externs/ts/angularjs/angular.d.ts" />
/// <amd-dependency path="app/components/editorcell/EditorCellDirective" />
/// <amd-dependency path="app/components/sessions/ClientNotebookSession" />
import actions = require('app/shared/actions');
import constants = require('app/common/Constants');
import logging = require('app/common/Logging');
import _app = require('app/App');


var log = logging.getLogger(constants.scopes.codeCell);

class CodeCellController implements app.ICellController {

  _clientNotebookSession: app.IClientNotebookSession;
  _rootScope: ng.IRootScopeService;
  _scope: app.CellScope;

  showEditRegion: boolean;
  showPreviewRegion: boolean;

  static $inject: string[] = ['$scope', '$rootScope', constants.clientNotebookSession.name];
  constructor (
      scope: app.CellScope,
      rootScope: ng.IRootScopeService,
      clientNotebookSession: app.IClientNotebookSession) {

    this._clientNotebookSession = clientNotebookSession;
    this._rootScope = rootScope;
    this._scope = scope;

    this.showPreviewRegion = false; // always-off for code cell
    this.showEditRegion = true; // always-on for code cell

    scope.keymap = this._createKeymap();
    scope.ctrl = this;
  }

  switchToEditMode () { /* noop: code cell always in edit mode */ }

  _createKeymap () {
    return {
      'Shift-Enter': this._handleExecute.bind(this)
    };
  }

  /**
   * Requests that the notebook evaluate the given cell (update + execute)
   */
  _handleExecute () {
    // TODO(bryantd): apply a subset of the updates below as "predictive modifications" (e.g.,
    // clear the cell output immediately)
    // TODO(bryantd): apply a visual treatment to show that the cell is in an "executing" state
    this._clientNotebookSession.evaluateCell(this._scope.cell, this._scope.worksheetId);
  }
}

/**
 * Creates a directive definition.
 */
function codeCellDirective (): ng.IDirective {
  return {
    restrict: 'E',
    scope: {
      cell: '=',
      worksheetId: '='
    },
    templateUrl: constants.scriptPaths.app + '/components/codecell/codecell.html',
    replace: true,
    controller: CodeCellController
  }
}

_app.registrar.directive(constants.codeCell.directiveName, codeCellDirective);
log.debug('Registered code cell directive');