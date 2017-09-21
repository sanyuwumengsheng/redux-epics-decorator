import 'rxjs/add/operator/exhaustMap'
import 'rxjs/add/operator/takeUntil'
import { Action } from 'redux-actions'
import { ActionsObservable } from 'redux-observable'
import { Observable } from 'rxjs/Observable'

import { generateMsg, Msg } from '../service'
import { EffectModule, namespace, Effect, Reducer, ModuleActionProps, DefineAction } from '../../../src'

export interface Module1StateProps {
  currentMsgId: string | null
  allMsgs: Msg[]
}

@namespace('one')
class Module1 extends EffectModule<Module1StateProps> {
  defaltState: Module1StateProps = {
    currentMsgId: null,
    allMsgs: []
  }

  @DefineAction('dispose') dispose: Observable<Action<void>>

  @Effect('get_msg')({
    success: (state: Module1StateProps, { payload }: Action<Msg>) => {
      const { allMsgs } = state
      return { ...state, allMsgs: allMsgs.concat([payload!]) }
    }
  })
  getMsg(action$: ActionsObservable<Action<void>>) {
    return action$
      .exhaustMap(() => generateMsg()
        .takeUntil(this.dispose)
        .map(this.createAction('success'))
      )
  }

  @Reducer('select_msg')
  selectMsg(state: Module1StateProps, { payload }: Action<string>) {
    return { ...state, currentMsgId: payload }
  }
}

export type Module1DispatchProps = ModuleActionProps<Module1StateProps, Module1>

const moduleOne = new Module1
export default moduleOne
export const reducer = moduleOne.reducer
export const epic = moduleOne.epic