/**
 * Created by Dennis on 08/11/16.
 */

/*
 * action types
 */

export const SET_QUESTION = 'SET_QUESTION'
/*
 * other constants
 */

/*
 * action creators
 */

//export function addQuestion(text) {
//  return { type: ADD_QUESTION, text }
//}

export function setQuestion(question){
  return {
    type: SET_QUESTION,
    question: question,
  }
}
